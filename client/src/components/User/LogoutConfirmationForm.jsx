import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogoutConfirmationForm({ onConfirm }) {
  const navigate = useNavigate();

  const handleYes = () => {
    // Perform logout action
    // Redirect to login/user route
    navigate('/login/user');
  };

  const handleNo = () => {
    // Close the logout confirmation form
    onConfirm(false);
  };

  return (
    <div className="fixed inset-0 overflow-y-auto flex justify-center items-center">
      <div className="relative bg-white w-96 mx-auto rounded-lg">
        <div className="p-6">
          <h2 className="text-xl font-semibold">Logout Confirmation</h2>
          <p className="text-gray-600 mt-2">Are you sure you want to logout?</p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleYes}
              className="mr-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Yes
            </button>
            <button
              onClick={handleNo}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

