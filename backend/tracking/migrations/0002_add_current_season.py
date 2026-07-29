# Generated migration for current_season field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracking', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='tracking',
            name='current_season',
            field=models.PositiveIntegerField(blank=True, null=True, verbose_name='Temporada actual'),
        ),
    ]
