import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const UserRegistrationForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Phone Number must be 10 digits';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.trim().length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/^(?=.*[!@#$%^&*(),.?":{}|<>])/.test(formData.password.trim())) {
      newErrors.password = 'Password must contain at least one special symbol';
    }

    if (formData.confirmPassword.trim() !== formData.password.trim()) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm(formData)) {
	    try {
		    const response = await fetch('http://127.0.0.1:8000/api/user/sign_up/', {
			    method: 'POST',
			    headers: {
				    'Content-Type': 'application/json',
			    },

			    body: JSON.stringify({
				    full_name: formData.fullName,
				    phone_number: formData.phoneNumber,
				    email: formData.email,
				    password1: formData.password,
				    password2: formData.confirmPassword,

		          }),

			   });
        if (response.ok) {
          console.log('Registration successful');
          setErrors({});
          setSuccessMessage('Registration successful! Redirecting to login page...');

          setTimeout(() => {
            navigate('/login/user');
          }, 3000);
        } else {
          const errorData = await response.json();
          setErrors(errorData);

          // Check if the email is already in use
          if (
            errorData.email &&
            errorData.email[0] === 'user with this email address already exists.'
          ) {
            setErrors({ ...errors, email: 'Email is already in use. Please try another.' });
          }

          // Check if the full name is already in use
          if (
            errorData.full_name &&
            errorData.full_name[0] === 'user with this full name already exists.'
          ) {
            setErrors({ ...errors, fullName: 'Full Name is already in use. Please try another.' });
          }

          // Check if the phone number is already in use
          if (
            errorData.phone_number &&
            errorData.phone_number[0] === 'user with this phone number already exists.'
          ) {
            setErrors({
              ...errors,
              phoneNumber: 'Phone Number is already in use. Please try another.',
            });
          }
        }
      } catch (error) {
        console.error('Error during registration:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded shadow-md p-6 w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Join Toota Community</h2>

        <div className="mb-4">
          <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            autoComplete="fullName"
            className="w-full px-3 py-2 border rounded shadow appearance-none"
          />
          {errors.fullName && <p className="text-red-500 text-lg italic">{errors.fullName}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Enter your phone number"
            value={formData.phoneNumber}
            onChange={handleChange}
            autoComplete="phoneNumber"
            className="w-full px-3 py-2 border rounded shadow appearance-none"
          />
          {errors.phoneNumber && <p className="text-red-500 text-lg italic">{errors.phoneNumber}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="current-email"
            className="w-full px-3 py-2 border rounded shadow appearance-none"
          />
          {errors.email && <p className="text-red-500 text-lg italic">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            className="w-full px-3 py-2 border rounded shadow appearance-none"
          />
          {errors.password && <p className="text-red-500 text-lg italic">{errors.password}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="current-confirmPassword"
            className="w-full px-3 py-2 border rounded shadow appearance-none"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-lg italic">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 focus:outline-none focus:shadow-outline-black"
        >
          Register Your Account
        </button>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login/user" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Log in here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default UserRegistrationForm;

