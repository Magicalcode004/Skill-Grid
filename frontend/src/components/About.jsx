import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      
      <div className="about-hero">
        <div className="about-hero-content animate-slide-up">
          <h1>About <span className="highlight-text">SkillGrid</span></h1>
          <p>Empowering local professionals. Connecting communities.</p>
        </div>
      </div>

      
      <div className="about-container">
        <div className="mission-section">
          <div className="mission-text">
            <h2>Our Mission</h2>
            <p>
              SkillGrid is a platform designed to connect daily-wage workers, electricians, plumbers, and other local service professionals with the digital marketplace. Our mission is to provide clients with reliable services while helping workers find nearby job opportunities effortlessly, all without the involvement of middlemen.
            </p>
            <p>
              From Hazaribagh to every city where skilled professionals are needed, we are making employment opportunities more accessible through technology.
            </p>
          </div>
          <div className="mission-image">
            
            <img 
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Workers at site" 
              className="rounded-img shadow"
            />
          </div>
        </div>

        
        <div className="features-section">
          <h2>Why Choose SkillGrid?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🔍 Verified Professionals</h3>
              <p>Each worker’s profile and experience are carefully verified to ensure quality, reliability, and the best possible service for our customers.</p>
            </div>
            <div className="feature-card">
              <h3>⚡ Instant Booking</h3>
              <p>Simply describe your requirement in a few clicks and connect with available professionals in your area.</p>
            </div>
            <div className="feature-card">
              <h3>🛡️ Secure & Transparent</h3>
              <p>Connect directly with skilled professionals with complete transparency and no hidden charges. Enjoy a safe and secure experience on our platform.</p>
            </div>
          </div>
        </div>

        
        <div className="developer-section">
          <h2>Meet The Developer Team</h2>
          <div className="dev-card">
            <img 
              src={`https://ui-avatars.com/api/?name=Sonal+Kumar&background=fdb441&color=1a1a1a&bold=true&size=150`} 
              alt="Developer Avatar" 
              className="dev-avatar"
            />
            <div className="dev-info">
              <h3>Magicals</h3>
              <h4>Full-Stack Web Developer | BCA Scholars</h4>
              <p>
                SkillGrid is a passion project built using the MERN Stack (MongoDB, Express, React, Node.js). 
                The vision behind this platform is to bridge the gap between traditional skills and modern digital accessibility.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;