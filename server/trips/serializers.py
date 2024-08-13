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
        pickup_location_data = validated_data.pop('pickup_location', None)
        dropoff_location_data = validated_data.pop('dropoff_location', None)

        # Update PickupLocation fields if data is present
        if pickup_location_data:
            pickup_location = instance.pickup_location
            pickup_location.location = pickup_location_data.get('location', pickup_location.location)
            pickup_location.phone_number = pickup_location_data.get('phone_number', pickup_location.phone_number)
            pickup_location.save()

        # Update DropoffLocation fields if data is present
        if dropoff_location_data:
            dropoff_location = instance.dropoff_location
            dropoff_location.location = dropoff_location_data.get('location', dropoff_location.location)
            dropoff_location.phone_number = dropoff_location_data.get('phone_number', dropoff_location.phone_number)
            dropoff_location.save()

        # Update trip fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update driver's acceptance rate if status is updated to 'ACCEPTED'
        if instance.status == 'ACCEPTED' and instance.driver:
            instance.driver.update_acceptance_rate()

        return instance

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id', 'trip', 'driver', 'amount_paid', 
            'compensation_amount', 'net_amount', 
            'payment_status', 'payment_date', 'order_number'
        ]
        read_only_fields = ('id', 'payment_date', 'order_number')

    def create(self, validated_data):
        # Create and save Payment instance with calculated values
        payment = Payment(
            trip=validated_data.get('trip'),
            driver=validated_data.get('driver'),
            amount_paid=validated_data.get('amount_paid'),
            payment_status=validated_data.get('payment_status', Payment.PENDING)
        )
        payment.save()
        return payment

    def update(self, instance, validated_data):
        # Update Payment instance with validated data
        instance.trip = validated_data.get('trip', instance.trip)
        instance.driver = validated_data.get('driver', instance.driver)
        instance.amount_paid = validated_data.get('amount_paid', instance.amount_paid)
        instance.payment_status = validated_data.get('payment_status', instance.payment_status)

        # Calculate new compensation and net amounts
        instance.compensation_amount = instance.amount_paid * 0.20
        instance.net_amount = instance.amount_paid - instance.compensation_amount

        instance.save()
        return instance
