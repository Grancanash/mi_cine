from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Actor(models.Model):
    MALE = "M"
    FEMALE = "F"
    SEX_CHOICES = [
        (MALE, "Masculino"),
        (FEMALE, "Femenino"),
    ]

    name = models.CharField('Nombre', max_length=100)
    birth_date = models.DateField('Cumpleaños', blank=True, null=True)
    sex = models.CharField('Sexo', max_length=1, choices=SEX_CHOICES, blank=True)
    nationality = models.CharField('Nacionalidad', max_length=50, blank=True)

    def __str__(self):
        return self.name


class Platform(models.Model):
    name = models.CharField('Nombre', max_length=50, unique=True)

    def __str__(self):
        return self.name
