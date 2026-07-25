import pandas as pd
excel_path = '/home/sistemas/Proyectos/App_Facturacion/backend/media/IACI INGENIERO DE IMPLEMENTACION Y PROYECTO RECLUTAMIENTO BUENO edITABLE.xlsx'
df = pd.read_excel(excel_path, sheet_name='Perfilador')
print('PERFILADOR:')
for i in range(15):
    row_vals = df.iloc[i, :10].values.tolist()
    row_vals = [str(x) if not pd.isna(x) else '' for x in row_vals]
    print(f'Row {i}: {row_vals}')

df_cand = pd.read_excel(excel_path, sheet_name='Candidato 01')
print('\nCANDIDATO 01:')
for i in range(10):
    row_vals = df_cand.iloc[i, :5].values.tolist()
    row_vals = [str(x) if not pd.isna(x) else '' for x in row_vals]
    print(f'Row {i}: {row_vals}')
