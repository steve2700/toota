from rest_framework import serializers
from .models import Trip, TripPayment

class TripPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripPayment
        fields = ['id', 'trip', 'driver', 'amount_paid', 'payment_status', 'payment_date']
    
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
        
        



        

                