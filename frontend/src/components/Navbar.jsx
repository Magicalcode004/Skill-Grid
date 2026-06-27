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
    alert("Log out Successful!");
    
    navigate('/login'); 
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Logo />
      </Link>

      <div className="nav-links">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/about" className="nav-item">About</Link>

        {/* Conditonal rendering for log in or log out*/}
        {token && user ? (
          /* If user is log in */
          <>
            {/* if client is login */}
            {user.role === 'client' && (
              <>
                <Link to="/dashboard" className="nav-item">Dashboard</Link>
                <Link to="/my-bookings" className="nav-item">My Bookings</Link>
              </>
            )}

            {/* if worker is login */}
            {user.role === 'worker' && (
              <Link to="/worker-dashboard" className="nav-item">Job Requests</Link>
            )}

            {/* Logout Button  */}
            <button 
              onClick={handleLogout} 
              className="nav-item register-btn" 
              style={{ cursor: 'pointer', border: 'none', fontFamily: 'inherit', fontSize: 'inherit' }}
            >
              Logout
            </button>
          </>
        ) : (
          /* if nobody loged in */
          <>
            <Link to="/dashboard" className="nav-item">Dashboard</Link>
            <Link to="/login" className="nav-item">Login</Link>
            <Link to="/ragister" className="nav-item register-btn">Register</Link>
          </>
        )}
       
        
      </div>
    </nav>
  );
};

export default Navbar;