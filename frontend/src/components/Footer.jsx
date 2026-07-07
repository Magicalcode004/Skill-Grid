import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const token = sessionStorage.getItem('token');
  const userString = sessionStorage.getItem('user');

  let user = null;
  if (userString && userString !== "undefined") {
    user = JSON.parse(userString);
  }

  const isLoggedIn = token && user;

  return (
    <footer className="footer-section">
      <div className="footer-container">
        
        
        <div className="footer-col brand-col">
          <h2><span style={{ color: '#ffffff' }}>Skill</span><span style={{ color: '#fdb441' }}>Grid</span></h2>
          <p>
            Connect with verified and trusted professionals near you, just a click away. Discover the best local services available in your city.
          </p>
        </div>

        
        <div className="footer-col">
          <h3>Top Categories</h3>
          <ul>
            <li><Link to="/">⚡ Electrician</Link></li>
            <li><Link to="/">🚰 Plumber</Link></li>
            <li><Link to="/">🪚 Carpenter</Link></li>
            <li><Link to="/">❄️ AC Repair</Link></li>
          </ul>
        </div>

        
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            {!isLoggedIn && <li><Link to="/login">Login</Link></li>}
            <li><Link to="/browse-workers">Services</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>

        
        <div className="footer-col contact-col">
          <h3>Contact Info</h3>
          <p>📍 Hazaribagh, Jharkhand, India</p>
          <p>📞 +91-8809058320</p>
          <p>✉️ support.skillgrid@gmail.com</p>
        </div>

      </div>

      
      <div className="footer-bottom">
        <p>&copy; 2026 SkillGrid. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;