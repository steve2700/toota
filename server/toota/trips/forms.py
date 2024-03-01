from django.contrib.auth.forms import UserChangeForm, UserCreationForm

from .models import User, Driver

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('full_name', 'email', 'phone_number')
        
class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = User
        fields = ('full_name', 'email', 'phone_number')

