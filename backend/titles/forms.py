from django import forms

from catalogs.models import Actor, Category, Platform
from .models import Title


class TitleForm(forms.ModelForm):
    categories = forms.CharField(
        required=False,
        widget=forms.SelectMultiple(attrs={'class': 'select2-tags'}),
        label="Géneros",
    )

    actors = forms.CharField(
        required=False,
        widget=forms.SelectMultiple(attrs={'class': 'select2-tags'}),
        label="Actores",
    )

    platforms = forms.CharField(
        required=False,
        widget=forms.SelectMultiple(attrs={'class': 'select2-tags'}),
        label="Plataforma",
    )

    class Meta:
        model = Title
        fields = ["name", 'original_title', "year", "type", "description"]
        widgets = {
            'description': forms.Textarea(attrs={
                'rows': 5,
                "class": "textarea textarea-bordered w-full"
            })
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # ------------------------- Cargar TODOS los actores de la tabla Actors como opciones
        all_actors = Actor.objects.all()
        self.fields['actors'].widget.choices = [(a.name, a.name) for a in all_actors]

        # Preseleccionar los actores del título
        if self.instance.pk:
            self.fields['actors'].initial = [a.name for a in self.instance.actors.all()]

        # ------------------------- Cargar TODAS las categorias de la tabla Category como opciones
        all_categories = Category.objects.all()
        self.fields['categories'].widget.choices = [(c.name, c.name) for c in all_categories]

        # Preseleccionar las categorías del título
        if self.instance.pk:
            self.fields['categories'].initial = [c.name for c in self.instance.categories.all()]

        # ------------------------- Cargar TODAS las plataformas de la tabla Platform como opciones
        all_platforms = Platform.objects.all()
        self.fields['platforms'].widget.choices = [(p.name, p.name) for p in all_platforms]

        # Preseleccionar las plataformas del título
        if self.instance.pk and self.instance.platforms:
            self.fields['platforms'].initial = [p.name for p in self.instance.platforms.all()]

        # Se crea el atributo is_textarea para detectar el textarea en el template y manipularlo de forma diferente a los inputs
        for name, field in self.fields.items():
            field.is_textarea = isinstance(field.widget, forms.Textarea)


class FilterTitleForm(forms.Form):
    categories = forms.CharField(
        required=False,
        widget=forms.SelectMultiple(attrs={'class': 'select2-tags'}),
        label="Géneros",
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Mismas opciones que en TitleForm
        all_categories = Category.objects.all()
        self.fields['categories'].widget.choices = [(c.name, c.name) for c in all_categories]
