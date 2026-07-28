import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
User = get_user_model()
u = User.objects.get(username='test_debug')
c = APIClient()
c.force_authenticate(user=u)
resp = c.get('/api/reclutamiento/candidatos/3/')
print('CANDIDATO 3:', resp.json())
