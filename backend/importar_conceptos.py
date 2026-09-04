import os
from collections import Counter
from apps.cotizador.models import EmpresaEmisora, ConceptoEstrategia
import openpyxl

def run():
    print("Iniciando importación masiva desde Excel...")
    ruta = '/app/media/LISTADO_CONCEPTOS2026.xlsx'
    
    if not os.path.exists(ruta):
        print(f"Error: No se encontró el archivo en {ruta}")
        return

    # Cargar Excel
    wb = openpyxl.load_workbook(ruta)
    # Seleccionamos explícitamente la primera hoja donde están los datos reales (índice 0)
    ws = wb.worksheets[0] 
    rows = list(ws.iter_rows(values_only=True))
    
    # Limpiar los headers de espacios en blanco
    headers = [str(h).strip() if h else '' for h in rows[0]]
    
    idx_empresa = headers.index('EMPRESA')
    idx_cliente = headers.index('CLIENTE')
    idx_concepto = headers.index('CONCEPTO')
    
    # Agrupar conceptos exactos y contar frecuencias para no repetir texto a lo tonto
    conteo = Counter()
    
    print(f"Analizando {len(rows) - 1} filas...")
    for row in rows[1:]:
        empresa_nombre = str(row[idx_empresa]).strip() if row[idx_empresa] else ''
        cliente_nombre = str(row[idx_cliente]).strip() if row[idx_cliente] else ''
        concepto = str(row[idx_concepto]).strip() if row[idx_concepto] else ''
        
        if not empresa_nombre or not concepto or concepto == 'None':
            continue
            
        conteo[(empresa_nombre, cliente_nombre, concepto)] += 1

    print(f"Se agruparon en {len(conteo)} conceptos únicos (sumando frecuencias).")
    
    # Mapear nombres de empresas del Excel a la BD
    nombres_empresas_excel = set([k[0] for k in conteo.keys()])
    mapa_empresas = {}
    
    for nombre in nombres_empresas_excel:
        try:
            # Busca la empresa ignorando mayúsculas/minúsculas
            emp = EmpresaEmisora.objects.get(nombre_empresa__iexact=nombre)
            mapa_empresas[nombre] = emp
        except EmpresaEmisora.DoesNotExist:
            print(f"ADVERTENCIA: Empresa '{nombre}' no existe en tu BD. Se saltarán sus conceptos.")
        except EmpresaEmisora.MultipleObjectsReturned:
            print(f"ADVERTENCIA: Hay varias empresas llamadas '{nombre}'.")

    # Limpiar tabla vieja por si corremos el script 2 veces
    ConceptoEstrategia.objects.all().delete()
    print("Preparando inserción masiva en PostgreSQL/SQLite...")
    
    nuevos_objetos = []
    for (emp_nom, cli_nom, concepto), freq in conteo.items():
        if emp_nom in mapa_empresas:
            nuevos_objetos.append(
                ConceptoEstrategia(
                    empresa_emisora=mapa_empresas[emp_nom],
                    cliente_receptor=cli_nom,
                    clave_sat='80141600', # Clave comodín
                    descripcion=concepto,
                    frecuencia=freq,
                    origen='Excel Import'
                )
            )
            
    # Insertar todo usando bulk_create
    ConceptoEstrategia.objects.bulk_create(nuevos_objetos)
    print(f"¡Éxito total! Se guardaron {len(nuevos_objetos)} conceptos en el catálogo de IA.")


run()
