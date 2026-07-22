from reportlab.pdfgen import canvas
from random import random
import io
import pandas as pd
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from pypdf import PdfReader, PdfWriter
from .plantillas_config import MAPA_PLANTILLAS
from .temas_config import get_tema
import os
from reportlab.platypus import Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
import random
import string
from datetime import datetime

# --- HELPERS DE DIBUJO ---
def dibujar_texto_alineado(can, texto, x, y, fuente, tamano, color, alineacion="left"):
    can.setFont(fuente, tamano)
    can.setFillColor(color)
    if alineacion == "left":
        can.drawString(x, y, str(texto))
    elif alineacion == "right":
        can.drawRightString(x, y, str(texto))
    elif alineacion == "center":
        can.drawCentredString(x, y, str(texto))

def dibujar_linea_horizontal(can, x_inicio, x_fin, y, grosor, color):
    can.setStrokeColor(color)
    can.setLineWidth(grosor)
    can.line(x_inicio, y, x_fin, y)

def dibujar_linea_vertical(can, x, y_inicio, y_fin, grosor, color):
    can.setStrokeColor(color)
    can.setLineWidth(grosor)
    can.line(x, y_inicio, x, y_fin)

def dibujar_tarjeta(can, x, y, ancho, alto, color_borde, color_fondo=None, grosor=1, radio_esquinas=4):
    can.setStrokeColor(color_borde)
    can.setLineWidth(grosor)
    if color_fondo:
        can.setFillColor(color_fondo)
        can.roundRect(x, y, ancho, alto, radio_esquinas, fill=1, stroke=1)
    else:
        can.roundRect(x, y, ancho, alto, radio_esquinas, fill=0, stroke=1)

class GenerarCotizacionView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        archivo = request.FILES.get('file')
        fecha_operacion = request.POST.get('fecha') # Se atrapa la fecha de react
        if not archivo:
            return Response({"error": "No se envió ningún archivo"}, status=400)

        try:
            # Validar que sea un archivo Excel antes de abrirlo
            if not archivo.name.endswith(('.xlsx', '.xls')):
                return Response({"error": "El archivo que subiste no es un Excel válido. Por favor sube un archivo .xlsx o .xls"}, status=400)

            # 1. Leer el Excel directamente
            try:
                df = pd.read_excel(archivo, sheet_name='4.0')
            except Exception:
                # Intentar listar las hojas disponibles para dar un mensaje útil
                archivo.seek(0)
                try:
                    import openpyxl
                    wb = openpyxl.load_workbook(archivo, read_only=True)
                    hojas = wb.sheetnames
                    return Response({
                        "error": f"El archivo no contiene una hoja llamada '4.0'. Las hojas que encontré son: {', '.join(hojas)}. Asegúrate de subir el archivo de facturación correcto."
                    }, status=400)
                except Exception:
                    return Response({"error": "No se pudo leer el archivo. Verifica que sea un Excel de facturación válido con una hoja llamada '4.0'."}, status=400)
            
            # === DEBUGGING LOG ===
            debug_path = '/home/sistemas/Proyectos/App_Facturacion/backend/media/debug_log.txt'
            with open(debug_path, 'w') as f:
                f.write("=== INICIO DEBUG COTIZADOR ===\n")
                f.write(f"Shape del DF: {df.shape}\n")
                # Guardamos las primeras 25 filas para inspección (solo representaciones de texto)
                for r in range(min(df.shape[0], 25)):
                    valores = [str(v).strip() for v in df.iloc[r].values if pd.notna(v) and str(v).strip() != 'nan' and str(v).strip() != '']
                    f.write(f"Row {r}: {valores}\n")
            
            # Función de búsqueda dinámica para evitar problemas con celdas combinadas
            def buscar_valor_derecha(etiqueta, filas_max=17):
                etiqueta = etiqueta.upper()
                for r in range(filas_max):
                    for c in range(min(df.shape[1], 10)):
                        val = str(df.iloc[r, c]).strip().upper()
                        if val and val != 'NAN' and etiqueta in val:
                            # Busca hasta 3 celdas a la derecha para no cruzar a la otra columna del layout
                            max_c = min(c + 4, df.shape[1])
                            for next_c in range(c + 1, max_c):
                                next_val = df.iloc[r, next_c]
                                if pd.notna(next_val) and str(next_val).strip() != "":
                                    if str(next_val).strip().upper() != "NAN":
                                        return str(next_val).strip()
                            return ""
                return ""

            # 2. Extracción de datos fijos con búsqueda inteligente
            datos_generales = {
                "empresa_factura": df.iloc[0, 3] if not pd.isna(df.iloc[0, 3]) else "", 
                "rfc_receptor": buscar_valor_derecha("RFC") or (df.iloc[4, 3] if not pd.isna(df.iloc[4, 3]) else ""),
                "razon_social": buscar_valor_derecha("RAZON SOCIAL") or (df.iloc[6, 3] if not pd.isna(df.iloc[6, 3]) else ""),
                "calle_numero": buscar_valor_derecha("CALLE Y NUMERO") or (df.iloc[7, 3] if not pd.isna(df.iloc[7, 3]) else ""),
                "colonia": buscar_valor_derecha("COLONIA") or (df.iloc[8, 3] if not pd.isna(df.iloc[8, 3]) else ""),
                "ciudad": buscar_valor_derecha("CIUDAD") or (df.iloc[9, 3] if not pd.isna(df.iloc[9, 3]) else ""),
                "estado": buscar_valor_derecha("ESTADO") or (df.iloc[10, 3] if not pd.isna(df.iloc[10, 3]) else ""),
                "codigo_postal": buscar_valor_derecha("CODIGO POSTAL") or (df.iloc[11, 3] if not pd.isna(df.iloc[11, 3]) else ""),
                "regimen_fiscal": buscar_valor_derecha("RÉGIMEN FISCAL") or buscar_valor_derecha("REGIMEN FISCAL") or (df.iloc[12, 4] if not pd.isna(df.iloc[12, 4]) else ""),
                "uso_cfdi": buscar_valor_derecha("USO CFDI") or (df.iloc[11, 7] if not pd.isna(df.iloc[11, 7]) else "")
            }

            # 3. Mapeo dinámico de columnas y búsqueda de encabezados
            fila_headers_idx = -1
            for r in range(15, 23):
                if r >= df.shape[0]: break
                fila_texto = " ".join(df.iloc[r].fillna('').astype(str).str.upper())
                if "DESCRIPCION" in fila_texto or "DESCRIPCIÓN" in fila_texto or "CLAVE PROD" in fila_texto:
                    fila_headers_idx = r
                    break

            # Valores por defecto para plantillas SIN ENCABEZADOS (ej. CALAFELL)
            col_map = {
                'no': 0, 'clave_prod': 1, 'cantidad': 3, 'clave_unidad': 4,
                'unidad': 6, 'descripcion': 8, 'valor_unitario': 11, 'impuesto': 12, 'importe': 15
            }
            
            inicio_partidas = 17 # Asume df.iloc[17] (fila 18 o 19 en Excel) si no hay encabezados detectables
            
            if fila_headers_idx != -1:
                fila_headers = df.iloc[fila_headers_idx].fillna('').astype(str).str.strip().str.upper()
                inicio_partidas = fila_headers_idx + 1
                for idx, val in enumerate(fila_headers):
                    if "CLAVE PROD" in val: col_map['clave_prod'] = idx
                    elif "CANTIDAD" in val: col_map['cantidad'] = idx
                    elif "CLAVE UNIDAD" in val: col_map['clave_unidad'] = idx
                    elif "UNIDAD" == val: col_map['unidad'] = idx
                    elif "DESCRIPCION" in val or "DESCRIPCIÓN" in val: col_map['descripcion'] = idx
                    elif "VALOR UNITARIO" in val: col_map['valor_unitario'] = idx
                    elif "IMPUESTO" in val: col_map['impuesto'] = idx
                    elif "IMPORTE" in val: col_map['importe'] = idx
                    elif "NO." in val or "NO" == val: col_map['no'] = idx

            # Función segura para extraer datos por índice dinámico
            def safe_get(fila, key, default=""):
                try:
                    val = fila.iloc[col_map[key]]
                    return val if pd.notna(val) else default
                except IndexError:
                    return default

            # Función auxiliar para limpiar números
            def clean_num(val):
                if isinstance(val, str):
                    val = val.replace('$', '').replace(',', '').strip()
                    try: return float(val)
                    except: return 0.0
                return val

            # Extracción de Partidas
            df_partidas_brutas = df.iloc[inicio_partidas:]
            
            partidas = []
            contador_partida = 1
            for _, fila in df_partidas_brutas.iterrows():
                if fila_headers_idx != -1:
                    # Mapeo por columnas encontradas
                    clave = safe_get(fila, 'clave_prod')
                    desc = str(safe_get(fila, 'descripcion')).strip()
                    cantidad = safe_get(fila, 'cantidad')
                    clave_unidad = safe_get(fila, 'clave_unidad')
                    unidad = safe_get(fila, 'unidad')
                    valor_unitario = clean_num(safe_get(fila, 'valor_unitario', 0.0))
                    impuesto = safe_get(fila, 'impuesto')
                    importe = clean_num(safe_get(fila, 'importe', 0.0))
                    val_no = safe_get(fila, 'no')
                else:
                    # HEURÍSTICA para plantillas sin encabezados (obtiene celdas no vacías en orden)
                    valores_fila = [v for v in fila.values if pd.notna(v) and str(v).strip() != "" and str(v).strip().upper() != "NAN"]
                    if len(valores_fila) >= 6:
                        clave = valores_fila[0]
                        cantidad = valores_fila[1]
                        clave_unidad = valores_fila[2]
                        unidad = valores_fila[3]
                        desc = str(valores_fila[4]).strip()
                        valor_unitario = clean_num(valores_fila[5])
                        impuesto = valores_fila[6] if len(valores_fila) > 6 else ""
                        importe = clean_num(valores_fila[-1])
                        val_no = ""
                    else:
                        clave = "" # Fila inválida
                        desc = ""
                    
                    with open(debug_path, 'a') as f:
                        f.write(f"Extracting row heuristically:\nValores: {valores_fila}\nClave: {clave}, Desc: {desc}\n")
                
                # Filtramos las filas fantasma: deben tener clave y descripción real
                if str(clave).strip() != "" and desc != "" and desc.upper() != "NAN":
                    numero_partida = val_no if str(val_no).strip() != "" else contador_partida
                    
                    partida = {
                        "no": numero_partida,
                        "clave_prod": clave,
                        "cantidad": cantidad,
                        "clave_unidad": clave_unidad,
                        "unidad": unidad,
                        "descripcion": desc,
                        "valor_unitario": valor_unitario,
                        "impuesto": impuesto,
                        "importe": importe
                    }
                    partidas.append(partida)
                    contador_partida += 1

            # === FASE 3: GENERACIÓN DEL PDF (DINÁMICO) ===
            empresa = str(datos_generales.get('empresa_factura', '')).strip().upper()
            config = None
            
            # Búsqueda flexible: Si la llave (ej. 'FICSAR') está dentro de 'FICSAR ADMINISTRACION SA DE CV', lo acepta
            for key, val in MAPA_PLANTILLAS.items():
                if key.upper() in empresa or empresa in key.upper():
                    config = val
                    break
            
            if not config:
                return Response({"error": f"La empresa '{empresa}' no tiene una plantilla configurada en el mapa."}, status=400)
                
            coords = config["coords"]
            
            # El tema se define únicamente por la configuración de la empresa en plantillas_config.py
            tema_final = config.get("tema", "AVIDUX")
            
            tema = get_tema(tema_final)
            nombre_tema = tema_final.upper()
            
            # ============================================================
            # RENDERIZADO SEGÚN TEMA
            # ============================================================
            packet = io.BytesIO()
            can = canvas.Canvas(packet, pagesize=letter)

            if fecha_operacion:
                # Si viene en formato YYYY-MM-DD (ej: desde un input HTML), convertirla a DD-MM-YYYY
                if "-" in fecha_operacion and len(fecha_operacion) == 10 and fecha_operacion.startswith("20"):
                    try:
                        fecha_obj = datetime.strptime(fecha_operacion, "%Y-%m-%d")
                        fecha_operacion = fecha_obj.strftime("%d-%m-%Y")
                    except ValueError:
                        pass
            else:
                fecha_operacion = datetime.now().strftime("%d-%m-%Y")

            letras_folio = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
            folio_generado = f"COT-{fecha_operacion.replace('-','')}-{letras_folio}"

            partes_linea1 = [str(datos_generales['calle_numero']).strip(), str(datos_generales['colonia']).strip()]
            domicilio_linea1 = ", ".join(p for p in partes_linea1 if p)
            partes_linea2 = [str(datos_generales['ciudad']).strip(), str(datos_generales['estado']).strip()]
            if str(datos_generales['codigo_postal']).strip():
                partes_linea2.append(f"C.P. {str(datos_generales['codigo_postal']).strip()}")
            domicilio_linea2 = ", ".join(p for p in partes_linea2 if p)

            if nombre_tema == "AVIDUX":
                # ---- DATOS DE CLIENTE Y CABECERA (AVIDUX) ----
                x_inicio = coords.get("x_tabla_inicio", 60)
                y_cursor = coords["cliente"][1]
                
                # Folio y Fecha Centrados
                x_centro = coords.get("folio_centro", (306, 680))[0]
                y_folio = coords.get("folio_centro", (306, 680))[1]
                
                can.setFont("Helvetica-Bold", 12)
                can.drawCentredString(x_centro, y_folio, folio_generado)
                can.setFont("Helvetica", 10)
                can.drawCentredString(x_centro, y_folio - 15, f"Fecha: {fecha_operacion}")

                # Datos del cliente (Izquierda)
                dibujar_texto_alineado(can, "CLIENTE", x_inicio, y_cursor, "Helvetica-Bold", 11, colors.black)
                dibujar_texto_alineado(can, f"Nombre: {str(datos_generales['razon_social'])[:50]}", x_inicio, y_cursor - 15, "Helvetica", 10, colors.black)
                
                domicilio_completo = f"{domicilio_linea1} {domicilio_linea2}".strip()
                dibujar_texto_alineado(can, f"Dirección: {domicilio_completo[:45]}", x_inicio, y_cursor - 30, "Helvetica", 10, colors.black)
                if len(domicilio_completo) > 45:
                    dibujar_texto_alineado(can, domicilio_completo[45:95], x_inicio + 55, y_cursor - 42, "Helvetica", 10, colors.black)
                
                y_fin_cliente = y_cursor - 60

                # Reset
                can.setFillColor(colors.black)

            elif nombre_tema == "373 COMERCIO":
                # ---- DATOS DE CLIENTE Y CABECERA (373 COMERCIO) ----
                x_inicio = coords.get("x_tabla_inicio", 40)
                y_cursor = coords["cliente"][1]
                
                # Fecha y Folio (A la derecha)
                x_ff = coords.get("fecha_folio", (420, 690))[0]
                y_ff = coords.get("fecha_folio", (420, 690))[1]
                
                dibujar_texto_alineado(can, "FECHA:", x_ff, y_ff, "Helvetica", 11, colors.black)
                dibujar_texto_alineado(can, f"{fecha_operacion}", x_ff + 45, y_ff, "Helvetica", 11, colors.black)
                
                dibujar_texto_alineado(can, "Folio:", x_ff, y_ff - 15, "Helvetica", 10, colors.HexColor("#4A5568"))
                dibujar_texto_alineado(can, folio_generado, x_ff + 35, y_ff - 15, "Helvetica", 10, colors.HexColor("#4A5568"))

                # Datos del cliente (Izquierda)
                color_acento = colors.HexColor("#002855") # Azul oscuro para "CLIENTE"
                dibujar_texto_alineado(can, "CLIENTE", x_inicio, y_cursor, "Helvetica-Bold", 14, color_acento)
                
                y_cursor -= 20
                dibujar_texto_alineado(can, "Nombre: ", x_inicio, y_cursor, "Helvetica", 10, colors.HexColor("#2D3748"))
                dibujar_texto_alineado(can, str(datos_generales['razon_social'])[:50], x_inicio + 50, y_cursor, "Helvetica", 10, colors.black)
                
                y_cursor -= 15
                domicilio_completo = f"{domicilio_linea1} {domicilio_linea2}".strip()
                dibujar_texto_alineado(can, "Dirección:", x_inicio, y_cursor, "Helvetica", 10, colors.HexColor("#2D3748"))
                dibujar_texto_alineado(can, domicilio_completo[:45], x_inicio + 55, y_cursor, "Helvetica", 10, colors.black)
                if len(domicilio_completo) > 45:
                    y_cursor -= 12
                    dibujar_texto_alineado(can, domicilio_completo[45:95], x_inicio + 55, y_cursor, "Helvetica", 10, colors.black)
                
                y_cursor -= 15
                dibujar_texto_alineado(can, "RFC:", x_inicio, y_cursor, "Helvetica", 10, colors.HexColor("#2D3748"))
                dibujar_texto_alineado(can, str(datos_generales['rfc_receptor']), x_inicio + 35, y_cursor, "Helvetica", 10, colors.black)
                
                y_fin_cliente = y_cursor - 30
            
            elif nombre_tema == "MELLAFE":
                # ---- DATOS DE CLIENTE Y CABECERA (MELLAFE) ----
                x_inicio = coords.get("x_tabla_inicio", 40)
                y_cursor = coords["cliente"][1]
                
                # Folio y Fecha (Debajo de COTIZACIÓN, a la derecha)
                x_centro = coords.get("folio_centro", (380, 680))[0]
                y_folio = coords.get("folio_centro", (380, 680))[1]
                
                dibujar_texto_alineado(can, "FOLIO:", x_centro - 10, y_folio, "Helvetica-Bold", 10, colors.black)
                dibujar_texto_alineado(can, folio_generado, x_centro + 35, y_folio, "Helvetica", 10, colors.black)
                
                dibujar_texto_alineado(can, "FECHA:", x_centro - 10, y_folio - 15, "Helvetica-Bold", 10, colors.black)
                dibujar_texto_alineado(can, f"{fecha_operacion}", x_centro + 35, y_folio - 15, "Helvetica", 10, colors.black)

                # Empresa (Lado Derecho)
                color_azul = colors.HexColor("#0076C0")
                dibujar_texto_alineado(can, "EMPRESA", letter[0] - 40, y_cursor + 35, "Helvetica-Bold", 9, colors.black, "right")
                dibujar_texto_alineado(can, "MALLAFE COMERCIALIZADORA S.A. DE C.V.", letter[0] - 40, y_cursor + 20, "Helvetica-Bold", 11, color_azul, "right")

                # Cliente (Lado Izquierdo)
                dibujar_texto_alineado(can, "COTIZACIÓN", x_inicio, y_cursor, "Helvetica-Bold", 9, colors.black)
                dibujar_texto_alineado(can, "CLIENTE:", x_inicio, y_cursor - 15, "Helvetica-Bold", 12, color_azul)
                
                dibujar_texto_alineado(can, str(datos_generales['razon_social'])[:50], x_inicio + 65, y_cursor - 15, "Helvetica", 10, colors.black)
                
                domicilio_completo = f"{domicilio_linea1} {domicilio_linea2}".strip()
                dibujar_texto_alineado(can, "Domicilio :", x_inicio, y_cursor - 30, "Helvetica-Bold", 10, colors.black)
                dibujar_texto_alineado(can, domicilio_completo[:45], x_inicio + 65, y_cursor - 30, "Helvetica", 10, colors.black)
                if len(domicilio_completo) > 45:
                    y_cursor -= 12
                    dibujar_texto_alineado(can, domicilio_completo[45:95], x_inicio + 65, y_cursor - 30, "Helvetica", 10, colors.black)
                    
                
                dibujar_texto_alineado(can, "RFC:", x_inicio, y_cursor - 45, "Helvetica-Bold", 10, colors.black)
                dibujar_texto_alineado(can, str(datos_generales['rfc_receptor']), x_inicio + 35, y_cursor - 45, "Helvetica", 10, colors.black)
                
                y_fin_cliente = y_cursor - 70

            elif nombre_tema == "AGRAMON":
                # ---- DATOS DE CLIENTE Y CABECERA (AGRAMON) ----
                x_inicio = coords.get("x_tabla_inicio", 40)
                y_cursor = coords["cliente"][1]
                
                # Folio y Fecha (Desfasados como en el mockup)
                x_ff = coords.get("fecha_folio", (400, 680))[0]
                y_ff = coords.get("fecha_folio", (400, 680))[1]
                
                dibujar_texto_alineado(can, "Folio:", x_ff - 40, y_ff, "Helvetica", 11, colors.black)
                dibujar_texto_alineado(can, folio_generado, x_ff + 5, y_ff, "Helvetica", 11, colors.black)
                
                dibujar_texto_alineado(can, "FECHA:", x_ff + 20, y_ff - 40, "Helvetica", 11, colors.black)
                dibujar_texto_alineado(can, f"{fecha_operacion}", x_ff + 70, y_ff - 40, "Helvetica", 11, colors.black)

                # Datos del cliente
                dibujar_texto_alineado(can, "CLIENTE:", x_inicio, y_cursor, "Helvetica", 12, colors.black)
                dibujar_texto_alineado(can, str(datos_generales['razon_social'])[:50], x_inicio + 65, y_cursor, "Helvetica", 11, colors.black)
                
                domicilio_completo = f"{domicilio_linea1} {domicilio_linea2}".strip()
                dibujar_texto_alineado(can, "DOMICILIO:", x_inicio, y_cursor - 20, "Helvetica", 12, colors.black)
                dibujar_texto_alineado(can, domicilio_completo[:45], x_inicio + 75, y_cursor - 20, "Helvetica", 11, colors.black)
                if len(domicilio_completo) > 45:
                    y_cursor -= 14
                    dibujar_texto_alineado(can, domicilio_completo[45:95], x_inicio + 75, y_cursor - 20, "Helvetica", 11, colors.black)
                    
                dibujar_texto_alineado(can, "RFC:", x_inicio, y_cursor - 40, "Helvetica", 12, colors.black)
                dibujar_texto_alineado(can, str(datos_generales['rfc_receptor']), x_inicio + 35, y_cursor - 40, "Helvetica", 11, colors.black)
                
                y_fin_cliente = y_cursor - 70


            elif nombre_tema == "SISUC":
                # ---- DATOS DE CLIENTE Y CABECERA (SISUC) ----
                x_inicio = coords.get("x_tabla_inicio", 40)
                y_cursor = coords["cliente"][1]
                
                # Fecha y Folio (Alineados a la derecha)
                x_ff = coords.get("fecha_folio", (340, 680))[0]
                y_ff = coords.get("fecha_folio", (340, 680))[1]
                
                dibujar_texto_alineado(can, "FECHA:", x_ff, y_ff, "Helvetica", 10, colors.black)
                dibujar_texto_alineado(can, f"{fecha_operacion}", x_ff + 55, y_ff, "Helvetica", 10, colors.black)
                
                dibujar_texto_alineado(can, "FOLIO:", x_ff, y_ff - 15, "Helvetica", 10, colors.black)
                dibujar_texto_alineado(can, folio_generado, x_ff + 55, y_ff - 15, "Helvetica", 10, colors.black)
                
                # Línea horizontal divisoria azul
                color_azul = colors.HexColor("#00508C")
                dibujar_linea_horizontal(can, x_inicio, letter[0] - 40, y_cursor + 20, 1.5, color_azul)

                # Datos del cliente
                dibujar_texto_alineado(can, "CLIENTE :", x_inicio, y_cursor, "Helvetica", 10, colors.black)
                dibujar_texto_alineado(can, str(datos_generales['razon_social'])[:50], x_inicio + 70, y_cursor, "Helvetica", 10, colors.black)
                
                domicilio_completo = f"{domicilio_linea1} {domicilio_linea2}".strip()
                dibujar_texto_alineado(can, "DIRECCION:", x_inicio, y_cursor - 20, "Helvetica", 10, colors.black)
                dibujar_texto_alineado(can, domicilio_completo[:45], x_inicio + 80, y_cursor - 20, "Helvetica", 10, colors.black)
                if len(domicilio_completo) > 45:
                    y_cursor -= 12
                    dibujar_texto_alineado(can, domicilio_completo[45:95], x_inicio + 80, y_cursor - 20, "Helvetica", 10, colors.black)
                    
                dibujar_texto_alineado(can, "RFC:", x_inicio, y_cursor - 40, "Helvetica", 10, colors.black)
                dibujar_texto_alineado(can, str(datos_generales['rfc_receptor']), x_inicio + 35, y_cursor - 40, "Helvetica", 10, colors.black)
                
                y_fin_cliente = y_cursor - 60

            elif nombre_tema == "AMELIT":
                # ---- DATOS DE CLIENTE Y CABECERA (AMELIT) ----
                x_inicio = coords.get("x_tabla_inicio", 40)
                y_cursor = coords["cliente"][1]
                
                # COTIZACION Y FOLIO (Agrupados a la izquierda)
                x_ff = coords.get("fecha_folio", (40, 680))[0]
                y_ff = coords.get("fecha_folio", (40, 680))[1]
                
                dibujar_texto_alineado(can, "COTIZACION", x_ff, y_ff, "Helvetica-Bold", 14, colors.black)
                dibujar_texto_alineado(can, f"Folio: {folio_generado}", x_ff, y_ff - 15, "Helvetica", 11, colors.black)
                
                y_cursor -= 10
                # Datos del cliente agrupados
                dibujar_texto_alineado(can, "Cliente:", x_inicio, y_cursor, "Helvetica", 11, colors.black)
                dibujar_texto_alineado(can, str(datos_generales['razon_social'])[:50], x_inicio + 45, y_cursor, "Helvetica", 11, colors.black)
                
                y_cursor -= 13
                dibujar_texto_alineado(can, "RFC:", x_inicio, y_cursor, "Helvetica", 11, colors.black)
                dibujar_texto_alineado(can, str(datos_generales['rfc_receptor']), x_inicio + 35, y_cursor, "Helvetica", 11, colors.black)
                
                y_cursor -= 13
                dibujar_texto_alineado(can, "Fecha:", x_inicio, y_cursor, "Helvetica", 11, colors.black)
                dibujar_texto_alineado(can, f"{fecha_operacion}", x_inicio + 40, y_cursor, "Helvetica", 11, colors.black)
                
                y_cursor -= 13
                domicilio_completo = f"{domicilio_linea1} {domicilio_linea2}".strip()
                dibujar_texto_alineado(can, "Domicilio:", x_inicio, y_cursor, "Helvetica", 11, colors.black)
                dibujar_texto_alineado(can, domicilio_completo[:45], x_inicio + 55, y_cursor, "Helvetica", 11, colors.black)
                if len(domicilio_completo) > 45:
                    y_cursor -= 11
                    dibujar_texto_alineado(can, domicilio_completo[45:95], x_inicio + 55, y_cursor, "Helvetica", 11, colors.black)
                
                y_fin_cliente = y_cursor - 30

            elif nombre_tema == "BERGUN":
                # ---- DATOS DE CLIENTE Y CABECERA (BERGUN) ----
                x_inicio = coords.get("x_tabla_inicio", 40)
                
                # Folio centrado debajo de COTIZACIÓN
                x_folio = coords.get("folio_centro", (300, 685))[0]
                y_folio = coords.get("folio_centro", (300, 685))[1]
                
                color_magenta = colors.HexColor("#87274E")
                
                dibujar_texto_alineado(can, f"FOLIO: {folio_generado}", x_folio, y_folio, "Helvetica-Bold", 11, color_magenta, "center")
                
                y_cursor = coords["cliente"][1]
                
                # Etiquetas en magenta, texto en negro
                dibujar_texto_alineado(can, "FECHA:", x_inicio, y_cursor, "Helvetica-Bold", 10, color_magenta)
                dibujar_texto_alineado(can, f"{fecha_operacion}", x_inicio + 45, y_cursor, "Helvetica", 10, colors.black)
                
                y_cursor -= 13
                dibujar_texto_alineado(can, "Cliente:", x_inicio, y_cursor, "Helvetica-Bold", 10, color_magenta)
                dibujar_texto_alineado(can, str(datos_generales['razon_social'])[:50], x_inicio + 45, y_cursor, "Helvetica", 10, colors.black)
                
                y_cursor -= 13
                dibujar_texto_alineado(can, "RFC:", x_inicio, y_cursor, "Helvetica-Bold", 10, color_magenta)
                dibujar_texto_alineado(can, str(datos_generales['rfc_receptor']), x_inicio + 35, y_cursor, "Helvetica", 10, colors.black)
                
                y_cursor -= 13
                dibujar_texto_alineado(can, "Dirección de residencia:", x_inicio, y_cursor, "Helvetica-Bold", 10, color_magenta)
                
                domicilio_completo = f"{domicilio_linea1} {domicilio_linea2}".strip()
                dibujar_texto_alineado(can, domicilio_completo[:50], x_inicio + 130, y_cursor, "Helvetica", 10, colors.black)
                if len(domicilio_completo) > 50:
                    y_cursor -= 11
                    dibujar_texto_alineado(can, domicilio_completo[50:100], x_inicio + 130, y_cursor, "Helvetica", 10, colors.black)
                
                # Le damos un salto grande para esquivar el párrafo que ya viene impreso en el PDF ("Respondiendo a su...")
                y_fin_cliente = y_cursor - 60 

            elif nombre_tema == "BERZAN":
                # ---- DATOS DE CLIENTE Y CABECERA (BERZAN) ----
                x_inicio = coords.get("x_tabla_inicio", 40)
                y_cursor = coords["cliente"][1]
                
                # La palabra "Datos del cliente" ya viene en el PDF, escribimos debajo
                
                # Etiquetas en cursiva, valores normales
                dibujar_texto_alineado(can, "Nombre:", x_inicio, y_cursor, "Helvetica-Oblique", 10, colors.black)
                dibujar_texto_alineado(can, str(datos_generales['razon_social'])[:50], x_inicio + 45, y_cursor, "Helvetica", 10, colors.black)
                
                y_cursor -= 15
                dibujar_texto_alineado(can, "Folio:", x_inicio, y_cursor, "Helvetica-Oblique", 10, colors.black)
                dibujar_texto_alineado(can, folio_generado, x_inicio + 30, y_cursor, "Helvetica", 10, colors.black)
                
                y_cursor -= 15
                dibujar_texto_alineado(can, "Dirección:", x_inicio, y_cursor, "Helvetica-Oblique", 10, colors.black)
                domicilio_completo = f"{domicilio_linea1} {domicilio_linea2}".strip()
                dibujar_texto_alineado(can, domicilio_completo[:45], x_inicio + 55, y_cursor, "Helvetica", 10, colors.black)
                if len(domicilio_completo) > 45:
                    y_cursor -= 12
                    dibujar_texto_alineado(can, domicilio_completo[45:95], x_inicio + 55, y_cursor, "Helvetica", 10, colors.black)
                    
                y_cursor -= 15
                dibujar_texto_alineado(can, "RFC:", x_inicio, y_cursor, "Helvetica-Oblique", 10, colors.black)
                dibujar_texto_alineado(can, str(datos_generales['rfc_receptor']), x_inicio + 30, y_cursor, "Helvetica", 10, colors.black)
                
                # FECHA (A la derecha, debajo de COTIZACIÓN)
                x_ff = coords.get("fecha_folio", (400, 680))[0]
                y_ff = coords.get("fecha_folio", (400, 680))[1]
                
                dibujar_texto_alineado(can, "FECHA :", x_ff - 15, y_ff - 20, "Helvetica", 10, colors.black)
                dibujar_texto_alineado(can, f"{fecha_operacion}", x_ff + 35, y_ff - 20, "Helvetica", 10, colors.black)
                
                y_fin_cliente = y_cursor - 40

            elif nombre_tema == "CALAFELL":
                # ---- DATOS DE CLIENTE (CALAFELL) ----
                x_inicio = coords.get("x_tabla_inicio", 40)
                y_cursor = coords["cliente"][1]
                
                # Etiquetas en negritas, valores en regular
                dibujar_texto_alineado(can, "CLIENTE:", x_inicio, y_cursor, "Helvetica-Bold", 10, colors.black)
                dibujar_texto_alineado(can, str(datos_generales['razon_social'])[:50], x_inicio + 60, y_cursor, "Helvetica", 10, colors.black)
                
                y_cursor -= 20
                dibujar_texto_alineado(can, "FECHA:", x_inicio, y_cursor, "Helvetica-Bold", 10, colors.black)
                dibujar_texto_alineado(can, f"{fecha_operacion}", x_inicio + 50, y_cursor, "Helvetica", 10, colors.black)
                
                y_cursor -= 20
                dibujar_texto_alineado(can, "FOLIO:", x_inicio, y_cursor, "Helvetica-Bold", 10, colors.black)
                dibujar_texto_alineado(can, folio_generado, x_inicio + 50, y_cursor, "Helvetica", 10, colors.black)
                
                # Espacio generoso antes de la tabla
                y_fin_cliente = y_cursor - 40 

            elif nombre_tema == "CRISAC":
                # ---- DATOS DE CLIENTE Y CABECERA (CRISAC) ----
                x_inicio = coords.get("x_tabla_inicio", 65)
                y_cursor = coords["cliente"][1]
                
                # Folio a la derecha (debajo de COTIZACIÓN)
                x_folio = 560  # Lo pegamos al margen derecho
                y_folio = coords.get("folio", (450, 710))[1]
                
                dibujar_texto_alineado(can, f"FOLIO N°: {folio_generado}", x_folio, y_folio, "Helvetica-Bold", 9, colors.black, "right")
                
                # Datos del cliente
                dibujar_texto_alineado(can, "CLIENTE:", x_inicio, y_cursor, "Helvetica-Bold", 10, colors.black)
                dibujar_texto_alineado(can, str(datos_generales['razon_social'])[:50], x_inicio + 55, y_cursor, "Helvetica", 10, colors.black)
                
                y_cursor -= 15
                dibujar_texto_alineado(can, "RFC:", x_inicio, y_cursor, "Helvetica-Bold", 10, colors.black)
                dibujar_texto_alineado(can, str(datos_generales['rfc_receptor']), x_inicio + 35, y_cursor, "Helvetica", 10, colors.black)
                
                y_cursor -= 15
                dibujar_texto_alineado(can, "DIRECCIÓN:", x_inicio, y_cursor, "Helvetica-Bold", 10, colors.black)
                domicilio_completo = f"{domicilio_linea1} {domicilio_linea2}".strip()
                dibujar_texto_alineado(can, domicilio_completo[:45], x_inicio + 70, y_cursor, "Helvetica", 10, colors.black)
                if len(domicilio_completo) > 45:
                    y_cursor -= 12
                    dibujar_texto_alineado(can, domicilio_completo[45:95], x_inicio + 70, y_cursor, "Helvetica", 10, colors.black)
                
                # Espacio antes de la tabla
                y_fin_cliente = y_cursor - 40

            elif nombre_tema == "CUENCA":
                color_azul = colors.HexColor("#1b1958")
                x_inicio = coords.get("x_tabla_inicio", 60)
                y_cursor = coords["cliente"][1]
                
                # Folio
                x_folio = coords.get("folio", (450, 715))[0]
                y_folio = coords.get("folio", (450, 715))[1]
                dibujar_texto_alineado(can, f"FOLIO: {folio_generado}", x_folio, y_folio, "Helvetica-Bold", 10, color_azul)
                
                # Fecha
                x_fecha = coords.get("fecha", (380, 580))[0]
                y_fecha = coords.get("fecha", (380, 580))[1]
                dibujar_texto_alineado(can, f"Fecha: {fecha_operacion}", x_fecha, y_fecha, "Helvetica-Bold", 9, color_azul)
                
                # Datos del cliente
                dibujar_texto_alineado(can, "CLIENTE", x_inicio, y_cursor, "Helvetica-Bold", 11, color_azul)
                y_cursor -= 25
                
                dibujar_texto_alineado(can, "Nombre:", x_inicio, y_cursor, "Helvetica", 10, color_azul)
                dibujar_texto_alineado(can, str(datos_generales['razon_social'])[:50], x_inicio + 45, y_cursor, "Helvetica", 10, color_azul)
                
                y_cursor -= 15
                dibujar_texto_alineado(can, "Dirección:", x_inicio, y_cursor, "Helvetica", 10, color_azul)
                domicilio_completo = f"{domicilio_linea1} {domicilio_linea2}".strip()
                dibujar_texto_alineado(can, domicilio_completo[:45], x_inicio + 55, y_cursor, "Helvetica", 10, color_azul)
                if len(domicilio_completo) > 45:
                    y_cursor -= 12
                    dibujar_texto_alineado(can, domicilio_completo[45:95], x_inicio + 55, y_cursor, "Helvetica", 10, color_azul)
                
                y_cursor -= 15
                dibujar_texto_alineado(can, "RFC:", x_inicio, y_cursor, "Helvetica", 10, color_azul)
                dibujar_texto_alineado(can, str(datos_generales['rfc_receptor']), x_inicio + 30, y_cursor, "Helvetica", 10, color_azul)
                
                y_fin_cliente = y_cursor - 30

            elif nombre_tema == "DERSA":
                color_azul = colors.HexColor("#1b1464")
                x_inicio = coords.get("x_tabla_inicio", 60)
                y_cursor = coords["cliente"][1]
                
                # Cliente (Lado izquierdo)
                dibujar_texto_alineado(can, "CLIENTE", x_inicio, y_cursor, "Helvetica-Bold", 10, color_azul)
                y_cursor -= 12
                
                dibujar_texto_alineado(can, "Nombre:", x_inicio, y_cursor, "Helvetica", 9, color_azul)
                dibujar_texto_alineado(can, str(datos_generales['razon_social'])[:45], x_inicio + 40, y_cursor, "Helvetica", 9, color_azul)
                
                y_cursor -= 11
                dibujar_texto_alineado(can, "Domicilio:", x_inicio, y_cursor, "Helvetica", 9, color_azul)
                dom = f"{domicilio_linea1} {domicilio_linea2}".strip()
                dibujar_texto_alineado(can, dom[:42], x_inicio + 45, y_cursor, "Helvetica", 9, color_azul)
                # Si el domicilio es largo, lo partimos en un segundo renglón
                if len(dom) > 42:
                    y_cursor -= 10
                    dibujar_texto_alineado(can, dom[42:90], x_inicio + 45, y_cursor, "Helvetica", 9, color_azul)
                
                y_cursor -= 11
                dibujar_texto_alineado(can, "RFC:", x_inicio, y_cursor, "Helvetica", 9, color_azul)
                dibujar_texto_alineado(can, str(datos_generales['rfc_receptor']), x_inicio + 25, y_cursor, "Helvetica", 9, color_azul)
                
                y_cursor -= 11
                dibujar_texto_alineado(can, "Folio:", x_inicio, y_cursor, "Helvetica", 9, color_azul)
                dibujar_texto_alineado(can, folio_generado, x_inicio + 25, y_cursor, "Helvetica", 9, color_azul)
                
                # Fecha (Lado derecho)
                x_fecha = coords.get("fecha", (380, 660))[0]
                y_fecha = coords.get("fecha", (380, 660))[1]
                dibujar_texto_alineado(can, f"FECHA: {fecha_operacion}", x_fecha, y_fecha, "Helvetica-Bold", 10, color_azul)
                
                # La tabla empieza cómodamente debajo de la segunda línea azul
                y_fin_cliente = 560

            elif nombre_tema == "EXPRESATEL":
                color_morado = colors.HexColor("#761dc9")
                color_gris = colors.HexColor("#7a7a7a")
                
                x_inicio = coords.get("x_tabla_inicio", 60)
                y_cursor = coords["cliente"][1]
                
                # Nombre del cliente en Morado y GRANDE (reemplaza a los labels de la maqueta)
                razon_social = str(datos_generales['razon_social'])
                dibujar_texto_alineado(can, razon_social[:40], x_inicio, y_cursor, "Helvetica-Bold", 16, color_morado)
                if len(razon_social) > 40:
                    y_cursor -= 18
                    dibujar_texto_alineado(can, razon_social[40:80], x_inicio, y_cursor, "Helvetica-Bold", 16, color_morado)
                
                y_cursor -= 18
                # Domicilio y RFC en gris plateado
                dom = f"{domicilio_linea1} {domicilio_linea2}".strip()
                dibujar_texto_alineado(can, dom[:60], x_inicio, y_cursor, "Helvetica-Bold", 11, color_gris)
                
                y_cursor -= 15
                dibujar_texto_alineado(can, f"RFC: {datos_generales['rfc_receptor']}", x_inicio, y_cursor, "Helvetica-Bold", 11, color_gris)
                
                # Fecha y Folio (Lado derecho arriba)
                x_fecha = coords.get("fecha", (420, 660))[0]
                y_fecha = coords.get("fecha", (420, 660))[1]
                
                dibujar_texto_alineado(can, "FECHA :", x_fecha, y_fecha, "Helvetica", 11, colors.black)
                dibujar_texto_alineado(can, fecha_operacion, x_fecha + 50, y_fecha, "Helvetica", 11, colors.black)
                
                y_fecha -= 18
                dibujar_texto_alineado(can, "Folio:", x_fecha, y_fecha, "Helvetica", 11, colors.black)
                dibujar_texto_alineado(can, folio_generado, x_fecha + 40, y_fecha, "Helvetica", 11, colors.black)
                
                y_fin_cliente = y_cursor - 30

            elif nombre_tema == "FACSAM":
                color_texto = colors.HexColor("#6b4c4c") # Café oscuro
                x_inicio = coords.get("x_tabla_inicio", 60)
                y_cursor = coords["cliente"][1]
                
                # Las 3 líneas preimpresas del PDF:
                # 1. Fecha
                dibujar_texto_alineado(can, "Fecha:", x_inicio, y_cursor, "Helvetica", 10, color_texto)
                dibujar_texto_alineado(can, fecha_operacion, x_inicio + 45, y_cursor, "Helvetica", 10, color_texto)
                
                y_cursor -= 24
                # 2. Cliente
                dibujar_texto_alineado(can, "Cliente:", x_inicio, y_cursor, "Helvetica", 10, color_texto)
                dibujar_texto_alineado(can, str(datos_generales['razon_social'])[:45], x_inicio + 45, y_cursor, "Helvetica", 10, color_texto)
                
                y_cursor -= 24
                # 3. RFC (En la maqueta dice teléfono, pero usaremos RFC por legalidad)
                dibujar_texto_alineado(can, "RFC:", x_inicio, y_cursor, "Helvetica", 10, color_texto)
                dibujar_texto_alineado(can, str(datos_generales['rfc_receptor']), x_inicio + 45, y_cursor, "Helvetica", 10, color_texto)
                
                # Folio (Lado derecho, debajo del logo)
                x_folio = coords.get("folio", (450, 630))[0]
                y_folio = coords.get("folio", (450, 630))[1]
                dibujar_texto_alineado(can, f"Folio: {folio_generado}", x_folio, y_folio, "Helvetica", 10, color_texto)
                
                y_fin_cliente = y_cursor - 40

            elif nombre_tema == "FICSAR":
                x_inicio = coords.get("x_tabla_inicio", 60)
                y_cursor = coords["cliente"][1]
                
                # "COTIZACIÓN" ya viene en el PDF, solo imprimimos los datos
                dibujar_texto_alineado(can, f"Cliente: {str(datos_generales['razon_social'])[:50]}", x_inicio, y_cursor, "Helvetica", 10, colors.black)
                y_cursor -= 18
                
                dibujar_texto_alineado(can, f"Fecha: {fecha_operacion}", x_inicio, y_cursor, "Helvetica", 10, colors.black)
                y_cursor -= 18
                
                dibujar_texto_alineado(can, f"RFC: {datos_generales['rfc_receptor']}", x_inicio, y_cursor, "Helvetica", 10, colors.black)
                
                # Folio (Lado derecho arriba, debajo del logo)
                x_folio = coords.get("folio", (450, 680))[0]
                y_folio = coords.get("folio", (450, 680))[1]
                dibujar_texto_alineado(can, f"Folio: {folio_generado}", x_folio, y_folio, "Helvetica", 10, colors.black)
                
                y_fin_cliente = y_cursor - 40

            elif nombre_tema == "ASESORES GBR":
                color_verde = colors.HexColor("#134a46") # Verde Teal oscuro
                color_gris = colors.HexColor("#555555")
                x_inicio = coords.get("x_tabla_inicio", 60)
                y_cursor = coords["cliente"][1]
                
                # Cliente
                dibujar_texto_alineado(can, "NOMBRE:", x_inicio, y_cursor, "Helvetica-Bold", 11, color_verde)
                dibujar_texto_alineado(can, str(datos_generales['razon_social'])[:50], x_inicio + 70, y_cursor, "Helvetica", 11, color_gris)
                y_cursor -= 22
                
                # Fecha
                dibujar_texto_alineado(can, "FECHA:", x_inicio, y_cursor, "Helvetica-Bold", 11, color_verde)
                dibujar_texto_alineado(can, fecha_operacion, x_inicio + 60, y_cursor, "Helvetica", 11, color_gris)
                y_cursor -= 22
                
                # RFC 
                dibujar_texto_alineado(can, "RFC:", x_inicio, y_cursor, "Helvetica-Bold", 11, color_verde)
                dibujar_texto_alineado(can, str(datos_generales['rfc_receptor']), x_inicio + 40, y_cursor, "Helvetica", 11, color_gris)
                
                # Folio (Lado derecho debajo de COTIZACIÓN)
                x_folio = coords.get("folio", (400, 620))[0]
                y_folio = coords.get("folio", (400, 620))[1]
                dibujar_texto_alineado(can, f"FOLIO: {folio_generado}", x_folio, y_folio, "Helvetica", 12, color_gris)
                
                y_fin_cliente = y_cursor - 40

            elif nombre_tema == "GLOBALEARTH":
                color_texto = colors.HexColor("#555555")
                # Sangramos 15 puntos para que quede alineado dentro de "Datos del cliente"
                x_inicio = coords.get("x_tabla_inicio", 60) + 15 
                y_cursor = coords["cliente"][1]
                
                # Nombre, Folio y RFC en Cursiva (Oblique)
                dibujar_texto_alineado(can, f"Nombre: {str(datos_generales['razon_social'])[:50]}", x_inicio, y_cursor, "Helvetica-Oblique", 10, color_texto)
                y_cursor -= 16
                
                dibujar_texto_alineado(can, f"Folio: {folio_generado}", x_inicio, y_cursor, "Helvetica-Oblique", 10, color_texto)
                y_cursor -= 16
                
                dibujar_texto_alineado(can, f"RFC: {datos_generales['rfc_receptor']}", x_inicio, y_cursor, "Helvetica-Oblique", 10, color_texto)
                
                # Fecha (A la derecha)
                x_fecha = coords.get("fecha", (450, 640))[0]
                y_fecha = coords.get("fecha", (450, 640))[1]
                dibujar_texto_alineado(can, f"FECHA: {fecha_operacion}", x_fecha, y_fecha, "Helvetica", 10, color_texto)
                
                y_fin_cliente = y_cursor - 40

            elif nombre_tema == "GOVIDA":
                color_texto = colors.HexColor("#000000")
                x_inicio = coords.get("x_tabla_inicio", 60)
                y_cursor = coords["cliente"][1]
                
                # Cliente
                dibujar_texto_alineado(can, "COTIZACIÓN", x_inicio, y_cursor, "Helvetica", 10, color_texto)
                y_cursor -= 15
                dibujar_texto_alineado(can, f"CLIENTE: {str(datos_generales['razon_social'])[:50]}", x_inicio, y_cursor, "Helvetica", 10, color_texto)
                y_cursor -= 15
                dibujar_texto_alineado(can, f"FOLIO: {folio_generado}", x_inicio, y_cursor, "Helvetica", 10, color_texto)
                y_cursor -= 15
                 # Construimos la dirección juntando las celdas separadas del Excel
                calle = str(datos_generales.get('calle_numero', '')).strip()
                col = str(datos_generales.get('colonia', '')).strip()
                cd = str(datos_generales.get('ciudad', '')).strip()
                cp = str(datos_generales.get('codigo_postal', '')).strip()
                
                # Filtramos para no agregar vacíos o la palabra "None"
                partes_domicilio = [p for p in [calle, col, cd, f"C.P. {cp}" if cp and cp != "None" else ""] if p and p != "None"]
                domicilio = ", ".join(partes_domicilio)
                
                dibujar_texto_alineado(can, f"DOMICILIO: {domicilio[:120]}", x_inicio, y_cursor, "Helvetica", 9, color_texto)

                
                # Fecha (Arriba en la línea)
                x_fecha = coords.get("fecha", (500, 700))[0]
                y_fecha = coords.get("fecha", (500, 700))[1]
                dibujar_texto_alineado(can, fecha_operacion, x_fecha, y_fecha, "Helvetica", 10, color_texto)
                
                y_fin_cliente = y_cursor - 30

            elif nombre_tema == "KALE":
                color_texto = colors.black
                x_inicio = coords.get("x_tabla_inicio", 60)
                y_cursor = coords["cliente"][1]
                
                # Cliente
                dibujar_texto_alineado(can, "CLIENTE:", x_inicio, y_cursor, "Helvetica-Bold", 10, color_texto)
                dibujar_texto_alineado(can, str(datos_generales['razon_social'])[:50], x_inicio + 60, y_cursor, "Helvetica", 10, color_texto)
                y_cursor -= 20
                
                # Fecha
                dibujar_texto_alineado(can, "FECHA:", x_inicio, y_cursor, "Helvetica-Bold", 10, color_texto)
                dibujar_texto_alineado(can, fecha_operacion, x_inicio + 50, y_cursor, "Helvetica", 10, color_texto)
                y_cursor -= 20
                
                # Domicilio (Armado automático desde el Excel)
                calle = str(datos_generales.get('calle_numero', '')).strip()
                col = str(datos_generales.get('colonia', '')).strip()
                cd = str(datos_generales.get('ciudad', '')).strip()
                cp = str(datos_generales.get('codigo_postal', '')).strip()
                partes_domicilio = [p for p in [calle, col, cd, f"C.P. {cp}" if cp and cp != "None" else ""] if p and p != "None"]
                domicilio = ", ".join(partes_domicilio)
                
                dibujar_texto_alineado(can, "DOMICILIO:", x_inicio, y_cursor, "Helvetica-Bold", 10, color_texto)
                dibujar_texto_alineado(can, f"{domicilio[:90]}", x_inicio + 75, y_cursor, "Helvetica", 10, color_texto)
                
                # Folio (Arriba a la derecha)
                x_folio = coords.get("folio", (450, 720))[0]
                y_folio = coords.get("folio", (450, 720))[1]
                dibujar_texto_alineado(can, f"FOLIO: {folio_generado}", x_folio, y_folio, "Helvetica-Bold", 11, color_texto)
                
                y_fin_cliente = y_cursor - 40

            elif nombre_tema == "LEVICTUS":
                color_texto = colors.black
                x_inicio = coords.get("x_tabla_inicio", 60)
                y_cursor = coords["cliente"][1]
                
                # Cliente
                dibujar_texto_alineado(can, "Cliente:", x_inicio, y_cursor, "Helvetica", 10, color_texto)
                dibujar_texto_alineado(can, str(datos_generales['razon_social'])[:50], x_inicio + 45, y_cursor, "Helvetica", 10, color_texto)
                y_cursor -= 18
                
                # Fecha
                dibujar_texto_alineado(can, "Fecha:", x_inicio, y_cursor, "Helvetica", 10, color_texto)
                dibujar_texto_alineado(can, fecha_operacion, x_inicio + 40, y_cursor, "Helvetica", 10, color_texto)
                y_cursor -= 18
                
                # RFC
                dibujar_texto_alineado(can, "Identificación (RFC):", x_inicio, y_cursor, "Helvetica", 10, color_texto)
                dibujar_texto_alineado(can, str(datos_generales['rfc_receptor']), x_inicio + 110, y_cursor, "Helvetica", 10, color_texto)
                y_cursor -= 18
                
                # Domicilio
                calle = str(datos_generales.get('calle_numero', '')).strip()
                col = str(datos_generales.get('colonia', '')).strip()
                cd = str(datos_generales.get('ciudad', '')).strip()
                cp = str(datos_generales.get('codigo_postal', '')).strip()
                partes_domicilio = [p for p in [calle, col, cd, f"C.P. {cp}" if cp and cp != "None" else ""] if p and p != "None"]
                domicilio = ", ".join(partes_domicilio)
                
                dibujar_texto_alineado(can, "Domicilio:", x_inicio, y_cursor, "Helvetica", 10, color_texto)
                dibujar_texto_alineado(can, f"{domicilio[:90]}", x_inicio + 55, y_cursor, "Helvetica", 10, color_texto)
                
                # Folio (Arriba a la derecha)
                x_folio = coords.get("folio", (450, 720))[0]
                y_folio = coords.get("folio", (450, 720))[1]
                dibujar_texto_alineado(can, f"{folio_generado}", x_folio, y_folio, "Helvetica", 10, color_texto)
                
                y_fin_cliente = y_cursor - 40

            elif nombre_tema == "LEXIC":
                color_texto = colors.black
                x_inicio = coords.get("x_tabla_inicio", 60)
                y_cursor = coords["cliente"][1]
                
                # Cliente
                dibujar_texto_alineado(can, "Cliente :", x_inicio, y_cursor, "Helvetica-Bold", 10, color_texto)
                dibujar_texto_alineado(can, str(datos_generales['razon_social'])[:50], x_inicio + 55, y_cursor, "Helvetica", 10, color_texto)
                y_cursor -= 18
                
                # Folio
                dibujar_texto_alineado(can, "Folio:", x_inicio, y_cursor, "Helvetica-Bold", 10, color_texto)
                dibujar_texto_alineado(can, f"{folio_generado}", x_inicio + 40, y_cursor, "Helvetica", 10, color_texto)
                y_cursor -= 18
                
                # Domicilio
                calle = str(datos_generales.get('calle_numero', '')).strip()
                col = str(datos_generales.get('colonia', '')).strip()
                cd = str(datos_generales.get('ciudad', '')).strip()
                cp = str(datos_generales.get('codigo_postal', '')).strip()
                partes_domicilio = [p for p in [calle, col, cd, f"C.P. {cp}" if cp and cp != "None" else ""] if p and p != "None"]
                domicilio = ", ".join(partes_domicilio)
                
                dibujar_texto_alineado(can, "Domicilio:", x_inicio, y_cursor, "Helvetica-Bold", 10, color_texto)
                dibujar_texto_alineado(can, f"{domicilio[:90]}", x_inicio + 60, y_cursor, "Helvetica", 10, color_texto)
                y_cursor -= 18
                
                # RFC
                dibujar_texto_alineado(can, "RFC:", x_inicio, y_cursor, "Helvetica-Bold", 10, color_texto)
                dibujar_texto_alineado(can, str(datos_generales['rfc_receptor']), x_inicio + 35, y_cursor, "Helvetica", 10, color_texto)
                
                # Fecha (Lado derecho)
                x_fecha = coords.get("fecha", (450, 680))[0]
                y_fecha = coords.get("fecha", (450, 680))[1]
                dibujar_texto_alineado(can, "FECHA:", x_fecha, y_fecha, "Helvetica", 10, color_texto)
                dibujar_texto_alineado(can, fecha_operacion, x_fecha + 50, y_fecha, "Helvetica", 10, color_texto)
                
                y_fin_cliente = y_cursor - 40

            elif nombre_tema == "LIMGRATSA":
                color_cafe = colors.HexColor("#8c5c38")
                x_inicio = coords.get("x_tabla_inicio", 60)
                
                # Si sientes que el texto toca mucho la línea, súbele un par de puntos a esta Y desde plantillas_config
                y_base = coords["cliente"][1]
                
                # Esta es la distancia exacta entre las líneas doradas de tu PDF (ajustable)
                espacio = 15 
                
                # Fecha (Línea 1)
                dibujar_texto_alineado(can, "Fecha:", x_inicio, y_base, "Helvetica", 10, color_cafe)
                dibujar_texto_alineado(can, fecha_operacion, x_inicio + 50, y_base, "Helvetica", 10, color_cafe)
                
                # Cliente (Línea 2)
                dibujar_texto_alineado(can, "Cliente:", x_inicio, y_base - espacio, "Helvetica", 10, color_cafe)
                dibujar_texto_alineado(can, str(datos_generales['razon_social'])[:50], x_inicio + 50, y_base - espacio, "Helvetica", 10, color_cafe)
                
                # RFC (Línea 3)
                dibujar_texto_alineado(can, "RFC:", x_inicio, y_base - (espacio * 2), "Helvetica", 10, color_cafe)
                dibujar_texto_alineado(can, str(datos_generales['rfc_receptor']), x_inicio + 40, y_base - (espacio * 2), "Helvetica", 10, color_cafe)
                
                # Dirección (Línea 4)
                calle = str(datos_generales.get('calle_numero', '')).strip()
                col = str(datos_generales.get('colonia', '')).strip()
                cd = str(datos_generales.get('ciudad', '')).strip()
                cp = str(datos_generales.get('codigo_postal', '')).strip()
                partes_domicilio = [p for p in [calle, col, cd, f"C.P. {cp}" if cp and cp != "None" else ""] if p and p != "None"]
                domicilio = ", ".join(partes_domicilio)
                
                dibujar_texto_alineado(can, "Dirección:", x_inicio, y_base - (espacio * 3), "Helvetica", 10, color_cafe)
                dibujar_texto_alineado(can, f"{domicilio[:90]}", x_inicio + 60, y_base - (espacio * 3), "Helvetica", 10, color_cafe)
                
                # Textos blancos sobre la caja café (Folio)
                x_folio = coords.get("folio", (380, 715))[0]
                y_folio = coords.get("folio", (380, 715))[1]
                dibujar_texto_alineado(can, "COTIZACIÓN", x_folio, y_folio, "Helvetica-Bold", 10, colors.white)
                dibujar_texto_alineado(can, f"FOLIO: {folio_generado}", x_folio, y_folio - 12, "Helvetica-Bold", 10, colors.white)
                
                # Dejamos margen antes de empezar la tabla
                y_fin_cliente = y_base - (espacio * 3) - 30

            elif nombre_tema == "LITERSA":
                color_texto = colors.HexColor("#666666")
                x_inicio = coords.get("x_tabla_inicio", 50)
                y_cursor = coords["cliente"][1]
                
                # Cliente (Etiquetas en cursiva - Oblique)
                dibujar_texto_alineado(can, "Nombre:", x_inicio, y_cursor, "Helvetica-Oblique", 10, color_texto)
                dibujar_texto_alineado(can, str(datos_generales['razon_social'])[:50], x_inicio + 50, y_cursor, "Helvetica", 10, color_texto)
                y_cursor -= 15
                
                # Domicilio
                calle = str(datos_generales.get('calle_numero', '')).strip()
                col = str(datos_generales.get('colonia', '')).strip()
                cd = str(datos_generales.get('ciudad', '')).strip()
                cp = str(datos_generales.get('codigo_postal', '')).strip()
                partes_domicilio = [p for p in [calle, col, cd, f"C.P. {cp}" if cp and cp != "None" else ""] if p and p != "None"]
                domicilio = ", ".join(partes_domicilio)
                
                dibujar_texto_alineado(can, "Domicilio:", x_inicio, y_cursor, "Helvetica-Oblique", 10, color_texto)
                dibujar_texto_alineado(can, f"{domicilio[:90]}", x_inicio + 55, y_cursor, "Helvetica", 10, color_texto)
                y_cursor -= 15
                
                # RFC
                dibujar_texto_alineado(can, "RFC:", x_inicio, y_cursor, "Helvetica-Oblique", 10, color_texto)
                dibujar_texto_alineado(can, str(datos_generales['rfc_receptor']), x_inicio + 35, y_cursor, "Helvetica", 10, color_texto)
                
                # Cotización y Fecha (Alineados perfectamente a la derecha)
                y_folio = coords.get("folio", (380, 660))[1]
                borde_derecho_texto = 550 # Límite derecho de la tabla
                
                dibujar_texto_alineado(can, f"COTIZACIÓN F: {folio_generado}", borde_derecho_texto, y_folio, "Helvetica", 10, color_texto, "right")
                dibujar_texto_alineado(can, f"FECHA: {fecha_operacion}", borde_derecho_texto, y_folio - 15, "Helvetica", 10, color_texto, "right")
                
                y_fin_cliente = y_cursor - 30

            elif nombre_tema == "LOTSA":
                color_azul = colors.HexColor("#231f82")
                color_texto = color_azul # TODO el texto va en azul
                
                x_inicio = coords.get("x_tabla_inicio", 60)
                y_base = coords["cliente"][1]
                
                # --- Columna Izquierda ---
                # Título CLIENTE
                dibujar_texto_alineado(can, "CLIENTE", x_inicio, y_base, "Helvetica-Bold", 10, color_azul)
                
                # Datos del cliente apilados hacia abajo
                y_cursor = y_base - 15
                dibujar_texto_alineado(can, str(datos_generales['razon_social'])[:50], x_inicio, y_cursor, "Helvetica", 9, color_texto)
                
                y_cursor -= 14
                calle = str(datos_generales.get('calle_numero', '')).strip()
                col = str(datos_generales.get('colonia', '')).strip()
                cd = str(datos_generales.get('ciudad', '')).strip()
                cp = str(datos_generales.get('codigo_postal', '')).strip()
                partes_domicilio = [p for p in [calle, col, cd, f"C.P. {cp}" if cp and cp != "None" else ""] if p and p != "None"]
                
                # Salto de línea inteligente para el domicilio para no chocar con el texto derecho
                if len(partes_domicilio) > 2:
                    domicilio_l1 = ", ".join(partes_domicilio[:2])
                    domicilio_l2 = ", ".join(partes_domicilio[2:])
                else:
                    domicilio_l1 = ", ".join(partes_domicilio)
                    domicilio_l2 = ""
                
                dibujar_texto_alineado(can, f"Dirección: {domicilio_l1}", x_inicio, y_cursor, "Helvetica", 9, color_texto)
                
                if domicilio_l2:
                    y_cursor -= 11
                    # x_inicio + 45 lo indenta justo para que empiece debajo del texto de la dirección
                    dibujar_texto_alineado(can, domicilio_l2, x_inicio + 45, y_cursor, "Helvetica", 9, color_texto)
                
                y_cursor -= 14
                dibujar_texto_alineado(can, f"RFC: {str(datos_generales['rfc_receptor'])}", x_inicio, y_cursor, "Helvetica", 9, color_texto)
                
                y_cursor -= 14
                dibujar_texto_alineado(can, f"Folio: {folio_generado}", x_inicio, y_cursor, "Helvetica", 9, color_texto)
                
                # --- Columna Derecha ---
                # Fecha alineada con el texto de la derecha (x=330 aprox)
                x_fecha = coords.get("fecha", (330, 660))[0]
                dibujar_texto_alineado(can, "FECHA:", x_fecha, y_base, "Helvetica-Bold", 10, color_azul)
                dibujar_texto_alineado(can, fecha_operacion, x_fecha + 45, y_base, "Helvetica", 10, color_texto)
                
                y_fin_cliente = y_cursor - 30

            elif nombre_tema == "PLAFOREY":
                color_texto = colors.HexColor("#333333")
                x_inicio = coords.get("x_tabla_inicio", 60)
                y_cursor = coords["cliente"][1]
                
                # Cliente
                dibujar_texto_alineado(can, "Cliente:", x_inicio, y_cursor, "Helvetica-Bold", 10, color_texto)
                dibujar_texto_alineado(can, str(datos_generales['razon_social'])[:50], x_inicio + 50, y_cursor, "Helvetica", 10, color_texto)
                y_cursor -= 15
                
                # Fecha
                dibujar_texto_alineado(can, "Fecha:", x_inicio, y_cursor, "Helvetica-Bold", 10, color_texto)
                dibujar_texto_alineado(can, fecha_operacion, x_inicio + 45, y_cursor, "Helvetica", 10, color_texto)
                y_cursor -= 15
                
                # Domicilio
                calle = str(datos_generales.get('calle_numero', '')).strip()
                col = str(datos_generales.get('colonia', '')).strip()
                cd = str(datos_generales.get('ciudad', '')).strip()
                cp = str(datos_generales.get('codigo_postal', '')).strip()
                partes_domicilio = [p for p in [calle, col, cd, f"C.P. {cp}" if cp and cp != "None" else ""] if p and p != "None"]
                domicilio = ", ".join(partes_domicilio)
                
                dibujar_texto_alineado(can, "Domicilio:", x_inicio, y_cursor, "Helvetica-Bold", 10, color_texto)
                dibujar_texto_alineado(can, f"{domicilio[:80]}", x_inicio + 60, y_cursor, "Helvetica", 10, color_texto)
                
                # Folio (se inyecta a la derecha, junto a la etiqueta preimpresa en el logo)
                x_folio = coords.get("folio", (490, 715))[0]
                y_folio = coords.get("folio", (490, 715))[1]
                dibujar_texto_alineado(can, f"{folio_generado}", x_folio, y_folio, "Helvetica", 10, color_texto)
                
                y_fin_cliente = y_cursor - 30

            elif nombre_tema == "RAWAN":
                color_azul = colors.HexColor("#0d47a1")
                color_texto = colors.HexColor("#333333")
                
                x_inicio = coords.get("x_tabla_inicio", 50)
                y_base = coords["cliente"][1]
                
                # --- Fecha (Cajas dibujadas) ---
                x_fecha = coords.get("fecha", (50, 630))[0]
                alto_caja = 20
                ancho_caja_fecha = 70
                ancho_caja_valor = 90
                
                can.setStrokeColor(color_azul)
                can.setLineWidth(1)
                
                # Caja de etiqueta "Fecha:"
                can.rect(x_fecha, y_base, ancho_caja_fecha, alto_caja, fill=0, stroke=1)
                dibujar_texto_alineado(can, "Fecha:", x_fecha + (ancho_caja_fecha/2), y_base + 6, "Helvetica-Bold", 11, color_azul, "center")
                
                # Caja del valor de la fecha
                can.rect(x_fecha + ancho_caja_fecha, y_base, ancho_caja_valor, alto_caja, fill=0, stroke=1)
                dibujar_texto_alineado(can, fecha_operacion, x_fecha + ancho_caja_fecha + (ancho_caja_valor/2), y_base + 6, "Helvetica-Bold", 10, color_azul, "center")
                
                # --- Cliente (A la derecha) ---
                x_cliente = coords.get("cliente", (320, 630))[0]
                
                dibujar_texto_alineado(can, "CLIENTE :", x_cliente, y_base + 6, "Helvetica-Bold", 14, color_azul)
                
                y_cursor = y_base - 14
                dibujar_texto_alineado(can, str(datos_generales['razon_social'])[:45], x_cliente, y_cursor, "Helvetica-Bold", 10, color_azul)
                
                y_cursor -= 12
                calle = str(datos_generales.get('calle_numero', '')).strip()
                col = str(datos_generales.get('colonia', '')).strip()
                cd = str(datos_generales.get('ciudad', '')).strip()
                partes_domicilio = [p for p in [calle, col, cd] if p and p != "None"]
                domicilio = ", ".join(partes_domicilio)
                dibujar_texto_alineado(can, f"{domicilio[:50]}", x_cliente, y_cursor, "Helvetica", 9, color_texto)
                
                y_cursor -= 12
                dibujar_texto_alineado(can, f"RFC: {str(datos_generales['rfc_receptor'])}", x_cliente, y_cursor, "Helvetica", 9, color_texto)
                
                # Folio (inyectado debajo de la palabra Cotización)
                x_folio = coords.get("folio", (400, 690))[0]
                y_folio = coords.get("folio", (400, 690))[1]
                dibujar_texto_alineado(can, f"{folio_generado}", x_folio, y_folio, "Helvetica", 10, color_azul)
                
                y_fin_cliente = y_cursor - 25

            elif nombre_tema == "TABEL":
                color_texto = colors.HexColor("#000000") # Negro
                
                x_izq = coords.get("x_tabla_inicio", 60)
                y_base = coords["cliente"][1] # y = 620
                x_der = 350
                
                # --- Columna Derecha (FECHA, FOLIO, CLIENTE) ---
                y_der = y_base + 30 
                dibujar_texto_alineado(can, "FECHA:", x_der, y_der, "Helvetica-Bold", 10, color_texto)
                dibujar_texto_alineado(can, fecha_operacion, x_der + 50, y_der, "Helvetica", 10, color_texto)
                
                y_der -= 12
                dibujar_texto_alineado(can, "FOLIO:", x_der, y_der, "Helvetica-Bold", 10, color_texto)
                dibujar_texto_alineado(can, folio_generado, x_der + 50, y_der, "Helvetica", 10, color_texto)
                
                y_der -= 12
                dibujar_texto_alineado(can, "CLIENTE:", x_der, y_der, "Helvetica-Bold", 10, color_texto)
                dibujar_texto_alineado(can, str(datos_generales['razon_social'])[:35], x_der + 60, y_der, "Helvetica", 10, color_texto)
                
                # --- Columna Izquierda (DOMICILIO, RFC) ---
                # Empezamos más arriba (a la misma altura que FECHA)
                y_izq = y_base + 30 
                
                calle = str(datos_generales.get('calle_numero', '')).strip()
                col = str(datos_generales.get('colonia', '')).strip()
                cd = str(datos_generales.get('ciudad', '')).strip()
                cp = str(datos_generales.get('codigo_postal', '')).strip()
                
                # Partimos el domicilio en dos líneas
                linea1 = ", ".join([p for p in [calle, col] if p and p != "None"])
                linea2 = ", ".join([p for p in [cd, f"C.P. {cp}" if cp and cp != "None" else ""] if p and p != "None"])
                
                dibujar_texto_alineado(can, "DOMICILIO:", x_izq, y_izq, "Helvetica-Bold", 10, color_texto)
                dibujar_texto_alineado(can, f"{linea1[:50]}", x_izq + 70, y_izq, "Helvetica", 9, color_texto)
                
                y_izq -= 12 # Bajamos al renglón del medio (alineado con FOLIO)
                dibujar_texto_alineado(can, f"{linea2[:50]}", x_izq + 70, y_izq, "Helvetica", 9, color_texto)
                
                y_izq -= 12 # Bajamos al renglón de abajo (alineado con CLIENTE, seguro sobre la línea azul)
                dibujar_texto_alineado(can, "RFC:", x_izq, y_izq, "Helvetica-Bold", 10, color_texto)
                dibujar_texto_alineado(can, f"{str(datos_generales['rfc_receptor'])}", x_izq + 35, y_izq, "Helvetica", 10, color_texto)
                
                y_fin_cliente = y_base - 10

            elif nombre_tema == "TERIGEN":
                color_texto = colors.HexColor("#333333")
                
                x_izq = coords.get("x_tabla_inicio", 60)
                y_base = coords["cliente"][1]
                
                # --- Columna Derecha (FOLIO) ---
                x_der = coords.get("folio", (400, 680))[0]
                y_der = coords.get("folio", (400, 680))[1]
                dibujar_texto_alineado(can, f"Folio: {folio_generado}", x_der, y_der, "Helvetica", 10, color_texto)
                
                # --- Columna Izquierda (Cliente, Fecha, RFC) ---
                y_izq = y_base
                
                dibujar_texto_alineado(can, "Cliente:", x_izq, y_izq, "Helvetica", 10, color_texto)
                dibujar_texto_alineado(can, str(datos_generales['razon_social'])[:50], x_izq + 45, y_izq, "Helvetica", 10, color_texto)
                
                y_izq -= 15
                dibujar_texto_alineado(can, "Fecha:", x_izq, y_izq, "Helvetica", 10, color_texto)
                dibujar_texto_alineado(can, fecha_operacion, x_izq + 40, y_izq, "Helvetica", 10, color_texto)
                
                y_izq -= 15
                dibujar_texto_alineado(can, "RFC:", x_izq, y_izq, "Helvetica", 10, color_texto)
                dibujar_texto_alineado(can, str(datos_generales['rfc_receptor']), x_izq + 30, y_izq, "Helvetica", 10, color_texto)
                
                y_fin_cliente = y_izq - 30

            elif nombre_tema == "TORRES":
                color_teal = colors.HexColor("#0a4b52") # Verde azulado oscuro para los títulos
                color_texto = colors.HexColor("#333333")
                
                x_izq = coords.get("x_tabla_inicio", 160)
                y_base = coords["cliente"][1]
                
                # --- Columna Derecha (FOLIO) ---
                x_der = coords.get("folio", (450, 630))[0]
                y_der = coords.get("folio", (450, 630))[1]
                dibujar_texto_alineado(can, "FOLIO:", x_der, y_der, "Helvetica-Bold", 12, color_texto)
                dibujar_texto_alineado(can, folio_generado, x_der + 45, y_der, "Helvetica", 12, color_texto)
                
                # --- Columna Izquierda (Cliente, Fecha, Direccion) ---
                y_izq = y_base
                
                dibujar_texto_alineado(can, "NOMBRE:", x_izq, y_izq, "Helvetica-Bold", 10, color_teal)
                dibujar_texto_alineado(can, str(datos_generales['razon_social'])[:45], x_izq + 60, y_izq, "Helvetica-Bold", 10, color_texto)
                
                y_izq -= 15
                dibujar_texto_alineado(can, "FECHA:", x_izq, y_izq, "Helvetica-Bold", 10, color_teal)
                dibujar_texto_alineado(can, fecha_operacion, x_izq + 50, y_izq, "Helvetica-Bold", 10, color_texto)
                
                y_izq -= 15
                calle = str(datos_generales.get('calle_numero', '')).strip()
                col = str(datos_generales.get('colonia', '')).strip()
                cd = str(datos_generales.get('ciudad', '')).strip()
                partes_domicilio = [p for p in [calle, col, cd] if p and p != "None"]
                domicilio = ", ".join(partes_domicilio)
                
                dibujar_texto_alineado(can, "DIRECCION:", x_izq, y_izq, "Helvetica-Bold", 10, color_teal)
                dibujar_texto_alineado(can, f"{domicilio[:40]}", x_izq + 75, y_izq, "Helvetica-Bold", 10, color_texto)
                
                y_fin_cliente = y_izq - 30

            elif nombre_tema == "VIMEX":
                color_texto = colors.HexColor("#000000")
                
                x_izq = coords.get("x_tabla_inicio", 60)
                y_base = coords["cliente"][1]
                
                # --- Columna Derecha (FOLIO y FECHA) ---
                x_der = coords.get("folio", (420, 630))[0]
                y_der = coords.get("folio", (420, 630))[1]
                
                dibujar_texto_alineado(can, "FOLIO:", x_der, y_der, "Helvetica-Bold", 10, color_texto)
                dibujar_texto_alineado(can, folio_generado, x_der + 40, y_der, "Helvetica", 10, color_texto)
                
                y_der -= 15
                dibujar_texto_alineado(can, "Fecha:", x_der, y_der, "Helvetica-Bold", 10, color_texto)
                dibujar_texto_alineado(can, fecha_operacion, x_der + 40, y_der, "Helvetica", 10, color_texto)
                
                # --- Columna Izquierda (Cliente) ---
                y_izq = y_base
                
                dibujar_texto_alineado(can, "CLIENTE", x_izq, y_izq, "Helvetica-Bold", 10, color_texto)
                
                y_izq -= 18
                dibujar_texto_alineado(can, "Nombre:", x_izq, y_izq, "Helvetica", 10, color_texto)
                dibujar_texto_alineado(can, str(datos_generales['razon_social'])[:45], x_izq + 45, y_izq, "Helvetica", 10, color_texto)
                
                y_izq -= 15
                dibujar_texto_alineado(can, "RFC:", x_izq, y_izq, "Helvetica", 10, color_texto)
                dibujar_texto_alineado(can, str(datos_generales['rfc_receptor']), x_izq + 30, y_izq, "Helvetica", 10, color_texto)
                
                y_izq -= 15
                calle = str(datos_generales.get('calle_numero', '')).strip()
                col = str(datos_generales.get('colonia', '')).strip()
                cd = str(datos_generales.get('ciudad', '')).strip()
                partes_domicilio = [p for p in [calle, col, cd] if p and p != "None"]
                domicilio = ", ".join(partes_domicilio)
                
                dibujar_texto_alineado(can, "Dirección:", x_izq, y_izq, "Helvetica", 10, color_texto)
                dibujar_texto_alineado(can, f"{domicilio[:40]}", x_izq + 55, y_izq, "Helvetica", 10, color_texto)
                
                y_fin_cliente = y_izq - 30


            # --- CONSTRUCCIÓN DE TABLA ---
            estilos = getSampleStyleSheet()
            estilo_celda = estilos["Normal"].clone("EstiloCelda2")
            estilo_celda.fontSize = 8
            estilo_celda.textColor = colors.black

            # Estilo del encabezado según tema
            estilo_header = estilos["Normal"].clone("EstiloHeader2")
            estilo_header.fontSize = 9
            estilo_header.alignment = 1
            
            # Forzamos que siempre use el color definido en temas_config.py
            color_texto = tema.get("color_texto_header", "#000000")
            estilo_header.textColor = colors.HexColor(color_texto)


            # Leemos los textos desde la configuración del tema (temas_config.py)
            # Si el tema no tiene esa etiqueta, usamos el valor por defecto
            texto_col1 = tema.get("etiqueta_col1", "CONCEPTO")
            texto_col2 = tema.get("etiqueta_col2", "CANTIDAD")
            texto_col3 = tema.get("etiqueta_col3", "VALOR UNITARIO")
            texto_col4 = tema.get("etiqueta_col4", "TOTAL")
            
            # Construimos los encabezados dinámicamente
            headers = [
                Paragraph(f"<b>{texto_col1}</b>", estilo_header),
                Paragraph(f"<b>{texto_col2}</b>", estilo_header),
                Paragraph(f"<b>{texto_col3}</b>", estilo_header),
                Paragraph(f"<b>{texto_col4}</b>", estilo_header)
            ]




            datos_tabla = [headers]

            subtotal = 0

            for p in partidas:
                # Extraemos y limpiamos la descripción (Concepto)
                desc = str(p['descripcion'])
                
                # Valores numéricos limpios
                v_unitario = float(p['valor_unitario']) if p['valor_unitario'] else 0.0
                importe = float(p['importe']) if p['importe'] else 0.0

                # Creamos la fila (Invertida si es BERGUN)
                # Creamos la fila
                if nombre_tema == "BERGUN":
                    fila = [
                        str(p['cantidad']),
                        Paragraph(desc, estilo_celda),
                        f"${v_unitario:,.2f}",
                        f"${importe:,.2f}"
                    ]
                elif nombre_tema == "CALAFELL":
                    # Orden CALAFELL: Descripción, PRECIO, Cantidad, Total
                    fila = [
                        Paragraph(desc, estilo_celda),
                        f"${v_unitario:,.2f}",
                        str(p['cantidad']),
                        f"${importe:,.2f}"
                    ]
                else:
                    fila = [
                        Paragraph(desc, estilo_celda),
                        str(p['cantidad']),
                        f"${v_unitario:,.2f}",
                        f"${importe:,.2f}"
                    ]
                    
                datos_tabla.append(fila)
                subtotal += importe

            anchos_columnas = tema.get("anchos_columnas", [220, 80, 100, 100])
            if tema.get("ocultar_columnas_centrales", False):
                for fila in datos_tabla:
                    fila[1] = ""
                    fila[2] = ""
          


            tabla = Table(datos_tabla, colWidths=anchos_columnas, repeatRows=1)

            # Estilo de tabla según tema
            if tema["estilo_tabla"] == "lineas_simples":
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 8),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    ('ALIGN', (6,0), (8,-1), 'RIGHT'),
                    ('ALIGN', (0,0), (4,-1), 'CENTER'),
                    ('ALIGN', (0,0), (-1,0), 'CENTER'),
                    # Separadores horizontales, cero líneas verticales
                    ('LINEABOVE', (0,0), (-1,0), 1, colors.black),  # Arriba de cabecera
                    ('LINEBELOW', (0,0), (-1,0), 1, colors.black),  # Abajo de cabecera
                    ('LINEBELOW', (0,1), (-1,-1), 0.5, colors.HexColor("#E0E0E0")), # Filas iteradas
                    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
                    ('TOPPADDING', (0,0), (-1,-1), 6),
                ])
            elif tema["estilo_tabla"] == "avidux_style":
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 9),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'), # Toda la tabla centrada
                    ('BACKGROUND', (0,0), (-1,0), colors.HexColor(tema["color_header_tabla"])), # Encabezado rosa
                    ('TEXTCOLOR', (0,0), (-1,0), colors.black),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
                    ('TOPPADDING', (0,0), (-1,-1), 8),
                    # Las celdas de datos no llevan BACKGROUND para ser transparentes
                    # Cuadrícula rosa tenue
                    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#F4DCDC")),
                ])
            
            elif tema["estilo_tabla"] == "373_style":
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 9),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                    ('BACKGROUND', (0,0), (-1,0), colors.HexColor(tema["color_header_tabla"])), # Azul grisáceo
                    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
                    ('TOPPADDING', (0,0), (-1,-1), 8),
                    # Magia: Filas de colores alternados (Blanco y Gris Claro) sin bordes
                    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#E2E8F0")]),
                    ('TEXTCOLOR', (0,1), (-1,-1), colors.HexColor("#2D3748")),
                ])

            elif tema["estilo_tabla"] == "mellafe_style":
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 9),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                    ('BACKGROUND', (0,0), (-1,0), colors.HexColor(tema["color_header_tabla"])), # Azul Mellafe
                    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
                    ('TOPPADDING', (0,0), (-1,-1), 8),
                    # Líneas horizontales grises (estilo renglón)
                    ('LINEBELOW', (0,0), (-1,-1), 1, colors.HexColor("#A0A0A0")), 
                ])

            elif tema["estilo_tabla"] == "sisuc_style":
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 9),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    ('ALIGN', (0,0), (-1,-1), 'LEFT'),   # Alineado a la izquierda como el mockup
                    ('BACKGROUND', (0,0), (-1,0), colors.HexColor(tema["color_header_tabla"])), # Azul
                    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
                    ('TOPPADDING', (0,0), (-1,-1), 6),
                    # Cuadrícula completamente negra
                    ('GRID', (0,0), (-1,-1), 1, colors.black),
                ])

            elif tema["estilo_tabla"] == "agramon_style":
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 9),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                    ('ALIGN', (0,0), (0,-1), 'LEFT'),   # Primera columna a la izquierda
                    ('BACKGROUND', (0,0), (-1,0), colors.HexColor(tema["color_header_tabla"])), # Gris oscuro
                    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
                    ('TOPPADDING', (0,0), (-1,-1), 8),
                    # Filas alternadas grises sin bordes
                    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#EAEAEA")]),
                    ('TEXTCOLOR', (0,1), (-1,-1), colors.HexColor("#333333")),
                ])

            elif tema["estilo_tabla"] == "amelit_style":
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 10),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                    ('ALIGN', (0,0), (0,-1), 'LEFT'),   # Primera columna a la izquierda
                    ('TEXTCOLOR', (0,0), (-1,0), colors.black),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
                    ('TOPPADDING', (0,0), (-1,-1), 8),
                    ('LINEBELOW', (0,0), (-1,0), 2, colors.black),
                    
                    # Línea negra al final de los datos de la tabla
                    ('LINEBELOW', (0,-1), (-1,-1), 2, colors.black),
                ])

            elif tema["estilo_tabla"] == "bergun_style":
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 10),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    ('ALIGN', (0,0), (-1,-1), 'LEFT'),
                    ('BACKGROUND', (0,0), (-1,0), colors.HexColor(tema["color_header_tabla"])), # Rosa fuerte
                    ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor(tema["color_texto_header"])),  # Magenta
                    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
                    ('TOPPADDING', (0,0), (-1,-1), 6),
                    # Fondo rosa clarito para todos los datos
                    ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#FDECF0")),
                    ('TEXTCOLOR', (0,1), (-1,-1), colors.black),
                    # Cuadrícula blanca para separar las celdas
                    ('GRID', (0,0), (-1,-1), 1.5, colors.white),
                ])

            elif tema["estilo_tabla"] == "berzan_style":
                color_borde = colors.HexColor("#D1C7B7") # Color Beige/Arena
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 10),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                    # Encabezados
                    ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor(tema["color_texto_header"])),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
                    ('TOPPADDING', (0,0), (-1,-1), 8),
                    # Textos de los datos
                    ('TEXTCOLOR', (0,1), (-1,-1), colors.black),
                    # Cuadrícula beige, fondo totalmente transparente (SIN BACKGROUND)
                    ('GRID', (0,0), (-1,-1), 1, color_borde),
                ])
            
            elif tema["estilo_tabla"] == "calafell_style":
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 10),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                    ('ALIGN', (0,0), (0,-1), 'LEFT'), # Descripción a la izquierda
                    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
                    ('TOPPADDING', (0,0), (-1,-1), 8),
                    ('TEXTCOLOR', (0,0), (-1,-1), colors.black),
                    
                    # Líneas gruesas (2pt) arriba y abajo de los encabezados (fila 0)
                    ('LINEABOVE', (0,0), (-1,0), 2, colors.black),
                    ('LINEBELOW', (0,0), (-1,0), 2, colors.black),
                    
                    # Líneas horizontales delgadas (0.5pt) para separar las filas de datos
                    ('LINEBELOW', (0,1), (-1,-1), 0.5, colors.black),
                    
                    # Línea gruesa (2pt) al final de la tabla
                    ('LINEBELOW', (0,-1), (-1,-1), 2, colors.black),
                ])

            elif tema["estilo_tabla"] == "crisac_style":
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 9),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                    ('ALIGN', (0,0), (0,-1), 'LEFT'), # Descripción a la izquierda
                    ('BOTTOMPADDING', (0,0), (-1,-1), 10),
                    ('TOPPADDING', (0,0), (-1,-1), 10),
                    ('TEXTCOLOR', (0,0), (-1,-1), colors.black),
                    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'), # Encabezados en negrita
                    # Esta tabla es 100% transparente, no lleva ninguna línea separadora
                ])

            elif tema["estilo_tabla"] == "cuenca_style":
                color_azul = colors.HexColor("#1b1958")
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 9),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'), # Todo centrado
                    ('BOTTOMPADDING', (0,0), (-1,-1), 10),
                    ('TOPPADDING', (0,0), (-1,-1), 10),
                    ('TEXTCOLOR', (0,0), (-1,-1), color_azul), # Texto azul
                    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'), # Encabezados negrita
                ])
            
            elif tema["estilo_tabla"] == "dersa_style":
                color_azul = colors.HexColor("#1b1464")
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 9),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'), 
                    ('BOTTOMPADDING', (0,0), (-1,-1), 10),
                    ('TOPPADDING', (0,0), (-1,-1), 10),
                    ('TEXTCOLOR', (0,0), (-1,-1), color_azul), 
                    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'), # Encabezados negrita
                    # Tabla sin líneas, todo transparente
                ])

            elif tema["estilo_tabla"] == "expresatel_style":
                color_morado = colors.HexColor("#761dc9")
                color_fondo_alt = colors.HexColor("#ebdcf7") # Lila clarito
                color_texto = colors.HexColor("#7a7a7a")
                
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 10),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'), 
                    ('ALIGN', (0,0), (0,-1), 'LEFT'), # Descripción a la izq
                    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
                    ('TOPPADDING', (0,0), (-1,-1), 8),
                    # Encabezados
                    ('BACKGROUND', (0,0), (-1,0), color_morado),
                    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
                    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                    # Cuerpo de la tabla (Color de texto Gris)
                    ('TEXTCOLOR', (0,1), (-1,-1), color_texto),
                    # Filas alternas mágicas (Cebra)
                    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, color_fondo_alt]),
                    # Sin bordes
                ])

            elif tema["estilo_tabla"] == "facsam_style":
                color_rosa = colors.HexColor("#c17d7d")
                color_lineas = colors.HexColor("#e8dcc8") # Beige claro
                color_texto = colors.HexColor("#6b4c4c")
                
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 9),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'), 
                    ('ALIGN', (0,0), (0,-1), 'LEFT'), # Descripción a la izq
                    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
                    ('TOPPADDING', (0,0), (-1,-1), 6),
                    # Encabezados
                    ('BACKGROUND', (0,0), (-1,0), color_rosa),
                    ('TEXTCOLOR', (0,0), (-1,0), color_texto),
                    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                    # Cuerpo de la tabla
                    ('TEXTCOLOR', (0,1), (-1,-1), color_texto),
                    # Cuadrícula beige para toda la tabla
                    ('GRID', (0,0), (-1,-1), 1, color_lineas),
                ])

            elif tema["estilo_tabla"] == "ficsar_style":
                color_fondo_alt = colors.HexColor("#f0f0f0") # Gris muy claro
                
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 10),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'), 
                    ('ALIGN', (0,0), (0,-1), 'LEFT'), # Descripción a la izq
                    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
                    ('TOPPADDING', (0,0), (-1,-1), 8),
                    # Encabezados
                    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                    ('LINEABOVE', (0,0), (-1,0), 1.5, colors.black),
                    ('LINEBELOW', (0,0), (-1,0), 1.5, colors.black),
                    # Cuerpo de la tabla (filas alternas Cebra que empieza en gris)
                    ('ROWBACKGROUNDS', (0,1), (-1,-1), [color_fondo_alt, colors.white]),
                    # Línea negra gruesa al final de toda la tabla
                    ('LINEBELOW', (0,-1), (-1,-1), 1.5, colors.black),
                ])

            elif tema["estilo_tabla"] == "asesores_gbr_style":
                color_azul = colors.HexColor("#2f3a4b")
                color_lineas = colors.HexColor("#b0c4c3") # Verde/gris clarito para separadores
                color_texto = colors.HexColor("#444444")
                
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 9),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'), 
                    ('ALIGN', (0,0), (0,-1), 'LEFT'), # Descripción a la izq
                    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
                    ('TOPPADDING', (0,0), (-1,-1), 8),
                    # Encabezados
                    ('BACKGROUND', (0,0), (-1,0), color_azul),
                    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
                    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                    # Cuerpo
                    ('TEXTCOLOR', (0,1), (-1,-1), color_texto),
                    # Líneas horizontales internas tenues
                    ('LINEBELOW', (0,0), (-1,-1), 0.5, color_lineas),
                ])

            elif tema["estilo_tabla"] == "globalearth_style":
                color_lineas = colors.HexColor("#e1dbcf") # Beige/Gris clarito
                color_texto = colors.HexColor("#555555")
                
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 10),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'), 
                    # Encabezados
                    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                    ('TEXTCOLOR', (0,0), (-1,0), color_texto),
                    # Cuerpo
                    ('TEXTCOLOR', (0,1), (-1,-1), color_texto),
                    # Cuadrícula completa color beige
                    ('GRID', (0,0), (-1,-1), 1, color_lineas),
                ])

            elif tema["estilo_tabla"] == "govida_style":
                color_azul = colors.HexColor("#75cbe6")
                
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 9),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    # Textos a la izquierda
                    ('ALIGN', (0,0), (-1,-1), 'LEFT'), 
                    # Excepto los encabezados que van centrados
                    ('ALIGN', (0,0), (-1,0), 'CENTER'), 
                    # Encabezados (Fondo Celeste, Letra Blanca)
                    ('BACKGROUND', (0,0), (-1,0), color_azul),
                    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
                    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                    # Cuadrícula completa negra de 1 punto de grosor
                    ('GRID', (0,0), (-1,-1), 1, colors.black),
                ])

            elif tema["estilo_tabla"] == "kale_style":
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 10),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'), 
                    ('ALIGN', (0,0), (0,-1), 'LEFT'), # Descripción a la izq
                    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
                    ('TOPPADDING', (0,0), (-1,-1), 8),
                    # Encabezados
                    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                    ('TEXTCOLOR', (0,0), (-1,-1), colors.black),
                    # Líneas horizontales negras gruesas (2 puntos)
                    ('LINEABOVE', (0,0), (-1,0), 2, colors.black),
                    ('LINEBELOW', (0,0), (-1,0), 2, colors.black),
                    # Línea delgada para separar productos
                    ('LINEBELOW', (0,1), (-1,-2), 0.5, colors.black),
                    # Línea gruesa final de la tabla
                    ('LINEBELOW', (0,-1), (-1,-1), 2, colors.black),
                ])

            elif tema["estilo_tabla"] == "levictus_style":
                color_fondo = colors.HexColor("#f0f0f0") # Gris clarito
                
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 10),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    # Encabezados
                    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                    ('ALIGN', (0,0), (0,0), 'LEFT'), # DESCRIPCION a la izq
                    ('ALIGN', (3,0), (3,0), 'RIGHT'), # TOTAL a la der
                    # Datos
                    ('ALIGN', (0,1), (0,-1), 'LEFT'),
                    ('ALIGN', (3,1), (3,-1), 'RIGHT'),
                    # Quitamos el padding interno de esas columnas casi invisibles por seguridad
                    ('LEFTPADDING', (1,0), (2,-1), 0),
                    ('RIGHTPADDING', (1,0), (2,-1), 0),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
                    ('TOPPADDING', (0,0), (-1,-1), 8),
                    # Líneas negras gruesas
                    ('LINEABOVE', (0,0), (-1,0), 2, colors.black),
                    ('LINEBELOW', (0,0), (-1,0), 2, colors.black),
                    ('LINEBELOW', (0,-1), (-1,-1), 2, colors.black),
                ])
                # Alternar fondo gris/blanco (iniciando en blanco)
                for i in range(1, len(datos_tabla)):
                    if i % 2 == 0: # Filas pares (2, 4...) en gris
                        estilo_tabla.add('BACKGROUND', (0, i), (-1, i), color_fondo)

            elif tema["estilo_tabla"] == "lexic_style":
                color_header = colors.HexColor("#5e8aef")
                color_fila_azul = colors.HexColor("#dee7f9") # Azul clarito
                color_texto_gris = colors.HexColor("#555555")
                
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 10),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    # Encabezados
                    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                    ('BACKGROUND', (0,0), (-1,0), color_header),
                    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
                    ('ALIGN', (0,0), (-1,0), 'CENTER'),
                    ('ALIGN', (0,0), (0,0), 'LEFT'), # Descripción a la izq
                    
                    # Datos
                    ('ALIGN', (0,1), (0,-1), 'LEFT'),
                    ('ALIGN', (1,1), (-1,-1), 'CENTER'), # Centrado para cantidades y montos
                    ('TEXTCOLOR', (0,1), (-1,-1), color_texto_gris), # Texto gris oscuro en filas
                    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
                    ('TOPPADDING', (0,0), (-1,-1), 6),
                    # ¡SIN LÍNEAS! 
                ])
                # Alternar fondo blanco/azul claro
                for i in range(1, len(datos_tabla)):
                    if i % 2 == 0: # Filas pares
                        estilo_tabla.add('BACKGROUND', (0, i), (-1, i), color_fila_azul)
                    else:
                        estilo_tabla.add('BACKGROUND', (0, i), (-1, i), colors.white)

            elif tema["estilo_tabla"] == "limgratsa_style":
                color_beige = colors.HexColor("#eedfcb")
                color_lineas = colors.HexColor("#e3d1bb")
                color_cafe = colors.HexColor("#8c5c38")
                
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 9),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'), 
                    ('ALIGN', (0,0), (0,-1), 'LEFT'), # Descripción a la izq
                    
                    # Encabezados
                    ('BACKGROUND', (0,0), (-1,0), color_beige),
                    ('TEXTCOLOR', (0,0), (-1,-1), color_cafe), # Todo el texto café
                    ('FONTNAME', (0,0), (-1,-1), 'Helvetica'), # Letra normal (no bold)
                    
                    # Cuadrícula completa (líneas beige muy sutiles)
                    ('GRID', (0,0), (-1,-1), 0.5, color_lineas),
                ])

            elif tema["estilo_tabla"] == "litersa_style":
                color_lineas = colors.HexColor("#e0e0e0")
                color_texto = colors.HexColor("#666666")
                
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 10),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'), 
                    ('ALIGN', (0,1), (0,-1), 'LEFT'), # El concepto de los datos alineado a la izq
                    
                    # Encabezados
                    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                    ('TEXTCOLOR', (0,0), (-1,-1), color_texto), 
                    
                    # Cuadrícula completa muy sutil
                    ('GRID', (0,0), (-1,-1), 1, color_lineas),
                ])

            elif tema["estilo_tabla"] == "lotsa_style":
                color_azul = colors.HexColor("#231f82")
                color_texto = colors.HexColor("#555555")
                
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 10),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    
                    # Encabezados
                    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                    ('TEXTCOLOR', (0,0), (-1,0), color_azul),
                    ('ALIGN', (0,0), (-1,0), 'CENTER'),
                    
                    # Datos
                    ('TEXTCOLOR', (0,1), (-1,-1), color_texto),
                    ('ALIGN', (0,1), (0,-1), 'LEFT'),
                    ('ALIGN', (1,1), (-1,-1), 'CENTER'),
                    
                    # Sin líneas de cuadrícula, agregamos margen para que respiren las filas
                    ('BOTTOMPADDING', (0,0), (-1,-1), 10),
                    ('TOPPADDING', (0,0), (-1,-1), 10),
                ])

            elif tema["estilo_tabla"] == "plaforey_style":
                color_fondo = colors.HexColor("#f0f0f0") # Gris clarito
                
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 9),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    
                    # Encabezados
                    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                    ('TEXTCOLOR', (0,0), (-1,0), colors.black),
                    
                    # Alineaciones
                    ('ALIGN', (0,0), (0,-1), 'LEFT'), # Descripción a la izquierda
                    ('ALIGN', (3,0), (3,-1), 'RIGHT'), # Total a la derecha
                    
                    # Quitar padding a columnas invisibles para que no estorben
                    ('LEFTPADDING', (1,0), (2,-1), 0),
                    ('RIGHTPADDING', (1,0), (2,-1), 0),
                    
                    # Líneas negras sólidas (Arriba y abajo del encabezado)
                    ('LINEABOVE', (0,0), (-1,0), 1.5, colors.black),
                    ('LINEBELOW', (0,0), (-1,0), 1.5, colors.black),
                ])
                
                # Alternar fondo gris/blanco (iniciando en blanco)
                for i in range(1, len(datos_tabla)):
                    if i % 2 == 0: # Filas pares de datos (2, 4, 6...) en gris
                        estilo_tabla.add('BACKGROUND', (0, i), (-1, i), color_fondo)

            elif tema["estilo_tabla"] == "rawan_style":
                color_azul = colors.HexColor("#0d47a1")
                
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 9),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    
                    # Encabezados
                    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                    ('TEXTCOLOR', (0,0), (-1,0), color_azul),
                    ('ALIGN', (0,0), (-1,0), 'CENTER'),
                    
                    # Datos
                    ('ALIGN', (0,1), (0,-1), 'LEFT'),
                    ('ALIGN', (1,1), (-1,-1), 'CENTER'),
                    
                    # Grid completo en azul
                    ('GRID', (0,0), (-1,-1), 1, color_azul),
                ])

            elif tema["estilo_tabla"] == "tabel_style":
                color_azul = colors.HexColor("#04437a")
                
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 9),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    
                    # Encabezados
                    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
                    ('BACKGROUND', (0,0), (-1,0), color_azul),
                    ('ALIGN', (0,0), (-1,0), 'CENTER'),
                    
                    # Datos
                    ('ALIGN', (0,1), (0,-1), 'LEFT'),
                    ('ALIGN', (1,1), (-1,-1), 'CENTER'), 
                    
                    # Grid negro para todo
                    ('GRID', (0,0), (-1,-1), 1, colors.black),
                    
                    # Líneas internas del encabezado en blanco para resaltar
                    ('INNERGRID', (0,0), (-1,0), 1, colors.white),
                ])

            elif tema["estilo_tabla"] == "terigen_style":
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 9),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    
                    # Encabezados
                    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                    ('TEXTCOLOR', (0,0), (-1,0), colors.black),
                    
                    # Alineaciones (Izquierda y Derecha)
                    ('ALIGN', (0,0), (0,-1), 'LEFT'),
                    ('ALIGN', (3,0), (3,-1), 'RIGHT'), 
                    
                    # Línea gruesa negra debajo del encabezado
                    ('LINEBELOW', (0,0), (-1,0), 2, colors.black),
                ])
                # Añadir colores alternos a las filas de datos
                color_gris = colors.HexColor("#f2f2f2")
                for i in range(1, len(datos_tabla)):
                    if i % 2 == 0:
                        estilo_tabla.add('BACKGROUND', (0, i), (-1, i), color_gris)

            elif tema["estilo_tabla"] == "torres_style":
                color_header = colors.HexColor("#263645")
                color_linea = colors.HexColor("#7a9b9b")
                
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 9),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    
                    # Encabezados
                    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
                    ('BACKGROUND', (0,0), (-1,0), color_header),
                    
                    # Alineaciones
                    ('ALIGN', (0,0), (0,-1), 'LEFT'),
                    ('ALIGN', (1,0), (-1,-1), 'CENTER'), 
                    
                    # Líneas divisorias horizontales finas para las filas
                    ('LINEBELOW', (0,1), (-1,-1), 0.5, color_linea),
                ])
                # Colores alternos (Cian muy clarito)
                color_fondo1 = colors.HexColor("#f0f4f5")
                for i in range(1, len(datos_tabla)):
                    if i % 2 != 0: # Filas impares
                        estilo_tabla.add('BACKGROUND', (0, i), (-1, i), color_fondo1)

            elif tema["estilo_tabla"] == "vimex_style":
                color_rosa = colors.HexColor("#f5cccc")
                
                estilo_tabla = TableStyle([
                    ('FONTSIZE', (0,0), (-1,-1), 9),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                    
                    # Encabezados
                    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                    ('TEXTCOLOR', (0,0), (-1,0), colors.black),
                    ('BACKGROUND', (0,0), (-1,0), color_rosa),
                    
                    # Todo centrado en VIMEX
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                    
                    # Cuadrícula rosa para todo
                    ('GRID', (0,0), (-1,-1), 1, color_rosa),
                ])
 
            tabla.setStyle(estilo_tabla)
            
            # --- BUCLE DE PAGINACIÓN DINÁMICA ---
            y_actual = y_fin_cliente - 15
            x_tabla = coords["x_tabla_inicio"]

            # --- MARGEN DE EMPRESAS
            margen_inferior = 150
            if nombre_tema == "CRISAC":
                margen_inferior = 280 
            elif nombre_tema == "CUENCA":
                margen_inferior = 250
            elif nombre_tema == "DERSA":
                margen_inferior = 200
            elif nombre_tema == "EXPRESATEL":
                margen_inferior = 200
            elif nombre_tema == "FICSAR":
                margen_inferior = 200
            elif nombre_tema == "ASESORES GBR":
                margen_inferior = 220
            elif nombre_tema == "GLOBALEARTH":
                margen_inferior = 220
            elif nombre_tema == "GOVIDA":
                margen_inferior = 210
            elif nombre_tema == "KALE":
                margen_inferior = 250
            elif nombre_tema == "LEVICTUS":
                margen_inferior = 200
            elif nombre_tema == "LEXIC":
                margen_inferior = 230
            elif nombre_tema == "LIMGRATSA":
                margen_inferior = 150
            elif nombre_tema == "LITERSA":
                margen_inferior = 200
            elif nombre_tema == "LOTSA":
                margen_inferior = 250
            elif nombre_tema == "PLAFOREY":
                margen_inferior = 200
            elif nombre_tema == "RAWAN":
                margen_inferior = 150
            elif nombre_tema == "TABEL":
                margen_inferior = 150
            elif nombre_tema == "TERIGEN":
                margen_inferior = 250
            elif nombre_tema == "TORRES":
                margen_inferior = 300
            elif nombre_tema == "VIMEX":
                margen_inferior = 300

            espacio_necesario_totales = 100  # Más espacio si hay nota de validez o para forzar salto temprano

            def dibujar_totales(can, y_dibujo, subtotal, anchos_columnas, x_tabla, tema):
                iva = subtotal * 0.16
                total = subtotal + iva
                borde_derecho = x_tabla + sum(anchos_columnas)
                x_etiquetas_totales = borde_derecho - 70
                y_subtotal = y_dibujo - 20
                y_iva = y_dibujo - 35
                y_total = y_dibujo - 50

                can.setFont("Helvetica-Bold", 10)
                if nombre_tema == "AVIDUX":
                    # Caja rosa pálido para totales (simulando el diseño de la imagen)
                    # ancho = 160, alto = 55
                    dibujar_tarjeta(can, borde_derecho - 160, y_total - 10, 160, 55, colors.white, colors.HexColor("#F4DCDC"))
                    
                    x_etiq = borde_derecho - 70
                    dibujar_texto_alineado(can, "Sub Total", x_etiq, y_subtotal, "Helvetica", 10, colors.black, "right")
                    dibujar_texto_alineado(can, "IVA", x_etiq, y_iva, "Helvetica", 10, colors.black, "right")
                    dibujar_texto_alineado(can, "Total", x_etiq, y_total, "Helvetica-Bold", 10, colors.black, "right")

                    dibujar_texto_alineado(can, f"${subtotal:,.2f}", borde_derecho - 15, y_subtotal, "Helvetica", 10, colors.black, "right")
                    dibujar_texto_alineado(can, f"${iva:,.2f}", borde_derecho - 15, y_iva, "Helvetica", 10, colors.black, "right")
                    dibujar_texto_alineado(can, f"${total:,.2f}", borde_derecho - 15, y_total, "Helvetica-Bold", 10, colors.black, "right")

                elif nombre_tema == "373 COMERCIO":
                    color_azul = colors.HexColor("#3C4B64")
                    
                    x_etiq = borde_derecho - 80
                    y_total_373 = y_dibujo - 60  # Lo bajamos un poquito más
                    
                    dibujar_texto_alineado(can, "SUBTOTAL:", x_etiq, y_subtotal, "Helvetica-Bold", 10, colors.black, "right")
                    dibujar_texto_alineado(can, "IVA:", x_etiq, y_iva, "Helvetica-Bold", 10, colors.black, "right")
                    
                    dibujar_texto_alineado(can, f"${subtotal:,.2f}", borde_derecho - 5, y_subtotal, "Helvetica-Bold", 10, colors.black, "right")
                    dibujar_texto_alineado(can, f"${iva:,.2f}", borde_derecho - 5, y_iva, "Helvetica-Bold", 10, colors.black, "right")
                    
                    # Caja azul para el TOTAL
                    dibujar_tarjeta(can, borde_derecho - 180, y_total_373 - 7, 180, 22, color_azul, color_azul)
                    
                    dibujar_texto_alineado(can, "TOTAL:", x_etiq, y_total_373, "Helvetica-Bold", 11, colors.white, "right")
                    dibujar_texto_alineado(can, f"${total:,.2f}", borde_derecho - 5, y_total_373, "Helvetica-Bold", 11, colors.white, "right")

                elif nombre_tema == "MELLAFE":
                    x_etiq = borde_derecho - 75
                    
                    # Nuevas alturas específicas para que cuadren exacto en la caja
                    y_subtotal_m = y_dibujo - 25
                    y_iva_m = y_dibujo - 40
                    y_totales_m = y_dibujo - 55
                    
                    # Caja gris claro de fondo (centrada verticalmente con los textos)
                    dibujar_tarjeta(can, borde_derecho - 170, y_totales_m - 10, 170, 50, colors.white, colors.HexColor("#EAEAEA"))
                    
                    dibujar_texto_alineado(can, "Subtotal", x_etiq, y_subtotal_m, "Helvetica-Bold", 10, colors.black, "right")
                    dibujar_texto_alineado(can, "IVA", x_etiq, y_iva_m, "Helvetica-Bold", 10, colors.black, "right")
                    dibujar_texto_alineado(can, "TOTAL", x_etiq, y_totales_m, "Helvetica-Bold", 11, colors.black, "right")
                    
                    dibujar_texto_alineado(can, f"${subtotal:,.2f}", borde_derecho - 15, y_subtotal_m, "Helvetica", 10, colors.black, "right")
                    dibujar_texto_alineado(can, f"${iva:,.2f}", borde_derecho - 15, y_iva_m, "Helvetica", 10, colors.black, "right")
                    dibujar_texto_alineado(can, f"${total:,.2f}", borde_derecho - 15, y_totales_m, "Helvetica-Bold", 11, colors.black, "right")

                elif nombre_tema == "SISUC":
                    color_azul = colors.HexColor("#00508C")
                    x_etiq = borde_derecho - 70
                    
                    # Dibujaremos el TOTAL pegado a la tabla simulando una fila
                    y_caja = y_dibujo - 20
                    # Las columnas Precio y Total miden 100 cada una (Total = 200)
                    dibujar_tarjeta(can, borde_derecho - 200, y_caja, 200, 20, colors.black, color_azul)
                    
                    # Textos centrados dentro de las columnas
                    dibujar_texto_alineado(can, "Total", borde_derecho - 150, y_caja + 6, "Helvetica-Bold", 10, colors.white, "center")
                    dibujar_texto_alineado(can, f"${total:,.2f}", borde_derecho - 50, y_caja + 6, "Helvetica-Bold", 10, colors.white, "center")

                    # Subtotal e IVA debajo de la tabla (por si los necesitas)
                    dibujar_texto_alineado(can, "Subtotal", x_etiq, y_caja - 20, "Helvetica", 10, colors.black, "right")
                    dibujar_texto_alineado(can, "IVA", x_etiq, y_caja - 35, "Helvetica", 10, colors.black, "right")
                    dibujar_texto_alineado(can, f"${subtotal:,.2f}", borde_derecho - 15, y_caja - 20, "Helvetica", 10, colors.black, "right")
                    dibujar_texto_alineado(can, f"${iva:,.2f}", borde_derecho - 15, y_caja - 35, "Helvetica", 10, colors.black, "right")

                elif nombre_tema == "AGRAMON":
                    color_gris = colors.HexColor("#737373")
                    x_etiq = borde_derecho - 75
                    
                    y_subtotal_a = y_dibujo - 25
                    y_iva_a = y_dibujo - 40
                    y_totales_a = y_dibujo - 65
                    
                    dibujar_texto_alineado(can, "SUBTOTAL:", x_etiq, y_subtotal_a, "Helvetica-Bold", 10, colors.black, "right")
                    dibujar_texto_alineado(can, "IVA", x_etiq, y_iva_a, "Helvetica-Bold", 10, colors.black, "right")
                    
                    dibujar_texto_alineado(can, f"${subtotal:,.2f}", borde_derecho - 5, y_subtotal_a, "Helvetica-Bold", 10, colors.black, "right")
                    dibujar_texto_alineado(can, f"${iva:,.2f}", borde_derecho - 5, y_iva_a, "Helvetica-Bold", 10, colors.black, "right")
                    
                    # Caja gris para el TOTAL
                    dibujar_tarjeta(can, borde_derecho - 180, y_totales_a - 7, 180, 24, color_gris, color_gris)
                    
                    dibujar_texto_alineado(can, "TOTAL:", x_etiq, y_totales_a, "Helvetica-Bold", 11, colors.white, "right")
                    dibujar_texto_alineado(can, f"${total:,.2f}", borde_derecho - 5, y_totales_a, "Helvetica-Bold", 11, colors.white, "right")

                elif nombre_tema == "AMELIT":
                    color_gris = colors.HexColor("#F2F2F2")
                    ancho_total = borde_derecho - 40  # 40 es el x_inicio
                    
                    # Fila Subtotal (Altura 20, pegada al borde inferior de la tabla)
                    y_caja_sub = y_dibujo - 22
                    dibujar_tarjeta(can, 40, y_caja_sub, ancho_total, 20, color_gris, color_gris)
                    
                    # Fila IVA (Altura 20, fondo blanco transparente)
                    y_caja_iva = y_caja_sub - 20
                    
                    # Fila Total (Altura 25, fondo gris)
                    y_caja_tot = y_caja_iva - 25
                    dibujar_tarjeta(can, 40, y_caja_tot, ancho_total, 25, color_gris, color_gris)
                    
                    x_etiq = borde_derecho - 80
                    
                    # Textos centrados verticalmente en sus propias franjas
                    dibujar_texto_alineado(can, "Sub-total", x_etiq, y_caja_sub + 6, "Helvetica", 10, colors.black, "right")
                    dibujar_texto_alineado(can, "Impuestos", x_etiq, y_caja_iva + 6, "Helvetica", 10, colors.black, "right")
                    dibujar_texto_alineado(can, "TOTAL", x_etiq, y_caja_tot + 8, "Helvetica-Bold", 11, colors.black, "right")
                    
                    dibujar_texto_alineado(can, f"$ {subtotal:,.2f}", borde_derecho - 15, y_caja_sub + 6, "Helvetica", 10, colors.black, "right")
                    dibujar_texto_alineado(can, f"$ {iva:,.2f}", borde_derecho - 15, y_caja_iva + 6, "Helvetica", 10, colors.black, "right")
                    dibujar_texto_alineado(can, f"$ {total:,.2f}", borde_derecho - 15, y_caja_tot + 8, "Helvetica-Bold", 11, colors.black, "right")

                elif nombre_tema == "BERGUN":
                    color_rosa = colors.HexColor("#F4A4B8")
                    color_magenta = colors.HexColor("#87274E")
                    
                    y_caja_tot = y_dibujo - 20
                    # Caja rosa que abarca las dos últimas columnas
                    dibujar_tarjeta(can, borde_derecho - 200, y_caja_tot, 200, 20, colors.white, color_rosa)
                    
                    # Línea blanca vertical para separar "Total" del monto
                    can.setStrokeColor(colors.white)
                    can.setLineWidth(1.5)
                    can.line(borde_derecho - 100, y_caja_tot, borde_derecho - 100, y_caja_tot + 20)
                    
                    dibujar_texto_alineado(can, "Total", borde_derecho - 190, y_caja_tot + 6, "Helvetica-Bold", 10, color_magenta, "left")
                    dibujar_texto_alineado(can, f"${total:,.2f}", borde_derecho - 90, y_caja_tot + 6, "Helvetica-Bold", 10, color_magenta, "left")

                elif nombre_tema == "BERZAN":
                    color_borde = colors.HexColor("#D1C7B7")
                    ancho_total = borde_derecho - 40
                    
                    # Dibujaremos las 3 filas pegadas al final de la tabla
                    y_caja_sub = y_dibujo - 20
                    y_caja_iva = y_caja_sub - 20
                    y_caja_tot = y_caja_iva - 20
                    
                    can.setStrokeColor(color_borde)
                    can.setLineWidth(1)
                    
                    # Cajas totalmente transparentes (fill=0), solo dibujamos el borde (stroke=1)
                    can.rect(40, y_caja_sub, ancho_total, 20, stroke=1, fill=0)
                    can.rect(40, y_caja_iva, ancho_total, 20, stroke=1, fill=0)
                    can.rect(40, y_caja_tot, ancho_total, 20, stroke=1, fill=0)
                    
                    # Línea vertical separadora alineada con el final de la columna CONCEPTO (ancho 220)
                    x_div = 40 + 220
                    can.line(x_div, y_caja_sub, x_div, y_caja_sub + 20)
                    can.line(x_div, y_caja_iva, x_div, y_caja_iva + 20)
                    can.line(x_div, y_caja_tot, x_div, y_caja_tot + 20)
                    
                    # Textos centrados en la primera celda (mitad de 220 = 110)
                    x_centro_texto = 40 + 110
                    dibujar_texto_alineado(can, "SUBTOTAL", x_centro_texto, y_caja_sub + 6, "Helvetica-Bold", 10, colors.black, "center")
                    dibujar_texto_alineado(can, "IVA", x_centro_texto, y_caja_iva + 6, "Helvetica-Bold", 10, colors.black, "center")
                    dibujar_texto_alineado(can, "TOTAL", x_centro_texto, y_caja_tot + 6, "Helvetica-Bold", 10, colors.black, "center")
                    
                    # Montos alineados a la derecha del todo
                    dibujar_texto_alineado(can, f"${subtotal:,.2f}", borde_derecho - 15, y_caja_sub + 6, "Helvetica", 10, colors.black, "right")
                    dibujar_texto_alineado(can, f"${iva:,.2f}", borde_derecho - 15, y_caja_iva + 6, "Helvetica", 10, colors.black, "right")
                    dibujar_texto_alineado(can, f"${total:,.2f}", borde_derecho - 15, y_caja_tot + 6, "Helvetica-Bold", 11, colors.black, "right")

                elif nombre_tema == "CALAFELL":
                    y_caja_sub = y_dibujo - 20
                    y_caja_iva = y_caja_sub - 15
                    
                    # Línea negra gruesa debajo del IVA
                    can.setStrokeColor(colors.black)
                    can.setLineWidth(2)
                    can.line(borde_derecho - 180, y_caja_iva - 8, borde_derecho, y_caja_iva - 8)
                    
                    y_caja_tot = y_caja_iva - 25
                    
                    dibujar_texto_alineado(can, "Sub-total", borde_derecho - 100, y_caja_sub, "Helvetica", 10, colors.black, "right")
                    dibujar_texto_alineado(can, "IVA:", borde_derecho - 100, y_caja_iva, "Helvetica", 10, colors.black, "right")
                    dibujar_texto_alineado(can, "TOTAL", borde_derecho - 100, y_caja_tot, "Helvetica-Bold", 11, colors.black, "right")
                    
                    dibujar_texto_alineado(can, f"$ {subtotal:,.2f}", borde_derecho - 10, y_caja_sub, "Helvetica", 10, colors.black, "right")
                    dibujar_texto_alineado(can, f"$ {iva:,.2f}", borde_derecho - 10, y_caja_iva, "Helvetica", 10, colors.black, "right")
                    dibujar_texto_alineado(can, f"$ {total:,.2f}", borde_derecho - 10, y_caja_tot, "Helvetica-Bold", 11, colors.black, "right")

                elif nombre_tema == "CRISAC":
                    color_naranja = colors.HexColor("#F37021") # Naranja corporativo CRISAC
                    
                    y_subtotal = y_dibujo - 20
                    y_iva = y_subtotal - 20
                    y_total = y_iva - 30 # El total va un poco más separado
                    
                    x_etiq = borde_derecho - 75
                    
                    dibujar_texto_alineado(can, "SUBTOTAL:", x_etiq, y_subtotal, "Helvetica-Bold", 10, colors.black, "right")
                    dibujar_texto_alineado(can, "IMPUESTO:", x_etiq, y_iva, "Helvetica-Bold", 10, colors.black, "right")
                    dibujar_texto_alineado(can, "TOTAL FINAL:", x_etiq, y_total, "Helvetica-Bold", 10, color_naranja, "right")
                    
                    dibujar_texto_alineado(can, f"$ {subtotal:,.2f}", borde_derecho, y_subtotal, "Helvetica", 10, colors.black, "right")
                    dibujar_texto_alineado(can, f"$ {iva:,.2f}", borde_derecho, y_iva, "Helvetica", 10, colors.black, "right")
                    dibujar_texto_alineado(can, f"$ {total:,.2f}", borde_derecho, y_total, "Helvetica", 10, colors.black, "right")

                elif nombre_tema == "CUENCA":
                    color_azul = colors.HexColor("#1b1958")
                    ancho_caja = 200
                    alto_caja = 60
                    x_caja = borde_derecho - ancho_caja
                    y_caja = y_dibujo - alto_caja
                    
                    # Dibujar caja azul oscuro
                    can.setFillColor(color_azul)
                    can.rect(x_caja, y_caja, ancho_caja, alto_caja, fill=1, stroke=0)
                    
                    # Posiciones dentro de la caja
                    y_subtotal = y_caja + 40
                    y_iva = y_caja + 25
                    y_total = y_caja + 10
                    
                    x_etiquetas = x_caja + 10
                    x_montos = borde_derecho - 10
                    
                    # Textos en BLANCO
                    dibujar_texto_alineado(can, "Sub Total", x_etiquetas, y_subtotal, "Helvetica-Bold", 10, colors.white, "left")
                    dibujar_texto_alineado(can, "IVA", x_etiquetas, y_iva, "Helvetica-Bold", 10, colors.white, "left")
                    dibujar_texto_alineado(can, "Total", x_etiquetas, y_total, "Helvetica-Bold", 10, colors.white, "left")
                    
                    dibujar_texto_alineado(can, f"$ {subtotal:,.2f}", x_montos, y_subtotal, "Helvetica-Bold", 10, colors.white, "right")
                    dibujar_texto_alineado(can, f"$ {iva:,.2f}", x_montos, y_iva, "Helvetica-Bold", 10, colors.white, "right")
                    dibujar_texto_alineado(can, f"$ {total:,.2f}", x_montos, y_total, "Helvetica-Bold", 10, colors.white, "right")

                elif nombre_tema == "DERSA":
                    color_azul = colors.HexColor("#1b1464")
                    y_sub = y_dibujo - 20
                    y_iva = y_sub - 20
                    y_tot = y_iva - 20
                    
                    x_izq = coords.get("x_tabla_inicio", 60)
                    
                    can.setStrokeColor(color_azul)
                    can.setLineWidth(1)
                    
                    # Dibujamos las líneas de lado a lado
                    can.line(x_izq, y_sub + 12, borde_derecho, y_sub + 12) # Arriba del subtotal
                    can.line(x_izq, y_iva + 12, borde_derecho, y_iva + 12) # Arriba del IVA
                    can.line(x_izq, y_tot + 12, borde_derecho, y_tot + 12) # Arriba del TOTAL
                    can.line(x_izq, y_tot - 8, borde_derecho, y_tot - 8)   # Abajo del TOTAL
                    
                    # Textos del lado izquierdo
                    dibujar_texto_alineado(can, "SUBTOTAL", x_izq + 15, y_sub, "Helvetica-Bold", 10, color_azul, "left")
                    dibujar_texto_alineado(can, "IVA", x_izq + 15, y_iva, "Helvetica-Bold", 10, color_azul, "left")
                    dibujar_texto_alineado(can, "TOTAL", x_izq + 15, y_tot, "Helvetica-Bold", 10, color_azul, "left")
                    
                    # Montos del lado derecho
                    dibujar_texto_alineado(can, f"$ {subtotal:,.2f}", borde_derecho - 20, y_sub, "Helvetica", 10, color_azul, "right")
                    dibujar_texto_alineado(can, f"$ {iva:,.2f}", borde_derecho - 20, y_iva, "Helvetica", 10, color_azul, "right")
                    dibujar_texto_alineado(can, f"$ {total:,.2f}", borde_derecho - 20, y_tot, "Helvetica", 10, color_azul, "right")

                elif nombre_tema == "EXPRESATEL":
                    color_morado = colors.HexColor("#761dc9")
                    
                    ancho_caja = 220
                    alto_caja = 25
                    x_caja = borde_derecho - ancho_caja
                    
                    y_sub = y_dibujo - 20
                    y_iva = y_sub - 18
                    y_tot = y_iva - 30 # Salto extra para la caja morada
                    
                    x_etiquetas = x_caja + 10
                    
                    # Textos Subtotal e IVA en Negro
                    dibujar_texto_alineado(can, "SUBTOTAL:", x_etiquetas, y_sub, "Helvetica-Bold", 10, colors.black, "left")
                    dibujar_texto_alineado(can, "IVA:", x_etiquetas, y_iva, "Helvetica-Bold", 10, colors.black, "left")
                    
                    dibujar_texto_alineado(can, f"${subtotal:,.2f}", borde_derecho - 10, y_sub, "Helvetica-Bold", 10, colors.black, "right")
                    dibujar_texto_alineado(can, f"${iva:,.2f}", borde_derecho - 10, y_iva, "Helvetica-Bold", 10, colors.black, "right")
                    
                    # Caja Morada para el TOTAL
                    can.setFillColor(color_morado)
                    can.rect(x_caja, y_tot - 8, ancho_caja, alto_caja, fill=1, stroke=0)
                    
                    # Texto del TOTAL en Blanco
                    dibujar_texto_alineado(can, "TOTAL:", x_etiquetas, y_tot, "Helvetica-Bold", 11, colors.white, "left")
                    dibujar_texto_alineado(can, f"${total:,.2f}", borde_derecho - 10, y_tot, "Helvetica-Bold", 11, colors.white, "right")

                elif nombre_tema == "FACSAM":
                    color_lineas = colors.HexColor("#e8dcc8")
                    color_texto = colors.HexColor("#6b4c4c")
                    color_fondo_tot = colors.HexColor("#eee5cf")
                    
                    x_izq = coords.get("x_tabla_inicio", 60)
                    ancho_total_tabla = sum(anchos_columnas)
                    
                    ancho_col4 = anchos_columnas[3]
                    ancho_col3 = anchos_columnas[2]
                    
                    # Coordenadas X para las líneas verticales
                    x_linea_col3 = borde_derecho - ancho_col4 - ancho_col3
                    x_linea_col4 = borde_derecho - ancho_col4
                    
                    alto_fila = 20
                    y_sub = y_dibujo - alto_fila
                    y_iva = y_sub - alto_fila
                    y_tot = y_iva - alto_fila
                    
                    # Fondo Beige para el Total
                    can.setFillColor(color_fondo_tot)
                    can.rect(x_linea_col4, y_tot, ancho_col4, alto_fila, fill=1, stroke=0)
                    
                    # Dibujamos la cuadrícula de los totales para que parezca parte de la tabla
                    can.setStrokeColor(color_lineas)
                    can.setLineWidth(1)
                    
                    # Borde exterior de la zona de totales
                    can.rect(x_izq, y_tot, ancho_total_tabla, alto_fila * 3, fill=0, stroke=1)
                    
                    # Líneas horizontales interiores
                    can.line(x_linea_col3, y_sub, borde_derecho, y_sub)
                    can.line(x_linea_col3, y_iva, borde_derecho, y_iva)
                    
                    # Líneas verticales
                    can.line(x_linea_col3, y_tot, x_linea_col3, y_dibujo)
                    can.line(x_linea_col4, y_tot, x_linea_col4, y_dibujo)
                    
                    # Textos (Suma, Impuestos, Total)
                    dibujar_texto_alineado(can, "SUMA:", x_linea_col4 - 5, y_sub + 6, "Helvetica-Bold", 9, color_texto, "right")
                    dibujar_texto_alineado(can, "IMPUESTOS:", x_linea_col4 - 5, y_iva + 6, "Helvetica-Bold", 9, color_texto, "right")
                    dibujar_texto_alineado(can, "TOTAL:", x_linea_col4 - 5, y_tot + 6, "Helvetica-Bold", 9, color_texto, "right")
                    
                    # Montos
                    dibujar_texto_alineado(can, f"${subtotal:,.2f}", borde_derecho - 5, y_sub + 6, "Helvetica", 9, color_texto, "right")
                    dibujar_texto_alineado(can, f"${iva:,.2f}", borde_derecho - 5, y_iva + 6, "Helvetica", 9, color_texto, "right")
                    dibujar_texto_alineado(can, f"${total:,.2f}", borde_derecho - 5, y_tot + 6, "Helvetica-Bold", 9, color_texto, "right")

                elif nombre_tema == "FICSAR":
                    color_fondo_tot = colors.HexColor("#f0f0f0")
                    
                    y_sub = y_dibujo - 20
                    y_iva = y_sub - 20
                    y_tot = y_iva - 25
                    
                    x_etiquetas = borde_derecho - 110
                    
                    # Fondo gris SOLAMENTE para el monto del TOTAL
                    can.setFillColor(color_fondo_tot)
                    can.rect(borde_derecho - 100, y_tot - 6, 100, 22, fill=1, stroke=0)
                    
                    # Textos
                    dibujar_texto_alineado(can, "Sub-total", x_etiquetas, y_sub, "Helvetica", 10, colors.black, "right")
                    dibujar_texto_alineado(can, "Impuestos", x_etiquetas, y_iva, "Helvetica", 10, colors.black, "right")
                    dibujar_texto_alineado(can, "TOTAL", x_etiquetas, y_tot, "Helvetica-Bold", 10, colors.black, "right")
                    
                    # Montos
                    dibujar_texto_alineado(can, f"$ {subtotal:,.2f}", borde_derecho - 10, y_sub, "Helvetica", 10, colors.black, "right")
                    dibujar_texto_alineado(can, f"$ {iva:,.2f}", borde_derecho - 10, y_iva, "Helvetica", 10, colors.black, "right")
                    dibujar_texto_alineado(can, f"$ {total:,.2f}", borde_derecho - 10, y_tot, "Helvetica-Bold", 10, colors.black, "right")

                elif nombre_tema == "ASESORES GBR":
                    color_azul = colors.HexColor("#2f3a4b")
                    color_texto = colors.HexColor("#666666")
                    
                    x_mitad = borde_derecho - 200 # Inicio de las líneas cortas
                    
                    y_sub = y_dibujo - 20
                    y_iva = y_sub - 18
                    y_tot = y_iva - 25
                    
                    # Línea gruesa arriba del subtotal (solo mitad derecha)
                    can.setStrokeColor(color_azul)
                    can.setLineWidth(1.5)
                    can.line(x_mitad, y_dibujo, borde_derecho, y_dibujo)
                    
                    # Línea gruesa arriba del TOTAL
                    can.line(x_mitad, y_iva - 10, borde_derecho, y_iva - 10)
                    
                    # Textos (Alineados a la derecha contra el margen de los valores)
                    x_etiquetas = x_mitad + 100
                    dibujar_texto_alineado(can, "Sub-Total", x_etiquetas, y_sub, "Helvetica", 10, color_texto, "right")
                    dibujar_texto_alineado(can, "IVA", x_etiquetas, y_iva, "Helvetica", 10, color_texto, "right")
                    dibujar_texto_alineado(can, "TOTAL", x_etiquetas, y_tot, "Helvetica-Bold", 12, color_azul, "right")
                    
                    # Montos
                    dibujar_texto_alineado(can, f"${subtotal:,.2f}", borde_derecho - 5, y_sub, "Helvetica", 10, color_texto, "right")
                    dibujar_texto_alineado(can, f"${iva:,.2f}", borde_derecho - 5, y_iva, "Helvetica", 10, color_texto, "right")
                    dibujar_texto_alineado(can, f"${total:,.2f}", borde_derecho - 5, y_tot, "Helvetica-Bold", 12, color_azul, "right")

                elif nombre_tema == "GLOBALEARTH":
                    color_lineas = colors.HexColor("#e1dbcf")
                    color_texto = colors.HexColor("#555555")
                    
                    x_izq = coords.get("x_tabla_inicio", 60)
                    
                    # La primera caja abarca Columna 1 y 2. La segunda caja abarca Columna 3 y 4.
                    ancho_caja1 = anchos_columnas[0] + anchos_columnas[1]
                    ancho_caja2 = anchos_columnas[2] + anchos_columnas[3]
                    
                    alto_fila = 22
                    # Dejamos un gap de 5 puntos respecto a la tabla principal
                    y_inicio = y_dibujo - 5 
                    
                    y_sub = y_inicio - alto_fila
                    y_iva = y_sub - alto_fila
                    y_tot = y_iva - alto_fila
                    
                    can.setStrokeColor(color_lineas)
                    can.setLineWidth(1)
                    
                    # Dibujamos las 3 filas de totales simulando que son parte de la cuadrícula
                    # Subtotal
                    can.rect(x_izq, y_sub, ancho_caja1, alto_fila, fill=0, stroke=1)
                    can.rect(x_izq + ancho_caja1, y_sub, ancho_caja2, alto_fila, fill=0, stroke=1)
                    dibujar_texto_alineado(can, "SUBTOTAL", x_izq + (ancho_caja1/2), y_sub + 7, "Helvetica-Bold", 10, color_texto, "center")
                    dibujar_texto_alineado(can, f"${subtotal:,.2f}", borde_derecho - 10, y_sub + 7, "Helvetica", 10, color_texto, "right")
                    
                    # IVA
                    can.rect(x_izq, y_iva, ancho_caja1, alto_fila, fill=0, stroke=1)
                    can.rect(x_izq + ancho_caja1, y_iva, ancho_caja2, alto_fila, fill=0, stroke=1)
                    dibujar_texto_alineado(can, "IVA", x_izq + (ancho_caja1/2), y_iva + 7, "Helvetica-Bold", 10, color_texto, "center")
                    dibujar_texto_alineado(can, f"${iva:,.2f}", borde_derecho - 10, y_iva + 7, "Helvetica", 10, color_texto, "right")
                    
                    # TOTAL
                    can.rect(x_izq, y_tot, ancho_caja1, alto_fila, fill=0, stroke=1)
                    can.rect(x_izq + ancho_caja1, y_tot, ancho_caja2, alto_fila, fill=0, stroke=1)
                    dibujar_texto_alineado(can, "TOTAL", x_izq + (ancho_caja1/2), y_tot + 7, "Helvetica-Bold", 10, color_texto, "center")
                    dibujar_texto_alineado(can, f"${total:,.2f}", borde_derecho - 10, y_tot + 7, "Helvetica-Bold", 10, color_texto, "right")

                elif nombre_tema == "GOVIDA":
                    color_azul = colors.HexColor("#75cbe6")
                    
                    x_izq = coords.get("x_tabla_inicio", 60)
                    w_col1 = anchos_columnas[0]
                    w_col2 = anchos_columnas[1]
                    w_col3 = anchos_columnas[2]
                    w_col4 = anchos_columnas[3]
                    
                    alto_fila = 20
                    y_sub = y_dibujo - alto_fila
                    y_iva = y_sub - alto_fila
                    y_tot = y_iva - alto_fila
                    
                    can.setStrokeColor(colors.black)
                    can.setLineWidth(1)
                    
                    # Función interna para dibujar cada fila de totales como parte de la tabla
                    def dibujar_fila_govida(y_pos, etiqueta, monto, bg_color, text_color):
                        # Cajas vacías (Col 1 y Col 2)
                        can.rect(x_izq, y_pos, w_col1, alto_fila, fill=0, stroke=1)
                        can.rect(x_izq + w_col1, y_pos, w_col2, alto_fila, fill=0, stroke=1)
                        
                        # Caja Etiqueta (Col 3)
                        can.setFillColor(bg_color)
                        can.rect(x_izq + w_col1 + w_col2, y_pos, w_col3, alto_fila, fill=1 if bg_color != colors.white else 0, stroke=1)
                        dibujar_texto_alineado(can, etiqueta, x_izq + w_col1 + w_col2 + 5, y_pos + 6, "Helvetica-Bold", 9, text_color, "left")
                        
                        # Caja Monto (Col 4)
                        can.rect(x_izq + w_col1 + w_col2 + w_col3, y_pos, w_col4, alto_fila, fill=1 if bg_color != colors.white else 0, stroke=1)
                        dibujar_texto_alineado(can, f"${monto:,.2f}", x_izq + w_col1 + w_col2 + w_col3 + 5, y_pos + 6, "Helvetica", 9, text_color, "left")

                    # Dibujamos Subtotal e IVA (Cajas Blancas) y el TOTAL (Caja Celeste)
                    dibujar_fila_govida(y_sub, "Subtotal", subtotal, colors.white, colors.black)
                    dibujar_fila_govida(y_iva, "IVA", iva, colors.white, colors.black)
                    dibujar_fila_govida(y_tot, "Total", total, color_azul, colors.white)
                    
                    can.setFillColor(colors.black) # Resetear color para evitar problemas

                elif nombre_tema == "KALE":
                    color_texto = colors.black
                    
                    y_sub = y_dibujo - 20
                    y_iva = y_sub - 18
                    y_tot = y_iva - 25
                    
                    # Línea gruesa arriba del TOTAL (que es abajo del IVA)
                    x_mitad = borde_derecho - 200
                    
                    can.setStrokeColor(colors.black)
                    can.setLineWidth(2)
                    can.line(x_mitad, y_iva - 8, borde_derecho, y_iva - 8)
                    
                    # Textos
                    x_etiquetas = x_mitad + 100
                    dibujar_texto_alineado(can, "Sub-total", x_etiquetas, y_sub, "Helvetica", 10, color_texto, "right")
                    dibujar_texto_alineado(can, "IVA", x_etiquetas, y_iva, "Helvetica", 10, color_texto, "right")
                    dibujar_texto_alineado(can, "TOTAL", x_etiquetas, y_tot, "Helvetica-Bold", 12, color_texto, "right")
                    
                    # Montos
                    dibujar_texto_alineado(can, f"$ {subtotal:,.2f}", borde_derecho - 10, y_sub, "Helvetica", 10, color_texto, "right")
                    dibujar_texto_alineado(can, f"$ {iva:,.2f}", borde_derecho - 10, y_iva, "Helvetica", 10, color_texto, "right")
                    dibujar_texto_alineado(can, f"$ {total:,.2f}", borde_derecho - 10, y_tot, "Helvetica-Bold", 12, color_texto, "right")

                elif nombre_tema == "LEVICTUS":
                    color_fondo = colors.HexColor("#f0f0f0")
                    color_texto = colors.black
                    x_izq = coords.get("x_tabla_inicio", 60)
                    ancho_total = sum(anchos_columnas)
                    alto_fila = 20
                    
                    y_sub = y_dibujo - alto_fila
                    y_iva = y_sub - alto_fila
                    y_tot = y_iva - alto_fila
                    
                    # Identificar los índices para saber qué color toca (par o impar)
                    indice_sub = len(datos_tabla)
                    indice_iva = indice_sub + 1
                    indice_tot = indice_iva + 1
                    
                    def dibujar_fila_levictus(y_pos, etiqueta, monto, indice, is_bold=False):
                        # Si el índice es par, pinta gris; si no, blanco
                        bg_color = color_fondo if indice % 2 == 0 else colors.white
                        can.setFillColor(bg_color)
                        can.rect(x_izq, y_pos, ancho_total, alto_fila, fill=1, stroke=0)
                        
                        # Textos
                        fuente = "Helvetica-Bold" if is_bold else "Helvetica"
                        x_etiquetas = borde_derecho - 120
                        dibujar_texto_alineado(can, etiqueta, x_etiquetas, y_pos + 6, fuente, 10, color_texto, "right")
                        dibujar_texto_alineado(can, f"$ {monto:,.2f}", borde_derecho - 10, y_pos + 6, fuente, 10, color_texto, "right")

                    dibujar_fila_levictus(y_sub, "Sub-total", subtotal, indice_sub)
                    dibujar_fila_levictus(y_iva, "Impuestos", iva, indice_iva)
                    dibujar_fila_levictus(y_tot, "TOTAL", total, indice_tot, is_bold=True)
                    
                    can.setFillColor(colors.black)

                elif nombre_tema == "LEXIC":
                    color_texto_azul = colors.HexColor("#3366cc")
                    color_fondo_azul = colors.HexColor("#5e8aef")
                    
                    y_sub = y_dibujo - 20
                    y_iva = y_sub - 20
                    y_tot = y_iva - 30
                    
                    # El bloque de totales está a la derecha
                    x_mitad = borde_derecho - 180
                    x_etiquetas = x_mitad + 60
                    
                    # Subtotal e IVA (Texto azul)
                    dibujar_texto_alineado(can, "SUBTOTAL:", x_etiquetas, y_sub, "Helvetica-Bold", 10, color_texto_azul, "right")
                    dibujar_texto_alineado(can, f"${subtotal:,.2f}", borde_derecho - 10, y_sub, "Helvetica-Bold", 10, color_texto_azul, "right")
                    
                    dibujar_texto_alineado(can, "IVA:", x_etiquetas, y_iva, "Helvetica-Bold", 10, color_texto_azul, "right")
                    dibujar_texto_alineado(can, f"${iva:,.2f}", borde_derecho - 10, y_iva, "Helvetica-Bold", 10, color_texto_azul, "right")
                    
                    # TOTAL con caja azul redondeada
                    ancho_caja = 180
                    alto_caja = 25
                    x_caja = borde_derecho - ancho_caja
                    y_caja = y_tot - 7 # Bajar un poco para envolver bien el texto
                    
                    can.setFillColor(color_fondo_azul)
                    can.roundRect(x_caja, y_caja, ancho_caja, alto_caja, 8, fill=1, stroke=0)
                    
                    dibujar_texto_alineado(can, "TOTAL:", x_etiquetas, y_tot, "Helvetica-Bold", 11, colors.white, "right")
                    dibujar_texto_alineado(can, f"${total:,.2f}", borde_derecho - 15, y_tot, "Helvetica-Bold", 11, colors.white, "right")
                    
                    can.setFillColor(colors.black)

                elif nombre_tema == "LIMGRATSA":
                    color_beige = colors.HexColor("#eedfcb")
                    color_lineas = colors.HexColor("#e3d1bb")
                    color_cafe = colors.HexColor("#8c5c38")
                    
                    x_izq = coords.get("x_tabla_inicio", 60)
                    w_col1 = anchos_columnas[0]
                    w_col2 = anchos_columnas[1]
                    w_col3 = anchos_columnas[2]
                    w_col4 = anchos_columnas[3]
                    
                    alto_fila = 20
                    y_sub = y_dibujo - alto_fila
                    y_iva = y_sub - alto_fila
                    y_tot = y_iva - alto_fila
                    
                    can.setStrokeColor(color_lineas)
                    can.setLineWidth(0.5)
                    
                    # 1. Caja grande unificada para "Observaciones" (Abarca col 1 y 2, y baja por las 3 filas)
                    can.setFillColor(colors.white)
                    can.rect(x_izq, y_tot, w_col1 + w_col2, alto_fila * 3, fill=1, stroke=1)
                    dibujar_texto_alineado(can, "Observaciones:", x_izq + 5, y_sub + 10, "Helvetica", 9, color_cafe, "left")
                    
                    # 2. Función para dibujar las cajas de la derecha (Etiquetas y montos)
                    def dibujar_fila_lim_der(y_pos, etiqueta, monto, bg_val=colors.white):
                        # Caja etiqueta (Col 3)
                        can.setFillColor(colors.white)
                        can.rect(x_izq + w_col1 + w_col2, y_pos, w_col3, alto_fila, fill=1, stroke=1)
                        dibujar_texto_alineado(can, etiqueta, x_izq + w_col1 + w_col2 + w_col3 - 5, y_pos + 6, "Helvetica-Bold", 9, color_cafe, "right")
                        
                        # Caja valor (Col 4)
                        can.setFillColor(bg_val)
                        can.rect(x_izq + w_col1 + w_col2 + w_col3, y_pos, w_col4, alto_fila, fill=1 if bg_val != colors.white else 0, stroke=1)
                        dibujar_texto_alineado(can, f"${monto:,.2f}", borde_derecho - 5, y_pos + 6, "Helvetica", 9, color_cafe, "right")

                    # Sumas
                    dibujar_fila_lim_der(y_sub, "SUMA:", subtotal)
                    dibujar_fila_lim_der(y_iva, "IMPUESTOS:", iva)
                    dibujar_fila_lim_der(y_tot, "TOTAL:", total, bg_val=color_beige) # El fondo del total en beige
                    
                    can.setFillColor(colors.black)

                elif nombre_tema == "LITERSA":
                    color_lineas = colors.HexColor("#e0e0e0")
                    color_texto = colors.HexColor("#666666")
                    
                    x_izq = coords.get("x_tabla_inicio", 50)
                    w_lbl = anchos_columnas[0] # Ancho de la etiqueta (Igual a la columna CONCEPTO)
                    w_val = sum(anchos_columnas[1:]) # Ancho del valor (Suma del resto de columnas)
                    
                    alto_fila = 20
                    y_sub = y_dibujo - alto_fila
                    y_iva = y_sub - alto_fila
                    y_tot = y_iva - alto_fila
                    
                    can.setStrokeColor(color_lineas)
                    can.setLineWidth(1)
                    
                    # Dibuja la fila dividida en solo 2 cajas
                    def dibujar_fila_litersa(y_pos, etiqueta, monto, is_bold=False):
                        # Caja Etiqueta (Izquierda)
                        can.rect(x_izq, y_pos, w_lbl, alto_fila, fill=0, stroke=1)
                        fuente = "Helvetica-Bold" if is_bold else "Helvetica"
                        dibujar_texto_alineado(can, etiqueta, x_izq + (w_lbl/2), y_pos + 6, fuente, 10, color_texto, "center")
                        
                        # Caja Valor (Derecha)
                        can.rect(x_izq + w_lbl, y_pos, w_val, alto_fila, fill=0, stroke=1)
                        dibujar_texto_alineado(can, f"${monto:,.2f}", borde_derecho - 10, y_pos + 6, fuente, 10, color_texto, "right")

                    dibujar_fila_litersa(y_sub, "SUBTOTAL", subtotal)
                    dibujar_fila_litersa(y_iva, "IVA", iva)
                    dibujar_fila_litersa(y_tot, "TOTAL", total, is_bold=True)
                    
                    can.setFillColor(colors.black)

                elif nombre_tema == "LOTSA":
                    color_azul = colors.HexColor("#231f82")
                    color_texto = colors.HexColor("#555555")
                    
                    x_izq = coords.get("x_tabla_inicio", 60)
                    ancho_total = sum(anchos_columnas)
                    
                    alto_fila = 25
                    y_sub = y_dibujo - alto_fila
                    y_iva = y_sub - alto_fila
                    y_tot = y_iva - alto_fila
                    
                    can.setStrokeColor(color_azul)
                    can.setLineWidth(1)
                    
                    # Dibujamos las 4 líneas horizontales separadoras
                    can.line(x_izq, y_dibujo, x_izq + ancho_total, y_dibujo) # Arriba de subtotal
                    can.line(x_izq, y_sub, x_izq + ancho_total, y_sub)       # Arriba de iva
                    can.line(x_izq, y_iva, x_izq + ancho_total, y_iva)       # Arriba de total
                    can.line(x_izq, y_tot, x_izq + ancho_total, y_tot)       # Abajo de total
                    
                    # Centro de la columna 1 para las etiquetas
                    centro_col1 = x_izq + (anchos_columnas[0] / 2)
                    # Centro de la última columna para los valores
                    centro_col4 = x_izq + anchos_columnas[0] + anchos_columnas[1] + anchos_columnas[2] + (anchos_columnas[3] / 2)
                    
                    # Textos centrados en sus respectivas columnas
                    dibujar_texto_alineado(can, "SUBTOTAL", centro_col1, y_sub + 8, "Helvetica-Bold", 10, color_azul, "center")
                    dibujar_texto_alineado(can, f"${subtotal:,.2f}", centro_col4, y_sub + 8, "Helvetica", 10, color_texto, "center")
                    
                    dibujar_texto_alineado(can, "IVA", centro_col1, y_iva + 8, "Helvetica-Bold", 10, color_azul, "center")
                    dibujar_texto_alineado(can, f"${iva:,.2f}", centro_col4, y_iva + 8, "Helvetica", 10, color_texto, "center")
                    
                    dibujar_texto_alineado(can, "TOTAL", centro_col1, y_tot + 8, "Helvetica-Bold", 11, color_azul, "center")
                    dibujar_texto_alineado(can, f"${total:,.2f}", centro_col4, y_tot + 8, "Helvetica-Bold", 11, color_texto, "center")
                    
                    can.setFillColor(colors.black)

                elif nombre_tema == "PLAFOREY":
                    color_fondo = colors.HexColor("#f0f0f0")
                    color_texto = colors.HexColor("#333333")
                    
                    x_izq = coords.get("x_tabla_inicio", 60)
                    ancho_total = sum(anchos_columnas)
                    borde_derecho_tabla = x_izq + ancho_total
                    
                    alto_fila = 25
                    y_sub = y_dibujo - alto_fila
                    y_iva = y_sub - alto_fila
                    y_tot = y_iva - alto_fila
                    
                    # Línea negra gruesa separadora arriba de los totales
                    can.setStrokeColor(colors.black)
                    can.setLineWidth(1.5)
                    can.line(x_izq, y_dibujo, borde_derecho_tabla, y_dibujo)
                    
                    # MAGIA CEBRA: Continuamos el patrón de colores basado en el tamaño de la tabla
                    num_datos = len(datos_tabla) - 1 # Sin contar encabezado
                    subtotal_fondo = color_fondo if num_datos % 2 != 0 else colors.white
                    iva_fondo = colors.white if subtotal_fondo == color_fondo else color_fondo
                    
                    def dibujar_fila_plaforey(y_pos, etiqueta, monto, fondo, is_total=False):
                        if is_total:
                            # Caja gris pequeña alineada a la derecha
                            ancho_caja_total = 200
                            x_caja = borde_derecho_tabla - ancho_caja_total
                            can.setFillColor(color_fondo)
                            can.rect(x_caja, y_pos, ancho_caja_total, alto_fila, fill=1, stroke=0)
                            
                            # Textos en negrita (y negro puro)
                            dibujar_texto_alineado(can, etiqueta, borde_derecho_tabla - 100, y_pos + 8, "Helvetica-Bold", 10, colors.black, "right")
                            dibujar_texto_alineado(can, f"${monto:,.2f}", borde_derecho_tabla - 10, y_pos + 8, "Helvetica-Bold", 10, colors.black, "right")
                        else:
                            # Fila normal
                            if fondo != colors.white:
                                can.setFillColor(fondo)
                                can.rect(x_izq, y_pos, ancho_total, alto_fila, fill=1, stroke=0)
                            
                            dibujar_texto_alineado(can, etiqueta, borde_derecho_tabla - 100, y_pos + 8, "Helvetica", 10, color_texto, "right")
                            dibujar_texto_alineado(can, f"${monto:,.2f}", borde_derecho_tabla - 10, y_pos + 8, "Helvetica", 10, color_texto, "right")
                    
                    dibujar_fila_plaforey(y_sub, "Sub-total", subtotal, subtotal_fondo)
                    dibujar_fila_plaforey(y_iva, "Impuestos", iva, iva_fondo)
                    dibujar_fila_plaforey(y_tot, "TOTAL", total, None, is_total=True)
                    
                    can.setFillColor(colors.black)

                elif nombre_tema == "RAWAN":
                    color_azul = colors.HexColor("#0d47a1")
                    color_texto = colors.HexColor("#333333")
                    
                    x_izq = coords.get("x_tabla_inicio", 50)
                    
                    alto_fila = 20 # Filas compactas
                    y_sub = y_dibujo - alto_fila
                    y_iva = y_sub - alto_fila
                    y_tot = y_iva - alto_fila
                    
                    # Coordenadas X para las líneas verticales
                    x_col1 = x_izq
                    # OMITIMOS x_col2 y x_col3 para que se vea como una sola celda combinada
                    x_col4 = x_izq + anchos_columnas[0] + anchos_columnas[1] + anchos_columnas[2]
                    x_fin = x_col4 + anchos_columnas[3]
                    
                    can.setStrokeColor(color_azul)
                    can.setLineWidth(1)
                    
                    # Dibujar líneas horizontales de los totales
                    can.line(x_izq, y_sub, x_fin, y_sub)
                    can.line(x_izq, y_iva, x_fin, y_iva)
                    can.line(x_izq, y_tot, x_fin, y_tot)
                    
                    # Dibujar líneas verticales (Solo bordes exteriores y separador de valores)
                    can.line(x_col1, y_dibujo, x_col1, y_tot) # Borde izquierdo
                    can.line(x_col4, y_dibujo, x_col4, y_tot) # Separador de valores
                    can.line(x_fin, y_dibujo, x_fin, y_tot)   # Borde derecho
                    
                    # Textos de totales (alineados a la derecha contra el separador)
                    centro_col4 = x_col4 + (anchos_columnas[3] / 2)
                    
                    dibujar_texto_alineado(can, "Subtotal", x_col4 - 5, y_sub + 6, "Helvetica-Bold", 10, color_azul, "right")
                    dibujar_texto_alineado(can, f"${subtotal:,.2f}", centro_col4, y_sub + 6, "Helvetica-Bold", 10, color_azul, "center")
                    
                    dibujar_texto_alineado(can, "Impuestos", x_col4 - 5, y_iva + 6, "Helvetica-Bold", 10, color_azul, "right")
                    dibujar_texto_alineado(can, f"${iva:,.2f}", centro_col4, y_iva + 6, "Helvetica-Bold", 10, color_azul, "center")
                    
                    dibujar_texto_alineado(can, "Total", x_col4 - 5, y_tot + 6, "Helvetica-Bold", 10, color_azul, "right")
                    dibujar_texto_alineado(can, f"${total:,.2f}", centro_col4, y_tot + 6, "Helvetica-Bold", 10, color_azul, "center")

                elif nombre_tema == "TABEL":
                    color_azul = colors.HexColor("#04437a")
                    color_texto = colors.HexColor("#000000")
                    
                    x_izq = coords.get("x_tabla_inicio", 60)
                    
                    alto_fila = 20
                    y_sub = y_dibujo - alto_fila
                    y_iva = y_sub - alto_fila
                    y_tot = y_iva - alto_fila
                    
                    # Coordenadas X para las líneas verticales
                    x_col1 = x_izq
                    x_col2 = x_col1 + anchos_columnas[0]
                    x_col3 = x_col2 + anchos_columnas[1]
                    x_col4 = x_col3 + anchos_columnas[2]
                    x_fin = x_col4 + anchos_columnas[3]
                    
                    # -- Fondo Azul para el TOTAL --
                    can.setFillColor(color_azul)
                    can.rect(x_col3, y_tot, anchos_columnas[2] + anchos_columnas[3], alto_fila, fill=1, stroke=0)
                    can.setFillColor(colors.black)
                    
                    can.setStrokeColor(colors.black)
                    can.setLineWidth(1)
                    
                    # Dibujar líneas horizontales
                    can.line(x_izq, y_sub, x_fin, y_sub)
                    can.line(x_izq, y_iva, x_fin, y_iva)
                    can.line(x_izq, y_tot, x_fin, y_tot)
                    
                    # Dibujar líneas verticales
                    can.line(x_col1, y_dibujo, x_col1, y_tot)
                    can.line(x_col2, y_dibujo, x_col2, y_tot)
                    can.line(x_col3, y_dibujo, x_col3, y_tot)
                    can.line(x_col4, y_dibujo, x_col4, y_tot)
                    can.line(x_fin, y_dibujo, x_fin, y_tot)
                    
                    # Textos
                    centro_col4 = x_col4 + (anchos_columnas[3] / 2)
                    
                    dibujar_texto_alineado(can, "Subtotal", x_col4 - 5, y_sub + 6, "Helvetica-Bold", 10, color_texto, "right")
                    dibujar_texto_alineado(can, f"${subtotal:,.2f}", centro_col4, y_sub + 6, "Helvetica", 10, color_texto, "center")
                    
                    dibujar_texto_alineado(can, "Impuestos", x_col4 - 5, y_iva + 6, "Helvetica-Bold", 10, color_texto, "right")
                    dibujar_texto_alineado(can, f"${iva:,.2f}", centro_col4, y_iva + 6, "Helvetica", 10, color_texto, "center")
                    
                    # Texto del total en BLANCO para hacer contraste
                    dibujar_texto_alineado(can, "Total", x_col4 - 5, y_tot + 6, "Helvetica-Bold", 10, colors.white, "right")
                    dibujar_texto_alineado(can, f"${total:,.2f}", centro_col4, y_tot + 6, "Helvetica-Bold", 10, colors.white, "center")

                elif nombre_tema == "TERIGEN":
                    color_texto = colors.black
                    color_gris = colors.HexColor("#f2f2f2")
                    
                    x_izq = coords.get("x_tabla_inicio", 60)
                    ancho_total = sum(anchos_columnas)
                    x_der = x_izq + ancho_total
                    
                    alto_fila = 20
                    y_sub = y_dibujo - alto_fila
                    y_iva = y_sub - alto_fila
                    y_tot = y_iva - alto_fila
                    
                    # Línea gruesa negra encima de los totales
                    can.setStrokeColor(colors.black)
                    can.setLineWidth(2)
                    can.line(x_izq, y_dibujo, x_der, y_dibujo)
                    
                    # Fondos grises intercalados
                    can.setFillColor(color_gris)
                    can.rect(x_izq, y_sub, ancho_total, alto_fila, fill=1, stroke=0)
                    can.rect(x_izq, y_tot, ancho_total, alto_fila, fill=1, stroke=0)
                    can.setFillColor(color_texto)
                    
                    # X para las etiquetas
                    x_etiqueta = x_izq + anchos_columnas[0] + anchos_columnas[1] + anchos_columnas[2] - 10
                    
                    dibujar_texto_alineado(can, "Sub-total", x_etiqueta, y_sub + 6, "Helvetica", 10, color_texto, "right")
                    dibujar_texto_alineado(can, f"${subtotal:,.2f}", x_der - 5, y_sub + 6, "Helvetica", 10, color_texto, "right")
                    
                    dibujar_texto_alineado(can, "Impuestos", x_etiqueta, y_iva + 6, "Helvetica", 10, color_texto, "right")
                    dibujar_texto_alineado(can, f"${iva:,.2f}", x_der - 5, y_iva + 6, "Helvetica", 10, color_texto, "right")
                    
                    dibujar_texto_alineado(can, "TOTAL", x_etiqueta, y_tot + 6, "Helvetica-Bold", 11, color_texto, "right")
                    dibujar_texto_alineado(can, f"${total:,.2f}", x_der - 5, y_tot + 6, "Helvetica-Bold", 11, color_texto, "right")

                elif nombre_tema == "TORRES":
                    color_texto = colors.HexColor("#333333")
                    color_linea = colors.HexColor("#7a9b9b")
                    
                    x_izq = coords.get("x_tabla_inicio", 160)
                    ancho_total = sum(anchos_columnas)
                    x_der = x_izq + ancho_total
                    
                    alto_fila = 20
                    y_sub = y_dibujo - alto_fila
                    y_iva = y_sub - alto_fila
                    y_tot = y_iva - alto_fila - 15 # Espacio extra de separación para el Total
                    
                    # Línea fina debajo de los impuestos (y encima del total)
                    x_linea_inicio = x_izq + anchos_columnas[0] + anchos_columnas[1]
                    can.setStrokeColor(color_linea)
                    can.setLineWidth(1)
                    can.line(x_linea_inicio, y_iva - 7, x_der, y_iva - 7)
                    
                    # X para las etiquetas
                    x_etiqueta = x_linea_inicio + anchos_columnas[2] - 10
                    
                    dibujar_texto_alineado(can, "Sub-Total", x_etiqueta, y_sub + 6, "Helvetica", 10, color_texto, "right")
                    dibujar_texto_alineado(can, f"${subtotal:,.2f}", x_der - 5, y_sub + 6, "Helvetica", 10, color_texto, "right")
                    
                    dibujar_texto_alineado(can, "Impuestos", x_etiqueta, y_iva + 6, "Helvetica", 10, color_texto, "right")
                    dibujar_texto_alineado(can, f"${iva:,.2f}", x_der - 5, y_iva + 6, "Helvetica", 10, color_texto, "right")
                    
                    dibujar_texto_alineado(can, "TOTAL", x_etiqueta, y_tot + 6, "Helvetica-Bold", 12, color_texto, "right")
                    dibujar_texto_alineado(can, f"${total:,.2f}", x_der - 5, y_tot + 6, "Helvetica-Bold", 12, color_texto, "right")

                elif nombre_tema == "VIMEX":
                    color_texto = colors.black
                    color_rosa = colors.HexColor("#f5cccc")
                    
                    x_izq = coords.get("x_tabla_inicio", 60)
                    ancho_total = sum(anchos_columnas)
                    x_der = x_izq + ancho_total
                    
                    # La caja rosa de totales cubre las últimas dos columnas
                    ancho_caja = anchos_columnas[2] + anchos_columnas[3]
                    x_caja = x_der - ancho_caja
                    
                    alto_fila = 20
                    alto_caja = alto_fila * 3
                    y_caja = y_dibujo - alto_caja
                    
                    y_sub = y_caja + (alto_fila * 2)
                    y_iva = y_caja + alto_fila
                    y_tot = y_caja
                    
                    # Fondo rosa para totales
                    can.setFillColor(color_rosa)
                    can.rect(x_caja, y_caja, ancho_caja, alto_caja, fill=1, stroke=0)
                    can.setFillColor(color_texto)
                    
                    # Textos dentro de la caja
                    x_etiquetas = x_caja + 10
                    x_valores = x_der - 10
                    
                    dibujar_texto_alineado(can, "Sub Total", x_etiquetas, y_sub + 6, "Helvetica", 10, color_texto, "left")
                    dibujar_texto_alineado(can, f"${subtotal:,.2f}", x_valores, y_sub + 6, "Helvetica", 10, color_texto, "right")
                    
                    dibujar_texto_alineado(can, "IVA", x_etiquetas, y_iva + 6, "Helvetica", 10, color_texto, "left")
                    dibujar_texto_alineado(can, f"${iva:,.2f}", x_valores, y_iva + 6, "Helvetica", 10, color_texto, "right")
                    
                    dibujar_texto_alineado(can, "Total", x_etiquetas, y_tot + 6, "Helvetica-Bold", 10, color_texto, "left")
                    dibujar_texto_alineado(can, f"${total:,.2f}", x_valores, y_tot + 6, "Helvetica-Bold", 10, color_texto, "right")

                else:
                    can.drawRightString(x_etiquetas_totales, y_subtotal, "SUBTOTAL:")
                    can.drawRightString(x_etiquetas_totales, y_iva, "IMP. TRASLADADOS:")
                    can.drawRightString(x_etiquetas_totales, y_total, "TOTAL:")
                    can.setFont("Helvetica", 10)
                    can.drawRightString(borde_derecho, y_subtotal, f"${subtotal:,.2f}")
                    can.drawRightString(borde_derecho, y_iva, f"${iva:,.2f}")
                    can.drawRightString(borde_derecho, y_total, f"${total:,.2f}")

                # Nota de validez (solo en temas que la tienen)
                if tema["mostrar_nota_validez"] and tema["nota_validez"]:
                    from reportlab.platypus import Paragraph as Para
                    from reportlab.lib.styles import getSampleStyleSheet
                    estilos_nota = getSampleStyleSheet()
                    estilo_nota = estilos_nota["Normal"].clone("EstiloNota")
                    estilo_nota.fontSize = 7
                    estilo_nota.textColor = colors.HexColor("#555555")
                    nota = Para(tema["nota_validez"], estilo_nota)
                    nota_ancho = sum(anchos_columnas) * 0.45
                    nota.wrap(nota_ancho, 100)
                    nota.drawOn(can, x_tabla, y_subtotal - 5)
            
            tabla_restante = tabla
            primer_pagina = True
            
            while tabla_restante:
                if not primer_pagina:
                    can.showPage() # Salto de página oficial en el canvas
                    y_actual = 700 # Las siguientes páginas no tienen encabezados del cliente, empiezan más arriba
                
                espacio_disponible = y_actual - margen_inferior
                _, alto = tabla_restante.wrap(letter[0], espacio_disponible)
                
                # Si cabe la tabla y tenemos espacio suficiente para los totales al final
                if alto <= espacio_disponible and (alto + espacio_necesario_totales <= espacio_disponible):
                    y_dibujo = y_actual - alto
                    tabla_restante.drawOn(can, x_tabla, y_dibujo)
                    dibujar_totales(can, y_dibujo, subtotal, anchos_columnas, x_tabla, tema)
                    break
                else:
                    # Hay que partir la tabla porque sobrepasamos el límite
                    fragmentos = tabla_restante.split(letter[0], espacio_disponible)
                    if not fragmentos or len(fragmentos) == 1:
                        y_dibujo = y_actual - alto
                        tabla_restante.drawOn(can, x_tabla, y_dibujo)
                        dibujar_totales(can, y_dibujo, subtotal, anchos_columnas, x_tabla, tema)
                        break
                        
                    # Dibujamos el primer fragmento que sí cabe
                    parte1 = fragmentos[0]
                    _, alto_parte1 = parte1.wrap(letter[0], espacio_disponible)
                    parte1.drawOn(can, x_tabla, y_actual - alto_parte1)
                    
                    # Lo sobrante a la nueva página
                    tabla_restante = fragmentos[1]
                    primer_pagina = False
                
            can.save()
            packet.seek(0)
            
            # --- FUSION MULTIPÁGINA DE PLANTILLA ---
            ruta_plantilla = f"/home/sistemas/Proyectos/App_Facturacion/backend/media/membretadas/{config['pdf']}"
            if not os.path.exists(ruta_plantilla):
                return Response({"error": f"No se encontró el PDF: {ruta_plantilla}"}, status=400)
                
            nuevo_pdf = PdfReader(packet)
            output = PdfWriter()
            
            # Por cada hoja que hayamos generado, extraemos la plantilla de cero y la combinamos
            for i in range(len(nuevo_pdf.pages)):
                plantilla_pdf_iter = PdfReader(open(ruta_plantilla, "rb"))
                pagina_fondo = plantilla_pdf_iter.pages[0]
                pagina_fondo.merge_page(nuevo_pdf.pages[i])
                output.add_page(pagina_fondo)
            
            # 4. Devolver el archivo final
            response = HttpResponse(content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="cotizacion_generada.pdf"'
            output.write(response)
            
            return response


        except Exception as e:
            mensaje = str(e)
            # Traducir errores técnicos comunes a mensajes entendibles
            if 'not found' in mensaje.lower() or 'no existe' in mensaje.lower():
                return Response({"error": "No se encontró un archivo de plantilla para esta empresa. Verifica que la hoja membretada esté subida en el Gestor de Membretadas."}, status=400)
            elif 'permission' in mensaje.lower() or 'access' in mensaje.lower():
                return Response({"error": "Error de permisos al guardar el archivo. Contacta al administrador del sistema."}, status=500)
            elif 'memory' in mensaje.lower() or 'size' in mensaje.lower():
                return Response({"error": "El archivo es demasiado grande para procesarse. Intenta con un archivo más pequeño."}, status=400)
            else:
                # Error desconocido: mostramos el error real temporalmente para depuración
                return Response({"error": f"Error interno: {str(e)}"}, status=500)

class GestorMembretadasView(APIView):
    parser_classes = [MultiPartParser]
    
    def get_directorio(self):
        ruta = os.path.join('/home/sistemas/Proyectos/App_Facturacion/backend/media/membretadas')
        if not os.path.exists(ruta):
            os.makedirs(ruta)
        return ruta

    def get(self, request):
        ruta = self.get_directorio()
        archivos = [f for f in os.listdir(ruta) if f.endswith('.pdf')]
        return Response({"archivos": archivos})

    def post(self, request):
        archivo = request.FILES.get('file')
        if not archivo:
            return Response({"error": "No se envió ningún archivo"}, status=400)
            
        if not archivo.name.endswith('.pdf'):
            return Response({"error": "El archivo debe ser un PDF"}, status=400)
            
        ruta = self.get_directorio()
        ruta_archivo = os.path.join(ruta, archivo.name)
        
        with open(ruta_archivo, 'wb+') as destino:
            for chunk in archivo.chunks():
                destino.write(chunk)
                
        return Response({"mensaje": f"Archivo {archivo.name} subido correctamente"})

    def delete(self, request):
        nombre_archivo = request.GET.get('nombre')
        if not nombre_archivo:
            return Response({"error": "No se especificó el archivo a eliminar"}, status=400)
            
        ruta = self.get_directorio()
        ruta_archivo = os.path.join(ruta, nombre_archivo)
        
        if os.path.exists(ruta_archivo):
            os.remove(ruta_archivo)
            return Response({"mensaje": f"Archivo {nombre_archivo} eliminado"})
        else:
            return Response({"error": "El archivo no existe"}, status=404)
