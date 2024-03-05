# Generated by Django 5.0.2 on 2024-03-01 13:43

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trips', '0003_trips_model'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trip',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True),
        ),
    ]
