import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaExclamationCircle } from 'react-icons/fa';
import logo from '../../logo.png'; // Adjust the path based on your file structure

const DriverLoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const clearErrors = () => {
    setTimeout(() => {
      setFormErrors({});
    }, 7000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/driver/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setFormErrors({ general: 'Invalid email or password. Please try again.' });
        } else {
          setFormErrors(responseData);
        }
        clearErrors();
      } else {
        const { access } = responseData;
        localStorage.setItem('access_token', access);
        setSuccessMessage('Login successful! Redirecting to the dashboard...');
        setTimeout(() => {
          navigate('/dashboard/driver');
        }, 2000);
        setFormData({ email: '', password: '' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      setFormErrors({ generic: 'An error occurred. Please try again later.' });
      clearErrors();
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#404042]">
      <form className="bg-white p-8 shadow-md rounded w-full sm:w-96" onSubmit={handleSubmit}>
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Toota Logo" className="w-32 h-32" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-4 text-[#f89f1b]">LOGIN AS TOOTA DRIVER</h2>

        {formErrors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <FaExclamationCircle className="mr-2" />
            <span>{formErrors.general}</span>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-600 flex items-center">
            <FaEnvelope className="mr-2" />
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring focus:border-[#f89f1b]"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-600 flex items-center">
            <FaLock className="mr-2" />
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring focus:border-[#f89f1b]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 py-2 text-gray-500 focus:outline-none"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#f89f1b] text-white py-2 px-4 rounded hover:bg-[#d78516] focus:outline-none focus:shadow-outline w-full"
        >
          LOG IN
        </button>

        <div className="mt-4 text-center">
          <p>
            Not a Toota driver?{' '}
            <Link to="/signup/driver" className="text-blue-500 hover:underline">Sign up here</Link>
          </p>
          <p>
            <Link to="/driver-forgot-password" className="text-blue-500 hover:underline">Forgot your password?</Link>
          </p>
        </div>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4">
            <span>{successMessage}</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default DriverLoginForm;

