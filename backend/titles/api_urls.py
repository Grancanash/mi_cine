# NUEVO DJANGO-REACT
from django.urls import path

from titles.api_views import ActorDetailAPIView, ActorsAPIView, CategoriesAPIView, PlatformsAPIView, TitleDetailAPIView, TitleListAPIView, TitlesApiSearchExternalView, TrackingStatusListAPIView

urlpatterns = [
    path("titles/", TitleListAPIView.as_view(), name="title-list"),
    path("titles/<int:pk>/", TitleDetailAPIView.as_view(), name="title-detail"),
    path("categories/", CategoriesAPIView.as_view(), name="category-list"),
    path("actors/", ActorsAPIView.as_view(), name="actor-list"),
    path("actors/<int:pk>/", ActorDetailAPIView.as_view(), name="actor-detail"),
    path("platforms/", PlatformsAPIView.as_view(), name="platform-list"),
    path("tracking-status/", TrackingStatusListAPIView.as_view(), name="trackingstatus-list"),
    path('search/external/', TitlesApiSearchExternalView.as_view(), name='title-api-searchexternal'),
]
