from django.contrib import admin
from django.urls import include, path

from mi_cine import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    # NUEVO DJANGO-REACT
    # API
    path("api/", include(("titles.api_urls", "titles_api"), namespace="titles_api")),
    path("api/", include(("accounts.api_urls", "accounts_api"), namespace="accounts_api")),
]

if settings.DEBUG:
    # Include django_browser_reload URLs only in DEBUG mode
    urlpatterns += [
        path("__reload__/", include("django_browser_reload.urls")),
    ]
