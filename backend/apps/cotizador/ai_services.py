import json
import requests
from .models import EmpresaEmisora, OperacionFacturacion, ConceptoEstrategia, Cliente

def generar_estrategias_prefactura_ai(empresa_emisora_id, monto_objetivo, num_partidas_deseadas=None, incluye_iva=True, cliente_id=None):
    """
    Genera estrategias de facturacion equilibradas matematicamente,
    considerando el giro de la Empresa Emisora y el historial del Cliente.
    """
    try:
        empresa = EmpresaEmisora.objects.get(id=empresa_emisora_id)
    except EmpresaEmisora.DoesNotExist:
        return {"error": "Empresa Emisora no encontrada", "status": 404}

    # 1. Calculo de importes base (Tasa 16% IVA)
    monto_float = float(monto_objetivo)
    if incluye_iva:
        subtotal_objetivo = round(monto_float / 1.16, 2)
        iva_objetivo = round(monto_float - subtotal_objetivo, 2)
        total_objetivo = monto_float
    else:
        subtotal_objetivo = monto_float
        iva_objetivo = round(monto_float * 0.16, 2)
        total_objetivo = round(subtotal_objetivo + iva_objetivo, 2)

    # 2. Historial de aprendizaje desde el Catálogo Excel (Hiper-Personalizado)
    conceptos_historicos = []
    
    if cliente_id:
        try:
            cliente_obj = Cliente.objects.get(id=cliente_id)
            conceptos_db = ConceptoEstrategia.objects.filter(
                empresa_emisora=empresa,
                cliente_receptor__icontains=cliente_obj.empresa
            ).order_by('-frecuencia')[:15]
            conceptos_historicos = [c.descripcion for c in conceptos_db]
        except Exception:
            pass

    if not conceptos_historicos:
        conceptos_db = ConceptoEstrategia.objects.filter(empresa_emisora=empresa).order_by('-frecuencia')[:20]
        conceptos_historicos = [c.descripcion for c in conceptos_db]

    giro = empresa.giro_comercial or "Servicios Generales y Administrativos"
    notas = empresa.notas_estrategia or "Ninguna restriccion adicional"
    
    instruccion_partidas = (
        f"DEBES dividir el subtotal matematicamente en exactamente {num_partidas_deseadas} partidas de importes reales de mercado." 
        if num_partidas_deseadas 
        else "Determina tu mismo entre 1 y 4 partidas dependiendo de lo que suene mas natural comercialmente."
    )

    contexto_historial = (
        f"CONCEPTOS HISTORICOS (PRIORIDAD ABSOLUTA, USA ESTOS PARA TUS PARTIDAS):\n- " + "\n- ".join(conceptos_historicos)
        if conceptos_historicos else "No hay historial previo registrado; tienes libertad total dentro del giro."
    )

    # 3. Calculo asimetrico en Python para evitar que la IA ponga ceros
    monto_1 = round(subtotal_objetivo * 0.6, 2)
    monto_2 = round(subtotal_objetivo - monto_1, 2)

    prompt = f"""
Eres un sistema estricto de facturacion en Mexico. Tienes estrictamente prohibido inventar conceptos.

DATOS EMISOR: {empresa.nombre_empresa} ({giro})
OBJETIVO MATEMATICO: 
- Subtotal a sumar: ${subtotal_objetivo:,.2f}

REGLAS MATEMATICAS:
- La suma de (cantidad * precio_unitario) de todas las partidas debe dar EXACTAMENTE ${subtotal_objetivo:.2f}.

DICCIONARIO PERMITIDO:
{contexto_historial}

REGLAS DE TEXTO (¡MUY IMPORTANTE!):
- Elige tus descripciones LITERALMENTE de la lista anterior.
- NUNCA REPITAS LA MISMA DESCRIPCION.

Responde SOLO con este JSON:
{{
  "empresa_emisora": "{empresa.nombre_empresa}",
  "subtotal_general": {subtotal_objetivo},
  "estrategias": [
    {{
      "id": "A",
      "tipo": "Historial",
      "titulo": "Estrategia Asimetrica",
      "justificacion": "Basada en historial real del cliente con montos escalonados.",
      "razonamiento_matematico": "Paso 1: Total {subtotal_objetivo}. Paso 2: Partida 1 es {monto_1} y Partida 2 es {monto_2}.",
      "partidas": [
        {{
          "clave_sat": "80141600",
          "descripcion": "PRIMER CONCEPTO LITERAL DEL DICCIONARIO",
          "cantidad": 1,
          "unidad": "E48",
          "precio_unitario": {monto_1},
          "importe": {monto_1}
        }},
        {{
          "clave_sat": "80141600",
          "descripcion": "SEGUNDO CONCEPTO TOTALMENTE DIFERENTE AL PRIMERO",
          "cantidad": 1,
          "unidad": "E48",
          "precio_unitario": {monto_2},
          "importe": {monto_2}
        }}
      ]
    }}
  ]
}}
"""




    url = "http://host.docker.internal:11434/api/generate"
    payload = {
        "model": "llama3.1",
        "prompt": prompt,
        "format": "json",
        "stream": False,
        "options": {
            "temperature": 0.2
        }
    }
    
    try:
        response = requests.post(url, json=payload, timeout=300)

        if response.status_code != 200:
            return {"error": f"Error Ollama API: {response.text}", "status": response.status_code}
        
        data = response.json()
        raw_text = data.get("response", "")
        return {"success": True, "data": json.loads(raw_text)}

    except Exception as e:
        return {"error": str(e), "status": 500}
