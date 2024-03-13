import datetime
import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.shortcuts import reverse
from django.conf import settings
from .utils import VEHICLE_TYPES
from .managers import UserManager, DriverUserManager
from django.utils.translation import gettext_lazy as _
from django.utils import timezone


class User(AbstractBaseUser, PermissionsMixin):
    username= None
    
    email = models.EmailField(unique=True, null=False, blank=False, max_length=255, db_index=True)
    phone_number = models.CharField(max_length=12, unique=True)
    full_name = models.CharField(max_length=255, null=False, blank=False)
    profile_picture = models.ImageField(upload_to='static/media/profile_pictures', null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now_add=True)
    is_email_confirmed = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)

    

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'phone_number']
    objects = UserManager()

    def __str__(self):
        return self.email

    def get_full_name(self):
        return self.full_name
    
    def get_phone_number(self):
        return self.phone_number
    
    def token(self):
        return ''
    
    
class Driver(User):
    username = None
    vehicle_registration_no = models.CharField(max_length=100, unique=True, null=False, blank=False, default='')
    vehicle_type = models.CharField(max_length=100, choices=VEHICLE_TYPES, null=False, blank=False, default='Bike')
    licence_no = models.CharField(max_length=100, unique=True, null=False, blank=False, verbose_name=_("Driver's Licence Number"), default='')
    physical_address = models.CharField(max_length=300, null=False, blank=False, default='')
    driver_licence  = models.ImageField(upload_to='static/media/driver_licence', null=True, blank=True)
    vehicle_registration  = models.ImageField(upload_to='static/media/vehicle_registration', null=True, blank=True)
    criminal_record_check = models.ImageField(upload_to='static/media/criminal_record_check', null=True, blank=True)


    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'phone_number', 'physical_address', 'vehicle_registration', 'vehicle_type', 'licence_no']

    objects = DriverUserManager()
    
        
    def save(self, *args, **kwargs):
        self.is_staff = True  # Drivers are staff
        super().save(*args, **kwargs)
        
    def __str__(self):
        return self.full_name

    
    
        
class Trip(models.Model):
    
    REQUESTED = 'REQUESTED'
    ACCEPTED = 'ACCEPTED'
    IN_PROGRESS = 'IN_PROGRESS'
    CANCELLED = 'CANCELLED'
    COMPLETED = 'COMPLETED'
    TRIP_STATUS = (
        (REQUESTED, 'REQUESTED'),
        (ACCEPTED, 'ACCEPTED'),
        (CANCELLED, 'CANCELLED'),
        (COMPLETED, 'COMPLETED'),
        (IN_PROGRESS, 'IN_PROGRESS')
    )
   
    id = models.UUIDField(primary_key=True, default=uuid.uuid4,  editable=False, unique=True)     
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    pickup_time = models.DateTimeField(default=timezone.now)
    dropoff_contact_number = models.CharField(max_length=20, null=True)
    load_description = models.TextField(blank=False, null=False, default='', max_length=500)
    driver = models.ForeignKey(
        settings.AUTH_DRIVER_MODEL, 
        on_delete=models.DO_NOTHING, 
        null=True,
        blank=True,
        related_name='trip_as_driver',
        
        )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
        related_name='trip_as_user',
       
    )
    vehicle_type = models.CharField(max_length=100, choices=VEHICLE_TYPES, null=False, blank=False)
    status = models.CharField(max_length=100, choices=TRIP_STATUS, default=REQUESTED)
    rating = models.IntegerField(default=0)
    bid = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False, default=0.00)
    number_of_floors = models.IntegerField(default=0, null=False)
    is_accepted = models.BooleanField(default=False)
    
    
    def __str__(self):
        return f'{self.id}'
    
    def get_absolute_url(self):
        return reverse('trip:trip_detail', kwargs={'trip_id': self.id})
    
    

    

    