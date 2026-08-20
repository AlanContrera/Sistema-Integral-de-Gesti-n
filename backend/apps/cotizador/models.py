from django.db import models

class EmpresaEmisora(models.Model):
    nombre_empresa = models.CharField(max_length=150, help_text='Ej. Sistemas P&M, RecluSystem, etc.')
    host_smtp = models.CharField(max_length=150, default='mail.tudominio.com', help_text='Servidor SMTP de tu Web Hosting')
    puerto_smtp = models.IntegerField(default=465, help_text='Generalmente 465 (SSL) o 587 (TLS)')
    usar_tls = models.BooleanField(default=False)
    usar_ssl = models.BooleanField(default=True)
    correo_remitente = models.EmailField(help_text='Correo corporativo que enviará el mensaje')
    password = models.CharField(max_length=255, help_text='Contraseña del correo')
    asunto_cotizacion = models.CharField(max_length=255, blank=True, null=True, help_text='Asunto personalizado del correo')
    cuerpo_cotizacion = models.TextField(blank=True, null=True, help_text='Cuerpo del correo personalizado')


    def __str__(self):
        return self.nombre_empresa

    class Meta:
        verbose_name = 'Empresa Emisora'
        verbose_name_plural = 'Empresas Emisoras'

class Cliente(models.Model):
    empresa = models.CharField(max_length=200, help_text='Nombre de la empresa del cliente')
    correo = models.EmailField(help_text='Correo principal donde se enviará la cotización')
    correos_cc = models.CharField(max_length=500, blank=True, null=True, help_text='Correos secundarios separados por coma (ej. uno@mail.com, dos@mail.com)')
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.empresa

    class Meta:
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'

