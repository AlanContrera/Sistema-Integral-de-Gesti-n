import os
import sys
import django

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
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
