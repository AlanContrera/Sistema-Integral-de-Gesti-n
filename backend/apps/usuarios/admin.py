from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    """Configuración del panel de administración para nuestro Usuario personalizado."""
    
    # Esto agrega nuestro campo "rol" a la pantalla de creación/edición de usuarios
    fieldsets = UserAdmin.fieldsets + (
        ('Permisos del Sistema Integral', {'fields': ('rol',)}),
    )
    
    # Esto muestra el "rol" en la tabla de la lista de usuarios
    list_display = ('username', 'email', 'first_name', 'last_name', 'rol', 'is_staff')
    
    # Para poder filtrar usuarios por rol
    list_filter = UserAdmin.list_filter + ('rol',)
