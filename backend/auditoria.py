from apps.cotizador.models import Cliente

def auditar():
    clientes = Cliente.objects.all()
    deficientes = []
    
    for c in clientes:
        alertas = []
        if not c.rfc or len(c.rfc) < 12: alertas.append('RFC Inválido o Faltante')
        if not c.codigo_postal: alertas.append('Falta CP')
        if not c.regimen_fiscal: alertas.append('Falta Régimen Fiscal')
        if not c.correo: alertas.append('Falta Correo Electrónico')
        if not c.calle_numero: alertas.append('Falta Domicilio')
        
        if alertas:
            nombre = c.razon_social if c.razon_social else c.empresa
            deficientes.append({'nombre': nombre, 'alertas': ', '.join(alertas)})

    print('INICIO_REPORTE')
    if not deficientes:
        print('✅ Todos los clientes tienen su información fiscal y de contacto completa.')
    else:
        print('⚠️ Se encontraron {} clientes con información faltante:\n'.format(len(deficientes)))
        for d in deficientes:
            print('- **{}**: {}'.format(d['nombre'], d['alertas']))
    print('FIN_REPORTE')

if __name__ == '__main__':
    auditar()
