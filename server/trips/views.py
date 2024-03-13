import jwt
from rest_framework import generics, status
from rest_framework_simplejwt.views import TokenObtainPairView as Token
from rest_framework.response import Response
from .serializers import UserSerializer, LoginSerializer, TripSerializer, DriverSerializer, VerifyEmailSerializer
from .models import Trip, Driver, User
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .utils import Util
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.conf import settings

class UserSignUpView(generics.GenericAPIView):
    serializer_class = UserSerializer
    
    def post(self, request):
        user = request.data
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        user_data = serializer.data
        user=User.objects.get(email=user_data['email'])

        token = RefreshToken.for_user(user).access_token
        current_site = get_current_site(request).domain
        relative_link = reverse('email-verify-user')
        abs_url = f'http://{current_site}{relative_link}?token={token}'
        email_body=f'Hey {user.full_name} \nThank you for signing up for a Toota account, just one more step!\nFor security purposes, Please verify your email address using the link below \n {abs_url}'
        data={
            'email_body': email_body,
            'domain': abs_url, 
            'to_email': user.email,
            'email_subject': 'Please verify your Toota Account'}
        Util.send_email(data)
        return Response(user_data, status=status.HTTP_201_CREATED)
    
    
class VerifyEmailUser(generics.GenericAPIView):
    def get(self, request):
        serializer = VerifyEmailSerializer(data=request.GET)
        serializer.is_valid(raise_exception=True)

        token = serializer.validated_data['token']

        try:
            payload = jwt.decode(token, settings.SECRET_KEY)
            user = User.objects.get(id=payload['user_id'])

            if not user.is_verified:
                user.is_verified = True
                user.save()

            return Response({'account': 'Successfully activated'}, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError:
            return Response({'error': "Activation link expired"}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError:
            return Response({'error': "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
    
class DriverSignUpView(generics.GenericAPIView):
    serializer_class = DriverSerializer
    
    def post(self, request):
        driver = request.data
        serializer = self.serializer_class(data=driver)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        driver_data = serializer.data
        
        driver=Driver.objects.get(email=driver_data['email'])

        token = RefreshToken.for_user(driver).access_token
        current_site = get_current_site(request).domain
        relative_link = reverse('email-verify-driver')
        abs_url = f'http://{current_site}{relative_link}?token={token}'
        email_body=f'Hey {driver.full_name} \n\nThank you for signing up for a Toota account, just one more step!.\n\nFor security purposes, Please verify your email address using the link below \n {abs_url}'
        data={
            'email_body': email_body,
            'domain': abs_url, 
            'to_email': driver.email,
            'email_subject': 'Please verify your Toota Account'}
        Util.send_email(data)
        return Response(driver_data, status=status.HTTP_201_CREATED)
    
    
class VerifyEmailDriver(generics.GenericAPIView):
    def get(self, request):
        serializer = VerifyEmailSerializer(data=request.GET)
        serializer.is_valid(raise_exception=True)

        token = serializer.validated_data['token']
        try:
            payload = jwt.decode(token, settings.SECRET_KEY)
            user = User.objects.get(id=payload('user_id'))
            if not user.is_verified:
                user.is_verified = True
                user.save()
            return Response({'account': 'Successfully activated'}, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError as identifier:
            return Response({'error': "Activation link expired"}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError as identifier:
            return Response({'error': "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(Token):
    serializer_class = LoginSerializer

    
    
class TripView(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'id'
    lookup_url_kwarg = 'trip_id'
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    