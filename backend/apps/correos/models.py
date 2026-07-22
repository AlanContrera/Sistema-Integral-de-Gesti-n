from django.db import models


class CorreoProcesado(models.Model):

    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('procesado', 'Procesado'),
        ('error', 'Error'),
    ]

    TIPO_INGRESO_CHOICES = [
        ('retorno', 'Retorno de transferencia'),
        ('confirmacion', 'Confirmacion de pago'),
        ('asimilado', 'Asimilado'),
        ('blindado', 'Blindado'),
        ('bancarizacion', 'Bancarizacion'),
        ('desconocido', 'Desconocido')
    ]

    tipo_ingreso = models.CharField(
        max_length=20,
        choices=TIPO_INGRESO_CHOICES,
        default='desconocido' )

    uid = models.CharField(max_length=100, unique=True)
    message_id = models.CharField(max_length=255, blank=True, null=True, unique=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='respuestas')

    remitente = models.EmailField()
    asunto = models.CharField(max_length=500)
    fecha_recibido = models.DateTimeField()
    cuerpo = models.TextField(blank=True)
    cuerpo_limpio = models.TextField(blank=True, null=True)
    estado = models.CharField(
        max_length=20,
        choices=ESTADO_CHOICES,
        default='pendiente'
    )

    fecha_procesado = models.DateTimeField(null=True, blank=True)

    cliente_nombre = models.CharField(max_length=255, blank=True, null=True, default='SIN NOMBRE')
    

    class Meta:
        verbose_name = 'Correo Procesado'
        verbose_name_plural = 'Correos Procesados'
        ordering = ['-fecha_recibido']

    def __str__(self):
        return f"[{self.estado.upper()}] {self.asunto} — {self.remitente}"

class Comprobante(models.Model):

    TIPO_CHOICES = [
        ('pdf_digital', 'PDF Digital'),
        ('pdf_escaneado', 'PDF Escaneado'),
        ('imagen', 'Imagen'),
        ('texto', 'Texto de Correo'),
    ]

    ESTADO_OCR_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('procesado', 'Procesado'),
        ('error', 'Error'),
    ]

    TIPO_INGRESO_CHOICES = [
        ('retorno', 'Retorno de transferencia'),
        ('confirmacion', 'Confirmacion de pago'),
        ('asimilado', 'Asimilado'),
        ('blindado', 'Blindado'),
        ('bancarizacion', 'Bancarizacion'),
        ('desconocido', 'Desconocido')
    ]

    tipo_ingreso = models.CharField(
        max_length=20,
        choices=TIPO_INGRESO_CHOICES,
        default='desconocido' )

    correo = models.ForeignKey(
        CorreoProcesado,
        on_delete=models.CASCADE,
        related_name='comprobantes'
    )
    archivo = models.FileField(upload_to='comprobantes/%Y/%m/%d/', null=True, blank=True)
    tipo_archivo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    estado_ocr = models.CharField(
        max_length=20,
        choices=ESTADO_OCR_CHOICES,
        default='pendiente'
    )
    fecha_extraida = models.DateField(null=True, blank=True)
    banco_extraido = models.CharField(max_length=200, blank=True)
    monto_extraido = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    cuenta_origen = models.CharField(max_length=255, blank=True)
    cuenta_destino = models.CharField(max_length=255, blank=True)
    referencia = models.CharField(max_length=100, blank=True)

    banco_origen = models.CharField(max_length=200, blank=True)
    banco_destino = models.CharField(max_length=200, blank=True)
    empresa_destino = models.CharField(max_length=255, blank=True)

        # campos extraídos del cuerpo del correo
    empresa_correo = models.CharField(max_length=255, blank=True)
    banco_correo = models.CharField(max_length=255, blank=True)
    clabe_correo = models.CharField(max_length=255, blank=True)
    
    monto_correo = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        null=True, 
        blank=True
    )
    saldo_anterior = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        null=True, 
        blank=True
    )
    saldo_actualizado = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        null=True, 
        blank=True
    )

    fecha_correo = models.DateField(null=True, blank=True)
    validacion_monto = models.BooleanField(default=False)


    texto_bruto = models.TextField(blank=True)
    fecha_procesado = models.DateTimeField(null=True, blank=True)

    revisado = models.BooleanField(default=False)

     # --- NUEVOS CAMPOS PARA VINCULAR ABONOS A FACTURAS ---
    factura_pagada = models.ForeignKey('Factura', null=True, blank=True, on_delete=models.SET_NULL, related_name='abonos')
    folio_factura_extraido = models.CharField(max_length=40, blank=True, null=True)


    class Meta:
        verbose_name = 'Comprobante'
        verbose_name_plural = 'Comprobantes'
        ordering = ['-id']

    def __str__(self):
        return f"[{self.estado_ocr.upper()}] {self.archivo.name} — {self.correo.remitente}"



class Factura(models.Model):

    ESTADO_CHOICES = [
        ('procesado', 'Procesado'),
        ('error', 'Error'),
    ]

    correo = models.ForeignKey(
        CorreoProcesado,
        on_delete=models.CASCADE,
        related_name='facturas'
    )
    archivo = models.FileField(upload_to='facturas/%Y/%m/%d/')
    archivo_pdf = models.FileField(upload_to='facturas_pdf/%Y/%m/%d/', null=True, blank=True)
    emisor_nombre = models.CharField(max_length=300, blank=True)
    emisor_rfc = models.CharField(max_length=20, blank=True)
    receptor_nombre = models.CharField(max_length=300, blank=True)
    receptor_rfc = models.CharField(max_length=20, blank=True)
    serie = models.CharField(max_length=25, blank=True)
    folio = models.CharField(max_length=40, blank=True)
    fecha = models.DateTimeField(null=True, blank=True)
    total = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    moneda = models.CharField(max_length=10, blank=True)
    metodo_pago = models.CharField(max_length=50, blank=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='procesado')
    fecha_procesado = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Factura CFDI'
        verbose_name_plural = 'Facturas CFDI'
        ordering = ['-fecha']

    def __str__(self):
        return f"{self.serie}{self.folio} — {self.emisor_nombre} → {self.receptor_nombre}"

class Liquidacion(models.Model):
    correo = models.OneToOneField(CorreoProcesado, on_delete=models.CASCADE, related_name='liquidacion')
    monto_depositado = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Porcentajes aplicados
    suma_comisiones_pct = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Desglose de dinero
    monto_retornado = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    comision_empresa_bruta = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    comision_promotor_1 = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    comision_promotor_2 = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    comision_bancaria = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    comision_traslado = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Utilidad neta a repartir
    comision_vallux_neta = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    utilidad_vallux = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    comision_pedro = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    fecha_calculo = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Liquidación de: {self.correo.asunto} - Neta: ${self.comision_vallux_neta}"

