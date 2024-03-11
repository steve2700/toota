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
          setSuccessMessage('Registration successful! Redirecting to login page...');

          setTimeout(() => {
            navigate('/login/user');
          }, 3000);
        } else {
          const errorData = await response.json();
          setErrors(errorData);

          if (
            errorData.email &&
            errorData.email[0] === 'user with this email address already exists.'
          ) {
            setErrors({ ...errors, email: 'Email is already in use. Please try another.' });
          }
        }
      } catch (error) {
        console.error('Registration error:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full md:w-2/3 lg:w-1/2 xl:w-1/3" onSubmit={handleSubmit} method="post">
        <h2 className="text-2xl mb-6 font-bold text-center">Sign Up</h2>

        {successMessage && <p className="text-green-600 text-lg italic mb-4">{successMessage}</p>}

        {errors.generic && <p className="text-red-500 text-lg italic mb-4">{errors.generic}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
            Full Name
          </label>
          <input
            className={`appearance-none border rounded w-full py-2 px-3 ${errors.fullName && 'border-red-500'}`}
            id="fullName"
            type="text"
            placeholder="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            autoComplete="current-fullName"
          />
          {errors.fullName && <p className="text-red-500 text-lg italic">{errors.fullName}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
            Phone Number
          </label>
          <input
            className={`appearance-none border rounded w-full py-2 px-3 ${errors.phoneNumber && 'border-red-500'}`}
            id="phoneNumber"
            type="text"
            placeholder="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            autoComplete="current-phoneNumber"
          />
          {errors.phoneNumber && <p className="text-red-500 text-lg italic">{errors.phoneNumber}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className={`appearance-none border rounded w-full py-2 px-3 ${errors.email && 'border-red-500'}`}
            id="email"
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="current-email"
          />
          {errors.email && <p className="text-red-500 text-lg italic">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className={`appearance-none border rounded w-full py-2 px-3 ${errors.password && 'border-red-500'}`}
            id="password"
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
          {errors.password && <p className="text-red-500 text-lg italic">{errors.password}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            className={`appearance-none border rounded w-full py-2 px-3 ${errors.confirmPassword && 'border-red-500'}`}
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="current-confirmPassword"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-lg italic">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-black hover:bg-gray-800"
        >
          Register Your Account
        </button>

        <div className="text-center mt-4">
          <p className="text-sm">
            Already have an account?{' '}
            <Link to="/login/user" className="text-blue-500 hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default UserRegistrationForm;

