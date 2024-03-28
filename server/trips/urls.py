from django.urls import path
from .views import TripView, TripPaymentListCreateAPIView, TripPaymentDetailAPIView

app_name = 'toota'

urlpatterns = [
    
    path('', TripView.as_view({'get': 'list'}), name='trip-list'),
    path('<uuid:trip_id>', TripView.as_view({'get': 'retrieve'}), name='trip-detail'),
    path('payments/', TripPaymentListCreateAPIView.as_view(), name='trip-payment-list'),
    path('payments/<uuid:pk>/', TripPaymentDetailAPIView.as_view(), name='trip-payment-detail'),
]