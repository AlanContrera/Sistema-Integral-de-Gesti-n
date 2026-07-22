from apps.correos.models import CorreoProcesado, Comprobante, Factura
import shutil
import os
from django.conf import settings

print("Borrando registros de la base de datos...")
CorreoProcesado.objects.all().delete()
Comprobante.objects.all().delete()
Factura.objects.all().delete()

print("Limpiando archivos descargados en la carpeta media...")
for carpeta in ['comprobantes', 'facturas', 'facturas_pdf']:
    ruta = os.path.join(settings.MEDIA_ROOT, carpeta)
    if os.path.exists(ruta):
        shutil.rmtree(ruta)
        os.makedirs(ruta)

print("¡Base de datos y archivos multimedia limpios al 100%!")
