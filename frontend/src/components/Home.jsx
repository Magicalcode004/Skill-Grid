import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import FeaturedWorkers from '../components/FeatureWorker';


const Home = () => {
  return (
    <div className="home-wrapper">
      
      {/* 🌟 HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          
          {/* Left Text Part */}
          <div className="hero-text">
            <span className="hero-badge">🚀 The Smart Way to Hire</span>
            <h1 className="hero-title">
              Find Trusted <span className="highlight-text">Professionals</span> in Minutes
            </h1>
            <p className="hero-desc">
              SkillGrid connects you with verified daily-wage workers, electricians, and plumbers right in your neighborhood. Quality work, guaranteed.
            </p>
            <div className="hero-buttons">
              <Link to="/dashboard" className="btn-primary">Book a Service</Link>
              <Link to="/register" className="btn-secondary">Join as Worker</Link>
            </div>
          </div>

          {/* Right Image Part with Floating Cards */}
          <div className="hero-visual">
            <div className="blob-shape"></div>
            
            <img src="/worker-hero.png" alt="Worker Professional" className="hero-img" />
            
            {/* Floating Glass Card 1 */}
            <div className="glass-card float-card-1">
              <span className="glass-icon">⭐</span>
              <div className="glass-text">
                <h4>4.9/5</h4>
                <p>Top Rated</p>
              </div>
            </div>

            {/* Floating Glass Card 2 */}
            <div className="glass-card float-card-2">
              <span className="glass-icon">✅</span>
              <div className="glass-text">
                <h4>100%</h4>
                <p>Verified Profiles</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="steps-section">
        <div className="section-header">
          <h2>How <span className="highlight-text">SkillGrid</span> Works</h2>
          <p>Get your work done in 3 simple steps</p>
        </div>
        
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-icon-wrapper">
              <span className="step-number">1</span>
              <span className="step-icon">🔍</span>
            </div>
            <h3>Search</h3>
            <p>Browse through our list of skilled local professionals based on your specific need.</p>
          </div>
          
          <div className="step-card">
            <div className="step-icon-wrapper">
              <span className="step-number">2</span>
              <span className="step-icon">📅</span>
            </div>
            <h3>Book</h3>
            <p>Check their profile, ratings, and experience, then instantly book them with one click.</p>
          </div>
          
          <div className="step-card">
            <div className="step-icon-wrapper">
              <span className="step-number">3</span>
              <span className="step-icon">🛠️</span>
            </div>
            <h3>Relax</h3>
            <p>Get your work done efficiently by experts while you sit back and relax.</p>
          </div>
        </div>
      </section>
      <FeaturedWorkers/>

    </div>
  );
};

export default Home;