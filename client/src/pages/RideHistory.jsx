import React, { useState, useEffect } from 'react';
import { ClockIcon, ClipboardCheckIcon } from '@heroicons/react/outline';
import { getAllTrips } from "../services/TripService";
import { format } from 'date-fns';

const RideHistorySection = () => {
  const [rideHistory, setRideHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        const response = await getAllTrips();
        const trips = response?.trips ?? [];

        if (Array.isArray(trips) && trips.length > 0) {
          const filteredTrips = trips.filter(trip => trip.user_id === response.user_id);
          
          setRideHistory(
            filteredTrips.map((trip) => {
              const pickupLocation = `${trip.pickup_location.location} (${trip.pickup_location.phone_number})`;
              const dropOffLocation = `${trip.dropoff_location.location} (${trip.dropoff_location.phone_number})`;

              return {
                id: trip.id,
                date: trip.pickup_time && !isNaN(new Date(trip.pickup_time))
                  ? format(new Date(trip.pickup_time), 'yyyy-MM-dd')
                  : 'Invalid Date',
                pickupLocation,
                dropOffLocation,
                fare: parseFloat(trip.bid),
                status: trip.status,
              };
            })
          );
        } else {
          setRideHistory([]);
        }
      } catch (error) {
        console.error('Error fetching ride history:', error);
        setRideHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRideHistory();
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-3xl font-bold text-center mb-6">Ride History</h2>
      {loading ? (
        <p className="text-blue-500">Loading trips...</p>
      ) : (
        <div>
          {rideHistory.length > 0 ? (
            <div>
              {rideHistory.map((ride) => (
                <div key={ride.id} className="bg-white p-6 rounded-lg shadow-md mb-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <ClockIcon className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Date: {ride.date}</h3>
                      <p className="text-gray-500">Pickup: {ride.pickupLocation}</p>
                      <p className="text-gray-500">Drop-off: {ride.dropOffLocation}</p>
                      <p className="text-gray-500">Fare: R {ride.fare.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <ClipboardCheckIcon className="h-8 w-8 text-blue-600" />
                    <p className="text-gray-500">Status: {ride.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-blue-500 text-center">No trips found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RideHistorySection;

