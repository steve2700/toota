from django.shortcuts import render

# Create your views here.

from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView as Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer, LoginSerializer, TripSerializer, DriverSerializer
from .models import Trip, Driver, User
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.response import Response
from djoser.views import UserViewSet
from rest_framework.decorators import api_view



@api_view(['POST'])
def admin_signup(request):
    if request.method == 'POST':
        serializer = UserAdminSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save(is_staff=True, is_superuser=True)
            return Response({'message': 'Admin user created successfully'}, status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserSignUpView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
class LoginView(Token):
    serializer_class = LoginSerializer
    
class DriverSignUpView(generics.CreateAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    
    
    
class TripView(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'id'
    lookup_url_kwarg = 'trip_id'
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    
