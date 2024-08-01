# trips/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Trip, Payment
from authentication.models import Driver
from .serializers import TripSerializer, PaymentSerializer
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class IsOwnerOrDriver(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user or obj.driver.user == request.user

class TripListCreateView(generics.ListCreateAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TripRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    lookup_field = 'pk'
    permission_classes = [IsOwnerOrDriver]

    def perform_update(self, serializer):
        trip = serializer.save()
        driver = trip.driver
        if trip.status == 'ACCEPTED':
            driver.total_trips += 1
            driver.accepted_trips += 1
        else:
            driver.total_trips += 1
        driver.update_acceptance_rate()

class TripRetrieveByDriverView(generics.ListAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        driver_id = self.kwargs['driver_id']
        return Trip.objects.filter(driver_id=driver_id)

class TripListView(generics.ListAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Trip.objects.order_by('-pickup_time')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        in_progress_count = queryset.filter(status='IN_PROGRESS').count()
        completed_count = queryset.filter(status='COMPLETED').count()
        return Response({
            "trips": serializer.data,
            "in_progress_count": in_progress_count,
            "completed_count": completed_count
        }, status=status.HTTP_200_OK)

class TripCompletedCountView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TripSerializer
    queryset = Trip.objects.all()

    def get(self, request, *args, **kwargs):
        completed_trips_data = self.get_completed_trips_data()
        return Response(completed_trips_data, status=status.HTTP_200_OK)

    def get_completed_trips_data(self):
        completed_trips_data = []
        for month in range(1, 13):
            month_name = calendar.month_name[month]
            completed_trips_count = self.get_completed_trips_count(month)
            completed_trips_data.append({
                "month": month_name,
                "completed_trips_count": completed_trips_count
            })
        return completed_trips_data

    def get_completed_trips_count(self, month):
        return Trip.objects.filter(status='COMPLETED', pickup_time__month=month).count()

class PaymentListCreateAPIView(generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

class PaymentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

class DriverAcceptanceRateView(generics.RetrieveAPIView):
    queryset = Driver.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        driver = self.get_object()
        return Response({'acceptance_rate': driver.acceptance_rate}, status=status.HTTP_200_OK)

