import os
import django
import pandas as pd

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')
django.setup()

from apps.cotizador.models import Cliente, EmpresaEmisora

def check():
    # 1. Obtener la lista de ignorados
    file_path1 = 'media/CLIENTES X EMPRESAS.xlsx'
    df1 = pd.read_excel(file_path1)
    df1['CLIENTE '] = df1['CLIENTE '].ffill()
    
    ignorados = set()
    for index, row in df1.iterrows():
        cliente_nombre = str(row['CLIENTE ']).strip()
        if pd.isna(cliente_nombre) or cliente_nombre == 'nan':
            continue
        clientes = Cliente.objects.filter(empresa__icontains=cliente_nombre)
        if not clientes.exists():
            ignorados.add(cliente_nombre)
            
    # 2. Revisar el nuevo Excel
    file_path2 = 'media/DATOS_DE_CLIENTES_FACTURA.xlsx'
    if not os.path.exists(file_path2):
        print("El archivo DATOS_DE_CLIENTES_FACTURA.xlsx no existe.")
        return
        
    df2 = pd.read_excel(file_path2)
    # Asumimos que la columna puede llamarse 'RAZON SOCIAL', 'CLIENTE', 'EMPRESA', o buscar en todo el DF
    # Para ser mas seguros, buscamos en todas las celdas de tipo texto
    text_data = df2.astype(str).apply(lambda x: x.str.upper())
    
    encontrados_en_nuevo = []
    
    for ignorado in ignorados:
        ig_upper = ignorado.upper()
        # Buscar si algun valor del dataframe contiene el nombre ignorado
        mask = text_data.apply(lambda col: col.str.contains(ig_upper, regex=False, na=False))
        if mask.any().any():
            encontrados_en_nuevo.append(ignorado)
            
    print(f"De {len(ignorados)} ignorados, encontramos {len(encontrados_en_nuevo)} en el nuevo Excel:")
    for enc in sorted(encontrados_en_nuevo):
        print(f" - {enc}")

if __name__ == '__main__':
    check()
