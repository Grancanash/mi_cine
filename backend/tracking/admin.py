from django.contrib import admin
from .models import Tracking


@admin.register(Tracking)
class TrackingAdmin(admin.ModelAdmin):
    list_display = ("user", "title", "status", "current_episode", "rating", "updated_at")
    list_filter = ("status", "updated_at")
    search_fields = ("user__username", "title__name")
