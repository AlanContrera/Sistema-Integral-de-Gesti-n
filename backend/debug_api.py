import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()
u, _ = User.objects.get_or_create(username='test_debug', is_staff=True, is_superuser=True)
u.set_password('test')
u.save()

c = APIClient()
c.force_authenticate(user=u)

print("Testing Vacantes...")
resp = c.get('/api/reclutamiento/vacantes/')
if resp.status_code != 200:
    print('VACANTES STATUS:', resp.status_code)
    print(resp.content.decode('utf-8'))
else:
    print('VACANTES OK')

print("Testing Candidatos...")
resp2 = c.get('/api/reclutamiento/candidatos/')
if resp2.status_code != 200:
    print('CANDIDATOS STATUS:', resp2.status_code)
    print(resp2.content.decode('utf-8'))
else:
    print('CANDIDATOS OK')
