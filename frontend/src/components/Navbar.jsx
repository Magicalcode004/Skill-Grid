import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import Logo from './logo';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  
  const token = sessionStorage.getItem('token');
  const userString = sessionStorage.getItem('user');
  
  let user = null;
  if (userString && userString !== "undefined") {
    user = JSON.parse(userString);
  }

  // Naya
const handleLogout = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
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
          <Link to="/contact" className="nav-item">Contact Us</Link>

          {token && user ? (
            <>
              {user.role === 'client' && (
                <>
                  <Link to="/browse-workers" className="nav-item">Browse Workers</Link>
                  <Link to="/dashboard" className="nav-item">My Dashboard</Link>
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
              <Link to="/browse-workers" className="nav-item">Browse Workers</Link>
              <Link to="/login" className="nav-item">Login</Link>
              <Link to="/register" className="nav-item nav-btn register-btn">Create Profile</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;