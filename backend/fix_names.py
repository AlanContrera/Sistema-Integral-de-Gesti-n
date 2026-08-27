import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')
django.setup()

from apps.cotizador.models import Cliente

corrections = {
    'CONSTRUCCIONES Y REMODELACION JRC': 'CONSTRUCCIONES Y REMODELACIONES JRC',
    'DESARROLLADORA DE CONFORT Y TECNOLOGIA': 'DESARROLLADORA CONFORT Y TECNOLOGIA',
    'PROMO EVOLUCIÓN': 'PROMO EVOLUCION',
    'TESLUM': 'TESLUM SOLAR ENERGY',
    'LARMO. MANTENIMIENTO, FABRICACION E INOXIDABLES': 'LARMO MANTENIMIENTO, FABRICACION E INOXIDABLES',
    'R.L. CONSTRUCCONES Y DECORACIONES': 'R.L. CONSTRUCCIONES Y DECORACIONES',
    'SYNFIRE EXINTORES': 'SYNFIRE EXTINTORES',
    'COMPACTOR SYSTEMS': 'COMPACTOR FACTORY'
}

for old_name, new_name in corrections.items():
    cliente = Cliente.objects.filter(empresa=old_name).first()
    if cliente:
        cliente.empresa = new_name
        cliente.save()
        print(f"Corregido: '{old_name}' -> '{new_name}'")
    else:
        print(f"No encontrado para corregir: '{old_name}'")

# Fix ISI BUCEO
isi = Cliente.objects.filter(empresa__icontains='ISI BUCEO').first()
if isi:
    isi.empresa = 'ISI BUCEO INDUSTRIAL MEXICO'
    isi.save()
    print("Corregido: ISI BUCEO")

