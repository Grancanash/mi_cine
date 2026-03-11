from django.db import models
from catalogs.models import Category, Actor, Platform
from mi_cine import settings


class Title(models.Model):
    MOVIE = "movie"
    SERIES = "series"
    TYPE_CHOICES = [
        (MOVIE, "Película"),
        (SERIES, "Serie"),
    ]

    name = models.CharField('Nombre', max_length=200)
    original_title = models.CharField('Título original', max_length=200, blank=True)
    year = models.PositiveIntegerField('Año', null=True, blank=True)
    type = models.CharField('Tipo', max_length=10, choices=TYPE_CHOICES)
    description = models.TextField('Descripción', blank=True)
    seasons = models.PositiveIntegerField('Temporadas', default=1)
    created_at = models.DateTimeField('Creado el', auto_now_add=True)

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                             related_name="titles", verbose_name="Usuario",)

    categories = models.ManyToManyField(Category, verbose_name="Géneros", related_name="titles", blank=True)
    actors = models.ManyToManyField(Actor, verbose_name="Actores", related_name="titles", blank=True)
    platforms = models.ManyToManyField(Platform, verbose_name="Plataforma", related_name="titles", blank=True)

    def __str__(self):
        return f"{self.name} ({self.year})"
