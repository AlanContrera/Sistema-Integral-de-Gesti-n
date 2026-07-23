from django.contrib.auth.models import AbstractUser
from django.db import models


class Usuario(AbstractUser):
    """Usuario personalizado del Sistema Integral."""
    
    class Rol(models.TextChoices):
        SUPER_ADMIN = 'super_admin', 'Super Admin'
        ADMIN = 'admin', 'Administrador'
        COMERCIAL = 'comercial', 'Comercial'
        RECLUTAMIENTO = 'reclutamiento', 'Reclutamiento'

    rol = models.CharField(
        max_length=20,
        choices=Rol.choices,
        default=Rol.RECLUTAMIENTO,
    )

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return f'{self.get_full_name()} ({self.get_rol_display()})'
