from django.conf import settings
from django.http import JsonResponse
from django.views import View
import requests

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView, ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Actor, Category, Platform, Title
from .serializers import ActorSerializer, ActorWriteSerializer, CategorySerializer, PlatformSerializer, TitleSerializer, TitleWriteSerializer, Tracking, TrackingStatusOptionSerializer
from mi_cine.utils import romanize_text, translate


class TitleListAPIView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    base_ordering_fields = ["name", "created_at", "year"]

    def get_serializer_class(self):
        # GET lista → serializer de lectura
        if self.request.method == "GET":
            return TitleSerializer
        # POST creación → serializer de escritura
        return TitleWriteSerializer

    def get_queryset(self):
        user = self.request.user
        params = self.request.query_params

        search_param = params.get("search", "")
        ordering_param = params.get("ordering")
        type_param = params.get('type')
        category_ids_param = params.getlist('category')
        status_param = params.getlist('status')

        qs = (
            Title.objects.filter(
                user=user,
                name__icontains=search_param,
            )
            .prefetch_related("categories", "actors", "platforms", "trackings")
        )

        # Filtro por tipo (serie o película)
        if type_param:
            qs = qs.filter(type=type_param)

        # Filtro por categorías
        if category_ids_param:
            qs = qs.filter(categories__id__in=category_ids_param).distinct()

        # Filtro por status de tracking
        if status_param:
            qs = qs.filter(trackings__status__in=status_param).distinct()

        # Orden por defecto, ya con id como desempate
        ordering_fields = ["-created_at", "id"]

        if ordering_param:
            raw_fields = [f.strip() for f in ordering_param.split(",") if f.strip()]

            cleaned = []
            for f in raw_fields:
                prefix = "-" if f.startswith("-") else ""
                field_name = f.lstrip("-")

                if field_name in self.base_ordering_fields:
                    cleaned.append(prefix + field_name)

            if cleaned:
                # Siempre añadimos 'id' al final para romper empates
                if not any(f in cleaned for f in ("id", "-id")):
                    cleaned.append("id")
                ordering_fields = cleaned

        return qs.order_by(*ordering_fields)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """
        Usamos TitleWriteSerializer para validar/crear
        y respondemos con TitleSerializer como en el detalle.
        """
        write_serializer = TitleWriteSerializer(
            data=request.data,
            context=self.get_serializer_context(),
        )
        write_serializer.is_valid(raise_exception=True)
        title = write_serializer.save(user=request.user)

        read_serializer = TitleSerializer(
            title,
            context=self.get_serializer_context(),
        )
        return Response(read_serializer.data, status=status.HTTP_201_CREATED)


class TitleDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Title.objects.all()

    def get_serializer_class(self):
        # Para GET usamos el serializer de lectura
        if self.request.method == "GET":
            return TitleSerializer
        # Para PUT/PATCH usaremos manualmente TitleWriteSerializer en update
        return TitleWriteSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        # 1) Validar y guardar con el serializer de escritura
        write_serializer = TitleWriteSerializer(
            instance, data=request.data, partial=partial, context=self.get_serializer_context()
        )
        write_serializer.is_valid(raise_exception=True)
        self.perform_update(write_serializer)

        # 2) Responder con el serializer de lectura
        read_serializer = TitleSerializer(
            instance, context=self.get_serializer_context()
        )
        return Response(data=read_serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({
            "status": True,
            "message": "Título eliminado correctamente"
        }, status=200)  # ✅ 200 en lugar de 204


class ActorDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Actor.objects.all()

    def get_serializer_class(self):
        # Para GET usamos el serializer de lectura
        if self.request.method == "GET":
            return ActorSerializer
        # Para PUT/PATCH usaremos manualmente TitleWriteSerializer en update
        return ActorWriteSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        # 1) Validar y guardar con el serializer de escritura
        write_serializer = ActorWriteSerializer(
            instance, data=request.data, partial=partial, context=self.get_serializer_context()
        )
        write_serializer.is_valid(raise_exception=True)
        self.perform_update(write_serializer)

        # 2) Responder con el serializer de lectura
        read_serializer = ActorSerializer(
            instance, context=self.get_serializer_context()
        )
        return Response(data=read_serializer.data)


class CategoriesAPIView(ListAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.all().order_by("name")
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ["name"]


class ActorsAPIView(ListAPIView):
    # serializer_class = ActorSerializer
    # permission_classes = [IsAuthenticated]
    # queryset = Actor.objects.all().order_by("name")
    # filter_backends = [SearchFilter]
    # search_fields = ["name"]

    serializer_class = ActorSerializer
    queryset = Actor.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ["name"]

    def get_queryset(self):
        queryset = super().get_queryset()
        ordering_param = self.request.query_params.get('ordering', 'name')
        return queryset.order_by(ordering_param)


class PlatformsAPIView(ListAPIView):
    serializer_class = PlatformSerializer
    queryset = Platform.objects.all().order_by("name")
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ["name"]


class TrackingStatusListAPIView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TrackingStatusOptionSerializer

    def get(self, request, *args, **kwargs):
        data = [
            {"status": value, "status_display": label}
            for value, label in Tracking.STATUS_CHOICES
        ]
        return Response(data)


class TitlesApiSearchExternalView(View):

    def get(self, request):
        title_id = request.GET.get('id')
        delete = request.GET.get('delete') == 'true'

        # ELIMINAR TITLE LOCAL
        if delete and title_id:
            try:
                title = Title.objects.get(id=title_id, user=request.user)
                title.delete()
                return JsonResponse({
                    "status": True,
                    "msg": "Título eliminado"
                })
            except Title.DoesNotExist:
                return JsonResponse({
                    "status": False,
                    "msg": "No existe"
                })

        TMDB_URL = "https://api.themoviedb.org/3"

        text = request.GET.get('text', '')
        media_type = request.GET.get('media_type', '')
        headers = {
            "accept": "application/json",
            'Authorization': f'Bearer {settings.TMDB_ACCESS_TOKEN}'
        }

        if text:

            # Buscar Serie / Película
            url = f"{TMDB_URL}/search/multi?query={text}&include_adult=false&language=es-ES"

            response = requests.get(url, headers=headers)
            data = response.json()

            titles = []
            status = True

            for title in data['results']:
                media_type = title['media_type']
                if media_type != 'person':
                    title_info = {
                        'id': title['id'],
                        'name': title['name'] if media_type == 'tv' else title['title'],
                        'year': (title['first_air_date'] if media_type == 'tv' else title['release_date'])[:4],
                        'media_type': media_type
                    }
                    titles.append(title_info)

            if len(titles):
                msg = f'Total: {len(titles)}'
            else:
                status = False
                msg = 'No se encontraron resultados'

            return JsonResponse({
                'status': status,
                'msg': msg,
                'titles': titles
            })

        elif title_id:

            # Obtener información detallada de título
            url = f"{TMDB_URL}/{media_type}/{title_id}?language=es-ES"

            params = {
                'language': 'es-ES',
                'append_to_response': 'credits'
            }

            response = requests.get(url, headers=headers, params=params)
            json = response.json()

            # Título
            name = json['name'] if media_type == 'tv' else json['title']

            # Título original
            original_name = json['original_name'] if media_type == 'tv' else json['original_title']
            translation = translate(original_name)
            original_title = f"{original_name} (Google Translator: {translation.capitalize()})"

            # Año
            year = (json['first_air_date'] if media_type == 'tv' else json['release_date'])[:4]

            # Descripción
            description = json['overview']

            # Categorías
            categories = [item["name"] for item in json['genres']]

            # Actores
            language = json['original_language']
            languages = ['ja', 'ko', 'zh']
            actors = [romanize_text(item["name"], language) if language in languages else item["name"]
                      for item in json['credits']['cast'][:5]]

            # Plataformas

            platforms = [item["name"] for item in json['networks']] if json.get('networks') else []

            # print('------------- 0 -------------', flush=True)
            # print(json['id'], flush=True)
            # print(name, flush=True)
            # print(original_title, flush=True)
            # print(year, flush=True)
            # print(media_type, flush=True)
            # print(description, flush=True)
            # print(categories, flush=True)
            # print(actors, flush=True)
            # print(platforms, flush=True)
            # print('------------- FIN -------------', flush=True)

            title_info = {
                'name': name,
                'original_title': original_title,
                'year': year,
                'type': media_type,
                'description': description,
                'categories': categories,
                'actors': actors,
                'platforms': platforms,
            }

            return JsonResponse({
                "title_info": title_info
            })
