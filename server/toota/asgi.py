"""
ASGI config for toota project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""
import os

from django.core.asgi import get_asgi_application
from django.urls import path

from channels.routing import ProtocolTypeRouter, URLRouter

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'toota.settings')

from toota.middleware import TokenAuthMiddlewareStack 
from trips.consumers import TootaConsumer

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': TokenAuthMiddlewareStack( 
        URLRouter([
            path('toota/', TootaConsumer.as_asgi()),
        ])
    ),
})

