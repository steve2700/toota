import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { getAccessToken } from '../../services/AuthService';
import {
    GoogleMap,
    Marker,
    Autocomplete,
    useJsApiLoader,
    DirectionsService,
    DirectionsRenderer,
} from '@react-google-maps/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMapMarkerAlt,
    faPhone,
    faClock,
    faFileAlt,
    faTruck,
    faBuilding,
    faMoneyBillWave,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';

const mapContainerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
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
    const [directions, setDirections] = useState(null);
    const autocompletePickupRef = useRef(null);
    const autocompleteDropoffRef = useRef(null);

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
            setFormData({
                ...formData,
                [name]: name === 'number_of_floors' ? parseInt(value) : value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/trip/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

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

    const handleAddressSelect = useCallback((place, isPickup) => {
        const address = place.formatted_address;
        const position = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
        };

        if (isPickup) {
            setPickupPosition(position);
            setFormData((prevState) => ({
                ...prevState,
                pickup_location: {
                    ...prevState.pickup_location,
                    location: address,
                },
            }));
        } else {
            setDropoffPosition(position);
            setFormData((prevState) => ({
                ...prevState,
                dropoff_location: {
                    ...prevState.dropoff_location,
                    location: address,
                },
            }));
        }

        if (pickupPosition && dropoffPosition) {
            calculateRoute();
        }
    }, []);

    const calculateRoute = () => {
        if (!pickupPosition || !dropoffPosition) return;

        const directionsService = new window.google.maps.DirectionsService();

        directionsService.route(
            {
                origin: pickupPosition,
                destination: dropoffPosition,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            }
        );
    };

    const autocompleteOptions = {
        componentRestrictions: { country: 'za' },
        fields: ['formatted_address', 'geometry'],
    };

    return (
        <div className="w-full p-8 bg-gray-100 rounded-lg">
            {isLoaded ? (
                <form onSubmit={handleSubmit} className="space-y-8">
                    {message && (
                        <div
                            className={`fixed top-0 inset-x-0 p-4 text-white ${
                                message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                            } flex justify-between items-center`}
                        >
                            <span>{message.text}</span>
                            <button
                                onClick={handleCloseMessage}
                                className="text-xl ml-4 text-white font-bold focus:outline-none"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                    )}
                    <div
                        className="text-3xl font-semibold text-center mb-6"
                        style={{ color: '#f89f1b' }}
                    >
                        Create Your Trip
                    </div>

                    {/* Map showing both locations */}
                    {currentStep === 0 && (
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={pickupPosition || dropoffPosition || center}
                            zoom={pickupPosition && dropoffPosition ? 10 : 7}
                            options={{
                                restriction: { latLngBounds: bounds },
                                scrollwheel: false,
                            }}
                        >
                            {pickupPosition && <Marker position={pickupPosition} label="P" />}
                            {dropoffPosition && <Marker position={dropoffPosition} label="D" />}
                            {directions && <DirectionsRenderer directions={directions} />}
                        </GoogleMap>
                    )}

                    {currentStep === 0 && (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Pickup Details */}
                                <div>
                                    <h2
                                        className="text-xl font-bold mb-4"
                                        style={{ color: '#f89f1b' }}
                                    >
                                        Pickup Details
                                    </h2>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            <FontAwesomeIcon
                                                icon={faMapMarkerAlt}
                                                className="mr-2"
                                            />
                                            Pickup Location
                                        </label>
                                        <Autocomplete
                                            onLoad={(autocomplete) =>
                                                (autocompletePickupRef.current = autocomplete)
                                            }
                                            onPlaceChanged={() => {
                                                const place =
                                                    autocompletePickupRef.current.getPlace();
                                                handleAddressSelect(place, true);
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
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            <FontAwesomeIcon
                                                icon={faPhone}
                                                className="mr-2"
                                            />
                                            Pickup Contact Number
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

                                {/* Dropoff Details */}
                                <div>
                                    <h2
                                        className="text-xl font-bold mb-4"
                                        style={{ color: '#f89f1b' }}
                                    >
                                        Dropoff Details
                                    </h2>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            <FontAwesomeIcon
                                                icon={faMapMarkerAlt}
                                                className="mr-2"
                                            />
                                            Dropoff Location
                                        </label>
                                        <Autocomplete
                                            onLoad={(autocomplete) =>
                                                (autocompleteDropoffRef.current = autocomplete)
                                            }
                                            onPlaceChanged={() => {
                                                const place =
                                                    autocompleteDropoffRef.current.getPlace();
                                                handleAddressSelect(place, false);
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
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            <FontAwesomeIcon
                                                icon={faPhone}
                                                className="mr-2"
                                            />
                                            Dropoff Contact Number
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
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div>
                            <h2 className="text-xl font-bold mb-4" style={{ color: '#f89f1b' }}>
                                Trip Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        <FontAwesomeIcon icon={faClock} className="mr-2" />
                                        Pickup Time
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
                                        <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                                        Load Description
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
                                        <FontAwesomeIcon icon={faTruck} className="mr-2" />
                                        Vehicle Type
                                    </label>
                                    <select
                                        name="vehicle_type"
                                        value={formData.vehicle_type}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    >
                                        <option value="">Select vehicle type</option>
                                        <option value="1 ton Truck">1 ton Truck</option>
                                        <option value="1.5 ton Truck">1.5 ton Truck</option>
                                        <option value="2 ton Truck">2 ton Truck</option>
                                        <option value="4 ton Truck">4 ton Truck</option>
                                        <option value="Bakkie">Bakkie</option>
                                        <option value="8 ton Truck">8 ton Truck</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                                        Number of Floors
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
                                        <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
                                        Bid Amount
                                    </label>
                                    <input
                                        type="number"
                                        name="bid"
                                        value={formData.bid}
                                        onChange={handleChange}
                                        placeholder="Enter bid amount"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        {currentStep > 0 && (
                            <button
                                type="button"
                                onClick={() => setCurrentStep(currentStep - 1)}
                                className={`bg-${
                                    currentStep === 0 ? 'black' : 'gray-200'
                                } text-black py-2 px-4 rounded-lg`}
                            >
                                Previous
                            </button>
                        )}
                        {currentStep < 1 && (
                            <button
                                type="button"
                                onClick={() => setCurrentStep(currentStep + 1)}
                                className="bg-gray-200 text-black py-2 px-4 rounded-lg"
                            >
                                Next
                            </button>
                        )}
                        {currentStep === 1 && (
                            <button
                                type="submit"
                                className="bg-green-500 text-white py-2 px-4 rounded-lg"
                            >
                                Submit
                            </button>
                        )}
                    </div>
                </form>
            ) : (
                <div className="text-center">
                    <p>Loading...</p>
                </div>
            )}
        </div>
    );
};

export default CreateTripForm;

