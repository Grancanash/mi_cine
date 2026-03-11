from django import forms
from .models import Tracking


class TrackingForm(forms.ModelForm):
    class Meta:
        model = Tracking
        fields = ["status", "current_episode", "rating", 'opinion']
        widgets = {
            'opinion': forms.Textarea(attrs={
                'rows': 5,
                "class": "textarea textarea-bordered w-full"
            })
        }
