from rest_framework import generics, status, views, permissions, viewsets
from .models import Trip, TripPayment
from .serializers import TripSerializer, TripPaymentSerializer
from django.db.models import Q
from django.http import HttpResponsePermanentRedirect
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from authentication.models import Driver

class TripPaymentView(generics.GenericAPIView):
   
    permission_classes = [IsAuthenticated,]
    serializer_class = TripPaymentSerializer

    def post(request, *args, **kwargs):
        driver_id = request.data.get('driver_id')
        trip_id = request.data.get('trip_id')

        try:
            driver = Driver.objects.get(id=driver_id)
            trip = Trip.objects.get(id=trip_id)

            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            payment_instance = serializer.instance
            payment_instance.payment_status = 'PAID'  # Change payment_status to 'PAID'
            payment_instance.save()

            return Response({'message': 'Payment created successfully'}, status=status.HTTP_201_CREATED)

            return Response({'message': 'Payment created successfully'}, status=status.HTTP_201_CREATED)
        except Driver.DoesNotExist:
            return Response({'error': 'Driver not found'}, status=status.HTTP_404_NOT_FOUND)
        except Trip.DoesNotExist:
            return Response({'error': 'Trip not found'}, status=status.HTTP_404_NOT_FOUND)
        




class TripView(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'id'
    lookup_url_kwarg = 'trip_id'
    permission_classes = (permissions.IsAuthenticated,)
    
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

    def get_queryset(self):
        user = self.request.user 
        
        if user.group == 'driver':
            return Trip.objects.filter(
                Q(status=Trip.REQUESTED) | Q(driver=driver))

        if user.group == 'user':
            return Trip.objects.filter(user=user)
        return Trip.objects.none()