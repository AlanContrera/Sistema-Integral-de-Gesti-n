import os
import django

# Cargar el entorno de Django para poder usar los modelos
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.cotizador.models import EmpresaEmisora

empresas_data = [
    ("nimsa", "compras.mx@comercionimsa.mx"),
    ("FACSAM", "compras.mx@facsam.com.mx"),
    ("POLINES", "compras.mx@aceroselalamo.mx"),
    ("SISUC", "compras.mx@plataformassisuc.mx"),
    ("GOVIDA", "compras.mx@govida.com.mx"),
    ("TABEL", "compras.mx@insumosmedicostabel.com"),
    ("CALAFELL", "compras.mx@comercializadoracalafell.mx"),
    ("RAWAN", "compras.mx@rawan.mx"),
    ("CUENCA", "compras.mx@cuencaadministracion.mx"),
    ("VEDRAS", "compras.mx@torresvedras.com.mx"),
    ("AMELIT", "compras.mx@amelitservices.com.mx"),
    ("levictus", "compras.mx@levictus.com.mx"),
    ("crisac", "compras.mx@crisac.mx"),
    ("vimex", "compras.mx@publicidadvimex.mx"),
    ("AGRAMON", "compras.mx@insumosagramon.mx"),
    ("INNSUMOS ORG", "compras.mx@organicosdelnorte.com.mx"),
    ("PLAFOREY", "compras.mx@plaforey.com"),
    ("FICSAR", "compras.mx@ficsar.com.mx"),
    ("TERIGEN", "compras.mx@terigen.com.mx"),
    ("LIMGRATSA", "compras.mx@limgratsa.mx"),
    ("global", "compras.mx@globalearth.mx"),
    ("lexic", "compras.mx@lexic.mx"),
    ("issaz", "compras.mx@centralissaz.mx"),
]

password_global = "Enero2026*"

print("Iniciando registro de Empresas Emisoras...")

for nombre, correo in empresas_data:
    # Extraemos el dominio automáticamente (ej. 'comercionimsa.mx')
    dominio = correo.split('@')[1]
    
    # Asumimos que el host es mail.dominio.com como en cPanel
    host_smtp = f"mail.{dominio}"
    
    # update_or_create evita duplicados por si corres el script 2 veces
    obj, created = EmpresaEmisora.objects.update_or_create(
        correo_remitente=correo,
        defaults={
            'nombre_empresa': nombre.upper(),
            'password': password_global,
            'host_smtp': host_smtp,
            'puerto_smtp': 465,
            'usar_tls': False,
            'usar_ssl': True,
        }
    )
    if created:
        print(f"✅ Agregada: {nombre.upper()} ({correo})")
    else:
        print(f"🔄 Actualizada: {nombre.upper()} ({correo})")

print("\n¡Todas las empresas fueron registradas con éxito en la base de datos!")
