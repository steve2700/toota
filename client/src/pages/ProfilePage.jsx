import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEnvelope, FaUser, FaPhone } from 'react-icons/fa'; // Import icons from Font Awesome icon pack
import {jwtDecode} from 'jwt-decode';
const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone_number: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const jwt = localStorage.getItem('access_token');
        if (jwt) {
          const decodedToken = jwtDecode(jwt);
          const user_id = decodedToken["user_id"];
          const response = await axios.get(`http://localhost:8000/api/user/profile/${user_id}`, {
            headers: {
              Authorization: `Bearer ${jwt}`
            }
          });
          setUser(response.data);
          setFormData({
            email: response.data.email,
            full_name: response.data.full_name,
            phone_number: response.data.phone_number,
          });
        } else {
          setErrorMessage('No authentication token available');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setErrorMessage('Failed to fetch user profile data. Please try again.');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jwt = localStorage.getItem('access_token');
      const response = await axios.put(`http://localhost:8000/api/user/profile/${user.user_id}`, formData, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });
      setUser(response.data);
      setEditMode(false);
      setSuccessMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating user profile:', error);
      setErrorMessage('Failed to update user profile. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading user profile....</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Profile Page</h1>
      {successMessage && (
        <div className="bg-green-200 text-green-800 px-4 py-2 mb-4 rounded">
          {successMessage}
        </div>
      )}
      {user && (
        <div className="bg-white shadow-md rounded-lg p-6">
          {editMode ? (
            <form onSubmit={handleSubmit}>
              {/* Form fields */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="full_name" className="block text-gray-700 text-sm font-bold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone_number" className="block text-gray-700 text-sm font-bold mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div>
              {/* Profile information */}
              <div className="bg-gray-100 rounded-md p-4 mb-4">
                <p className="text-lg text-gray-800">
                  <strong><FaEnvelope /> Email:</strong> {user.email}
                </p>
                <p className="text-lg text-gray-800">
                  <strong><FaUser /> Full Name:</strong> {user.full_name}
                </p>
                <p className="text-lg text-gray-800">
                  <strong><FaPhone /> Phone Number:</strong> {user.phone_number}
                </p>
              </div>
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

