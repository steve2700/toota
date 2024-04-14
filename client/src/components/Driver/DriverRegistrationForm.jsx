import React, { useState } from 'react';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/driver/sign_up/', formData);
      console.log(response.data); // Assuming the response contains success message or token
      // Display success message to user
      alert('Registration successful! Please check your email for verification.');
      setErrors({}); // Clear any previous errors
    } catch (error) {
      if (error.response) {
        // Server responded with non 2xx status code
        setErrors(error.response.data);
      } else {
        // Network error or similar
        console.error('Error:', error.message);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-yellow-100 p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Driver Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            maxLength={255}
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Full Name */}
        <div className="mb-4">
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            maxLength={255}
            required
          />
          {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            maxLength={12}
            required
          />
          {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
        </div>

        {/* Physical Address */}
        <div className="mb-4">
          <label htmlFor="physical_address" className="block text-sm font-medium text-gray-700">Physical Address</label>
          <input
            type="text"
            id="physical_address"
            name="physical_address"
            value={formData.physical_address}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            maxLength={300}
            required
          />
          {errors.physical_address && <p className="text-red-500 text-sm mt-1">{errors.physical_address}</p>}
        </div>

        {/* Vehicle Registration No */}
        <div className="mb-4">
          <label htmlFor="vehicle_registration_no" className="block text-sm font-medium text-gray-700">Vehicle Registration No</label>
          <input
            type="text"
            id="vehicle_registration_no"
            name="vehicle_registration_no"
            value={formData.vehicle_registration_no}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            maxLength={100}
            required
          />
          {errors.vehicle_registration_no && <p className="text-red-500 text-sm mt-1">{errors.vehicle_registration_no}</p>}
        </div>

        {/* Vehicle Type */}
        <div className="mb-4">
          <label htmlFor="vehicle_type" className="block text-sm font-medium text-gray-700">Vehicle Type</label>
          <select
            id="vehicle_type"
            name="vehicle_type"
            value={formData.vehicle_type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          >
            <option value="bike">Bike</option>
            <option value="car">Car</option>
            <option value="van">Van</option>
            <option value="truck_1">Truck 1</option>
            <option value="truck_1.5">Truck 1.5</option>
            <option value="truck_2">Truck 2</option>
            <option value="truck_4">Truck 4</option>
          </select>
          {errors.vehicle_type && <p className="text-red-500 text-sm mt-1">{errors.vehicle_type}</p>}
        </div>

        {/* Licence No */}
        <div className="mb-4">
          <label htmlFor="licence_no" className="block text-sm font-medium text-gray-700">Driver's Licence Number</label>
          <input
            type="text"
            id="licence_no"
            name="licence_no"
            value={formData.licence_no}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            maxLength={100}
            required
          />
          {errors.licence_no && <p className="text-red-500 text-sm mt-1">{errors.licence_no}</p>}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password1" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password1"
            name="password1"
            value={formData.password1}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            minLength={8}
            maxLength={68}
            required
          />
          {errors.password1 && <p className="text-red-500 text-sm mt-1">{errors.password1}</p>}
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label htmlFor="password2" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            id="password2"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            minLength={8}
            maxLength={68}
            required
          />
          {errors.password2 && <p className="text-red-500 text-sm mt-1">{errors.password2}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
        >
          Register with Toota
        </button>
      </form>

      <div className="mt-4 text-center">
        <p>Already have a Toota account?</p>
        <a href="/login/driver" className="text-indigo-600 hover:text-indigo-800">Login here</a>
      </div>
    </div>
  );
};

export default DriverRegistrationForm;

