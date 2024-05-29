from rest_framework import serializers
from .models import Trip, Payment, PickupLocation, DropoffLocation
from authentication.serializers import UserSerializer, DriverSerializer

class PickupLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupLocation
        fields = '__all__'


class DropoffLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DropoffLocation
        fields = '__all__'



class TripSerializer(serializers.ModelSerializer):
    pickup_location = PickupLocationSerializer()
    dropoff_location = DropoffLocationSerializer()

    class Meta:
        model = Trip
        fields = '__all__'
        read_only_fields = ('id', 'created', 'updated')

    def create(self, validated_data):
        pickup_location_data = validated_data.pop('pickup_location')
        dropoff_location_data = validated_data.pop('dropoff_location')
        pickup_location = PickupLocation.objects.create(**pickup_location_data)
        dropoff_location = DropoffLocation.objects.create(**dropoff_location_data)
        trip = Trip.objects.create(pickup_location=pickup_location, dropoff_location=dropoff_location, **validated_data)
        return trip

    def update(self, instance, validated_data):
        pickup_location_data = validated_data.pop('pickup_location')
        pickup_location = instance.pickup_location
        dropoff_location_data = validated_data.pop('dropoff_location')
        DropoffLocation = instance.dropoff_location

        # Update PickupLocation fields
        pickup_location.location = pickup_location_data.get('location', pickup_location.location)
        pickup_location.phone_number = pickup_location_data.get('phone_number', pickup_location.phone_number)
        pickup_location.save()

        # Update DroffLocation fields
        dropoff_location.location = dropoff_location_data.get('location', dropoff_location.location)
        dropoff_location.phone_number = dropoff_location_data.get('phone_number', dropoff_location.phone_number)
        dropoff_location.save()

        # Update trip fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ('id', 'payment_date', 'order_number')










    



        
        



        

                