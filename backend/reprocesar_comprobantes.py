from django.db.models import Q
from apps.correos.models import Comprobante
from apps.correos.tasks import procesar_comprobante

# Buscar los comprobantes que no tienen fecha extraida o tienen cuenta de origen vacía
incompletos = Comprobante.objects.filter(
    Q(fecha_extraida__isnull=True) | Q(cuenta_origen='') | Q(cuenta_destino='')
)

total = incompletos.count()
print(f"Comprobantes a reprocesar: {total}")

for c in incompletos:
    print(f"  Re-encolando ID {c.id}")
    procesar_comprobante.delay(c.id)

print(f"Listo. {total} comprobantes enviados a la cola de Celery.")
