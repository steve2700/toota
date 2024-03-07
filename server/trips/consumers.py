
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from trips.serializers import NestedTripSerializer, TripSerializer


class TootaConsumer(AsyncJsonWebsocketConsumer):
    groups = ['test']
    
    @database_sync_to_async
    def _create_trip(self, data):
        serializer = TripSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return serializer.create(serializer.validated_data)
    
    @database_sync_to_async
    def _get_user_group(self, user):
        user_groups = user.groups.all()
        if user_groups.exists():
            return user_groups[0].name
        else:
            return None
        
    async def connect(self):
        user = self.scope['user']
        if user.is_anonymous:
            await self.close()
        else:
            driver_group = await self._get_user_group(user)
            if driver_group == 'driver':
                await self.channel_layer.group_add(
                    group='drivers',
                    channel=self.channel_name
                )
            await self.accept()
        
    async def disconnect(self, close_code):
        user = self.scope['user']
        driver_group = await self._get_user_group(user)
        if driver_group == 'driver':
            await self.channel_layer.group_discard(
                group='drivers',
                channel=self.channel_name
            )
        await super().disconnect(close_code)
        
    async def echo_message(self, message):
        await self.send_json(message)
        
    async def receive_json(self, content, **kwargs):
        message_type = content.get('type')
        if message_type == 'create.trip':
            await self.create_trip(content)
        elif message_type == 'echo.message':
            await self.echo_message(content)
            
    async def create_trip(self, message):
        data = message.get('data')
        trip = await self._create_trip(data)
        
        trip_data = NestedTripSerializer(trip).data
        
        await self.channel_layer.group_send(group='driver', message={
            'type': 'echo.message',
            'data': trip_data,
        })
        
        await self.send_json({
            'type': 'echo.message',
            'data': trip_data,
        })
        
        