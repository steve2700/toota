from rest_framework import generics, status, views, permissions, viewsets
from .models import Trip, TripPayment
from .serializers import TripSerializer, TripPaymentSerializer


class IsDriverOnActiveTrip(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user is authenticated and is a driver on an active trip
        return request.user.is_authenticated and request.user.is_driver and request.user.active_trip

class TripPaymentListCreateAPIView(generics.ListCreateAPIView):
    queryset = TripPayment.objects.all()
    serializer_class = TripPaymentSerializer
    permission_classes = [permissions.IsAuthenticated, IsDriverOnActiveTrip]

class TripPaymentDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TripPayment.objects.all()
    serializer_class = TripPaymentSerializer
    permission_classes = [permissions.IsAuthenticated, IsDriverOnActiveTrip]


class TripView(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'id'
    lookup_url_kwarg = 'trip_id'
    permission_classes = (permissions.IsAuthenticated,)
    
    serializer_class = TripSerializer
    