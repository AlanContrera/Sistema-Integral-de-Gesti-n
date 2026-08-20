import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.cotizador.models import EmpresaEmisora

textos_data = [
    {"empresa": "AVIDUX", "asunto": "Su cotización está lista", "cuerpo": "Buenas tardes, espero que se encuentren muy bien. Le comparto la cotización que solicitó, elaborada con base en los requerimientos que nos compartió. Quedamos atentos a sus comentarios y con mucho gusto ajustamos lo que sea necesario para que se ajuste por completo a lo que buscan."},
    {"empresa": "373 COMERCIO", "asunto": "Cotización solicitada", "cuerpo": "¡Buenas tardes! Espero tengan una excelente semana. Les adjunto la cotización correspondiente a su solicitud, con el detalle de cada concepto para que puedan revisarlo con calma. Cualquier duda que surja, con todo gusto la resolvemos y les damos el seguimiento que necesiten."},
    {"empresa": "MELLAFE", "asunto": "Propuesta de cotización adjunta", "cuerpo": "Estimados, buen día. Ha sido un gusto platicar con ustedes y conocer más sobre su proyecto. Les hago llegar la cotización acordada, esperando que cumpla con lo que tenían en mente. Quedamos al pendiente de su confirmación para continuar con el proceso en cuanto gusten."},
    {"empresa": "SISUC", "asunto": "Cotización lista para su revisión", "cuerpo": "Buenas tardes, ¡qué gusto saludarles! Comparto con ustedes la cotización solicitada, ya lista para su revisión. Estamos a sus órdenes para resolver cualquier duda que les surja antes de tomar una decisión."},
    {"empresa": "AGRAMON", "asunto": "Envío de cotización", "cuerpo": "Buen día, espero se encuentren muy bien. Adjunto la cotización solicitada, preparada con el mayor cuidado para cubrir sus necesidades. Quedo pendiente de su retroalimentación y con gusto quedo a sus órdenes para cualquier ajuste."},
    {"empresa": "AMELIT", "asunto": "Le compartimos su cotización", "cuerpo": "Buenas tardes, gracias por darnos la oportunidad de cotizarles. Les comparto la propuesta correspondiente, con el detalle completo de lo conversado. Cualquier ajuste o aclaración que necesiten, no duden en escribirme, estoy para apoyarles."},
    {"empresa": "BERGUN", "asunto": "Cotización adjunta", "cuerpo": "Estimados, buen día. Fue un gusto atenderles y conocer más sobre lo que están buscando. Adjunto la cotización correspondiente, esperando que sea de su agrado; quedo atenta a sus indicaciones para continuar."},
    {"empresa": "BERZAN", "asunto": "Cotización solicitada", "cuerpo": "Buenas tardes, espero que todo marche muy bien por allá. Le comparto la cotización que platicamos, con cada punto detallado. Estaré al pendiente para dar seguimiento en cuanto gusten y resolver cualquier duda que tengan."},
    {"empresa": "CALAFELL", "asunto": "Su cotización", "cuerpo": "Buen día, ¡un gusto saludarles! Adjunto la cotización solicitada, elaborada conforme a lo que platicamos. Quedo atenta a cualquier comentario al respecto, y con mucho gusto ajustamos lo que haga falta."},
    {"empresa": "CRISAC", "asunto": "Cotización lista", "cuerpo": "Buenas tardes, espero se encuentren muy bien. Les hago llegar la cotización correspondiente, lista para su revisión. Con gusto atiendo cualquier duda que tengan y quedo pendiente de sus comentarios para avanzar."},
    {"empresa": "CUENCA", "asunto": "Propuesta cotización", "cuerpo": "Buen día, fue un placer conversar con ustedes. Comparto la cotización solicitada, con el detalle de cada servicio incluido. Quedo pendiente de sus comentarios y a sus órdenes para lo que necesiten."},
    {"empresa": "DERSA", "asunto": "Cotización", "cuerpo": "Buenas tardes, espero que su día vaya muy bien. Adjunto la cotización correspondiente, elaborada con base en lo platicado. Quedo atenta para cualquier aclaración y con gusto damos seguimiento cuando gusten."},
    {"empresa": "EXPRESATEL", "asunto": "Su cotización ya está lista", "cuerpo": "Buen día, ¡qué gusto saludarles! Les comparto la cotización solicitada, ya lista para su revisión. Estoy al pendiente de su respuesta para continuar y resolver cualquier duda que les surja."},
    {"empresa": "FICSAR", "asunto": "Envío de propuesta", "cuerpo": "Buenas tardes, espero se encuentren muy bien. Adjunto la cotización correspondiente, con cada concepto detallado para su fácil revisión. Cualquier duda o ajuste que necesiten, quedo a sus órdenes con mucho gusto."},
    {"empresa": "GBR", "asunto": "Cotización solicitada", "cuerpo": "Buen día, gracias por su tiempo y por confiar en nosotros. Comparto la cotización correspondiente, esperando que cubra lo que necesitan. Quedo atenta a sus comentarios para afinar cualquier detalle."},
    {"empresa": "global", "asunto": "Su propuesta económica", "cuerpo": "Buenas tardes, ¡espero se encuentren de maravilla! Les hago llegar la cotización solicitada, preparada con mucho gusto para su proyecto. Con gusto resolvemos cualquier duda que tengan antes de continuar."},
    {"empresa": "GOVIDA", "asunto": "Cotización adjunta", "cuerpo": "Buen día, fue un gusto platicar con ustedes. Adjunto la cotización solicitada, con el detalle completo de lo acordado. Quedo pendiente de su confirmación para seguir con el proceso en cuanto gusten."},
    {"empresa": "KALE", "asunto": "Propuesta económica", "cuerpo": "Buenas tardes, espero que todo vaya muy bien por su parte. Comparto la cotización correspondiente, elaborada conforme a los detalles de su proyecto. Estoy atenta a sus comentarios o ajustes que necesiten."},
    {"empresa": "levictus", "asunto": "Su cotización está lista", "cuerpo": "Buen día, ¡un gusto saludarles nuevamente! Les hago llegar la cotización solicitada, ya lista para su revisión. Quedo al pendiente para cualquier aclaración necesaria y darles el mejor seguimiento."},
    {"empresa": "lexic", "asunto": "Cotización solicitada", "cuerpo": "Buenas tardes, espero se encuentren muy bien. Adjunto la cotización correspondiente, con cada punto detallado para facilitar su revisión. Con gusto atendemos cualquier duda al respecto, estamos a sus órdenes."},
    {"empresa": "LIMGRATSA", "asunto": "Propuesta adjunta", "cuerpo": "Buen día, gracias por la confianza depositada en nosotros. Comparto la cotización solicitada, esperando que sea justo lo que estaban buscando. Quedo atenta a su respuesta para continuar con el proceso."},
    {"empresa": "LITERSA", "asunto": "Su cotización", "cuerpo": "Buenas tardes, espero que tengan un excelente día. Les hago llegar la cotización correspondiente, lista para su revisión. Estoy a sus órdenes para cualquier ajuste o duda que les surja."},
    {"empresa": "LOTSA", "asunto": "Cotización lista", "cuerpo": "Buen día, fue un gusto atenderles. Adjunto la cotización correspondiente, con el detalle de cada servicio incluido. Quedo pendiente de sus comentarios y con gusto ajustamos lo que necesiten."},
    {"empresa": "PLAFOREY", "asunto": "Le compartimos su cotización", "cuerpo": "Buenas tardes, espero se encuentren muy bien. Comparto la cotización solicitada, preparada con base en lo que platicamos. Cualquier duda que tengan, con gusto la resolvemos lo antes posible."},
    {"empresa": "RAWAN", "asunto": "Propuesta económica adjunta", "cuerpo": "Buen día, ¡qué gusto saludarles! Les hago llegar la cotización solicitada, lista para su revisión con todo el detalle. Quedo atenta a su confirmación para continuar con el proceso."},
    {"empresa": "TABEL", "asunto": "Cotización", "cuerpo": "Buenas tardes, espero que todo marche muy bien. Adjunto la cotización correspondiente, elaborada con base en lo solicitado. Estoy al pendiente de cualquier aclaración que necesiten antes de avanzar."},
    {"empresa": "TERIGEN", "asunto": "Su cotización está lista", "cuerpo": "Buen día, gracias por su paciencia mientras la preparábamos. Comparto la cotización correspondiente, lista para su revisión. Quedo a sus órdenes para dar seguimiento en cuanto gusten."},
    {"empresa": "VEDRAS", "asunto": "Propuesta económica", "cuerpo": "Buenas tardes, espero se encuentren muy bien. Les hago llegar la cotización correspondiente, con cada concepto detallado para su revisión. Quedo pendiente de sus comentarios para continuar con el proceso."},
    {"empresa": "vimex", "asunto": "Cotización adjunta", "cuerpo": "Buen día, fue un gusto conocer más sobre su proyecto. Adjunto la cotización solicitada, esperando que cumpla con lo que tenían en mente. Con gusto atiendo cualquier duda que surja, quedo a sus órdenes."},
    {"empresa": "FACSAM", "asunto": "FACSAM – Cotización lista para su revisión", "cuerpo": "Buenas tardes, espero que se encuentren muy bien. Les comparto la cotización solicitada, elaborada con base en lo que platicamos. Quedo atenta a sus comentarios y con gusto resolvemos cualquier duda antes de continuar con el proceso."}
]

print("Iniciando carga de plantillas dinámicas...")

for data in textos_data:
    # Usamos filter y name icontains para encontrar a la empresa aunque el nombre esté un poco diferente
    qs = EmpresaEmisora.objects.filter(nombre_empresa__icontains=data['empresa'])
    
    if qs.exists():
        obj = qs.first()
    else:
        obj = EmpresaEmisora.objects.create(
            nombre_empresa=data['empresa'],
            correo_remitente='',
            password='',
            host_smtp='mail.midominio.com'
        )
        print(f"🌟 Nueva empresa creada automáticamente: {data['empresa']}")
    
    obj.asunto_cotizacion = data['asunto']
    obj.cuerpo_cotizacion = data['cuerpo']
    obj.save()
    print(f"✅ Textos actualizados para: {obj.nombre_empresa}")

print("\n¡Todas las plantillas fueron inyectadas con éxito!")
