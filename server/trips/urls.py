from django.urls import path, re_path, include
from django.views.generic import TemplateView
from .views import TripView, DriverSignUpView

app_name = 'toota'

urlpatterns = [
    
    path('trip/', TripView.as_view({'get': 'list'}), name='trip-list'),
    path('trip/<uuid:trip_id>', TripView.as_view({'get': 'retrieve'}), name='trip-detail'),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('auth/', include('djoser.urls.jwt')),
]

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]