from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


from .models import Trip, Driver, User

class UserSerializer(serializers.ModelSerializer):
    password1=serializers.CharField(
        max_length=68,
        min_length=8,
        write_only=True)
    password2=serializers.CharField(
        max_length=68,
        min_length=8,
        write_only=True)
    
 
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone_number', 'password1', 'password2']
    
   
    def validate(self, attrs):
        
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError('Passwords must match.')
        
        if not attrs['full_name'].replace(" ", "").isalpha():
            raise serializers.ValidationError(
                {"full_name": "Full name should only contain letters"}
            )
        if len(attrs['phone_number']) != 10:
            raise serializers.ValidationError(
                {"phone_number": "Phone number should have 10 digits"}
            )
            
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError(
                {"email": "Email is already in use"}
            )
        return super().validate(attrs)
    
    def create(self, validated_data):
        data = {
            key: value for key, value in validated_data.items()
            if key not in ('password1', 'password2')
        }
        data['password'] = validated_data['password1']
        return User.objects.create_user(**data)
    
        
class DriverSerializer(serializers.ModelSerializer):
    password1=serializers.CharField(
        max_length=68,
        min_length=8,
        write_only=True)
    password2=serializers.CharField(
        max_length=68,
        min_length=8,
        write_only=True)
    
    class Meta:
        model = Driver
        fields = ['id','email', 'full_name', 'phone_number', 'physical_address', 'vehicle_registration', 'vehicle_type', 'licence_no','password1', 'password2']
        
    def validate(self, attrs):
        
        if not attrs['full_name'].isalpha():
            raise serializers.ValidationError(
                {"full_name": "Full name should only contain letters"}
            )
        
            
        if len(attrs['phone_number']) != 10:
            raise serializers.ValidationError(
                {"phone_number": "Phone number should have 10 digits"}
            )
            
        if Driver.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError(
                {"email": "Email is already in use"}
            )
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match"}
            )
                
        if Driver.objects.filter(licence_no=attrs['licence_no']).exists():
            raise serializers.ValidationError(
                {'licence_no': 'Licence Number already exists'}
            )
            
        if Driver.objects.filter(vehicle_registration=attrs['vehicle_registration']).exists():
            raise serializers.ValidationError(
                {'vehichle_registration': 'Vehicle_Registration already exists'}
            )
        
        if not attrs['physical_address']:
            raise serializers.ValidationError(
                {'physical address': 'Physical Address is required'}
            )
            
        return super().validate(attrs)
    
    def create(self, validated_data):
        data = {
            key: value for key, value in validated_data.items()
            if key not in ('password1', 'password2')
        }
        data['password'] = validated_data['password1']
       
        return User.objects.create_driver(**data)
    
            
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
        
        
class VerifyEmailSerializer(serializers.Serializer):
    token = serializers.CharField()

        

                