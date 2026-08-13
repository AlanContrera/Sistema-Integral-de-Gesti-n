from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Usuario
from .serializers import UsuarioSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite ver o editar usuarios.
    """
    queryset = Usuario.objects.all().order_by('-date_joined')
    serializer_class = UsuarioSerializer
    # Por seguridad, exigimos que estén logueados para usar este ViewSet
    permission_classes = [IsAuthenticated] 

    # Con este decorador creamos la ruta GET /api/usuarios/me/
    @action(detail=False, methods=['get'])
    def me(self, request):
        # request.user contiene al usuario dueño del token actual
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
