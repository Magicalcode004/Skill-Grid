import React from 'react';
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

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/"               element={<Home />} />
        <Route path="/ragister"       element={<Register />} />
        <Route path="/register"       element={<Register />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/browse-workers" element={<Dashboard />} />
        <Route path="/about"          element={<About />} />
        <Route path="/contact"        element={<ContactUs />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute><ClientDashboard /></PrivateRoute>
        } />
        <Route path="/worker-dashboard" element={
          <PrivateRoute><WorkerDashboard /></PrivateRoute>
        } />
        <Route path="/my-bookings" element={
          <PrivateRoute><MyBookings /></PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute><Profile /></PrivateRoute>
        } />
        <Route path="/admin-dashboard" element={
          <PrivateRoute><AdminDashboard /></PrivateRoute>
        } />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;