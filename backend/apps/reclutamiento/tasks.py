from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from .models import Candidato
import base64 

@shared_task
def enviar_correo_entrevista_task(candidato_id, fecha, hora, modalidad, detalles):
    try:
        candidato = Candidato.objects.get(id=candidato_id)
        
        asunto = f"Invitación a Entrevista - Proceso de Selección: {candidato.vacante.nombre_puesto}"
        
        # Inyectamos las variables al HTML
        contexto = {
            'candidato_nombre': candidato.nombre_completo,
            'nombre_vacante': candidato.vacante.nombre_puesto,
            'fecha': fecha,
            'hora': hora,
            'modalidad': modalidad,
            'detalles': detalles
        }
        
        # Renderizamos el HTML
        html_content = render_to_string('emails/entrevista_agendada.html', contexto)
        
        # Creamos el correo (con texto plano de respaldo por si fallara el HTML)
        correo = EmailMultiAlternatives(
            subject=asunto,
            body="Tiene una entrevista agendada. Por favor, revise este correo en un cliente que soporte HTML.",
            from_email=settings.EMAIL_HOST_USER,
            to=[candidato.correo]
        )
        correo.attach_alternative(html_content, "text/html")
        correo.send()
        
        return f"Correo enviado a {candidato.correo}"
    except Exception as e:
        return f"Error enviando correo: {str(e)}"

@shared_task
def enviar_correo_cambio_estatus_task(candidato_id, nuevo_estatus):
    try:
        candidato = Candidato.objects.get(id=candidato_id)
        
        if nuevo_estatus == Candidato.Estatus.SELECCIONADO:
            asunto = f"¡Felicidades! Ha sido seleccionado - {candidato.vacante.nombre_puesto}"
            mensaje_principal = "Nos complace enormemente informarle que ha sido seleccionado para la vacante."
            color = "#10B981" # Verde
        elif nuevo_estatus in [Candidato.Estatus.NO_VIABLE, Candidato.Estatus.CARTERA]:
            asunto = f"Actualización de su proceso - {candidato.vacante.nombre_puesto}"
            mensaje_principal = "Agradecemos profundamente el tiempo invertido en nuestro proceso de selección. En esta ocasión hemos decidido avanzar con otro perfil que se alinea más a los requerimientos actuales. Sin embargo, su perfil nos ha parecido muy interesante y lo conservaremos en cartera para futuras oportunidades."
            color = "#64748B" # Gris
        elif nuevo_estatus in [Candidato.Estatus.EN_PROCESO, Candidato.Estatus.VIABLE, Candidato.Estatus.ENVIADO_CLIENTE]:
            asunto = f"Avance en su proceso - {candidato.vacante.nombre_puesto}"
            mensaje_principal = "Le informamos que su perfil continúa avanzando favorablemente en el proceso de selección. Pronto nos comunicaremos para los siguientes pasos."
            color = "#3B82F6" # Azul
        else:
            return "No se envía correo para este estatus"

        contexto = {
            'candidato_nombre': candidato.nombre_completo,
            'nombre_vacante': candidato.vacante.nombre_puesto,
            'mensaje_principal': mensaje_principal,
            'color': color
        }
        
        html_content = render_to_string('emails/estatus_cambio.html', contexto)
        
        correo = EmailMultiAlternatives(
            subject=asunto,
            body=mensaje_principal,
            from_email=settings.EMAIL_HOST_USER,
            to=[candidato.correo]
        )
        correo.attach_alternative(html_content, "text/html")
        correo.send()
        
        return f"Correo de estatus enviado a {candidato.correo}"
    except Exception as e:
        return f"Error enviando correo de estatus: {str(e)}"

@shared_task
def enviar_reporte_pdf_task(email_cliente, candidato_nombre, vacante_nombre, pdf_base64, filename, reclutador_nombre, mensaje_adicional=""):
    try:
        # 1. Armamos un asunto dinámico dependiendo si es Vacante o Candidato
        if candidato_nombre:
            asunto = f"Reporte Ejecutivo - {candidato_nombre} ({vacante_nombre})"
            texto_plano = f"Adjunto encontrará el reporte de {candidato_nombre}."
        else:
            asunto = f"Reporte Ejecutivo - {vacante_nombre}"
            texto_plano = f"Adjunto encontrará el reporte de la vacante {vacante_nombre}."
            
        # 2. Inyectamos las variables al diseño HTML
        contexto = {
            'candidato_nombre': candidato_nombre,
            'vacante_nombre': vacante_nombre,
            'reclutador_nombre': reclutador_nombre,
            'mensaje_adicional': mensaje_adicional
        }
        html_content = render_to_string('emails/reporte_cliente.html', contexto)
        
        # 3. Limpiamos y decodificamos el Base64 a bytes puros (binario PDF)
        if "base64," in pdf_base64:
            pdf_base64 = pdf_base64.split("base64,")[1]
        pdf_bytes = base64.b64decode(pdf_base64)
        
        # 4. Construimos el correo
        correo = EmailMultiAlternatives(
            subject=asunto,
            body=texto_plano,
            from_email=settings.EMAIL_HOST_USER,
            to=[email_cliente]
        )
        correo.attach_alternative(html_content, "text/html")
        
        # Adjuntamos los bytes generados
        correo.attach(filename, pdf_bytes, 'application/pdf')
        correo.send()
        
        return f"Reporte PDF enviado exitosamente a {email_cliente}"
    except Exception as e:
        return f"Error enviando reporte PDF: {str(e)}"
