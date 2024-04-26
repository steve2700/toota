import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DriverLoginForm from "./components/Driver/DriverLoginForm";
import DriverRegistrationForm from "./components/Driver/DriverRegistrationForm";
import DriverProfile from "./components/Driver/DriverProfile"
import History from './components/Driver/History'
import UserLoginForm from "./components/User/UserLoginForm";
import UserRegistrationForm from "./components/User/UserRegistrationForm";
import ForgotPasswordForm from "./components/User/ForgotPasswordForm";
import ResetPasswordForm from "./components/User/ResetPasswordForm";
import NotFound from "./pages/NotFound";
import Dashboard from './components/User/Dashboard';
import DriverDashboard from './components/Driver/DriverDashboard';
import DocumentUploadForm from "./components/Driver/DocumentUploadForm";
import ProfilePage from './pages/ProfilePage';
import Layout from './components/Layout/Layout';
import LayoutDriver from './components/Layout/LayoutDriver'
import RideHistory from './pages/RideHistory';
import Calendar from './pages/Calendar';
import Logout from './pages/Logout';
import DriverLogout from './components/Driver/DriverLogout'



function App() {
  

  return (
    <Router>
      
        <Routes>
          <Route path="/signup/driver" element={<DriverRegistrationForm />} />
          <Route path="/login/driver" element={<DriverLoginForm />} />
          <Route path="/signup/user" element={<UserRegistrationForm />} />
          <Route path="/login/user" element={<UserLoginForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password/:uidb64/:token" component={ResetPasswordForm} />
          <Route path="/dashboard/user/" element={<Layout />} >
            <Route index element={<Dashboard />} />
            <Route path='profile' element={<ProfilePage />} />
            <Route path='trip-history' element= {<RideHistory />} />
            <Route path='calendar' element={<Calendar />} />
            <Route path='logout' element={<Logout />} />
          </Route>

          <Route path="/dashboard/driver/" element={<LayoutDriver />} >
            <Route index element={<DriverDashboard />} />
            <Route path='profile' element={<DriverProfile />} />
            <Route path='calendar' element={<Calendar />} />
            <Route path='trip-history' element= {<History />} />
            <Route path='logout' element={<DriverLogout />} />
          </Route>
          {/*<Route path="/profile/user/:token" element={<ProfilePage />} />*/}
          <Route path="*" element={<NotFound />} />
        </Routes>
     
    </Router>
  );
}

export default App;

