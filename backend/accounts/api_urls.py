# NUEVO DJANGO-REACT
from django.urls import path

from accounts.api_views import CSRFAPIView, LoginAPIView, LogoutAPIView, SessionAPIView

urlpatterns = [
    path("csrf/", CSRFAPIView.as_view(), name="api-csrf"),
    path("login/", LoginAPIView.as_view(), name="api-login"),
    path("logout/", LogoutAPIView.as_view(), name="api-logout"),
    path("session/", SessionAPIView.as_view(), name="api-session"),
]
