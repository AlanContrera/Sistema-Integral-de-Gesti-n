import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.correos.models import Comprobante
from apps.correos.ocr import procesar_archivo

try:
    c = Comprobante.objects.get(id=482)
    ruta_completa = os.path.join(django.conf.settings.MEDIA_ROOT, c.archivo.name)
    resultado = procesar_archivo(ruta_completa)
    
    print("=== RESULTADO OCR ===")
    print("Monto encontrado:", resultado.get('monto'))
    print("Banco encontrado:", resultado.get('banco'))
    
    # Actualizar BD
    if resultado.get('monto'):
        c.monto_extraido = resultado.get('monto')
        c.save()
        print("Monto actualizado en la base de datos.")
        
except Exception as e:
    print("Error:", e)
