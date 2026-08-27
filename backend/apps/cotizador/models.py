import uuid
from django.db import models
from django.db.models import JSONField

class EmpresaEmisora(models.Model):
    nombre_empresa = models.CharField(max_length=150, help_text='Nombre comercial o razón social de la empresa emisora')
    rfc = models.CharField(max_length=20, blank=True, null=True, help_text='RFC de la empresa emisora')
    regimen_fiscal = models.CharField(max_length=255, blank=True, null=True, default='601 - General de Ley Personas Morales', help_text='Régimen fiscal del emisor')
    
    # Parámetros predeterminados para la prefactura
    moneda_default = models.CharField(max_length=50, blank=True, null=True, default='MXN - Peso Mexicano')
    tipo_cambio_default = models.CharField(max_length=20, blank=True, null=True, default='1')
    forma_pago_default = models.CharField(max_length=150, blank=True, null=True, default='03 - TRANSFERENCIA ELECTRÓNICA DE FONDOS')
    metodo_pago_default = models.CharField(max_length=150, blank=True, null=True, default='PUE - Pago en una sola exhibición')
    uso_cfdi_default = models.CharField(max_length=150, blank=True, null=True, default='G03 - GASTOS EN GENERAL')

    # Configuración SMTP para envío de correos
    host_smtp = models.CharField(max_length=150, default='mail.tudominio.com', help_text='Servidor SMTP de tu Web Hosting')
    puerto_smtp = models.IntegerField(default=465, help_text='Generalmente 465 (SSL) o 587 (TLS)')
    usar_tls = models.BooleanField(default=False)
    usar_ssl = models.BooleanField(default=True)
    correo_remitente = models.EmailField(help_text='Correo corporativo que enviará el mensaje')
    password = models.CharField(max_length=255, help_text='Contraseña del correo')
    asunto_cotizacion = models.CharField(max_length=255, blank=True, null=True, help_text='Asunto personalizado del correo')
    cuerpo_cotizacion = models.TextField(blank=True, null=True, help_text='Cuerpo del correo personalizado')

    host_imap = models.CharField(max_length=150, default='mail.tudominio.com', help_text='Servidor IMAP para leer correos')
    puerto_imap = models.IntegerField(default=993, help_text='Generalmente 993 (SSL)')

    def __str__(self):
        return self.nombre_empresa

    class Meta:
        verbose_name = 'Empresa Emisora'
        verbose_name_plural = 'Empresas Emisoras'


class Cliente(models.Model):
    empresa = models.CharField(max_length=200, help_text='Nombre de la empresa / Razón Social')
    rfc = models.CharField(max_length=20, blank=True, null=True, help_text='RFC del cliente receptor')
    razon_social = models.CharField(max_length=255, blank=True, null=True, help_text='Razón Social exacta')
    calle_numero = models.CharField(max_length=255, blank=True, null=True, help_text='Calle y número')
    colonia = models.CharField(max_length=150, blank=True, null=True, help_text='Colonia')
    ciudad = models.CharField(max_length=150, blank=True, null=True, help_text='Municipio / Ciudad')
    estado = models.CharField(max_length=150, blank=True, null=True, help_text='Estado')
    codigo_postal = models.CharField(max_length=10, blank=True, null=True, help_text='Código Postal')
    regimen_fiscal = models.CharField(max_length=255, blank=True, null=True, default='601 - General de Ley Personas Morales', help_text='Régimen fiscal receptor')
    uso_cfdi_preferido = models.CharField(max_length=150, blank=True, null=True, default='G03 - GASTOS EN GENERAL')

    correo = models.EmailField(help_text='Correo principal donde se enviará la cotización')
    correos_cc = models.CharField(max_length=500, blank=True, null=True, help_text='Correos secundarios separados por coma')
    fecha_registro = models.DateTimeField(auto_now_add=True)

    empresas_emisoras = models.ManyToManyField(
        'EmpresaEmisora',
        blank=True,
        related_name='clientes_relacionados',
        help_text='Empresas emisoras autorizadas para este cliente'
    )

    def __str__(self):
        return f"{self.empresa} ({self.rfc or 'Sin RFC'})"

    class Meta:
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'

class OperacionFacturacion(models.Model):
    ESTADOS_FACTURA = [
        ('NO_SOLICITADA', 'No Solicitada'),
        ('ENVIADA_A_MONTERREY', 'Enviada a Monterrey'),
        ('RECIBIDA_DE_MONTERREY', 'Recibida de Monterrey'),
        ('ENVIADA_AL_CLIENTE', 'Enviada al Cliente'),
    ]
    
    referencia_unica = models.CharField(max_length=50, unique=True, blank=True, help_text="Código único como OP-2026-XYZ")
    cliente = models.ForeignKey(Cliente, on_delete=models.SET_NULL, null=True, blank=True)
    empresa_emisora = models.ForeignKey(EmpresaEmisora, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Valores de la Operación
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    impuestos = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    
    # Todo el JSON del formulario para poder regenerar el Excel o PDF cuando queramos
    datos_formulario = JSONField(default=dict, blank=True, help_text="Guarda todas las partidas y configuraciones")
    # Camino 1: Cotización
    cotizacion_enviada = models.BooleanField(default=False)
    # Camino 2: Facturación (Monterrey)
    estado_factura = models.CharField(max_length=50, choices=ESTADOS_FACTURA, default='NO_SOLICITADA')
    xml_factura = models.FileField(upload_to='facturas/xml/', blank=True, null=True)
    pdf_factura = models.FileField(upload_to='facturas/pdf/', blank=True, null=True)
    # Trazabilidad de tiempo
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    def save(self, *args, **kwargs):
        # Auto-generar la referencia si no existe
        if not self.referencia_unica:
            # Crea un código tipo "OP-8F4A"
            self.referencia_unica = f"OP-{str(uuid.uuid4())[:6].upper()}"
        super().save(*args, **kwargs)
    def __str__(self):
        return f"{self.referencia_unica} - {self.cliente}"
    class Meta:
        verbose_name = 'Operación Comercial'
        verbose_name_plural = 'Operaciones Comerciales'
