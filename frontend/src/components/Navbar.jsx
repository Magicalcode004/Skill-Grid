import React from "react";
import { NavLink, Link, useNavigate } from 'react-router-dom';
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  const navClass = ({ isActive }) => isActive ? "nav-item active" : "nav-item";
  const adminNavClass = ({ isActive }) => isActive ? "nav-item admin-link active" : "nav-item admin-link";
  const profileNavClass = ({ isActive }) => isActive ? "nav-item profile-link active" : "nav-item profile-link";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* Logo Section */}
        <Link to="/" className="navbar-logo">
          <Logo />
        </Link>

        {/* Links Section */}
        <div className="nav-links">
          <NavLink to="/" end className={navClass}>Home</NavLink>
          <NavLink to="/about" className={navClass}>About</NavLink>
          <NavLink to="/contact" className={navClass}>Contact Us</NavLink>

          {token && user ? (
            <>
              {user.role === 'client' && (
                <>
                  <NavLink to="/browse-workers" className={navClass}>Browse Workers</NavLink>
                  <NavLink to="/dashboard" className={navClass}>My Dashboard</NavLink>
                </>
              )}

              {user.role === 'worker' && (
                <NavLink to="/worker-dashboard" className={navClass}>Job Requests</NavLink>
              )}

              {user.role === 'admin' && (
                <NavLink to="/admin-dashboard" className={adminNavClass}>
                  Admin Panel
                </NavLink>
              )}

              <NavLink to="/profile" className={profileNavClass}>My Profile</NavLink>

              <button onClick={handleLogout} className="nav-item nav-btn logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/browse-workers" className={navClass}>Browse Workers</NavLink>
              <NavLink to="/login" className={navClass}>Login</NavLink>
              <NavLink to="/register" className="nav-item nav-btn register-btn">Register</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;