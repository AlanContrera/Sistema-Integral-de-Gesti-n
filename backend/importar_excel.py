import os
import sys
import django
import pandas as pd
from decimal import Decimal

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')
django.setup()

from apps.reclutamiento.models import Vacante, Candidato

def importar_vacante_y_candidatos(ruta_excel):
    print(f"Leyendo archivo Excel: {ruta_excel}...")
    
    try:
        # 1. Leer la hoja 'Perfilador'
        df_perfilador = pd.read_excel(ruta_excel, sheet_name='Perfilador')
        
        # Intentar extraer el Cliente y Puesto (ajustado por posibles celdas combinadas)
        cliente_val = str(df_perfilador.iloc[3, 1]).strip()
        if not cliente_val or cliente_val == 'nan':
            cliente_val = "IACI (Importado)"
            
        puesto_val = str(df_perfilador.iloc[9, 1]).strip()
        if not puesto_val or puesto_val == 'nan':
            puesto_val = "Ingeniero de Implementación"
            
        sueldo_val = str(df_perfilador.iloc[13, 1]).strip()
        sueldo_final = Decimal('25000.00')
        if sueldo_val and sueldo_val != 'nan' and sueldo_val.replace('.','').isdigit():
            sueldo_final = Decimal(sueldo_val)

        print("\n--- Creando Vacante ---")
        vacante, creada = Vacante.objects.get_or_create(
            cliente=cliente_val,
            nombre_puesto=puesto_val,
            defaults={
                'sueldo_ofertado': sueldo_final,
                'modalidad': 'presencial',
                'experiencia_minima': 3,
                'escolaridad_requerida': 'Ingeniería'
            }
        )
        if creada:
            print(f"✅ Vacante creada: {vacante.nombre_puesto} - {vacante.cliente}")
        else:
            print(f"⚠️ La vacante ya existía: {vacante.nombre_puesto}")


        print("\n--- Leyendo Candidatos ---")
        # Leer todas las hojas y filtrar las de candidatos
        hojas = pd.ExcelFile(ruta_excel).sheet_names
        hojas_candidatos = [h for h in hojas if 'Candidato' in h]
        
        for hoja in hojas_candidatos:
            df_cand = pd.read_excel(ruta_excel, sheet_name=hoja)
            
            # El nombre está en la fila 3 (índice 3), columna B (índice 1)
            nombre_candidato = str(df_cand.iloc[3, 1]).strip()
            if not nombre_candidato or nombre_candidato == 'nan':
                nombre_candidato = f"Candidato Anónimo ({hoja})"
                
            correo_candidato = f"{nombre_candidato.replace(' ', '').lower()}@ejemplo.com"
            
            # Solo importamos si tiene un nombre real o no está vacío el template
            if nombre_candidato == '0' or nombre_candidato == '0.0':
                continue # Evitar crear candidatos vacíos del template
                
            candidato, cand_creado = Candidato.objects.get_or_create(
                vacante=vacante,
                correo=correo_candidato,
                defaults={
                    'nombre_completo': nombre_candidato,
                    'telefono': '5550000000',
                    'zona_ubicacion': 'Ubicación importada',
                    'estatus': 'nuevo'
                }
            )
            
            if cand_creado:
                print(f"✅ Candidato creado: {candidato.nombre_completo}")
            else:
                print(f"⚠️ El candidato ya existía: {candidato.nombre_completo}")

        print("\n🎉 ¡Importación Finalizada! Revisa tu sistema web.")

    except Exception as e:
        print(f"❌ Error al importar: {e}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='Importar Vacante y Candidatos desde Excel')
    parser.add_argument('archivo', help='Ruta al archivo Excel (.xlsx)')
    args = parser.parse_args()
    
    importar_vacante_y_candidatos(args.archivo)
