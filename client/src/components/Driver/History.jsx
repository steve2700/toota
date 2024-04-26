import React, { useState, useEffect } from 'react';
import { ClockIcon, ClipboardCheckIcon } from '@heroicons/react/outline'; // Import required icons

const RideHistorySection = () => {
  // Define state to store ride history data
  const [rideHistory, setRideHistory] = useState([]);

  // Simulated ride history data (replace this with actual data from backend)
  const mockRideHistory = [
    { id: 1, date: '2022-03-15', pickupLocation: 'Location A', dropOffLocation: 'Location B', fare: 20.5 },
    { id: 2, date: '2022-03-14', pickupLocation: 'Location C', dropOffLocation: 'Location D', fare: 18.75 },
    // Add more ride history data as needed
  ];

  useEffect(() => {
    // Fetch ride history data from backend API and update state
    setRideHistory(mockRideHistory); // Replace with actual fetch logic
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Ride History</h2>
      {rideHistory.length > 0 ? (
        <div>
          {rideHistory.map((ride) => (
            <div key={ride.id} className="bg-white p-4 rounded-md shadow-md mb-4">
              <div className="flex items-center space-x-4">
                <ClockIcon className="h-8 w-8 text-gray-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Date: {ride.date}</h3>
                  <p className="text-gray-500">Pickup: {ride.pickupLocation}</p>
                  <p className="text-gray-500">Drop-off: {ride.dropOffLocation}</p>
                  <p className="text-gray-500">Fare: ${ride.fare.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <ClipboardCheckIcon className="h-8 w-8 text-gray-600" />
                <p className="text-gray-500">Status: Completed</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No ride history available</p>
      )}
    </div>
  );
};

export default RideHistorySection;

