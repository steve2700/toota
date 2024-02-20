import React, { useState } from 'react';
import axios from 'axios';

const DriverLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/login/driver/', {
        username,
        password,
      });
      console.log(response.data); // Handle success
    } catch (error) {
      console.error('Error during login:', error.response.data); // Handle error
    }
  };

  return (
    <div>
      <h2>Driver Login</h2>
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
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
};

export default DriverLogin;

