import base64
import smtplib
from django.template.loader import render_to_string
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from celery import shared_task
from .models import EmpresaEmisora, Cliente


@shared_task
def enviar_cotizacion_task(cliente_id, empresa_id, pdf_base64, folio="Oficial"):
    try:
        cliente = Cliente.objects.get(id=cliente_id)
        empresa = EmpresaEmisora.objects.get(id=empresa_id)
        
        # Preparar el mensaje
        msg = MIMEMultipart()
        msg['From'] = empresa.correo_remitente
        msg['To'] = cliente.correo
        # Usamos el asunto de la BD, o uno por defecto si está vacío
        msg['Subject'] = empresa.asunto_cotizacion if empresa.asunto_cotizacion else f"Propuesta Comercial - {empresa.nombre_empresa}"
    
        if cliente.correos_cc:
            msg['Cc'] = cliente.correos_cc
            
        # Inyectar las variables a la plantilla HTML
        contexto = {
            'cliente_nombre': cliente.empresa, 
            'empresa_nombre': empresa.nombre_empresa,
            'cuerpo_correo': empresa.cuerpo_cotizacion # Inyectamos el cuerpo dinámico
        }
        cuerpo_html = render_to_string('emails/envio_cotizacion.html', contexto)

        
        msg.attach(MIMEText(cuerpo_html, 'html'))
        
        # Decodificar el PDF adjunto
        pdf_bytes = base64.b64decode(pdf_base64)
        adjunto = MIMEApplication(pdf_bytes, _subtype="pdf")
        
        # NUEVO: Le ponemos el nombre dinámico con el folio
        nombre_archivo = f"{folio}.pdf"
        adjunto.add_header('Content-Disposition', 'attachment', filename=nombre_archivo)
        msg.attach(adjunto)

        
        # Conexión SMTP dinámica
        if empresa.usar_ssl:
            server = smtplib.SMTP_SSL(empresa.host_smtp, empresa.puerto_smtp)
        else:
            server = smtplib.SMTP(empresa.host_smtp, empresa.puerto_smtp)
            if empresa.usar_tls:
                server.starttls()
                
        server.login(empresa.correo_remitente, empresa.password)
        
        # Lógica para inyectar a SMTP tanto el TO como los CC
        to_addrs = [cliente.correo]
        if cliente.correos_cc:
            # Separamos por coma y quitamos espacios vacíos
            to_addrs.extend([c.strip() for c in cliente.correos_cc.split(',') if c.strip()])
            
        server.send_message(msg, to_addrs=to_addrs)
        server.quit()
        
        return "Cotización enviada exitosamente"
        
    except Exception as e:
        return f"Error al enviar cotización: {str(e)}"


