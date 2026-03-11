from django.db import models
from django.contrib.auth.models import AbstractUser

from mi_cine import settings


class CustomUser(AbstractUser):
    # Aquí podrás añadir campos extra en el futuro (avatar, país, etc.)
    # De momento lo dejamos igual que User.
    pass


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile",)
    bio = models.TextField(blank=True)

    def __str__(self):
        return f"Perfil de {self.user.username}"
