# NUEVO DJANGO-REACT
from rest_framework import serializers
from .models import Actor, Category, Platform, Title
from tracking.models import Tracking


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class ActorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actor
        fields = ['id', 'name', 'sex', 'birth_date', 'nationality']


class PlatformSerializer(serializers.ModelSerializer):
    class Meta:
        model = Platform
        fields = ['id', "name"]


class TrackingSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Tracking
        fields = ["status", 'status_display', "rating", "current_episode", "opinion"]


class TrackingWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tracking
        fields = ["status", "rating", "current_episode", "opinion"]


class TrackingStatusOptionSerializer(serializers.Serializer):
    status = serializers.CharField()
    status_display = serializers.CharField()


class TitleSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source="get_type_display", read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    actors = ActorSerializer(many=True, read_only=True)
    platforms = PlatformSerializer(many=True, read_only=True)
    tracking = serializers.SerializerMethodField()

    class Meta:
        model = Title
        fields = [
            "id",
            "name",
            'original_title',
            "year",
            "type",
            "type_display",
            "description",
            "seasons",
            "categories",
            "actors",
            "platforms",
            "tracking",
        ]

    def get_tracking(self, obj):
        """Devuelve el tracking del usuario actual para este título, o null."""
        request = self.context.get("request")
        if request is None or request.user.is_anonymous:
            return None

        tracking = obj.trackings.filter(user=request.user).first()
        if not tracking:
            return None

        return TrackingSerializer(tracking, context=self.context).data


class TitleWriteSerializer(serializers.ModelSerializer):
    categories = serializers.ListField(child=serializers.DictField())
    actors = serializers.ListField(child=serializers.DictField())
    platforms = serializers.ListField(child=serializers.DictField())
    tracking = TrackingWriteSerializer(required=False)

    class Meta:
        model = Title
        fields = [
            "id",
            "name",
            'original_title',
            "year",
            "type",
            "description",
            "seasons",
            "categories",
            "actors",
            "platforms",
            'tracking'
        ]

    def _process_catalogs(self, Catalog, catalogs_data):
        catalog_instances = []
        for item in catalogs_data:
            id = item.get("id")
            name = item.get("name", "").strip()

            if id:
                # Categoría ya existente
                catalog = Catalog.objects.get(pk=id)
            else:
                # Sin id -> crear (o get_or_create si quieres evitar duplicados por nombre)
                catalog, _ = Catalog.objects.get_or_create(name=name)

            catalog_instances.append(catalog)
        return catalog_instances

    def _upsert_tracking(self, title, tracking_data):
        """
        Crea o actualiza el tracking del usuario actual para este título.
        Respeta unique_together = (user, title).
        """
        request = self.context.get("request")
        user = getattr(request, "user", None)

        if not user or not user.is_authenticated:
            return
        tracking, _ = Tracking.objects.get_or_create(
            user=user,
            title=title,
            defaults=tracking_data,
        )

        # Si ya existía, actualiza campos
        for field, value in tracking_data.items():
            setattr(tracking, field, value)

        tracking.full_clean()
        tracking.save()

    def create(self, validated_data):
        request = self.context.get("request")
        validated_data["user"] = request.user

        categories_data = validated_data.pop("categories", [])
        actors_data = validated_data.pop("actors", [])
        platforms_data = validated_data.pop("platforms", [])
        tracking_data = validated_data.pop("tracking", None)

        title = super().create(validated_data)

        categories = self._process_catalogs(Category, categories_data)
        actors = self._process_catalogs(Actor, actors_data)
        platforms = self._process_catalogs(Platform, platforms_data)

        title.categories.set(categories)
        title.actors.set(actors)
        title.platforms.set(platforms)

        if tracking_data is not None:
            self._upsert_tracking(title, tracking_data)

        return title

    def update(self, instance, validated_data):
        categories_data = validated_data.pop("categories", None)
        actors_data = validated_data.pop("actors", None)
        platforms_data = validated_data.pop("platforms", None)
        tracking_data = validated_data.pop("tracking", None)

        title = super().update(instance, validated_data)

        if categories_data is not None:
            categories = self._process_catalogs(Category, categories_data)
            title.categories.set(categories)
        if actors_data is not None:
            actors = self._process_catalogs(Actor, actors_data)
            title.actors.set(actors)
        if platforms_data is not None:
            platforms = self._process_catalogs(Platform, platforms_data)
            title.platforms.set(platforms)

        if tracking_data is not None:
            self._upsert_tracking(title, tracking_data)

        return title


class ActorWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actor
        fields = [
            "id",
            "name",
            'sex',
            "birth_date",
            "nationality",
        ]

    def update(self, instance, validated_data):
        actor = super().update(instance, validated_data)
        return actor
