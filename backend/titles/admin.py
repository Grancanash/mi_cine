from django.contrib import admin
from django.contrib.auth import get_user_model
from django.shortcuts import redirect, render
from django.urls import path
from django import forms

from catalogs.models import Category, Platform
from .models import Title
import csv
from io import TextIOWrapper

# Formulario para subir CSV


class CsvImportForm(forms.Form):
    csv_file = forms.FileField()

# Admin personalizado


@admin.register(Title)
class TitleAdmin(admin.ModelAdmin):
    change_list_template = "admin/title_changelist.html"  # plantilla con botón

    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path('import-csv/', self.import_csv),  # URL para subir CSV
        ]
        return my_urls + urls

    def import_csv(self, request):
        if request.method == "POST":
            form = CsvImportForm(request.POST, request.FILES)
            if form.is_valid():
                User = get_user_model()
                csv_file = TextIOWrapper(request.FILES["csv_file"].file, encoding='utf-8')
                reader = csv.DictReader(csv_file, delimiter=';')
                for row in reader:
                    user = User.objects.get(id=2)  # 2 = usuario
                    title = Title.objects.create(
                        type='series' if row['tipo'] == 's' else 'movie',
                        name=row['titulo'],
                        year=row['anno'],
                        description=row['descripcion'],
                        created_at=row['fecha_creacion'],
                        seasons=row['temporadas'],
                        user=user,
                    )

                    # category_names = row['categoria'].split(',')
                    # for cat_name in category_names:
                    #     cat_name = cat_name.strip()
                    #     if cat_name:
                    #         category, _ = Category.objects.get_or_create(name=cat_name)
                    #         title.categories.add(category)

                    platform_name = 'Netflix' if row.get('plataforma', '').strip() == 'nf' else ''
                    if platform_name:
                        platform_obj, _ = Platform.objects.get_or_create(name=platform_name)
                        title.platforms.add(platform_obj)

                self.message_user(request, "CSV importado correctamente")
                return redirect("..")
        else:
            form = CsvImportForm()
        return render(request, "admin/csv_form.html", {"form": form})
