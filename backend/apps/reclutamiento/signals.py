from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Candidato
from .tasks import enviar_correo_cambio_estatus_task

@receiver(pre_save, sender=Candidato)
def detectar_cambio_estatus(sender, instance, **kwargs):
    # Si se están inyectando datos de respaldo (loaddata), ignorar el signal
    if kwargs.get('raw', False):
        return
        
    if instance.pk:
        try:
            candidato_viejo = Candidato.objects.get(pk=instance.pk)
            if candidato_viejo.estatus != instance.estatus:
                enviar_correo_cambio_estatus_task.delay(instance.id, instance.estatus)
        except Candidato.DoesNotExist:
            pass
