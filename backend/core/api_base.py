# core/api_base.py
from rest_framework.views import APIView as DRFAPIView


class CSRFApiView(DRFAPIView):
    @classmethod
    def as_view(cls, **initkwargs):
        view = super().as_view(**initkwargs)
        # Quitar el csrf_exempt que DRF pone por defecto
        view.csrf_exempt = False
        return view
