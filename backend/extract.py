import csv
from apps.cotizador.models import Cliente

with open('clientes_rfc.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['ID', 'Empresa/Nombre', 'RFC', 'Razon Social'])
    for c in Cliente.objects.all():
        writer.writerow([c.id, c.empresa, c.rfc, c.razon_social])
print('Data extracted to clientes_rfc.csv')
