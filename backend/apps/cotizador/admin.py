from django.contrib import admin
from .models import EmpresaEmisora, Cliente, OperacionFacturacion


@admin.register(EmpresaEmisora)
class EmpresaEmisoraAdmin(admin.ModelAdmin):
    # Esto define las columnas que verás en la tabla principal
    list_display = ('nombre_empresa', 'correo_remitente', 'asunto_cotizacion', 'host_smtp')
    # Agrega una barra de búsqueda en la parte superior
    search_fields = ('nombre_empresa', 'correo_remitente')


@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('empresa', 'correo', 'correos_cc', 'fecha_registro')
    search_fields = ('empresa', 'correo')
    # Filtro lateral para ver los clientes más nuevos
    list_filter = ('fecha_registro',)


@admin.register(OperacionFacturacion)
class OperacionFacturacionAdmin(admin.ModelAdmin):
    list_display = ('referencia_unica', 'tipo_operacion', 'cliente', 'empresa_emisora', 'total', 'estado_factura', 'fecha_creacion', 'creado_por')
    list_filter = ('tipo_operacion', 'estado_factura', 'cotizacion_enviada', 'fecha_creacion')
    search_fields = ('referencia_unica', 'cliente__empresa', 'cliente__razon_social')
    readonly_fields = ('fecha_creacion',)
    list_per_page = 30
