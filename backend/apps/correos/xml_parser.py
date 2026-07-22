import xml.etree.ElementTree as ET
from datetime import datetime


# El SAT tiene dos versiones del estándar CFDI en uso
NAMESPACES_CFDI = [
    'http://www.sat.gob.mx/cfd/4',   # CFDI 4.0 (actual)
    'http://www.sat.gob.mx/cfd/3',   # CFDI 3.3 (todavía en circulación)
]


def _encontrar_namespace(root):
    for ns in NAMESPACES_CFDI:
        if ns in root.tag:
            return ns
    return None


def parsear_cfdi(ruta):
    try:
        tree = ET.parse(ruta)
        root = tree.getroot()

        ns = _encontrar_namespace(root)
        if not ns:
            return None

        prefijo = f'{{{ns}}}'

         # Datos del comprobante raíz
        serie = root.get('Serie', '')
        folio = root.get('Folio', '')
        fecha_str = root.get('Fecha', '')
        total_str = root.get('Total', '')
        moneda = root.get('Moneda', '')
        metodo_pago = root.get('MetodoPago', '') # <-- LÍNEA NUEVA


        # Parsear fecha
        fecha = None
        if fecha_str:
            try:
                fecha = datetime.strptime(fecha_str, '%Y-%m-%dT%H:%M:%S')
            except ValueError:
                pass

        # Parsear total
        total = None
        
        # Si es un Complemento de Pago (TipoDeComprobante="P"), el Total viene en 0.
        # Debemos buscar el nodo de Pago para extraer el Monto real.
        tipo_comprobante = root.get('TipoDeComprobante', '')
        if tipo_comprobante == 'P' or float(total_str or 0) == 0:
            for elem in root.iter():
                if elem.tag.endswith('Pago'):
                    monto_pago = elem.get('Monto')
                    if monto_pago:
                        total_str = monto_pago
                        break

        if total_str:
            try:
                total = float(total_str)
            except ValueError:
                pass

        # Nodo Emisor
        emisor = root.find(f'{prefijo}Emisor')
        emisor_nombre = emisor.get('Nombre', '') if emisor is not None else ''
        emisor_rfc = emisor.get('Rfc', '') if emisor is not None else ''

        # Nodo Receptor
        receptor = root.find(f'{prefijo}Receptor')
        receptor_nombre = receptor.get('Nombre', '') if receptor is not None else ''
        receptor_rfc = receptor.get('Rfc', '') if receptor is not None else ''

        return {
            'serie': serie,
            'folio': folio,
            'fecha': fecha,
            'total': total,
            'moneda': moneda,
            'metodo_pago': metodo_pago, # <-- LÍNEA NUEVA
            'emisor_nombre': emisor_nombre,
            'emisor_rfc': emisor_rfc,
            'receptor_nombre': receptor_nombre,
            'receptor_rfc': receptor_rfc,
        }


    except ET.ParseError:
        return None
