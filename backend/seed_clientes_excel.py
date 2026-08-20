import os
import django
import pandas as pd

# Configurar Django para usar scripts externos
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.cotizador.models import Cliente

def cargar_clientes(ruta_excel):
    if not os.path.exists(ruta_excel):
        print(f"❌ No se encontró el archivo en: {ruta_excel}")
        return

    clientes_a_crear = []
    
    # Abrimos Excel SIN encabezados (header=None) porque tu primera fila ya tiene datos
    print("⏳ Leyendo archivo Excel...")
    df = pd.read_excel(ruta_excel, header=None)
    
    # Llenar espacios vacíos (NaN) con texto vacío
    df = df.fillna('')
    
    for indice, fila in df.iterrows():
        # Columna 0: Empresa, Columna 1: Correo Principal, Columna 2: CC
        empresa = str(fila[0]).strip() if len(fila) > 0 else ''
        correo = str(fila[1]).strip() if len(fila) > 1 else ''
        correos_cc = str(fila[2]).strip() if len(fila) > 2 else ''
        
        if empresa and correo:
            clientes_a_crear.append(
                Cliente(
                    empresa=empresa,
                    correo=correo,
                    correos_cc=correos_cc if correos_cc else None
                )
            )

    if clientes_a_crear:
        print(f"⏳ Guardando {len(clientes_a_crear)} clientes en la base de datos...")
        Cliente.objects.bulk_create(clientes_a_crear, ignore_conflicts=True)
        print("✅ ¡Carga masiva completada con éxito!")
    else:
        print("⚠️ No se encontró información válida.")

if __name__ == '__main__':
    # Ruta apuntando a la carpeta media
    ruta = os.path.join('media', 'clientes.xlsx') 
    cargar_clientes(ruta)
