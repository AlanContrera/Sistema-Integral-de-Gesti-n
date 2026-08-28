
import base64
import smtplib
import imaplib
import email
from email.header import decode_header
import re
import email.utils
from django.core.files.base import ContentFile
from django.template.loader import render_to_string
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from celery import shared_task
from .models import EmpresaEmisora, Cliente


@shared_task
def enviar_cotizacion_task(cliente_id, empresa_id, pdf_base64, folio="Oficial", subtotal=None, impuestos=None, total=None, es_excel=False, correo_destino=None, correos_cc_destino=None):
    try:
        cliente = Cliente.objects.get(id=cliente_id)
        empresa = EmpresaEmisora.objects.get(id=empresa_id)
        
        # Si se envían correos específicos (Monterrey), se usan; si no, se toma el correo del cliente
        destinatario = correo_destino if correo_destino else cliente.correo
        cc = correos_cc_destino if correos_cc_destino is not None else cliente.correos_cc
        
        # ESTRUCTURA ANTI-SPAM (Mixed y Headers)
        msg = MIMEMultipart('mixed')

        msg['Message-ID'] = email.utils.make_msgid(domain=empresa.correo_remitente.split('@')[-1])
        msg['Date'] = email.utils.formatdate(localtime=True)
        msg['Reply-To'] = empresa.correo_remitente
        
        msg['From'] = empresa.correo_remitente
        msg['To'] = destinatario
        msg['Subject'] = empresa.asunto_cotizacion if empresa.asunto_cotizacion else f"Propuesta Comercial / Pre-factura - {empresa.nombre_empresa}"
    
        if cc:
            msg['Cc'] = cc
            
        subtotal_fmt = f"${subtotal:,.2f} MXN" if subtotal is not None else None
        impuestos_fmt = f"${impuestos:,.2f} MXN" if impuestos is not None else None
        total_fmt = f"${total:,.2f} MXN" if total is not None else None

        contexto = {
            'cliente_nombre': cliente.empresa, 
            'empresa_nombre': empresa.nombre_empresa,
            'cuerpo_correo': empresa.cuerpo_cotizacion,
            'folio': folio,
            'subtotal': subtotal_fmt,
            'impuestos_trasladados': impuestos_fmt,
            'total': total_fmt,
            'es_excel': es_excel
        }
        
        cuerpo_html = render_to_string('emails/envio_cotizacion.html', contexto)
        
        # Bloque Anti-Spam: Todo buen correo debe tener versión en texto plano (MIMEMultipart alternative)
        texto_plano = re.sub('<[^<]+>', '', cuerpo_html).strip()
        
        alt_body = MIMEMultipart('alternative')
        alt_body.attach(MIMEText(texto_plano, 'plain'))
        alt_body.attach(MIMEText(cuerpo_html, 'html'))
        
        msg.attach(alt_body)

        
        file_bytes = base64.b64decode(pdf_base64)
        if es_excel:
            adjunto = MIMEApplication(file_bytes, _subtype="vnd.openxmlformats-officedocument.spreadsheetml.sheet")
            nombre_archivo = f"{folio}.xlsx"
        else:
            adjunto = MIMEApplication(file_bytes, _subtype="pdf")
            nombre_archivo = f"{folio}.pdf"
            
        adjunto.add_header('Content-Disposition', 'attachment', filename=nombre_archivo)
        msg.attach(adjunto)
        
        if empresa.usar_ssl:
            server = smtplib.SMTP_SSL(empresa.host_smtp, empresa.puerto_smtp)
        else:
            server = smtplib.SMTP(empresa.host_smtp, empresa.puerto_smtp)
            if empresa.usar_tls:
                server.starttls()
                
        server.login(empresa.correo_remitente, empresa.password)
        
        to_addrs = [destinatario]
        if cc:
            to_addrs.extend([c.strip() for c in cc.split(',') if c.strip()])
            
        server.send_message(msg, to_addrs=to_addrs)
        server.quit()
        
        return f"Mensaje enviado exitosamente a {destinatario}"
        
    except Exception as e:
        return f"Error al enviar correo: {str(e)}"

@shared_task
def robot_lector_imap_task():
    """
    Se conecta a las bandejas IMAP de cada EmpresaEmisora, busca correos con facturas
    de Monterrey ([REF: OP-XXXXXX]) y guarda los adjuntos (XML y PDF) en la BD.
    """
    # 1. Buscamos todas las empresas que tengan configurado un host IMAP
    empresas = EmpresaEmisora.objects.exclude(host_imap__isnull=True).exclude(host_imap='')
    
    for empresa in empresas:
        try:
            # 2. Conexión al servidor IMAP
            mail = imaplib.IMAP4_SSL(empresa.host_imap, empresa.puerto_imap)
            mail.login(empresa.correo_remitente, empresa.password)
            mail.select("inbox")
            
            # 3. Buscar correos no leídos (UNSEEN)
            status, messages = mail.search(None, 'UNSEEN')
            if status != 'OK':
                continue
                
            email_ids = messages[0].split()
            for e_id in email_ids:
                res, msg_data = mail.fetch(e_id, '(RFC822)')
                if res != 'OK':
                    continue
                    
                for response_part in msg_data:
                    if isinstance(response_part, tuple):
                        msg = email.message_from_bytes(response_part[1])
                        subject, encoding = decode_header(msg["Subject"])[0]
                        if isinstance(subject, bytes):
                            try:
                                subject = subject.decode(encoding if encoding else "utf-8")
                            except:
                                subject = subject.decode("latin-1", errors="ignore")
                        
                        # 4. Buscar el patrón [REF: OP/COT/PRE-XXXXXX] en el asunto del correo
                        match = re.search(r'\[REF:\s*((?:OP|COT|PRE)-[A-Z0-9\-]+)\]', subject)

                        if match:
                            referencia = match.group(1)
                            
                            # Buscar la operación en la BD
                            from .models import OperacionFacturacion
                            operacion = OperacionFacturacion.objects.filter(referencia_unica=referencia).first()
                            
                            if operacion:
                                xml_file = None
                                pdf_file = None
                                
                                # 5. Extraer los archivos adjuntos
                                if msg.is_multipart():
                                    for part in msg.walk():
                                        if part.get_content_maintype() == 'multipart':
                                            continue
                                        if part.get('Content-Disposition') is None:
                                            continue
                                            
                                        filename = part.get_filename()
                                        if filename:
                                            filename_decoded, enc = decode_header(filename)[0]
                                            if isinstance(filename_decoded, bytes):
                                                filename_decoded = filename_decoded.decode(enc if enc else 'utf-8')
                                                
                                            file_data = part.get_payload(decode=True)
                                            
                                            if filename_decoded.lower().endswith('.xml'):
                                                xml_file = (filename_decoded, file_data)
                                            elif filename_decoded.lower().endswith('.pdf'):
                                                pdf_file = (filename_decoded, file_data)
                                
                                # 6. Guardar los archivos físicos en la Base de Datos
                                if xml_file or pdf_file:
                                    if xml_file:
                                        operacion.xml_factura.save(xml_file[0], ContentFile(xml_file[1]), save=False)
                                    if pdf_file:
                                        operacion.pdf_factura.save(pdf_file[0], ContentFile(pdf_file[1]), save=False)
                                        
                                    # Mueve la máquina de estados al siguiente paso
                                    operacion.estado_factura = 'RECIBIDA_DE_MONTERREY'
                                    operacion.save()
                                    print(f"Éxito: Factura procesada y guardada para {referencia}")
                                    
                # 7. Marcar el correo como leído en el buzón real (para no reprocesarlo)
                mail.store(e_id, '+FLAGS', '\\Seen')
                
            mail.logout()
        except Exception as e:
            print(f"Error procesando IMAP para {empresa.nombre_empresa}: {str(e)}")
            continue
@shared_task
def enviar_factura_oficial_task(operacion_id):
    try:
        from .models import OperacionFacturacion
        operacion = OperacionFacturacion.objects.get(id=operacion_id)
        cliente = operacion.cliente
        empresa = operacion.empresa_emisora
        
        msg = MIMEMultipart('mixed')

        msg['Message-ID'] = email.utils.make_msgid(domain=empresa.correo_remitente.split('@')[-1])
        msg['Date'] = email.utils.formatdate(localtime=True)
        msg['Reply-To'] = empresa.correo_remitente
        
        msg['From'] = empresa.correo_remitente
        msg['To'] = cliente.correo
        msg['Subject'] = f"Factura Oficial - {empresa.nombre_empresa} - {operacion.referencia_unica}"
        
        if cliente.correos_cc:
            msg['Cc'] = cliente.correos_cc
            
        contexto = {
            'cliente_nombre': cliente.empresa,
            'empresa_nombre': empresa.nombre_empresa,
            'folio': operacion.referencia_unica
        }
        
        cuerpo_html = render_to_string('emails/envio_factura.html', contexto)
        
        # Bloque Anti-Spam
        texto_plano = re.sub('<[^<]+>', '', cuerpo_html).strip()
        
        alt_body = MIMEMultipart('alternative')
        alt_body.attach(MIMEText(texto_plano, 'plain'))
        alt_body.attach(MIMEText(cuerpo_html, 'html'))
        
        msg.attach(alt_body)

        
        if operacion.pdf_factura:
            pdf_adjunto = MIMEApplication(operacion.pdf_factura.read(), _subtype="pdf")
            pdf_adjunto.add_header('Content-Disposition', 'attachment', filename=f"{operacion.referencia_unica}.pdf")
            msg.attach(pdf_adjunto)
            
        if operacion.xml_factura:
            xml_adjunto = MIMEApplication(operacion.xml_factura.read(), _subtype="xml")
            xml_adjunto.add_header('Content-Disposition', 'attachment', filename=f"{operacion.referencia_unica}.xml")
            msg.attach(xml_adjunto)
            
        if empresa.usar_ssl:
            server = smtplib.SMTP_SSL(empresa.host_smtp, empresa.puerto_smtp)
        else:
            server = smtplib.SMTP(empresa.host_smtp, empresa.puerto_smtp)
            if empresa.usar_tls:
                server.starttls()
                
        server.login(empresa.correo_remitente, empresa.password)
        to_addrs = [cliente.correo]
        if cliente.correos_cc:
            to_addrs.extend([c.strip() for c in cliente.correos_cc.split(',') if c.strip()])
            
        server.send_message(msg, to_addrs=to_addrs)
        server.quit()
        
        return "Factura oficial enviada al cliente"
    except Exception as e:
        return f"Error enviando factura oficial: {str(e)}"

@shared_task
def enviar_prefactura_monterrey_task(cliente_id, empresa_id, pdf_base64, folio, es_excel=False, correo_destino=None, correos_cc_destino=None):
    try:

        cliente = Cliente.objects.get(id=cliente_id)
        empresa = EmpresaEmisora.objects.get(id=empresa_id)
        
        destinatario = correo_destino
        cc = correos_cc_destino
        
        msg = MIMEMultipart('mixed')
        
        import email.utils
        import re
        msg['Message-ID'] = email.utils.make_msgid(domain=empresa.correo_remitente.split('@')[-1])
        msg['Date'] = email.utils.formatdate(localtime=True)
        msg['Reply-To'] = empresa.correo_remitente
        
        msg['From'] = empresa.correo_remitente
        msg['To'] = destinatario
        msg['Subject'] = f"[REF: {folio}] Solicitud de Facturación - {cliente.empresa}"
    
        if cc:
            msg['Cc'] = cc

        contexto = {
            'cliente_nombre': cliente.empresa, 
            'empresa_nombre': empresa.nombre_empresa,
            'folio': folio,
            'es_excel': es_excel
        }
        
        # AQUI USAMOS LA NUEVA PLANTILLA NARANJA
        cuerpo_html = render_to_string('emails/envio_prefactura.html', contexto)
        
        # Bloque Anti-Spam
        texto_plano = re.sub('<[^<]+>', '', cuerpo_html).strip()
        
        alt_body = MIMEMultipart('alternative')
        alt_body.attach(MIMEText(texto_plano, 'plain'))
        alt_body.attach(MIMEText(cuerpo_html, 'html'))
        
        msg.attach(alt_body)

        
        file_bytes = base64.b64decode(pdf_base64)
        if es_excel:
            adjunto = MIMEApplication(file_bytes, _subtype="vnd.openxmlformats-officedocument.spreadsheetml.sheet")
            nombre_archivo = f"{folio}.xlsx"
        else:
            adjunto = MIMEApplication(file_bytes, _subtype="pdf")
            nombre_archivo = f"{folio}.pdf"
            
        adjunto.add_header('Content-Disposition', 'attachment', filename=nombre_archivo)
        msg.attach(adjunto)
        
        if empresa.usar_ssl:
            server = smtplib.SMTP_SSL(empresa.host_smtp, empresa.puerto_smtp)
        else:
            server = smtplib.SMTP(empresa.host_smtp, empresa.puerto_smtp)
            if empresa.usar_tls:
                server.starttls()
                
        server.login(empresa.correo_remitente, empresa.password)
        
        to_addrs = [destinatario]
        if cc:
            to_addrs.extend([c.strip() for c in cc.split(',') if c.strip()])
            
        server.send_message(msg, to_addrs=to_addrs)
        server.quit()
        
        return f"Prefactura enviada exitosamente a {destinatario}"
        
    except Exception as e:
        return f"Error al enviar prefactura a Monterrey: {str(e)}"
