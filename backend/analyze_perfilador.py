import pandas as pd
import json

file_path = '/home/sistemas/Proyectos/App_Facturacion/backend/media/IACI INGENIERO DE IMPLEMENTACION Y PROYECTO RECLUTAMIENTO BUENO edITABLE.xlsx'
df = pd.read_excel(file_path, sheet_name='Perfilador', header=None)

# Mostramos las primeras filas y su contenido
result = []
for index, row in df.iterrows():
    row_data = []
    for col_index, val in enumerate(row):
        if pd.notna(val):
            row_data.append(f"Col {col_index}: {val}")
    if row_data:
        result.append(f"Row {index}: " + " | ".join(row_data))

print("\n".join(result[:100]))  # print first 100 non-empty rows
