import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Message from './Message';

const ResetPasswordForm = () => {
  const { uidb64, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/driver/password-reset/${uidb64}/${token}`);
        if (response.status === 200) {
          setIsTokenValid(true);
        }
      } catch (error) {
        setMessage(error.response.data.message || 'An unexpected error occurred.');
        setMessageType('error');
      }
    };
    verifyToken();
  }, [uidb64, token]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      // Validation
      if (!newPassword.trim()) {
        setMessage('New password is required.');
        setMessageType('error');
        return;
      }

      // Make the backend API call to reset password
      const response = await axios.post(`http://localhost:8000/api/driver/password-reset/${uidb64}/${token}`, { newPassword });

      if (response.status === 200) {
        setMessage(response.data.message);
        setMessageType('success');
      }
    } catch (error) {
      setMessage(error.response.data.message || 'An unexpected error occurred.');
      setMessageType('error');
    }
  };

  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Message message={message} type={messageType} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {message && <Message message={message} type={messageType} />}

      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full md:w-2/3 lg:w-1/2 xl:w-1/3" onSubmit={handleResetPassword}>
        <h2 className="text-2xl mb-6 font-bold text-center">Reset Password</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
            New Password
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3"
            id="newPassword"
            type="password"
            placeholder="New Password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <button
            className="w-full bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-black hover:bg-gray-800"
            type="submit"
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;

