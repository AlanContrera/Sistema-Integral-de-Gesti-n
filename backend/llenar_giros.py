import os
import django

# Configuramos el entorno de Django para poder usar la base de datos
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')
django.setup()

from apps.reclutamiento.models import CategoriaPreguntas

def asignar_giros():
    categorias = CategoriaPreguntas.objects.all()
    actualizados = 0

    for cat in categorias:
        nombre = cat.nombre.lower()
        giro = "Servicios y Operaciones" # Giro por defecto
        
        if any(x in nombre for x in ['sistemas', 'desarrollador', 'programador', 'it', 'tecnología', 'software', 'soporte']):
            giro = "Tecnología de la Información (TI)"
        elif any(x in nombre for x in ['venta', 'comercial', 'asesor', 'ejecutivo de cuenta', 'kam']):
            giro = "Comercial / Ventas"
        elif any(x in nombre for x in ['ingeniero', 'producción', 'mantenimiento', 'calidad', 'planta', 'manufactura', 'automatización']):
            giro = "Industrial / Manufactura"
        elif any(x in nombre for x in ['contador', 'finanzas', 'financiero', 'nómina', 'auditor', 'crédito']):
            giro = "Contabilidad y Finanzas"
        elif any(x in nombre for x in ['rh', 'recursos humanos', 'reclutam', 'capacitación', 'talento']):
            giro = "Recursos Humanos"
        elif any(x in nombre for x in ['logística', 'almacén', 'chofer', 'compras', 'inventario', 'distribución']):
            giro = "Logística y Cadena de Suministro"
        elif any(x in nombre for x in ['marketing', 'diseño', 'mercadotecnia', 'publicidad', 'redes', 'comunicación']):
            giro = "Marketing y Publicidad"
        elif any(x in nombre for x in ['administración', 'auxiliar', 'asistente', 'recepción', 'secretaria', 'oficina']):
            giro = "Administrativo"
        elif any(x in nombre for x in ['salud', 'médico', 'enfermer', 'clínic', 'farmacia']):
            giro = "Salud y Medicina"
        elif any(x in nombre for x in ['construcción', 'arquitecto', 'obra', 'residente']):
            giro = "Construcción e Inmobiliaria"
        elif any(x in nombre for x in ['legal', 'abogado', 'jurídico']):
            giro = "Legal"
            
        cat.giro_industria = giro
        cat.save()
        actualizados += 1

    print(f"¡Éxito! Se actualizaron {actualizados} puestos con sus giros correspondientes.")

if __name__ == '__main__':
    asignar_giros()
