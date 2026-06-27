import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import BookingModel from './BookingModel';

const Dashboard = () => {
  
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  

  const handleBookClick = (worker) =>
  {
    const token = localStorage.getItem('token');

    if(!token)
    {
      alert("Please, Log in First");
    }else{
      setSelectedWorker(worker);
    }
  };

  //use effect for fecthing data from database show on every first rendal bcs of useeffect empty array
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        
        const response = await fetch("http://localhost:5000/api/workers/all");
        
        if (response.ok) {
          const data = await response.json();
          setWorkers(data); 
        } else {
          console.error("Failed to fetch workers");
        }
      } catch (error) {
        console.error("Server connection error:", error);
      }
    };

    fetchWorkers();
  }, []); 

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome to SkillGrid Dashboard</h1>
        <p>Book verified professionals near you instantly.</p>
      </div>

      <div className="dashboard-container">
        <h2>Available Professionals</h2>
        
        {workers.length === 0 ? (
          <p style={{textAlign: 'center', marginTop: '50px', fontSize: '1.2rem', color: '#666'}}>
            Loading professionals... (Or no registration till now..)
          </p>
        ) : (
          <div className="worker-list-layout">
            {workers.map(worker => (
              <div className="worker-row-card" key={worker._id}>
                
                
                <img 
                  src={`https://ui-avatars.com/api/?name=${worker.name}&background=fdb441&color=1a1a1a&bold=true`} 
                  alt={worker.name} 
                  className="worker-avatar" 
                />
                
                <div className="worker-info">
                  <h3>{worker.name} <span className="small-rating">⭐ 4.5</span></h3>
                  
                  <p className="worker-category">{worker.profession}</p>
                  <p className="worker-exp">Exp: {worker.experience}</p>
                </div>

                <div className="worker-action">
                  <button className="book-btn-small" onClick={() => handleBookClick(worker)}>
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedWorker && (
        <BookingModel 
          worker={selectedWorker} 
          onClose={() => setSelectedWorker(null)} 
        />
      )}
      
    </div>
  );
};

export default Dashboard;