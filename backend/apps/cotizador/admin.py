from django.contrib import admin
from .models import EmpresaEmisora, Cliente

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
