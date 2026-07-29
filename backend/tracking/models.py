from django.db import models
from mi_cine import settings
from titles.models import Title
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator


class Tracking(models.Model):
    PENDING = "pending"
    WATCHING = "watching"
    FINISHED = "finished"
    STATUS_CHOICES = [
        (PENDING, "Pendiente"),
        (WATCHING, "Viendo"),
        (FINISHED, "Visto"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="trackings")
    title = models.ForeignKey(Title, on_delete=models.CASCADE, related_name="trackings")
    status = models.CharField('Estado', max_length=10, choices=STATUS_CHOICES, default=PENDING)
    rating = models.PositiveSmallIntegerField('Valoración (0-10)', null=True, blank=True, validators=[
                                              MinValueValidator(0), MaxValueValidator(10)])
    current_season = models.PositiveIntegerField(
        'Temporada actual', null=True, blank=True)  # para series: temporada actual
    current_episode = models.PositiveIntegerField(
        'Episodio actual', null=True, blank=True)  # para series: episodio actual
    opinion = models.TextField('Opinión', blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "title")  # un usuario solo puede tener un tracking por título

    def clean(self):

        if self.rating is not None and not (0 <= self.rating <= 10):
            raise ValidationError({"rating": "El rating debe estar entre 0 y 10."})

        # Validar que la temporada actual no supere el total de temporadas del título
        if self.current_season is not None and self.title.seasons is not None:
            if self.current_season > self.title.seasons:
                raise ValidationError({
                    "current_season": f"La temporada actual ({self.current_season}) no puede ser mayor que "
                                      f"el total de temporadas de la serie ({self.title.seasons})."
                                      })

    def __str__(self):
        return f"{self.user.username} - {self.title.name} ({self.status})"
