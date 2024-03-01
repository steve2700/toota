import json
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from rest_framework import status
from trips.serializers import UserSerializer, DriverSerializer, TripSerializer
from trips.utils import VEHICLE_TYPES


class AuthenticationTestCase(APITestCase):
    def test_user_can_sign_up(self):
        data = {
            "full_name": "John Doe",
            "email": "testuser@gmail.com",
            "phone_number": "0712345678",
            "password1": "@Thingo11",
            "password2": "@Thingo11"
        }
        response = self.client.post('/api/user/sign_up/', data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['email'], data['email'])
        self.assertEqual(response.data['full_name'], data['full_name'])
        self.assertEqual(response.data['phone_number'], data['phone_number'])
        self.assertFalse('password1' in response.data)
        
    def test_driver_can_sign_up(self):
        data = {
            "full_name": "Jane Doe",
            "email": "jane@test.com",
            "phone_number": "071234578",
            "physical_address": "Nairobi",
            "vehicle_registration": "KCA 123X",
            "vehicle_type": VEHICLE_TYPES[0][0],
            "licence_no": "123456",
            "password1": "@Thingo11",
            "password2": "@Thingo11"
        }
        response = self.client.post('/api/driver/sign_up/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['email'], data['email'])
        self.assertEqual(response.data['full_name'], data['full_name'])
        self.assertEqual(response.data['phone_number'], data['phone_number'])
        self.assertEqual(response.data['physical_address'], data['physical_address'])
        self.assertEqual(response.data['vehicle_registration'], data['vehicle_registration'])
        self.assertEqual(response.data['vehicle_type'], data['vehicle_type'])
        self.assertEqual(response.data['licence_no'], data['licence_no'])
        self.assertFalse('password1' in response.data)
            
        
      
    
 