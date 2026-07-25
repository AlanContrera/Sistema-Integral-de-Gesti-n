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
resp = c.get('/api/reclutamiento/candidatos/13/')
print('CANDIDATO 13:', resp.json())
cand_data = resp.json()
cat_id = cand_data.get('categoria_puesto_id')
print('CAT ID:', cat_id)
if cat_id:
    resp2 = c.get(f'/api/reclutamiento/preguntas/?categoria={cat_id}')
    print('PLANTILLAS:', resp2.json())
