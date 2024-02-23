// src/pages/SignUpPage.js
import React from 'react';
import UserRegistrationForm from '../components/User/UserRegistrationForm';
import DriverRegistrationForm from '../components/Driver/DriverRegistrationForm';

const SignUpPage = () => {
  const handleUserSignUp = (formData) => {
    // Handle user sign up logic
    console.log('User signed up:', formData);
  };

  const handleDriverSignUp = (formData) => {
    // Handle driver sign up logic
    console.log('Driver signed up:', formData);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <UserRegistrationForm onSignUp={handleUserSignUp} />
      <DriverRegistrationForm onSignUp={handleDriverSignUp} />
    </div>
  );
};

export default SignUpPage;

