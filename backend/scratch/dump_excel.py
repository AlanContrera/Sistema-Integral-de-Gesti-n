import pandas as pd
df = pd.read_excel('/home/sistemas/Proyectos/App_Facturacion/Formatos/ARTYSIS SA DE CV- GRUPO OPERATIVO Y ADMINISTRATIVO BERZAN 100726.xls', sheet_name='4.0')
print('=== SEARCHING FOR ARTYSIS SA DE CV ===')
for r_idx, row in df.iterrows():
    for c_idx, val in enumerate(row):
        if isinstance(val, str) and 'ARTYSIS' in val:
            print(f'Found in Row {r_idx}, Col {c_idx}: {val}')
