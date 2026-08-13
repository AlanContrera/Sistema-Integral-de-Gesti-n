from django.contrib.auth.models import AbstractUser
from django.db import models


class Usuario(AbstractUser):
    """Usuario personalizado del Sistema Integral."""
    
    class Rol(models.TextChoices):
        SUPER_ADMIN = 'super_admin', 'Super Admin'
        ADMIN = 'admin', 'Administrador'
        SUPERVISOR = 'supervisor', 'Supervisor'
        USUARIO_ESTANDAR = 'usuario_estandar', 'Usuario Estandar'

    rol = models.CharField(
        max_length=30,
        choices=Rol.choices,
        default=Rol.USUARIO_ESTANDAR,
    )

    acceso_pagos = models.BooleanField(default=False)
    acceso_cotizador = models.BooleanField(default=False)
    acceso_reclutamiento = models.BooleanField(default=False)
    acceso_comercial = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return f'{self.get_full_name()} ({self.get_rol_display()})'
