from urllib.parse import parse_qs
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from channels.auth import AuthMiddleware
from channels.db import database_sync_to_async
from channels.sessions import CookieMiddleware, SessionMiddleware
from rest_framework_simplejwt.tokens import AccessToken
from authentication.models import User, Driver

User = get_user_model()

@database_sync_to_async
def get_user(scope):
    close_old_connections()
    query_string = parse_qs(scope['query_string'].decode())
    token = query_string.get('token')
    if not token:
        return AnonymousUser()
    try:
        access_token = AccessToken(token['access'])
        user = User.objects.get(id=access_token['user_id'])
        print(user)

    except Exception as e:
        return AnonymousUser()
    
    if not user.is_active:
        return AnonymousUser()

    return user


@database_sync_to_async
def get_driver(scope):
    close_old_connections()
    query_string = parse_qs(scope['query_string'].decode())
    token = query_string.get('token')
    if not token:
        return AnonymousUser()
    try:
        access_token = AccessToken(token['access'])
        driver = Driver.objects.get(id=access_token['user_id'])
        print(driver)

    except Exception as e:
        return AnonymousUser()
    
    if not driver.is_active:
        return AnonymousUser()

    return driver

class TokenAuthMiddleware(AuthMiddleware):
    async def resolve_scope(self, scope):
        user = await get_user(scope)
        driver = await get_driver(scope)

        scope['user']._wrapped = user
        if not user:
            scope['user']._wrapped = driver

def TokenAuthMiddlewareStack(inner):
    return CookieMiddleware(SessionMiddleware(TokenAuthMiddleware(inner)))