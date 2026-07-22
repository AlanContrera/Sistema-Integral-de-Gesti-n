import os
import csv
import re
import json
import PIL.Image
from pdf2image import convert_from_path
import google.generativeai as genai
from django.conf import settings

# --- CARGAR CATÁLOGO ---
CATALOGO_CUENTAS = {}
catalogo_path = os.path.join(os.path.dirname(__file__), 'catalogo.csv')
if os.path.exists(catalogo_path):
    with open(catalogo_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            banco = row.get('banco', '').strip()
            empresa = row.get('razon_social', '').strip()
            if row.get('cuenta', '').strip():
                CATALOGO_CUENTAS[row['cuenta'].strip()] = {'banco': banco, 'empresa': empresa}
            if row.get('clabe', '').strip():
                CATALOGO_CUENTAS[row['clabe'].strip()] = {'banco': banco, 'empresa': empresa}

def buscar_catalogo_por_cuenta(cuenta_str):
    if not cuenta_str:
        return None
        
    # Limpiamos el texto: a veces la IA devuelve "CRISAC * 14134" 
    # Extraemos solo los bloques de números
    numeros = re.findall(r'\d+', cuenta_str)
    if not numeros:
        return None
        
    # Tomamos el último bloque de números (ej. de "CRISAC * 14134" sacamos "14134")
    cuenta_limpia = numeros[-1]
    
    if cuenta_limpia in CATALOGO_CUENTAS:
        return CATALOGO_CUENTAS[cuenta_limpia]
        
    if len(cuenta_limpia) >= 3:
        for cuenta_cat, datos in CATALOGO_CUENTAS.items():
            if cuenta_cat.endswith(cuenta_limpia):
                return datos
                
    return None


def procesar_archivo(ruta):
    """
    Toma un archivo (PDF o Imagen), y lo envía a Gemini 1.5 Flash 
    para extraer los datos financieros en un JSON estricto.
    """
    extension = str(ruta).lower()
    
    if extension.endswith('.pdf'):
        tipo = 'pdf'
        # Convertimos la primera página del PDF a imagen
        images = convert_from_path(ruta, first_page=1, last_page=1, dpi=150)
        if not images:
            return {'error': 'No se pudo leer el PDF'}
        imagen_pil = images[0]
    else:
        tipo = 'imagen'
        # Es una imagen directa
        imagen_pil = PIL.Image.open(ruta)

    prompt_instruccion = """
Eres un asistente experto en extracción de datos financieros. 
Revisa este comprobante de pago bancario y extrae los siguientes datos.
Devuelve ÚNICAMENTE un objeto JSON válido. Si no encuentras un dato, usa null.

Estructura requerida:
{
    "monto": 1500.50,         
    "fecha": "YYYY-MM-DD",    
    "cuenta_origen": "Ultimos 4 digitos",
    "banco_origen": "Nombre del banco origen",
    "cuenta_destino": "Cuenta o CLABE destino",
    "banco_destino": "Nombre del banco destino",
    "referencia": "Concepto o referencia",
    "empresa_destino": "Nombre del beneficiario",
    "es_factura_pdf": false,
    "folio_factura_pagada": "Si detectas que este documento es un PAGO y menciona a qué folio de factura está pagando (ej. FRA 1502, F-400), extrae solo el número (ej. 1502). Si no, devuelve null"
}
"""


    api_key = getattr(settings, 'GEMINI_API_KEY', None)
    if api_key:
        genai.configure(api_key=api_key)
        
    try:
        # Usamos la versión más reciente de Gemini Flash (ej. 2.5 Flash o superior)
        model = genai.GenerativeModel('gemini-flash-latest')
        
        response = model.generate_content(
            [prompt_instruccion, imagen_pil],
            generation_config={"response_mime_type": "application/json"}
        )
        
        datos = json.loads(response.text)
        
        # --- CRUZAR CON CATÁLOGO ---
        cuenta_destino = datos.get('cuenta_destino') or ''
        banco_destino = datos.get('banco_destino') or ''
        empresa_destino = datos.get('empresa_destino') or ''
        
        datos_destino = buscar_catalogo_por_cuenta(cuenta_destino)
        if datos_destino:
            banco_destino = datos_destino['banco']
            empresa_destino = datos_destino['empresa']

        return {
            'tipo': tipo,
            'texto_bruto': 'Procesado por Inteligencia Artificial (Gemini Vision)',
            'fecha': datos.get('fecha'),
            'banco': datos.get('banco'),
            'monto': datos.get('monto'),
            'cuenta_origen': datos.get('cuenta_origen'),
            'cuenta_destino': cuenta_destino,
            'banco_origen': datos.get('banco_origen'),
            'banco_destino': banco_destino,
            'empresa_destino': empresa_destino,
            'referencia': datos.get('referencia'),
            'es_factura_pdf': datos.get('es_factura_pdf', False),
        }
        
    except Exception as e:
        print(f"Error procesando con Gemini: {e}")
        return {
            'tipo': tipo,
            'texto_bruto': f'Error de IA: {str(e)}',
            'fecha': None, 'banco': None, 'monto': None,
            'cuenta_origen': None, 'cuenta_destino': None,
            'banco_origen': None, 'banco_destino': None,
            'empresa_destino': None, 'referencia': None,
            'es_factura_pdf': False,
        }

# ======================================================================
# LECTURA DEL CUERPO DEL CORREO (Se mantienen igual para correos de Asimilados)
# ======================================================================

def extraer_datos_cuerpo_correo(texto):
    if not texto:
        return []
    registros = []
    patron_bloque = re.compile(r'(\d{2}[/-]\d{2}[/-]\d{2,4})\s+([^\$]+?)\$\s*([\d,]+\.\d{2})')
    for coincidencia in patron_bloque.finditer(texto):
        fecha_str = coincidencia.group(1)
        # Escudo para voltear fechas cortas (DD-MM-YY) a formato estricto (YYYY-MM-DD)
        m_fecha = re.match(r'^(\d{2})[-/](\d{2})[-/](\d{2,4})$', fecha_str)
        if m_fecha:
            dia, mes, anio = m_fecha.groups()
            if len(anio) == 2:
                anio = f"20{anio}"
            fecha_str = f"{anio}-{mes}-{dia}"
            
        if not re.match(r'^\d{4}-\d{2}-\d{2}$', fecha_str):
            fecha_str = None

        texto_medio = coincidencia.group(2).strip()
        monto_str = coincidencia.group(3)
        try:
            monto = float(monto_str.replace(',', ''))
            empresa = ''
            if ' - ' in texto_medio:
                empresa = texto_medio.split(' - ')[-1].strip()
            registros.append({'fecha': fecha_str, 'monto': monto, 'empresa': empresa})
        except ValueError:
            pass
    return registros

def extraer_datos_texto_correo(texto):
    datos = {
        'saldo_anterior': None, 'monto_operacion': None, 'saldo_actualizado': None,
        'beneficiario': '', 'banco': '', 'clabe': '',
    }
    if not texto: return datos
    
    m_resguardo = re.search(r'MONTO EN RESGUA[R]?DO[^\$]+\$\s*([\d,\.]+)', texto, re.IGNORECASE)
    if m_resguardo: datos['saldo_anterior'] = float(m_resguardo.group(1).replace(',', ''))
        
    m_retorno = re.search(r'MONTO (?:A RETORNAR|BLINDADO|CLIENTE)[^\$]+\$\s*([\d,\.]+)', texto, re.IGNORECASE)
    if m_retorno: datos['monto_operacion'] = float(m_retorno.group(1).replace(',', ''))
        
    m_actualizado = re.search(r'MONTO EN RESGUA[R]?DO (?:DESPUES DEL RETORNO|ACTUALIZADO)[^\$]+\$\s*([\d,\.]+)', texto, re.IGNORECASE)
    if m_actualizado: datos['saldo_actualizado'] = float(m_actualizado.group(1).replace(',', ''))

    patron_tabla = r'([A-Z\sÑÁÉÍÓÚ]+?)\s+(?:Transferencia|SPEI|Transfer)\s+([A-Z\s]+?)\s+(\d{10,18})\s+\$\s*([\d,\.]+)'
    m_tabla = re.search(patron_tabla, texto, re.IGNORECASE)
    if m_tabla:
        datos['beneficiario'] = m_tabla.group(1).strip().split('\n')[-1].strip()
        datos['banco'] = m_tabla.group(2).strip()
        datos['clabe'] = m_tabla.group(3).strip()
        if not datos['monto_operacion']:
            datos['monto_operacion'] = float(m_tabla.group(4).replace(',', ''))
            
    return datos



def analizar_correo_ia(asunto, remitente, cuerpo):
    """
    Envía el asunto, remitente y cuerpo a Gemini para extraer:
    1. El nombre del cliente/empresa (clasificador).
    2. El cuerpo del correo limpio (sin basura).
    """
    prompt = f"""
Eres un asistente experto procesando correos empresariales.
Revisa este correo entrante y extrae la siguiente información. Devuelve ÚNICAMENTE un JSON estricto.

1. "cliente_nombre": Deduce el nombre del cliente, empresa o proyecto principal del asunto o el cuerpo. Sé consistente. Si no lo encuentras, usa "Desconocido".
2. "cuerpo_limpio": Limpia agresivamente el cuerpo del correo. Elimina por completo saludos ("Buenos días"), despedidas...
3. "folio_factura_pagada": Si en el asunto o cuerpo del correo el cliente menciona que está pagando una factura y te da el número de folio (ej. "pago fra 1502"), extrae ÚNICAMENTE ese número o código (ej. "1502"). Si no menciona folio, devuelve null.
4. "monto_depositado": Si el correo menciona una cantidad total de la operación, monto a depositar, o total facturado, extrae SOLO el número con decimales (ej. 42500.00). Si no se menciona o hay ambigüedad, devuelve null.

Datos del correo:
Remitente: {remitente}
Asunto: {asunto}
Cuerpo original:
{cuerpo}

Estructura JSON requerida:
{{
    "cliente_nombre": "Nombre de la empresa",
    "cuerpo_limpio": "Texto limpio aquí...",
    "folio_factura_pagada": "1502",
    "monto_depositado": 42500.00
}}
"""


    api_key = getattr(settings, 'GEMINI_API_KEY', None)
    if api_key:
        genai.configure(api_key=api_key)
        
    try:
        model = genai.GenerativeModel('gemini-flash-latest')
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Error en IA limpiando correo: {e}")
        return {}
