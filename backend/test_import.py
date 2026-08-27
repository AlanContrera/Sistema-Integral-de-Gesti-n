import os
import django
import pandas as pd

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')
django.setup()

from apps.cotizador.models import Cliente, EmpresaEmisora

def importar():
    file_path = 'media/CLIENTES X EMPRESAS.xlsx'
    if not os.path.exists(file_path):
        print(f"No se encontró el archivo: {file_path}")
        return

    df = pd.read_excel(file_path)
    df['CLIENTE '] = df['CLIENTE '].ffill()
    
    todas_empresas = list(EmpresaEmisora.objects.all())
    vinculados = 0

    for index, row in df.iterrows():
        cliente_nombre = str(row['CLIENTE ']).strip()
        empresa_nombre = str(row['EMPRESA ']).strip().upper()
        
        if pd.isna(cliente_nombre) or cliente_nombre == 'nan':
            continue
            
        clientes = Cliente.objects.filter(empresa__icontains=cliente_nombre)
        if not clientes.exists():
            continue
        
        cliente = clientes.first()
        
        empresa_matched = None
        for e in todas_empresas:
            if e.nombre_empresa.upper() in empresa_nombre:
                empresa_matched = e
                break
                
        if empresa_matched:
            cliente.empresas_emisoras.add(empresa_matched)
            vinculados += 1

    print(f"¡Vinculados {vinculados} registros con la nueva logica!")

if __name__ == '__main__':
    importar()
