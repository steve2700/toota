from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Trip, Payment
from authentication.models import Driver
from .serializers import TripSerializer, PaymentSerializer
from rest_framework.exceptions import NotFound, ValidationError
from django.utils import timezone
from django.db.models import Count
import logging
import calendar

logger = logging.getLogger(__name__)

class IsOwnerOrDriver(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        logger.debug(f"User: {request.user}, Driver: {obj.driver}")
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user or (obj.driver and obj.driver.user == request.user)

class TripListCreateView(generics.ListCreateAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
            logger.info(f"Trip created successfully by user: {self.request.user}")
        except Exception as e:
            logger.error(f"Error creating trip: {str(e)}")
            raise ValidationError({"detail": "Error occurred during trip creation."})

class TripRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    lookup_field = 'pk'
    permission_classes = [IsOwnerOrDriver]

    def perform_update(self, serializer):
        try:
            serializer.save(driver=self.request.user.driver)
            logger.info(f"Trip updated successfully by driver: {self.request.user.driver}")
        except Exception as e:
            logger.error(f"Error updating trip: {str(e)}")
            raise ValidationError({"detail": "Error occurred during trip update."})

    def perform_destroy(self, instance):
        try:
            super().perform_destroy(instance)
            logger.info(f"Trip deleted successfully by user: {self.request.user}")
        except Exception as e:
            logger.error(f"Error deleting trip: {str(e)}")
            raise ValidationError({"detail": "Error occurred during trip deletion."})

class TripRetrieveByDriverView(generics.ListAPIView):
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        driver_id = self.kwargs['driver_id']
        try:
            driver = Driver.objects.get(id=driver_id)
            logger.info(f"Retrieving trips for driver: {driver_id}")
            return Trip.objects.filter(driver=driver)
        except Driver.DoesNotExist:
            logger.error(f"Driver not found with ID: {driver_id}")
            raise NotFound({"detail": "Driver not found."})

class TripListView(generics.ListAPIView):
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        logger.info("Fetching all trips ordered by pickup time")
        return Trip.objects.order_by('-pickup_time')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        in_progress_count = queryset.filter(status='IN_PROGRESS').count()
        completed_count = queryset.filter(status='COMPLETED').count()

        logger.info(f"Returning trip list. In-progress: {in_progress_count}, Completed: {completed_count}")
        return Response({
            "trips": serializer.data,
            "in_progress_count": in_progress_count,
            "completed_count": completed_count
        }, status=status.HTTP_200_OK)

class TripCompletedCountView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TripSerializer

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
        try:
            serializer.save()
            logger.info("Payment created successfully.")
        except Exception as e:
            logger.error(f"Error creating payment: {str(e)}")
            raise ValidationError({"detail": "Error occurred during payment creation."})

class PaymentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        try:
            serializer.save()
            logger.info(f"Payment updated successfully for ID: {serializer.instance.id}")
        except Exception as e:
            logger.error(f"Error updating payment: {str(e)}")
            raise ValidationError({"detail": "Error occurred during payment update."})

    def perform_destroy(self, instance):
        try:
            super().perform_destroy(instance)
            logger.info(f"Payment deleted successfully for ID: {instance.id}")
        except Exception as e:
            logger.error(f"Error deleting payment: {str(e)}")
            raise ValidationError({"detail": "Error occurred during payment deletion."})

class DriverAcceptanceRateView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, driver_id):
        try:
            driver = Driver.objects.get(id=driver_id)
            total_trips = Trip.objects.filter(driver=driver).count()
            accepted_trips = Trip.objects.filter(driver=driver, status='ACCEPTED').count()
            acceptance_rate = (accepted_trips / total_trips) * 100 if total_trips > 0 else 0
            logger.info(f"Driver {driver_id} acceptance rate: {acceptance_rate:.2f}%")
            return Response({'acceptance_rate': round(acceptance_rate, 2)}, status=status.HTTP_200_OK)
        except Driver.DoesNotExist:
            logger.error(f"Driver not found with ID: {driver_id}")
            return Response({'detail': 'Driver not found.'}, status=status.HTTP_404_NOT_FOUND)

class DriverTotalTripsCompletedView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, driver_id):
        try:
            driver = Driver.objects.get(id=driver_id)
            total_trips = Trip.objects.filter(driver=driver).count()
            completed_trips = Trip.objects.filter(driver=driver, status='COMPLETED').count()
            logger.info(f"Driver {driver_id} completed {completed_trips} of {total_trips} trips.")
            return Response({
                'total_trips_completed': f"{completed_trips}/{total_trips}",
                'completion_percentage': round((completed_trips / total_trips) * 100 if total_trips > 0 else 0, 2)
            }, status=status.HTTP_200_OK)
        except Driver.DoesNotExist:
            logger.error(f"Driver not found with ID: {driver_id}")
            return Response({'detail': 'Driver not found.'}, status=status.HTTP_404_NOT_FOUND)

class DriverDailyEarningsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, driver_id, date):
        try:
            # Parse the date
            date = timezone.datetime.strptime(date, '%Y-%m-%d').date()
            start_of_day = timezone.make_aware(timezone.datetime.combine(date, timezone.datetime.min.time()))
            end_of_day = timezone.make_aware(timezone.datetime.combine(date, timezone.datetime.max.time()))
            
            # Filter payments
            payments = Payment.objects.filter(driver_id=driver_id, payment_date__range=(start_of_day, end_of_day))
            total_earnings_before_compensation = sum(payment.amount_paid for payment in payments)
            total_compensation = total_earnings_before_compensation * 0.20
            total_earnings_after_compensation = total_earnings_before_compensation - total_compensation
            
            logger.info(f"Driver {driver_id} earnings for {date}: {total_earnings_after_compensation} after compensation.")
            return Response({
                'driver_id': driver_id,
                'date': date,
                'total_earnings_before_compensation': total_earnings_before_compensation,
                'total_compensation': total_compensation,
                'total_earnings_after_compensation': total_earnings_after_compensation,
                'total_payments_count': payments.count(),
            }, status=status.HTTP_200_OK)
        except ValueError:
            logger.error("Invalid date format provided.")
            return Response({'detail': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error calculating daily earnings: {str(e)}")
            return Response({'detail': 'Error calculating daily earnings.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

