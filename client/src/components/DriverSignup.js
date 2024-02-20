import React, { useState } from 'react';
import axios from 'axios';

const DriverSignup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [vehicleRegNo, setVehicleRegNo] = useState('');
  const [licenseNo, setLicenseNo] = useState('');

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/signup/driver/', {
        username,
        password,
        firstname,
        lastname,
        vehicleRegNo,
        licenseNo,
      });
      console.log(response.data); // Handle success
    } catch (error) {
      console.error('Error during signup:', error.response.data); // Handle error
    }
  };

  return (
    <div>
      <h2>Driver Signup</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="First Name"
        value={firstname}
        onChange={(e) => setFirstname(e.target.value)}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
      />
      <input
        type="text"
        placeholder="Vehicle Registration No"
        value={vehicleRegNo}
        onChange={(e) => setVehicleRegNo(e.target.value)}
      />
      <input
        type="text"
        placeholder="Driver's License No"
        value={licenseNo}
        onChange={(e) => setLicenseNo(e.target.value)}
      />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default DriverSignup;

