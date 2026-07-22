import sys
import os
import django
import re
from decimal import Decimal

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.base")
django.setup()

from apps.correos.models import CorreoProcesado, Liquidacion
from apps.correos.calculos import calcular_retorno

print("=== INICIANDO EXTRACCIÓN DINÁMICA ===")

# 1. Buscamos el correo específico (ID 506 según la base de datos)
try:
    correo = CorreoProcesado.objects.get(id=510)
except CorreoProcesado.DoesNotExist:
    print("Error: No se encontró el correo 510.")
    sys.exit()

print(f"Correo encontrado: {correo.asunto}")

# 2. Extracción con Expresiones Regulares (Regex) desde el cuerpo del correo
cuerpo = correo.cuerpo

# Buscar Comisión de la empresa (Ej: "Comisión 4%")
match_empresa = re.search(r'Comisi[oó]n\s*(\d+(?:\.\d+)?)\s*%', cuerpo, re.IGNORECASE)
pct_empresa = Decimal(match_empresa.group(1)) if match_empresa else Decimal('0')

# Buscar Comisión del promotor (Ej: "Comisión promotor 3%")
match_promotor = re.search(r'Comisi[oó]n\s+promotor\s*(\d+(?:\.\d+)?)\s*%', cuerpo, re.IGNORECASE)
pct_prom1 = Decimal(match_promotor.group(1)) if match_promotor else Decimal('0')

# Buscar Cantidad de Personas (Ej: "2 PERSONAS")
match_personas = re.search(r'(\d+)\s*PERSONAS?', cuerpo, re.IGNORECASE)
personas = int(match_personas.group(1)) if match_personas else 1

# Buscar Monto depositado (Desde el primer comprobante procesado)
comprobante = correo.comprobantes.first()
if not comprobante or not comprobante.monto_extraido:
    print("Error: El correo no tiene un comprobante con monto extraído válido.")
    sys.exit()

monto_dep = comprobante.monto_extraido

print(f"Datos Extraídos -> Monto: ${monto_dep}, Empresa: {pct_empresa}%, Promotor: {pct_prom1}%, Personas: {personas}")

# Si ya existía una liquidación de prueba en este correo, la borramos para sobreescribir
if hasattr(correo, 'liquidacion'):
    correo.liquidacion.delete()

# 3. Mandamos los datos dinámicos a nuestra Calculadora Financiera
resultados = calcular_retorno(
    monto_depositado=monto_dep, 
    pct_comision_empresa=pct_empresa, 
    pct_comision_promotor_1=pct_prom1, 
    pct_comision_promotor_2=Decimal('0.00'), # Promotor 2 lo dejamos en 0 por ahora
    cantidad_personas=personas, 
    tarifa_bancaria_por_persona=Decimal('8.70'), # Tarifa fija por persona
    comision_traslado=Decimal('0.00') # Traslado en 0 por defecto
)

# 4. Guardamos la Liquidación en la Base de Datos conectada a este correo
Liquidacion.objects.create(
    correo=correo,
    monto_depositado=resultados['monto_depositado'],
    subtotal=resultados['subtotal'],
    suma_comisiones_pct=resultados['suma_comisiones_pct'],
    monto_retornado=resultados['monto_retornado'],
    comision_empresa_bruta=resultados['comision_empresa_bruta'],
    comision_promotor_1=resultados['comision_promotor_1'],
    comision_promotor_2=resultados['comision_promotor_2'],
    comision_bancaria=resultados['comision_bancaria'],
    comision_traslado=resultados['comision_traslado'],
    comision_vallux_neta=resultados['comision_vallux_neta'],
    utilidad_vallux=resultados['utilidad_vallux'],
    comision_pedro=resultados['comision_pedro']
)

print("¡Listo! Extracción dinámica, cálculo y guardado completado con éxito.")
