from catalogs.models import Category
import os
import django

# Configura Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mi_cine.settings")
django.setup()

# Ahora sí importa tu modelo

# Comprueba que funciona creando un objeto de prueba
cat, created = Category.objects.get_or_create(name="PruebaSegura")
print(cat, created)
