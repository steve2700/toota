import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { getAccessToken } from '../../services/AuthService';
import { GoogleMap, Marker, Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faClock, faFileAlt, faTruck, faBuilding, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
  marginBottom: '20px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const center = {
  lat: -30.5595,
  lng: 22.9375,
};

const bounds = {
  south: -34.819166,
  west: 18.618444,
  north: -22.126612,
  east: 32.825388,
};

const libraries = ['places'];

const CreateTripForm = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [message, setMessage] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [pickupPosition, setPickupPosition] = useState(null);
  const [dropoffPosition, setDropoffPosition] = useState(null);
  const autocompleteRef = useRef(null);

  const token = getAccessToken();
  const decodedToken = jwtDecode(token);
  const user_id = decodedToken.user_id;

  const initialFormData = {
    pickup_location: {
      location: '',
      phone_number: '',
    },
    dropoff_location: {
      location: '',
      phone_number: '',
    },
    pickup_time: '',
    load_description: '',
    vehicle_type: '',
    number_of_floors: '',
    bid: '',
    user: user_id,
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [key, subKey] = name.split('.');
      setFormData((prevState) => ({
        ...prevState,
        [key]: {
          ...prevState[key],
          [subKey]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: name === 'number_of_floors' ? parseInt(value) : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/trip/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFormData(initialFormData);
      setMessage({ text: 'Trip created successfully!', type: 'success' });
    } catch (error) {
      console.error('Error creating trip:', error);
      setMessage({ text: 'Failed to create trip. Please try again.', type: 'error' });
    }
  };

  const handleCloseMessage = () => {
    setMessage(null);
  };

  const handleAddressSelect = (place, step) => {
    const address = place.formatted_address;
    const position = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    if (step === 0) {
      setPickupPosition(position);
      setFormData((prevState) => ({
        ...prevState,
        pickup_location: {
          ...prevState.pickup_location,
          location: address,
        },
      }));
    } else if (step === 1) {
      setDropoffPosition(position);
      setFormData((prevState) => ({
        ...prevState,
        dropoff_location: {
          ...prevState.dropoff_location,
          location: address,
        },
      }));
    }
  };

  const autocompleteOptions = {
    componentRestrictions: { country: 'za' },
  };

  return (
    <div className="w-full p-8 bg-gray-100">
      {isLoaded ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <div
              className={`fixed top-0 inset-x-0 p-4 ${
                message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              } text-white flex justify-between items-center`}
            >
              <span>{message.text}</span>
              <button onClick={handleCloseMessage} className="ml-4 text-white font-bold">
                &times;
              </button>
            </div>
          )}
          {currentStep === 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-blue-600">Pickup Details</h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> Pickup Location
                </label>
                <Autocomplete
                  onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                  onPlaceChanged={() => {
                    const place = autocompleteRef.current.getPlace();
                    handleAddressSelect(place, 0);
                  }}
                  options={autocompleteOptions}
                >
                  <input
                    type="text"
                    name="pickup_location.location"
                    value={formData.pickup_location.location}
                    onChange={handleChange}
                    placeholder="Enter pickup location"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </Autocomplete>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={pickupPosition || center}
                  zoom={13}
                  options={{ restriction: { latLngBounds: bounds } }}
                >
                  {pickupPosition && <Marker position={pickupPosition} />}
                </GoogleMap>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  <FontAwesomeIcon icon={faPhone} /> Pickup Contact Number
                </label>
                <input
                  type="tel"
                  name="pickup_location.phone_number"
                  value={formData.pickup_location.phone_number}
                  onChange={handleChange}
                  placeholder="Enter pickup contact number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            </div>
          )}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-blue-600">Dropoff Details</h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> Dropoff Location
                </label>
                <Autocomplete
                  onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                  onPlaceChanged={() => {
                    const place = autocompleteRef.current.getPlace();
                    handleAddressSelect(place, 1);
                  }}
                  options={autocompleteOptions}
                >
                  <input
                    type="text"
                    name="dropoff_location.location"
                    value={formData.dropoff_location.location}
                    onChange={handleChange}
                    placeholder="Enter dropoff location"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </Autocomplete>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={dropoffPosition || center}
                  zoom={13}
                  options={{ restriction: { latLngBounds: bounds } }}
                >
                  {dropoffPosition && <Marker position={dropoffPosition} />}
                </GoogleMap>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  <FontAwesomeIcon icon={faPhone} /> Dropoff Contact Number
                </label>
                <input
                  type="tel"
                  name="dropoff_location.phone_number"
                  value={formData.dropoff_location.phone_number}
                  onChange={handleChange}
                  placeholder="Enter dropoff contact number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-blue-600">Trip Details</h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  <FontAwesomeIcon icon={faClock} /> Pickup Time
                </label>
                <input
                  type="datetime-local"
                  name="pickup_time"
                  value={formData.pickup_time}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  <FontAwesomeIcon icon={faFileAlt} /> Load Description
                </label>
                <textarea
                  name="load_description"
                  value={formData.load_description}
                  onChange={handleChange}
                  placeholder="Enter load description"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  <FontAwesomeIcon icon={faTruck} /> Vehicle Type
                </label>
                <select
                  name="vehicle_type"
                  value={formData.vehicle_type}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select a vehicle type</option>
                  <option value="bakkie">bakkie</option>
                  <option value="truck_1">1 ton Truck</option>
                  <option value="truck_1.5">1.5 ton Truck</option>
                  <option value="truck_2">2 ton Truck</option>
                  <option value="truck_4">4 ton Truck</option>
                  <option value="truck_8">8 ton Truck</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  <FontAwesomeIcon icon={faBuilding} /> Number of Floors
                </label>
                <input
                  type="number"
                  name="number_of_floors"
                  value={formData.number_of_floors}
                  onChange={handleChange}
                  placeholder="Enter number of floors"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  <FontAwesomeIcon icon={faMoneyBillWave} /> Bid
                </label>
                <input
                  type="number"
                  name="bid"
                  value={formData.bid}
                  onChange={handleChange}
                  placeholder="Enter your bid"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Previous
              </button>
            )}
            {currentStep < 2 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Next
              </button>
            )}
            {currentStep === 2 && (
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CreateTripForm;

