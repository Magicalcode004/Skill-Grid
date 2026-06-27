import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import FeaturedWorkers from './FeatureWorker';


const Home = () => {
  return (
    <div className="home-wrapper">
      <div className="main-container">
        
        
        <div className="text-section">
          <h1>Welcome To <br /><span className="highlight-text">SkillGrid</span></h1>
          <p className="sub-text">
            Experience the Best Local Services.<br/>
            Verified Electricians, Plumbers & Carpenters.
          </p>
          
          <div className="action-buttons">
            <Link to="/dashboard" className="btn-yellow">VIEW WORKERS</Link>
            <Link to="/ragister" className="btn-black">JOIN US</Link>
          </div>
        </div>

        
        <div className="visual-section">
          
          <div className="orange-background-shape"></div>
          
          
          <div className="circular-image-container">
            
            <img 
              src="https://i.pinimg.com/736x/a6/4e/cc/a64ecc03d4d4286ff7834fbf66b7e8b5.jpg" 
              alt="Worker 2D Art" 
              className="main-circle-img"
            />
            
           
            <div className="badge top-badge">
              <span className="icon">📞</span> 24/7 Support Available
            </div>
            
            
            <div className="badge bottom-badge">
              <div className="badge-avatar">🧑‍🔧</div>
              <div className="badge-info">
                <strong>LOVE THEM!</strong>
                <div className="stars">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      <FeaturedWorkers/>
    </div>
  );
};

export default Home;