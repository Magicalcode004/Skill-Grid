import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
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


function App() {
  return (
    <Router>
      <Navbar/>

      <Routes>
        <Route path="/my-bookings" element={<PrivateRoute><MyBookings/></PrivateRoute>}/>
        <Route path="/worker-dashboard" element={<PrivateRoute><WorkerDashboard/></PrivateRoute>}/>
        <Route path="/" element={<Home/>}/>
        <Route path="/ragister" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/worker-dashboard" element={<WorkerDashboard/>}/>
        <Route path="/my-bookings" element={<MyBookings/>}/>
      </Routes>
      
      <About/>
      <Footer/>
    </Router>
  );
}

export default App;