import urllib.request
import urllib.parse
import json
import logging
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger(__name__)

def enviar_alerta_telegram(mensaje: str, chat_id: str = None) -> bool:
    """Envia un mensaje formateado en Markdown al administrador del sistema via Telegram."""
    token = getattr(settings, 'TELEGRAM_BOT_TOKEN', '')
    dest_chat = chat_id or getattr(settings, 'TELEGRAM_ADMIN_CHAT_ID', '')
    if not token or not dest_chat:
        return False

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        'chat_id': dest_chat,
        'text': mensaje,
        'parse_mode': 'Markdown'
    }
    try:
        data = urllib.parse.urlencode(payload).encode('utf-8')
        req = urllib.request.Request(url, data=data)
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status == 200
    except Exception as e:
        logger.error(f"Error al enviar notificacion de Telegram: {e}")
        return False

def notificar_error_correo(tipo_documento: str, destinatario: str, error: str, cliente: str = None, folio: str = None):
    """Genera y envia una alerta a Telegram por error de entrega o envio de correo."""
    hora_str = timezone.localtime(timezone.now()).strftime('%H:%M:%S')
    folio_str = f"`{folio}`" if folio else 'N/A'
    msg = (
        f"🚨 *ERROR EN ENVIO DE CORREO*\n\n"
        f"📄 *Documento:* {tipo_documento} ({folio_str})\n"
        f"👤 *Cliente:* *{cliente or 'Desconocido'}*\n"
        f"📧 *Destinatario:* `{destinatario or 'VACIO'}`\n"
        f"⏰ *Hora:* `{hora_str}`\n\n"
        f"❌ *Causa del Error:*\n```\n{str(error)[:400]}\n```"
    )
    return enviar_alerta_telegram(msg)

def notificar_error_sistema(origen: str, detalle: str):
    """Notifica una falla o excepcion critica de la aplicacion a Telegram."""
    hora_str = timezone.localtime(timezone.now()).strftime('%H:%M:%S')
    msg = (
        f"⚠️ *ALERTA DEL SISTEMA: {origen.upper()}*\n\n"
        f"⏰ *Hora:* `{hora_str}`\n"
        f"📌 *Detalle:*\n```\n{str(detalle)[:500]}\n```"
    )
    return enviar_alerta_telegram(msg)
