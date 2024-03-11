import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const UserLoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);

    // Add a timeout to hide the password after 5 seconds (5000 milliseconds)
    setTimeout(() => {
      setShowPassword(false);
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/user/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData({
		  email: formData.email,
		  password1: formData.password,
        }),
        });

        if (response.ok) {
          // Handle successful login, e.g., redirect to dashboard
          console.log('Login successful');
          setSuccessMessage('Login successful! Redirecting to the dashboard...');
          // Redirect to dashboard after a delay
          setTimeout(() => {
            navigate('/dashboard/user');
          }, 3000);
          // Reset the form after successful login
          setFormData({ email: '', password: '' });
          setErrors({});
        } else {
          // Handle login errors
          const errorData = await response.json();
          if (
            errorData.non_field_errors &&
            errorData.non_field_errors[0] === 'Unable to log in with provided credentials.'
          ) {
            setErrors({
              ...errors,
              invalidCredentials: 'Invalid email or password. Please try again.',
            });
          } else {
            setErrors(errorData);
          }
        }
      } catch (error) {
        console.error('Error during login:', error);
	// Show a clear error message to the user
	setErrors({ generic: 'An error occurred. Please try again later.' });
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white rounded shadow-md p-6 w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit}>
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-900">Login To TOOTA</h2>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded shadow appearance-none"
            />
            {errors.email && <p className="text-red-500 text-lg italic">{errors.email}</p>}
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded shadow appearance-none"
            />
            <span
              className="absolute right-0 bottom-1.5 mr-3 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </span>
            {errors.password && <p className="text-red-500 text-lg italic">{errors.password}</p>}
          </div>

          {errors.invalidCredentials && (
            <p className="text-red-500 text-lg font-bold mb-4">{errors.invalidCredentials}</p>
          )}
	  {errors.generic && (
            <p className="text-red-500 text-lg font-bold mb-4">{errors.generic}</p>
           )}


          <button
            type="submit"
            className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 focus:outline-none focus:shadow-outline-black w-full"
          >
            Login
          </button>
        </form>

        {successMessage && (
          <p className="mt-4 text-center text-green-500 font-bold">{successMessage}</p>
        )}

        <p className="mt-4 text-center text-sm text-gray-500">
          Forgot your password?{' '}
          <Link to="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Reset it here
          </Link>
        </p>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account with Toota?{' '}
          <Link to="/signup/user" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserLoginForm;

