import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import Logo from './logo';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  
  let user = null;
  if (userString && userString !== "undefined") {
    user = JSON.parse(userString);
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login'); 
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* Logo Section */}
        <Link to="/" className="navbar-logo">
          <Logo />
        </Link>

        {/* Links Section */}
        <div className="nav-links">
          <Link to="/" className="nav-item">Home</Link>
          <Link to="/about" className="nav-item">About</Link>

          {/* Conditional rendering for logged in/out users */}
          {token && user ? (
            <>
              {user.role === 'client' && (
                <>
                  <Link to="/dashboard" className="nav-item">Dashboard</Link>
                  <Link to="/my-bookings" className="nav-item">My Bookings</Link>
                </>
              )}

              {user.role === 'worker' && (
                <Link to="/worker-dashboard" className="nav-item">Job Requests</Link>
              )}

              {user.role === 'admin' && (
                <Link to="/admin-dashboard" className="nav-item admin-link">
                  Admin Panel
                </Link>
              )}

              <Link to="/profile" className="nav-item profile-link">My Profile</Link>

              <button onClick={handleLogout} className="nav-item nav-btn logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="nav-item">Dashboard</Link>
              <Link to="/login" className="nav-item">Login</Link>
              {/* Note: Typo fixed here (/register) */}
              <Link to="/ragister" className="nav-item nav-btn register-btn">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;