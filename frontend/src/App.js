import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/Footer';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import WorkerDashboard from './components/WorkerDashboard';
import About from './components/About';
import MyBookings from './components/MyBooking';
import PrivateRoute from './components/PrivateRoute';
import AdminDashboard from './components/AdminDashboard';
import Profile from './components/Profile';
import ContactUs from './components/ContactUs';
import ClientDashboard from './components/ClientDashboard';
import ScrollToTop from './components/ScrollToTop';
import { ToastProvider } from './context/ToastContext';

function App() {

  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  return (
    <ToastProvider>
    <Router>
      <ScrollToTop/>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/"               element={<Home />} />
        
        <Route path="/register"       element={<Register />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/browse-workers" element={<Dashboard />} />
        <Route path="/about"          element={<About />} />
        <Route path="/contact"        element={<ContactUs />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute allowedRoles={['client']}><ClientDashboard /></PrivateRoute>
        } />
        <Route path="/worker-dashboard" element={
          <PrivateRoute allowedRoles={['worker']}><WorkerDashboard /></PrivateRoute>
        } />
        <Route path="/my-bookings" element={
          <PrivateRoute><MyBookings /></PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute><Profile /></PrivateRoute>
        } />
        <Route path="/admin-dashboard" element={
          <PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>
        } />
      </Routes>

      <Footer />
    </Router>
    </ToastProvider>
  );
}

export default App;