import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DriverSignup from './components/DriverSignup';
import DriverLogin from './components/DriverLogin';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/driver/signup" component={DriverSignup} />
          <Route path="/driver/login" component={DriverLogin} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

