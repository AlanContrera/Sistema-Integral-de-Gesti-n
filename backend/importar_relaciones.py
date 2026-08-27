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

    print("Cargando Excel...")
    df = pd.read_excel(file_path)
    
    # Rellenar (forward-fill) para asociar a los clientes en las celdas vacías
    df['CLIENTE '] = df['CLIENTE '].ffill()
    
    # Cargamos todas las empresas de la BD a memoria para la búsqueda flexible
    todas_empresas = list(EmpresaEmisora.objects.all())
    
    for index, row in df.iterrows():
        cliente_nombre = str(row['CLIENTE ']).strip()
        empresa_nombre = str(row['EMPRESA ']).strip().upper()
        
        if pd.isna(cliente_nombre) or cliente_nombre == 'nan':
            continue
            
        clientes = Cliente.objects.filter(empresa__icontains=cliente_nombre)
        if not clientes.exists():
            print(f"[IGNORADO] Cliente no registrado en DB: '{cliente_nombre}'")
            continue
        
        cliente = clientes.first()
        
        # Búsqueda Flexible: Verificamos si el nombre corto de la DB está dentro del nombre del Excel
        empresa_matched = None
        for e in todas_empresas:
            # Ejemplo: Si "VIMEX" está en "PUBLICIDAD EFECTIVA VIMEX"
            if e.nombre_empresa.upper() in empresa_nombre:
                empresa_matched = e
                break
                
        if not empresa_matched:
            print(f"[IGNORADO] Empresa Emisora no registrada en DB: '{empresa_nombre}' (Cliente: {cliente_nombre})")
            continue
            
        # Si encuentra coincidencia, vincula
        cliente.empresas_emisoras.add(empresa_matched)
        print(f"[VINCULADO ÉXITO] {cliente.empresa} <-> {empresa_matched.nombre_empresa}")

    print("\nProceso completado exitosamente.")

if __name__ == '__main__':
    importar()
