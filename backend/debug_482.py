import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.correos.models import Comprobante

try:
    c = Comprobante.objects.get(id=482)
    print("=== TEXTO BRUTO ===")
    print(c.texto_bruto)
    print("=== FIN TEXTO ===")
    print(f"Monto extraído: {c.monto_extraido}")
except Exception as e:
    print("Error:", e)
