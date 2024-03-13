from django.core.mail import EmailMessage




VEHICLE_TYPES = (
        ('bike', 'Bike'),
        ('car', 'Car'),
        ('van', 'Van'),
        ('truck_1', '1 ton Truck'),
        ('truck_1.5', '1.5 ton Truck'),
        ('truck_2', '2 ton Truck'),
        ('truck_4', '4 ton Truck'),
    )

class Util:
    @staticmethod
    def send_email(data):
        email=EmailMessage(
            from_email='no-reply@toota.co.za',
            subject=data['email_subject'],
            body=data['email_body'],
            to=[data['to_email']])
        email.send()
    