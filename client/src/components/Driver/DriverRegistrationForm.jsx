import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DriverRegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone_number: '',
    physical_address: '',
    vehicle_registration_no: '',
    vehicle_type: 'bike',
    licence_no: '',
    password1: '',
    password2: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are completed
    const requiredFields = ['email', 'full_name', 'phone_number', 'physical_address', 'vehicle_registration_no', 'licence_no', 'password1', 'password2'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      setErrors({ general: 'Please complete all fields.' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/driver/sign_up/', formData);
      if (response.status === 201) {
        setSuccessMessage('Account created successfully. Please check your email.');
        setFormData({
          email: '',
          full_name: '',
          phone_number: '',
          physical_address: '',
          vehicle_registration_no: '',
          vehicle_type: 'bike',
          licence_no: '',
          password1: '',
          password2: '',
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'Something went wrong. Please try again later.' });
      }
    }
  };

  useEffect(() => {
    // Clear errors after 5 seconds
    const timeout = setTimeout(() => {
      setErrors({});
    }, 5000);

    return () => clearTimeout(timeout);
  }, [errors]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Driver Registration</h1>
      {successMessage && (
        <div className="bg-green-200 text-green-800 px-4 py-2 mb-4 rounded">{successMessage}</div>
      )}
      {errors.general && (
        <div className="bg-red-200 text-red-800 px-4 py-2 mb-4 rounded">{errors.general}</div>
      )}
      <form onSubmit={handleSubmit} className="max-w-lg">
        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
        </div>
        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="full_name">Full Name</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.full_name ? 'border-red-500' : ''}`}
          />
          {errors.full_name && <p className="text-red-500 text-xs italic">{errors.full_name}</p>}
        </div>
        {/* Phone Number */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone_number">Phone Number</label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.phone_number ? 'border-red-500' : ''}`}
          />
          {errors.phone_number && <p className="text-red-500 text-xs italic">{errors.phone_number}</p>}
        </div>
        {/* Physical Address */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="physical_address">Physical Address</label>
          <input
            type="text"
            id="physical_address"
            name="physical_address"
            value={formData.physical_address}
            onChange={handleChange}
            className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.physical_address ? 'border-red-500' : ''}`}
          />
          {errors.physical_address && <p className="text-red-500 text-xs italic">{errors.physical_address}</p>}
        </div>
        {/* Vehicle Registration Number */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vehicle_registration_no">Vehicle Registration Number</label>
          <input
            type="text"
            id="vehicle_registration_no"
            name="vehicle_registration_no"
            value={formData.vehicle_registration_no}
            onChange={handleChange}
            className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.vehicle_registration_no ? 'border-red-500' : ''}`}
          />
          {errors.vehicle_registration_no && <p className="text-red-500 text-xs italic">{errors.vehicle_registration_no}</p>}
        </div>
        {/* Vehicle Type */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vehicle_type">Vehicle Type</label>
          <select
            id="vehicle_type"
            name="vehicle_type"
            value={formData.vehicle_type}
            onChange={handleChange}
            className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.vehicle_type ? 'border-red-500' : ''}`}
          >
            <option value="bike">Bike</option>
            <option value="car">Car</option>
            <option value="truck">Truck 1</option>
	    <option value="van">Van</option>
	    <option value="truck_1.5">Truck 1.5</option>
	    <option value="truck_2">Truck 2</option>
	    <option value="truck_4">Truck 4</option>

            {/* Add other vehicle types as needed */}
          </select>
          {errors.vehicle_type && <p className="text-red-500 text-xs italic">{errors.vehicle_type}</p>}
        </div>
        {/* Driver's Licence Number */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="licence_no">Driver's Licence Number</label>
          <input
            type="text"
            id="licence_no"
            name="licence_no"
            value={formData.licence_no}
            onChange={handleChange}
            className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.licence_no ? 'border-red-500' : ''}`}
          />
          {errors.licence_no && <p className="text-red-500 text-xs italic">{errors.licence_no}</p>}
        </div>
        {/* Password field */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password1">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password1"
            name="password1"
            value={formData.password1}
            onChange={handleChange}
            className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.password1 ? 'border-red-500' : ''}`}
          />
          {/* Show/Hide password button */}
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
          {errors.password1 && <p className="text-red-500 text-xs italic">{errors.password1}</p>}
        </div>
        {/* Confirm password field */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password2">Confirm Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password2"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.password2 ? 'border-red-500' : ''}`}
          />
          {/* Show/Hide password button */}
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
          {errors.password2 && <p className="text-red-500 text-xs italic">{errors.password2}</p>}
        </div>
        <div className="mb-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Register
          </button>
        </div>
      </form>
	  <div className="mt-4 text-center">
	  <p>Already have a Toota account?</p>
	  <a href="/login/driver" className="text-indigo-600 hover:text-indigo-800">Login here</a>
    </div>
    </div>
  );
};

export default DriverRegistrationForm;

