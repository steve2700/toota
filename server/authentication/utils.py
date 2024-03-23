from django.core.mail import EmailMessage
from datetime import datetime
import threading

VEHICLE_TYPES = (
        ('bike', 'Bike'),
        ('car', 'Car'),
        ('van', 'Van'),
        ('truck_1', '1 ton Truck'),
        ('truck_1.5', '1.5 ton Truck'),
        ('truck_2', '2 ton Truck'),
        ('truck_4', '4 ton Truck'),
    )

def get_current_time(format="%Y-%m-%d %H:%M:%S"):
    """
    Get the current time with the specified format.

    Args:
    - format (str): The format string for the time. Defaults to "%Y-%m-%d %H:%M:%S".

    Returns:
    - str: The current time as a string with the specified format.
    """
    current_time = datetime.now()
    return current_time.strftime(format)


class  EmailThread(threading.Thread):
    def __init__(self, email):
        self.email = email
        threading.Thread.__init__(self)


    def run(self):
        self.email.send()


class Util:
    @staticmethod
    def send_email(data):
        email=EmailMessage(
            subject=data['email_subject'],
            body=data['email_body'],
            to=[data['to_email']])
        email.send()
        EmailThread(email).start()