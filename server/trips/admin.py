from django.contrib import admin

from .models import Trip, TripPayment


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    fields = (
        'id', 
        'pickup_location', 
        'dropoff_location', 
        'driver',
        'user',
        'vehicle_type', 
        'load_description',
        'status',
        'created',
        'updated', 
        'rating',
        'bid'
    )
    list_display = (
        'id', 
        'pickup_location', 
        'dropoff_location', 
        'driver',
        'user',
        'vehicle_type', 
        'load_description',
        'status',
        'created',
        'updated', 
        'rating',
        'bid'
    
    )
    
    list_filter = (
        'status',
    )
    
    readonly_fields = (
        'id', 'created', 'updated'
    
    )

@admin.register(TripPayment)
class TripAdmin(admin.ModelAdmin):
    fields = (
        'id', 
        'trip',  
        'driver',
        'amount_paid',
        'payment_status', 
        'payment_date',
    )

    list_display = (
        'id', 
        'trip',  
        'driver',
        'amount_paid',
        'payment_status', 
        'payment_date',
    )

    list_filter = (
        'payment_status', 'payment_date'
    )
    
    readonly_fields = (
        'id', 'payment_date', 'payment_status'
    
    )


