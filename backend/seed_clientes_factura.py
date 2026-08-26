import os
import django
import pandas as pd

# Configurar el entorno de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.cotizador.models import Cliente

def cargar_clientes():
    ruta_excel = os.path.join(os.path.dirname(__file__), 'media', 'DATOS_DE_CLIENTES_FACTURA.xlsx')
    if not os.path.exists(ruta_excel):
        print(f"No se encontro el archivo en: {ruta_excel}")
        return

    df = pd.read_excel(ruta_excel)
    print(f"Registros encontrados en el Excel: {len(df)}")

    creados = 0
    actualizados = 0

    for _, fila in df.iterrows():
        rfc = str(fila.get('RFC RECEPTOR', '')).strip()
        razon_social = str(fila.get('RAZON SOCIAL RECEPTOR', '')).strip()
        calle_numero = str(fila.get('CALLE Y NUMERO', '')).strip() if pd.notna(fila.get('CALLE Y NUMERO')) else ''
        colonia = str(fila.get('COLONIA', '')).strip() if pd.notna(fila.get('COLONIA')) else ''
        ciudad = str(fila.get('CIUDAD', '')).strip() if pd.notna(fila.get('CIUDAD')) else ''
        estado = str(fila.get('ESTADO', '')).strip() if pd.notna(fila.get('ESTADO')) else ''
        cp = str(fila.get('CODIGO POSTAL', '')).strip() if pd.notna(fila.get('CODIGO POSTAL')) else ''
        
        # Limpiar decimales en código postal si vino como float
        if cp.endswith('.0'):
            cp = cp[:-2]

        regimen = str(fila.get('Régimen fiscal en el que tribute el receptor', '601 - Régimen General de Ley Personas Morales')).strip()
        uso_cfdi = str(fila.get('USO CFDI', 'G03 - GASTOS EN GENERAL')).strip()

        if not razon_social or razon_social == 'nan':
            continue

        # Buscar si ya existe un cliente con esta razón social o RFC
        cliente = Cliente.objects.filter(empresa__iexact=razon_social).first()
        if not cliente and rfc and rfc != 'nan':
            cliente = Cliente.objects.filter(rfc__iexact=rfc).first()

        if cliente:
            cliente.rfc = rfc if rfc != 'nan' else cliente.rfc
            cliente.razon_social = razon_social
            cliente.calle_numero = calle_numero
            cliente.colonia = colonia
            cliente.ciudad = ciudad
            cliente.estado = estado
            cliente.codigo_postal = cp
            cliente.regimen_fiscal = regimen
            cliente.uso_cfdi_preferido = uso_cfdi
            cliente.save()
            actualizados += 1
        else:
            Cliente.objects.create(
                empresa=razon_social,
                razon_social=razon_social,
                rfc=rfc if rfc != 'nan' else '',
                calle_numero=calle_numero,
                colonia=colonia,
                ciudad=ciudad,
                estado=estado,
                codigo_postal=cp,
                regimen_fiscal=regimen,
                uso_cfdi_preferido=uso_cfdi,
                correo=f"contacto@{razon_social.lower().replace(' ', '').replace('.', '')[:12]}.com",
                correos_cc=''
            )
            creados += 1

    print(f"Carga completada con exito: {creados} clientes nuevos creados, {actualizados} clientes existentes enriquecidos.")

if __name__ == '__main__':
    cargar_clientes()
