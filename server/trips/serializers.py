from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from djoser.serializers import UserCreateSerializer

from .models import Trip, Driver, User



class UserSerializer(UserCreateSerializer):
   class Meta(UserCreateSerializer.Meta):
        model = get_user_model()
        ref_name = 'DjoserUser' 
        fields = ('id', 'email', 'full_name', 'phone_number', 'password')
        

# class UserAdminSerializer(UserCreateSerializer):
#     class Meta(UserCreateSerializer.Meta):
#         model = get_user_model()
#         ref_name = 'UserAdmin'
#         fields = ('id', 'email', 'full_name', 'phone_number', 'password' 'is_staff', 'is_active', 'is_superuser')

class DriverSerializer(UserCreateSerializer):

    class Meta(UserCreateSerializer.Meta):
        model = Driver
        ref_name = 'DjoserDriver' 
        fields = ['id','full_name', 'email', 'phone_number', 'physical_address', 'vehicle_registration', 'vehicle_type', 'licence_no', 'password',]

    
            
class LoginSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        user_data =  UserSerializer(user).data
        for key, value in user_data.items():
            if key != 'id':
                token[key] = value
        return token
    
class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = '__all__'
        read_only_fields = ('id', 'created', 'updated')
        
class NestedTripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = '__all__'
        depth = 1
        
        

                