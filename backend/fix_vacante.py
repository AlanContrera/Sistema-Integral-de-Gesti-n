import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.reclutamiento.models import Vacante, CategoriaPreguntas
try:
    cat = CategoriaPreguntas.objects.first()
    if cat:
        v = Vacante.objects.get(id=1)
        v.categoria_puesto = cat
        v.save()
        print('Categoria asignada a la vacante 1:', cat.nombre)
except Exception as e:
    print('Error:', e)
