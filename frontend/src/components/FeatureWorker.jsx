import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FeaturedWorkers.css';
import { useToast } from '../context/ToastContext';

const FeaturedWorkers = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Dummy Data for Home Page
  const dummyWorkers = [
    {
      id: 1,
      name: "Raju Electrician",
      profession: "Expert Electrician",
      location: "Boddom Bazar, Hazaribagh",
      rating: "4.8",
      jobsDone: 124,
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 2,
      name: "Mahesh Plumber",
      profession: "Plumbing Specialist",
      location: "Matwari, Hazaribagh",
      rating: "4.6",
      jobsDone: 89,
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 3,
      name: "Sunil Painter",
      profession: "House Painter",
      location: "Khurra Road, Hazaribagh",
      rating: "4.9",
      jobsDone: 210,
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  const handleDummyBook = () => {
    const token = sessionStorage.getItem('token');
    
    if (!token) {
      showToast("Log in first", 'error');
      
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="featured-section">
      <div className="featured-header">
        <h2>Top Rated Professionals Near You</h2>
        <p>Book verified and experienced workers for your home needs.</p>
      </div>

      <div className="featured-grid">
        {dummyWorkers.map((worker) => (
          <div className="featured-card" key={worker.id}>
            <div className="featured-img-container">
              <img src={worker.image} alt={worker.name} className="featured-img" />
              <div className="featured-rating">⭐ {worker.rating}</div>
            </div>
            
            <div className="featured-info">
              <h3>{worker.name}</h3>
              <p className="f-profession">🛠️ {worker.profession}</p>
              <p className="f-location">📍 {worker.location}</p>
              <p className="f-jobs">✅ {worker.jobsDone} Jobs Completed</p>
              
              <button className="f-book-btn" onClick={handleDummyBook}>
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedWorkers;