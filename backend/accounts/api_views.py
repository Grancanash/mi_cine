from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from core.api_base import CSRFApiView


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CSRFAPIView(CSRFApiView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        return Response({"detail": "CSRF cookie set."}, status=status.HTTP_200_OK)


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"detail": "Usuario y contraseña son obligatorios."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response(
                {"detail": "Credenciales inválidas."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        login(request, user)
        return Response({
            "detail": "Login correcto.",
            "user": {
                "username": user.username,
                "id": user.id
            }})


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        response = Response({"detail": "Logout correcto."})
        response.delete_cookie('csrftoken')  # opcional
        logout(request)
        return response


class SessionAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        print(request.user, flush=True)
        if request.user.is_authenticated:
            return Response(
                {
                    "is_authenticated": True,
                    "username": request.user.get_username(),
                },
                status=status.HTTP_200_OK,
            )
        return Response({"is_authenticated": False}, status=status.HTTP_200_OK)
