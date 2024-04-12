from rest_framework import serializers
from .models import Trip, TripPayment
from authentication.serializers import UserSerializer, DriverSerializer

class TripPaymentSerializer(serializers.ModelSerializer):

    class Meta:
        model = TripPayment
        fields = ['id', 'trip_id', 'driver_id', 'amount_paid', 'payment_status', 'payment_date']

    def validate(self, data):
        amount_paid = data.get('amount_paid')
        trip_id = data.get('trip_id')
        driver_id = data.get('driver_id')

        if not amount_paid:
            raise serializers.ValidationError(
                {"amount_paid": "Amount paid is requred"}
            )

        if not trip_id:
            raise serializers.ValidationError({
                "trip_id": "Trip  is requred"
        })

        if not driver_id:
            raise serializers.ValidationError({
                "trip_id": "Driver  is requred"
        })

        if not Driver.objects.get(id=driver_id):
            raise serializers.ValidationError({
                "driver": "Driver Does not Exist"
        })

        if not Trip.objects.get(id=trip_id):
            raise serializers.ValidationError(
                {"Trip": "Trip Does not exist"}
        )

        return super().validate(data)

    def create(self, validate_data):
        trip =  TripPayment.objects.create(**data)
        trip.payment_status = 'Paid'
        trip.save()
        return trip



    
class TripSerializer(serializers.ModelSerializer):

    class Meta:
        model = Trip
        fields = '__all__'
        read_only_fields = ('id', 'created', 'updated')


        
class NestedTripSerializer(serializers.ModelSerializer):
    driver = serializers.SlugRelatedField(
        many=False,
        read_only=True,
        slug_field='full_name')
    user = serializers.SlugRelatedField(
        many=False,
        read_only=True,
        slug_field='full_name')
    class Meta:
        model = Trip
        fields = '__all__'
        depth = 1
        
        



        

                