# Generated by Django 5.0.2 on 2024-03-25 10:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='driver',
            name='identity_document',
            field=models.ImageField(blank=True, null=True, upload_to='static/media/identity_document'),
        ),
    ]
