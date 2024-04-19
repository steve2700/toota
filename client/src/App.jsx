import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DriverLoginForm from "./components/Driver/DriverLoginForm";
import DriverRegistrationForm from "./components/Driver/DriverRegistrationForm";
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
import RideHistory from './pages/RideHistory';
import Calendar from './pages/Calendar';
import Logout from './pages/Logout';

export const AuthContext = createContext();

function App() {
  const [jwt, setJWT] = useState(null);

  return (
    <Router>
      <AuthContext.Provider value={{ auth: [jwt, setJWT] }}>
        <Routes>
          <Route path="/signup/driver" element={<DriverRegistrationForm />} />
          <Route path="/login/driver" element={<DriverLoginForm />} />
          <Route path="/signup/user" element={<UserRegistrationForm />} />
          <Route path="/login/user" element={<UserLoginForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
          <Route path="/dashboard/user/" element={<Layout />} >
            <Route index element={<Dashboard />} />
            <Route path='profile' element={<ProfilePage />} />
            <Route path='trip-history' element= {<RideHistory />} />
            <Route path='calendar' element={<Calendar />} />
            <Route path='logout' element={<Logout />} />
          </Route>
          <Route path="/dashboard/driver" element={<DriverDashboard />} />
          <Route path="/upload-document" element={<DocumentUploadForm />} />
          {/*<Route path="/profile/user/:token" element={<ProfilePage />} />*/}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;

