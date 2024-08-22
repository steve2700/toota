import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from "../../services/AuthService";
import { jwtDecode } from "jwt-decode";
import { format } from 'date-fns';

const History = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRideHistory();
  }, []);

  const fetchRideHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      const decoded = jwtDecode(token);
      const driver_id = decoded['user_id'];
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const url = `${import.meta.env.VITE_BASE_URL}/api/trip/driver/${driver_id}`;
      console.log('URL:', url);
      const response = await axios.get(url, config);
      console.log('Response:', response);
      console.log('Data received:', response.data);
      if (Array.isArray(response.data)) {
        setTrips(response.data);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      console.error('Error fetching ride history:', err);
      setError('Error fetching ride history. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "";
    return format(new Date(dateTime), 'MMMM dd, yyyy hh:mm a');
  };

  return (
    <div className="container mx-auto p-4 pt-6">
      <h1 className="text-3xl font-bold text-center mb-6">Driver History</h1>
      {isLoading ? (
        <p className="text-center text-gray-500">Loading ride history...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        trips.length > 0 ? (
          trips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-lg shadow-md p-4 mb-4 md:p-6">
              <h2 className="text-xl font-bold mb-2">Trip ID: {trip.id}</h2>
              <div className="text-gray-700">
                <p className="mb-1"><span className="font-bold">Pickup Location:</span> {trip.pickup_location?.location}</p>
                <p className="mb-1"><span className="font-bold">Dropoff Location:</span> {trip.dropoff_location?.location}</p>
                <p className="mb-1"><span className="font-bold">Pickup Time:</span> {formatDateTime(trip.pickup_time)}</p>
                <p className="mb-1"><span className="font-bold">Status:</span> {trip.status}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No ride history available.</p>
        )
      )}
    </div>
  );
};

export default History;

