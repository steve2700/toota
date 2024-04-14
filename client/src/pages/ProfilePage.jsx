import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { FaEnvelope, FaUser, FaPhone } from 'react-icons/fa'; // Import icons from Font Awesome icon pack

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

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

  if (loading) {
    return <p>Loading user profile....</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Profile Page</h1>
      {user && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <p className="text-lg font-semibold text-gray-800">Personal Information</p>
          </div>
          <div className="bg-gray-100 rounded-md p-4 mb-4">
            <p className="text-lg text-gray-800"><strong><FaEnvelope /> Email:</strong> {user.email}</p>
            <p className="text-lg text-gray-800"><strong><FaUser /> Full Name:</strong> {user.full_name}</p>
            <p className="text-lg text-gray-800"><strong><FaPhone /> Phone Number:</strong> {user.phone_number}</p>
          </div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

