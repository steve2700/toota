from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

def send_confirmation_email(email, token_id, user_id):
    print('Email confimation sent to')
    
VEHICLE_TYPES = (
        ('bike', 'Bike'),
        ('car', 'Car'),
        ('van', 'Van'),
        ('truck_1', '1 ton Truck'),
        ('truck_1.5', '1.5 ton Truck'),
        ('truck_2', '2 ton Truck'),
        ('truck_4', '4 ton Truck'),
    )

def validate_password(password):
        if len(password) < 8:
            raise ValidationError(_('Password must be at least 8 characters long'),
                                   params={'value': password},)
        

def validate_full_name(full_name):
    if len(full_name) < 8:
        raise ValidationError(_('Full name must be at least 8 characters long'),
                                   params={'value': full_name},)
    
def validate_phone_number(phone_number):
    if len(phone_number) < 10:
        raise ValidationError(_('Phone number must be at least 10 characters long'),
                                   params={'value': phone_number},)
        
def validate_vehicle_registration(vehicle_registration):
    if len(vehicle_registration) < 8:
        raise ValidationError(_('Vehicle registration must be at least 8 characters long'),
                                   params={'value': vehicle_registration},)
        
def validate_vehicle_type(vehicle_type):
    if vehicle_type not in VEHICLE_TYPES:
        raise ValidationError(_('Invalid vehicle type'),
                                   params={'value': vehicle_type},)

 