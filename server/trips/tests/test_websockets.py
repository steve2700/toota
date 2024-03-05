import pytest
import datetime
from uuid import UUID
import json
from channels.testing import WebsocketCommunicator
from toota.asgi import application
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from trips.models import User, Driver
from django.contrib.auth.models import Group
from trips.utils import VEHICLE_TYPES

TEST_CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}

@database_sync_to_async
def create_user(email, full_name, phone_number, password, group='user'):
    user = User.objects.create_user(
        email=email,
        full_name=full_name,
        phone_number=phone_number,
        password=password
    )
    user_group, _ = Group.objects.get_or_create(name=group)
    user.groups.add(user_group)
    user.save()
    access = AccessToken.for_user(user)
    return user, access


@database_sync_to_async
def create_driver(
    email, 
    full_name, 
    phone_number, 
    physical_address, 
    vehicle_registration, 
    vehicle_type, 
    licence_no, 
    password,
    group='driver'):
    driver = Driver.objects.create_driver(
        email=email,
        full_name=full_name,
        phone_number=phone_number,
        physical_address=physical_address,
        vehicle_registration=vehicle_registration,
        vehicle_type=vehicle_type,
        licence_no=licence_no,
        password=password
    )
    driver_group, _ = Group.objects.get_or_create(name=group)
    driver.groups.add(driver_group)
    driver.save()
    access = AccessToken.for_user(driver)
    return driver, access


@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
class TestWebSocket:
    async def test_can_connect_to_server(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        _, access = await create_user(
            'testuser@gmail.com',
            'John Doe',
            '0712345678',
            '@Thingo11'
            
        )
        communicator = WebsocketCommunicator(
            application=application,
            path=f'/toota/?token={access}'
        )
        connected, _ = await communicator.connect()
        assert connected is True
        await communicator.disconnect()
        
    async def test_can_send_and_receive_messages(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        _, access = await create_user(
            'testuser@gmail.com',
            'John Doe',
            '0712345678',
            '@Thingo11',
            
        )
        communicator = WebsocketCommunicator(
            application=application,
            path=f'/toota/?token={access}'
        )
        await communicator.connect()
        message = {
            'type': 'echo.message',
            'data': 'This is a test message'
        }
        await communicator.send_json_to(message)
        response = await communicator.receive_json_from()
        assert response == message
        await communicator.disconnect()
        
    async def test_can_send_and_receive_broadcast_message(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        _, access = await create_user(
            'vinny@gmail.com',
            'vinny Doe',
            '0821147890',
            '@Thingo11',
        )
        communicator = WebsocketCommunicator(
            application=application,
            path=f'/toota/?token={access}'
        )
        await communicator.connect()
        message = {
            'type': 'echo.message',
            'data': 'This is a test message.'
        }
        channel_layer = get_channel_layer()
        await channel_layer.group_send('test', message)
        response = await communicator.receive_json_from()
        assert response == message
        await communicator.disconnect()
        
    async def test_cannot_connect_to_socket(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        communicator = WebsocketCommunicator(
            application=application,
            path='/toota/'
        )
        connected, _ = await communicator.connect()
        assert connected is False
        await communicator.disconnect()
        
    async def test_join_driver_group(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        _, access = await create_driver(
            'testdriver@gmail.com',
            'John Doe',
            '0712345678',
            '123 Main Street',
            'KCB 123X',
            VEHICLE_TYPES[0][0],
            '123456',
            '@Thingo11',
        )
        communicator = WebsocketCommunicator(
            application=application,
            path=f'/toota/?token={access}'
        )
        connected, _ = await communicator.connect()
        message = {
            'type': 'echo.message',
            'data': 'This is a test message'
        }
        channel_layer = get_channel_layer()
        await channel_layer.group_send('drivers', message=message)
        response = await communicator.receive_json_from()
        assert response == message
        await communicator.disconnect()
        
    async def test_request_trip(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        user, access = await create_user(
            'vinny@test.com',
            'Vinny User',
            '0718567890',
            '@Thingo11',
        )

        communicator = WebsocketCommunicator(
            application=application,
            path=f'/toota/?token={access}'
        )
        connected, _ = await communicator.connect()

        trip_data = {
            'pickup_location': '23 Main Avenue',
            'dropoff_location': '100 Malibongwe Drive',
            'pickup_time': f'{datetime.datetime.now().isoformat()}',  # Ensure ISO format
            'load_description': 'Fridge',
            'vehicle_type': VEHICLE_TYPES[0][0],
            'user': str(user.id),
            'bid': 200
        }

        await communicator.send_json_to({
            'type': 'create.trip',
            'data': trip_data
            })
        
        response = await communicator.receive_json_from()
        response_data = response.get('data', {})
        assert 'id' in response_data
        assert response_data['pickup_location'] == '23 Main Avenue'
        assert response_data['dropoff_location'] == '100 Malibongwe Drive'
        assert response_data['status'] == 'REQUESTED'
        assert 'user' in response_data
        await communicator.disconnect()


    # async def test_driver_alerted_on_request(self, settings):
    #     settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
    #     channel_layer = get_channel_layer()
    #     await channel_layer.group_add(
    #         group='drivers',
    #         channel='test_channel'
    #     )
    #     user, access = await create_user(
    #         'vinny@test.com',
    #         'Vinny User',
    #         '0718567890',
    #         '@Thingo11',
    #     )
    #     communicator = WebsocketCommunicator(
    #         application=application,
    #         path=f'/toota/?f{access}'
    #     )
    #     connected, _ = await communicator.connect()

    #     trip_data = {
    #         'pickup_location': '23 Main Avenue',
    #         'dropoff_location': '100 Malibongwe Drive',
    #         'pickup_time': f'{datetime.datetime.now().isoformat()}',  # Ensure ISO format
    #         'load_description': 'Fridge',
    #         'vehicle_type': VEHICLE_TYPES[0][0],
    #         'user': str(user.id),
    #         'bid': 200
    #     }

    #     await communicator.send_json_to({
    #         'type': 'create.trip',
    #         'data': trip_data
    #         })

    #     response = await channel_layer.receive('test_channel')
    #     response_data = response.data.get('data')
    #     assert 'id' in response_data
    #     assert response_data['pickup_location'] == '23 Main Avenue'
    #     assert response_data['dropoff_location'] == '100 Malibongwe Drive'
    #     assert response_data['status'] == 'REQUESTED'
    #     await communicator.disconnect()


       
       
        
        
