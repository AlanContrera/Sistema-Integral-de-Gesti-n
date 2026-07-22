from django.contrib import admin
from .models import CorreoProcesado
from .models import Comprobante
from .models import Factura


@admin.register(CorreoProcesado)
class CorreoProcesadoAdmin(admin.ModelAdmin):

    list_display = ['uid', 'remitente', 'asunto', 'estado', 'fecha_recibido', 'fecha_procesado']
    list_filter = ['estado']
    search_fields = ['remitente', 'asunto', 'uid']
    readonly_fields = ['uid', 'remitente', 'asunto', 'fecha_recibido', 'cuerpo', 'fecha_procesado']
    ordering = ['-fecha_recibido']

@admin.register(Comprobante)
class ComprobanteAdmin(admin.ModelAdmin):
    list_display = ['id', 'correo', 'tipo_archivo', 'banco_extraido', 'monto_extraido', 'fecha_extraida', 'estado_ocr']
    list_filter = ['estado_ocr', 'tipo_archivo']
    readonly_fields = ['correo', 'archivo', 'tipo_archivo', 'texto_bruto',
                       'banco_extraido', 'monto_extraido', 'fecha_extraida',
                       'cuenta_origen', 'cuenta_destino', 'referencia',
                       'estado_ocr', 'fecha_procesado']
    ordering = ['-id']

@admin.register(Factura)
class FacturaAdmin(admin.ModelAdmin):

    list_display = [
        'id', 'correo', 'emisor_nombre', 'emisor_rfc',
        'receptor_rfc', 'folio', 'fecha', 'total', 'moneda', 'estado'
    ]
    list_filter = ['estado', 'moneda']
    search_fields = ['emisor_nombre', 'emisor_rfc', 'receptor_rfc', 'folio']
    readonly_fields = [
        'correo', 'archivo', 'archivo_pdf', 'emisor_nombre', 'emisor_rfc',
        'receptor_nombre', 'receptor_rfc', 'serie', 'folio',
        'fecha', 'total', 'moneda', 'estado', 'fecha_procesado'
    ]
    ordering = ['-id']
