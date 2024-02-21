"""toota URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import  TokenRefreshView

from trips.views import SignUpView, LoginView, SendEmailConfirmationAPIView, UserInformationAPIView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/sign_up/', SignUpView.as_view(), name='sign_up'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/user_info/', UserInformationAPIView.as_view(), name='user_info'),
    path('api/send_email_confirmation/', SendEmailConfirmationAPIView.as_view(), name='send_email_confirmation'),
    path('api/trip', include('trips.urls', 'trip',))
    
]
