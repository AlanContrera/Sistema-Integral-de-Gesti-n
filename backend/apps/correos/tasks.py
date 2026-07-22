from celery import shared_task
from django.conf import settings
from django.utils import timezone
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from apps.correos.ocr import extraer_datos_cuerpo_correo
from apps.correos.models import Liquidacion
from apps.correos.calculos import calcular_retorno
from .models import CorreoProcesado, Comprobante, Factura
from . import ocr, xml_parser
import imapclient
import pyzmail
import os
import re
import unicodedata
import email
from decimal import Decimal


EXTENSIONES_VALIDAS = {'.pdf', '.jpg', '.jpeg', '.png', '.tiff', '.tif'}
EXTENSIONES_XML = {'.xml'}

PALABRAS_CLAVE_BANCARIAS = [
            'transferencia', 'importe', 'banco', 'monto', 'clabe', 
            'cuenta', 'folio', 'referencia', 'pago', 'deposito', 'spei'
        ]

def extraer_nombre_cliente(asunto):
    """Limpia el asunto para extraer únicamente el nombre de la persona o empresa."""
    asunto_upper = asunto.upper()
    
    # 1. Quitar prefijos comunes
    asunto_upper = re.sub(r'^(RV|FW|FWD|RE):\s*', '', asunto_upper)
    asunto_upper = re.sub(r'^(SOLICITUD|MTY PYM)\s+', '', asunto_upper)
    
    # 2. Quitar el tipo de ingreso y también "EMISION FACTURA"
    asunto_upper = re.sub(r'^(RETORNO(?:S)?(?:\s+DE)?\s+TRANSFERENCIA(?:S)?|BANCARIZACION(?:ES)?|CONFIRMACION(?:ES)?\s+DE\s+PAGO(?:S)?|ASIMILADO(?:S)?(?:\s+ESTADO DE CUENTA)?|BLINDADO(?:S)?(?:/\s*ESTADO DE CUENTA)?|EMISION\s+FACTURA)\s*', '', asunto_upper)
    
    # 3. Tomar el texto hasta el primer guion o diagonal
    partes = re.split(r'[-/]', asunto_upper)
    nombre_limpio = partes[0].strip()
    
    return nombre_limpio if nombre_limpio else 'SIN NOMBRE'

    """Limpia el asunto para extraer únicamente el nombre de la persona o empresa."""
    asunto_upper = asunto.upper()
    
    # 1. Quitar prefijos comunes
    asunto_upper = re.sub(r'^(RV|FW|FWD|RE):\s*', '', asunto_upper)
    asunto_upper = re.sub(r'^(SOLICITUD|MTY PYM)\s+', '', asunto_upper)
    
    # 2. Quitar el tipo de ingreso
    asunto_upper = re.sub(r'^(RETORNO(?:S)?(?:\s+DE)?\s+TRANSFERENCIA(?:S)?|BANCARIZACION(?:ES)?|CONFIRMACION(?:ES)?\s+DE\s+PAGO(?:S)?|ASIMILADO(?:S)?(?:\s+ESTADO DE CUENTA)?|BLINDADO(?:S)?(?:/\s*ESTADO DE CUENTA)?)\s*', '', asunto_upper)
    
    # 3. Tomar el texto hasta el primer guion
    partes = asunto_upper.split('-')
    nombre_limpio = partes[0].strip()
    
    return nombre_limpio if nombre_limpio else 'SIN NOMBRE'


@shared_task(name='correos.revisar_bandeja')
def revisar_bandeja_entrada():

    procesados = 0
    errores = 0

    try:
        servidor = imapclient.IMAPClient(
            settings.IMAP_SERVER,
            port=settings.IMAP_PORT,
            ssl=True
        )
        servidor.login(settings.IMAP_USER, settings.IMAP_PASSWORD)
        servidor.select_folder(settings.IMAP_FOLDER, readonly=False)

        uids = servidor.search(['UNSEEN'])

        for uid in uids:
            uid_str = str(uid)

            if CorreoProcesado.objects.filter(uid=uid_str).exists():
                continue

            try:
                datos_raw = servidor.fetch([uid], ['RFC822'])
                mensaje = pyzmail.PyzMessage.factory(datos_raw[uid][b'RFC822'])

                raw_email = email.message_from_bytes(datos_raw[uid][b'RFC822'])
                msg_id = raw_email.get('Message-ID', '').strip()
                in_reply_to = raw_email.get('In-Reply-To', '').strip()

                remitente = mensaje.get_address('from')[1]
                asunto = mensaje.get_subject() or '(sin asunto)'

                # 1. Normalizamos para quitar acentos (así "Confirmación" y "Confirmacion" valen igual)
                asunto_norm = unicodedata.normalize('NFKD', asunto.lower()).encode('ASCII', 'ignore').decode('utf-8')
                tipo_detectado = 'desconocido'
                # 2. Usamos Expresiones Regulares para detectar plurales (la "s" al final) y variaciones
                if re.search(r'bancarizacion(es)?', asunto_norm):
                    tipo_detectado = 'bancarizacion'
                elif re.search(r'conf(ir|ri)macion(es)? de pago(s)?', asunto_norm):
                    tipo_detectado = 'confirmacion'
                elif re.search(r'asimilado(s)?', asunto_norm):
                    tipo_detectado = 'asimilado'
                elif re.search(r'blindado(s)?', asunto_norm):
                    tipo_detectado = 'blindado'
                elif re.search(r'retorno(s)? (de )?transferencia(s)?', asunto_norm):
                    tipo_detectado = 'retorno'

                fecha = timezone.now()

                if mensaje.text_part:
                    cuerpo = mensaje.text_part.get_payload().decode(
                        mensaje.text_part.charset or 'utf-8',
                        errors='replace'
                    )
                else:
                    cuerpo = ''

                

                correo_padre = None
                
                # Algoritmo de Hilos (Threading) robusto:
                candidatos = []
                if in_reply_to:
                    candidatos.append(in_reply_to)
                
                references = raw_email.get('References', '')
                if references:
                    candidatos.extend(references.split())
                
                for cand in candidatos:
                    cand = cand.strip()
                    if cand:
                        p = CorreoProcesado.objects.filter(message_id=cand).first()
                        if p:
                            # Encontramos un ancestro en la BD. 
                            # Para mantener la jerarquía Padre -> Multiples hijos, siempre anclamos a la raíz.
                            while p.parent:
                                p = p.parent
                            correo_padre = p
                            break

                # Fallback: Agrupar por Asunto si las cabeceras fallan o el padre no existe
                if not correo_padre:
                    asunto_limpio = asunto.replace('RV: ', '').replace('RE: ', '').replace('FW: ', '').replace('Rv: ', '').replace('Re: ', '').strip()
                    # Buscamos el correo más antiguo que comparta este asunto
                    hermano_mayor = CorreoProcesado.objects.filter(asunto__icontains=asunto_limpio).order_by('id').first()
                    if hermano_mayor:
                        while hermano_mayor.parent:
                            hermano_mayor = hermano_mayor.parent
                        correo_padre = hermano_mayor

                               # --- LLAMADA A LA IA PARA CLASIFICAR Y LIMPIAR ---
                datos_ia = ocr.analizar_correo_ia(asunto, remitente, cuerpo)
                
                nombre_ia = datos_ia.get('cliente_nombre')
                # Si la IA falla, usamos la función regex original como respaldo
                if not nombre_ia or nombre_ia == "Desconocido":
                    nombre_ia = extraer_nombre_cliente(asunto)
                
                cuerpo_limpio_ia = datos_ia.get('cuerpo_limpio', '')
                monto_ia = datos_ia.get('monto_depositado')
                if monto_ia is not None:
                    cuerpo_limpio_ia += f"\n[MONTO_EXTRAIDO_IA: {monto_ia}]"
                
                correo = CorreoProcesado.objects.create(
                    uid=uid_str,
                    message_id=msg_id if msg_id else None,
                    parent=correo_padre,
                    remitente=remitente,
                    asunto=asunto,
                    fecha_recibido=fecha,
                    cuerpo=cuerpo,
                    cuerpo_limpio=cuerpo_limpio_ia, # Guardamos el limpio de la IA
                    estado='pendiente',
                    tipo_ingreso=tipo_detectado,
                    cliente_nombre=nombre_ia,
                )

                procesados += 1

                comprobante_creado = False
                pdf_creado = False
                
                # Detectar y guardar adjuntos válidos
                for parte in mensaje.mailparts:
                    nombre = parte.filename
                    
                    # IGNORAR IMÁGENES INLINE SIN NOMBRE (iconos de firma, etc)
                    if not nombre:
                        continue
                        
                    if nombre:
                        _, extension = os.path.splitext(nombre.lower())
                        payload = parte.get_payload()

                        if extension in EXTENSIONES_XML:
                            ruta_relativa = f'facturas/{correo.id}/{nombre}'
                            ruta_guardada = default_storage.save(
                                ruta_relativa,
                                ContentFile(parte.get_payload())
                            )
                            factura = Factura.objects.create(
                                correo=correo,
                                archivo=ruta_guardada,
                            )
                            procesar_factura.delay(factura.id)

                        elif extension in EXTENSIONES_VALIDAS:
                            # Filtro: Ignorar imágenes menores a 25KB (casi seguro son logos/firmas)
                            if extension in {'.jpg', '.jpeg', '.png'}:
                                datos_archivo = parte.get_payload()
                                if datos_archivo and len(datos_archivo) < 25600:
                                    continue

                            ruta_relativa = f'comprobantes/{correo.id}/{nombre}'
                            ruta_guardada = default_storage.save(
                                ruta_relativa,
                                ContentFile(parte.get_payload())
                            )
                            comprobante = Comprobante.objects.create(
                                correo=correo,
                                archivo=ruta_guardada,
                                tipo_archivo='pdf' if extension == '.pdf' else 'imagen',
                                estado_ocr='pendiente',
                                tipo_ingreso=tipo_detectado
                            )
                            procesar_comprobante.delay(comprobante.id)
                            comprobante_creado = True
                            if extension == '.pdf':
                                pdf_creado = True
                
                # Extraer texto del correo SOLO si no se encontró NINGÚN archivo adjunto válido (ni PDF ni Imagen)
                if not comprobante_creado:
                    comprobante_texto = Comprobante.objects.create(
                        correo=correo,
                        tipo_archivo='texto',
                        estado_ocr='pendiente',
                        tipo_ingreso=tipo_detectado,
                        texto_bruto=cuerpo
                    )
                    procesar_comprobante.delay(comprobante_texto.id)


            except Exception as e:
                import traceback
                with open('celery_error.log', 'a') as f:
                    f.write(f"Error procesando UID {uid_str}:\n")
                    f.write(traceback.format_exc() + "\n")
                
                CorreoProcesado.objects.get_or_create(
                    uid=uid_str,
                    defaults={
                        'remitente': 'desconocido@error.com',
                        'asunto': 'Error al procesar',
                        'fecha_recibido': timezone.now(),
                        'estado': 'error'
                    }
                )
                errores += 1

    finally:
        try:
            servidor.logout()
        except Exception:
            pass

    return {'procesados': procesados, 'errores': errores}

@shared_task(name='correos.procesar_factura')
def procesar_factura(factura_id):

    try:
        factura = Factura.objects.get(id=factura_id)
        ruta_completa = os.path.join(settings.MEDIA_ROOT, factura.archivo.name)

        datos = xml_parser.parsear_cfdi(ruta_completa)

        if datos is None:
            factura.estado = 'error'
            factura.fecha_procesado = timezone.now()
            factura.save()
            return {'error': f'Factura {factura_id}: XML no reconocido como CFDI'}

        factura.emisor_nombre = datos['emisor_nombre']
        factura.emisor_rfc = datos['emisor_rfc']
        factura.receptor_nombre = datos['receptor_nombre']
        factura.receptor_rfc = datos['receptor_rfc']
        factura.serie = datos['serie']
        factura.folio = datos['folio']
        factura.fecha = datos['fecha']
        factura.total = datos['total']
        factura.moneda = datos['moneda']
        factura.metodo_pago = datos.get('metodo_pago', '') 
        factura.estado = 'procesado'
        factura.fecha_procesado = timezone.now()
        factura.save()

        return {
            'factura_id': factura_id,
            'folio': datos['folio'],
            'emisor': datos['emisor_nombre'],
            'total': datos['total'],
        }

    except Factura.DoesNotExist:
        return {'error': f'Factura {factura_id} no encontrada'}

    except Exception:
        Factura.objects.filter(id=factura_id).update(
            estado='error',
            fecha_procesado=timezone.now()
        )
        raise

@shared_task(name='correos.procesar_comprobante')
def procesar_comprobante(comprobante_id):

    try:
        comprobante = Comprobante.objects.get(id=comprobante_id)

        if comprobante.tipo_archivo == 'texto':
            registros = ocr.extraer_datos_cuerpo_correo(comprobante.texto_bruto)
            # Si encontro algo, agarramos el primer registro (o podríamos iterar, pero de momento es uno)
            reg = registros[0] if registros else {}
            resultado = {
                'tipo': 'texto',
                'texto_bruto': comprobante.texto_bruto,
                'banco': None,
                'monto': reg.get('monto'),
                'fecha': reg.get('fecha'),
                'es_factura_pdf': False,
                'empresa_destino': reg.get('empresa')
            }
        else:
            if not comprobante.archivo:
                return {'error': 'No hay archivo adjunto'}
            ruta_completa = os.path.join(settings.MEDIA_ROOT, comprobante.archivo.name)
            resultado = ocr.procesar_archivo(ruta_completa)

            # --- Filtro de firma/logo solo para imagenes ---
            texto_lower = (resultado.get('texto_bruto') or '').lower()
            es_contenido_bancario = (
                resultado.get('banco') or
                resultado.get('monto') is not None or
                any(palabra in texto_lower for palabra in ['transferencia', 'spei', 'bbva', 'santander', 'banorte', 'pago', 'deposito'])
            )
            if not es_contenido_bancario:
                comprobante.delete()
                return {'status': 'Descartado: imagen de firma o logo sin datos bancarios'}

        if resultado.get('es_factura_pdf'):
            # Buscar la factura hermana que llegó en este mismo correo
            factura = Factura.objects.filter(correo=comprobante.correo).first()
            if factura:
                # Le pasamos el archivo PDF a la Factura
                factura.archivo_pdf = comprobante.archivo
                factura.save()
            
            # Eliminamos este registro porque no es un comprobante de pago real
            comprobante.delete()
            return {'status': 'PDF reasignado a Factura y eliminado de Comprobantes'}

        if comprobante.tipo_archivo != 'texto':
            comprobante.tipo_archivo = resultado['tipo']
            comprobante.texto_bruto = resultado['texto_bruto']
            comprobante.banco_extraido = resultado.get('banco') or ''
            
        comprobante.monto_extraido = resultado.get('monto')

        fecha_str = resultado.get('fecha')
        if fecha_str:
            # Intentar corregir si la IA la mandó al revés (DD-MM-YY o DD-MM-YYYY)
            m_fecha = re.match(r'^(\d{2})[-/](\d{2})[-/](\d{2,4})$', fecha_str)
            if m_fecha:
                dia, mes, anio = m_fecha.groups()
                if len(anio) == 2:
                    anio = f"20{anio}"
                fecha_str = f"{anio}-{mes}-{dia}"
            
            # Si al final no es un YYYY-MM-DD válido, se anula para evitar crashear la base de datos
            if not re.match(r'^\d{4}-\d{2}-\d{2}$', fecha_str):
                fecha_str = None
                
        comprobante.fecha_extraida = fecha_str

        comprobante.empresa_destino = resultado.get('empresa_destino', '')
        
        # --- VINCULACIÓN AUTOMÁTICA DE ABONOS A FACTURAS ---
        folio_ia = resultado.get('folio_factura_pagada')
        
        # Si la imagen no traía folio, buscamos de manera rápida en el asunto o cuerpo limpio
        if not folio_ia:
            texto_busqueda = f"{comprobante.correo.asunto} {comprobante.correo.cuerpo_limpio}".lower()
            m_folio = re.search(r'(?:factura|fra|folio|f|fact)[\s-]*([a-z0-9]+)', texto_busqueda)
            if m_folio:
                folio_ia = m_folio.group(1).upper()

        if folio_ia:
            comprobante.folio_factura_extraido = str(folio_ia)
            # Buscamos la primera factura de la base de datos que coincida con ese folio
            factura_encontrada = Factura.objects.filter(folio__icontains=str(folio_ia)).first()
            if factura_encontrada:
                comprobante.factura_pagada = factura_encontrada
        # ---------------------------------------------------

            
        # EXTRAER DATOS DEL CUERPO DEL CORREO (Independiente del OCR)
        if comprobante.correo.cuerpo:
            datos_correo = ocr.extraer_datos_texto_correo(comprobante.correo.cuerpo)
            
            # Preferir lo que sacó extraer_datos_cuerpo_correo (que está en resultado)
            # si datos_correo no trajo nada
            m_correo = datos_correo.get('monto_operacion')
            if m_correo is None and comprobante.tipo_archivo == 'texto':
                m_correo = resultado.get('monto')
                
            e_correo = datos_correo.get('beneficiario', '')
            if not e_correo and comprobante.tipo_archivo == 'texto':
                e_correo = resultado.get('empresa_destino', '')
                
            comprobante.monto_correo = m_correo
            comprobante.empresa_correo = e_correo
            
            # Guardar nuevos campos financieros del cuerpo del correo
            comprobante.saldo_anterior = datos_correo.get('saldo_anterior')
            comprobante.saldo_actualizado = datos_correo.get('saldo_actualizado')
            comprobante.banco_correo = datos_correo.get('banco', '')
            comprobante.clabe_correo = datos_correo.get('clabe', '')
            
        if comprobante.tipo_archivo != 'texto':
            # --- NUEVOS CAMPOS ---
            comprobante.cuenta_origen = resultado.get('cuenta_origen') or ''
            comprobante.cuenta_destino = resultado.get('cuenta_destino') or ''
            comprobante.banco_origen = resultado.get('banco_origen') or ''
            comprobante.banco_destino = resultado.get('banco_destino') or ''
            comprobante.empresa_destino = resultado.get('empresa_destino') or ''
            comprobante.referencia = resultado.get('referencia') or ''

        comprobante.estado_ocr = 'procesado'
        comprobante.fecha_procesado = timezone.now()
        comprobante.save()

        # ---------------------

         # --- FASE 2: FUSIÓN DE DATOS Y ASIGNACIÓN DE MÚLTIPLES EMPRESAS ---
        # Solo ejecutar esto si NO es asimilado, para no sobreescribir la lógica avanzada
        if comprobante.tipo_ingreso != 'asimilado':
            lista_datos_correo = extraer_datos_cuerpo_correo(comprobante.correo.cuerpo)
            datos_correo = None
            
            # Hacemos match del monto del comprobante (OCR) con los montos del correo
            if comprobante.monto_extraido:
                for registro in lista_datos_correo:
                    if registro['monto'] and float(comprobante.monto_extraido) == registro['monto']:
                        datos_correo = registro
                        break
            
            # Fallback: Si no hizo match o el OCR no sacó monto, usamos el primero
            if not datos_correo and lista_datos_correo:
                datos_correo = lista_datos_correo[0]

            if datos_correo:
                comprobante.empresa_correo = datos_correo.get('empresa', '')
                comprobante.monto_correo = datos_correo.get('monto')
                comprobante.fecha_correo = datos_correo.get('fecha')

            # RESCATE DE MONTO
            if not comprobante.monto_extraido and datos_correo['monto']:
                monto_str = str(datos_correo['monto']).replace('.0', '')
                monto_format = f"{datos_correo['monto']:,.2f}".replace('.00', '')
                if monto_str in comprobante.texto_bruto.replace(',', '') or monto_format in comprobante.texto_bruto:
                    comprobante.monto_extraido = datos_correo['monto']

            # RESCATE DE FECHA
            if not comprobante.fecha_extraida and datos_correo['fecha']:
                dia = str(datos_correo['fecha'].day).zfill(2)
                anio_2 = str(datos_correo['fecha'].year)[-2:]
                anio_4 = str(datos_correo['fecha'].year)
                if (dia in comprobante.texto_bruto) and (anio_2 in comprobante.texto_bruto or anio_4 in comprobante.texto_bruto):
                    comprobante.fecha_extraida = datos_correo['fecha']
        # --------------------------------------------------------

        # --- FASE 3: LIMPIEZA DE FIRMAS Y BASURA ---
                # --- FASE 3: LIMPIEZA DE FIRMAS Y BASURA ---
        # Si un comprobante termina sin fecha y sin cuentas, y el texto es muy corto o no parece recibo
        es_basura = False
        
        if not comprobante.monto_extraido and not comprobante.fecha_extraida and not comprobante.cuenta_origen and not comprobante.cuenta_destino:
            es_basura = True
        elif comprobante.monto_extraido and not comprobante.fecha_extraida and not comprobante.cuenta_origen and not comprobante.cuenta_destino:
           
            if len(comprobante.texto_bruto) < 300:
                es_basura = True

        if es_basura:
            comprobante.archivo.delete(save=False)
            comprobante.delete()
            return

        # --------------------------------------------------------
        
        comprobante.fecha_procesado = timezone.now()
        comprobante.estado_ocr = 'procesado'
        comprobante.save()

         # --- FASE 4: AUTOMATIZACIÓN DE LIQUIDACIÓN FINANCIERA ---
        if comprobante.correo.tipo_ingreso == 'retorno' and comprobante.monto_extraido:
            
            cuerpo = comprobante.correo.cuerpo
            if cuerpo:
                # 1. Extracción dinámica
                match_empresa = re.search(r'Comisi[oó]n\s*(\d+(?:\.\d+)?)\s*%', cuerpo, re.IGNORECASE)
                pct_empresa = Decimal(match_empresa.group(1)) if match_empresa else Decimal('0')

                match_promotor = re.search(r'Comisi[oó]n\s+promotor\s*(\d+(?:\.\d+)?)\s*%', cuerpo, re.IGNORECASE)
                pct_prom1 = Decimal(match_promotor.group(1)) if match_promotor else Decimal('0')

                match_personas = re.search(r'(\d+)\s*PERSONAS?', cuerpo, re.IGNORECASE)
                personas = int(match_personas.group(1)) if match_personas else 1

                # 2. Borrar cálculo anterior si existía (por seguridad)
                if hasattr(comprobante.correo, 'liquidacion'):
                    comprobante.correo.liquidacion.delete()

                # 3. Calcular Monto Depositado
                match_ia = re.search(r'\[MONTO_EXTRAIDO_IA:\s*([\d\.]+)\]', comprobante.correo.cuerpo_limpio or '')
                if match_ia:
                    monto_depositado_calc = Decimal(match_ia.group(1))
                else:
                    match_monto = re.search(r'Monto\s+depositado\s*:\s*\$?\s*([\d,]+(?:\.\d+)?)', cuerpo, re.IGNORECASE)
                    if match_monto:
                        monto_str = match_monto.group(1).replace(',', '')
                        monto_depositado_calc = Decimal(monto_str)
                    else:
                        from django.db.models import Sum
                        total = comprobante.correo.comprobantes.aggregate(t=Sum('monto_extraido'))['t']
                        monto_depositado_calc = Decimal(str(total)) if total else Decimal('0')

                # 4. Calcular Liquidación
                resultados = calcular_retorno(
                    monto_depositado=monto_depositado_calc, 
                    pct_comision_empresa=pct_empresa, 
                    pct_comision_promotor_1=pct_prom1, 
                    pct_comision_promotor_2=Decimal('0.00'), 
                    cantidad_personas=personas, 
                    tarifa_bancaria_por_persona=Decimal('8.70'), 
                    comision_traslado=Decimal('0.00')
                )

                # 4. Guardar
                Liquidacion.objects.create(correo=comprobante.correo, **resultados)
        # --------------------------------------------------------


        return {
            'comprobante_id': comprobante_id,
            'banco': resultado['banco'],
            'monto': resultado['monto'],
            'fecha': resultado['fecha'],
        }

    except Comprobante.DoesNotExist:
        return {'error': f'Comprobante {comprobante_id} no encontrado'}

    except Exception:
        Comprobante.objects.filter(id=comprobante_id).update(
            estado_ocr='error',
            fecha_procesado=timezone.now()
        )
        raise