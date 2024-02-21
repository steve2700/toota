// DriverRegistrationForm.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DriverRegistrationForm.css';

const DriverRegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    vehicleRegistrationNo: '',
    license: '',
    city: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send data to Django backend (implement this part)
    console.log('Form submitted:', formData);
    navigate('/login/driver'); // redirect to the login page after successful registration
  };

  return (
    <div className="driver-registration-form">
      <h1 className="green-heading">Become a Toota Driver</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-card">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
	  <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />

          <label htmlFor="vehicleRegistrationNo">Vehicle Registration No</label>
          <input
            type="text"
            id="vehicleRegistrationNo"
            name="vehicleRegistrationNo"
            value={formData.vehicleRegistrationNo}
            onChange={handleChange}
            required
          />

          <label htmlFor="license">License</label>
          <input
            type="text"
            id="license"
            name="license"
            value={formData.license}
            onChange={handleChange}
            required
          />

          <label htmlFor="city">City</label>
          <select
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          >
            <option value="">Select City</option>
            <option value="Cape Town">Cape Town</option>
            <option value="Johannesburg">Johannesburg</option>
            {/* Add more cities as needed */}
          </select>

          <button
            type="submit"
            data-testid="submitButton"
            className="driver-signup-button"
          >
            Sign up as a Driver
          </button>
        </div>
      </form>

      <div className="login-link">
        Already have an account? <Link to="/login/driver">Log in</Link>
      </div>
    </div>
  );
};

export default DriverRegistrationForm;

