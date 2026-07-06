import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import BookingModel from './BookingModel';

const Dashboard = () => {
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleBookClick = (worker) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("For Booking, Login First");
    } else {
      setSelectedWorker(worker);
    }
  };

  // ✅ FIX 2: Added safety checks to prevent crashes and added Location search
  const filtered = workers.filter(w =>
    (w.name && w.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (w.profession && w.profession.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (w.location && w.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome to <span>SkillGrid</span> Dashboard</h1>
        <p>Book verified professionals near you instantly.</p>
        <input
          className="search-bar"
          type="text"
          placeholder="🔍  Search by name, profession, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="dashboard-container">
        <h2>Available Professionals</h2>

        {filtered.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem', color: '#666' }}>
            Loading professionals... (Or no registration till now..)
          </p>
        ) : (
          <div className="workers-grid">
            {filtered.map(worker => (
              <div className="worker-card" key={worker._id}>

                {/* Photo Section */}
                <div className="card-photo-wrapper">
                  <img
                    src={
                      worker.photo
                        ? `http://localhost:5000${worker.photo}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name || 'Worker')}&background=fdb441&color=1a1a1a&bold=true&size=300`
                    }
                    alt={worker.name}
                    className="card-photo"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name || 'Worker')}&background=fdb441&color=1a1a1a&bold=true&size=300`;
                    }}
                  />
                  <div className="rating-badge">
                    ⭐ {worker.rating || '4.5'}
                  </div>
                </div>

                {/* Info Section */}
                <div className="card-info">
                  <h3 className="worker-name">{worker.name}</h3>
                  <p className="worker-profession">🔧 {worker.profession || 'General Worker'}</p>
                  
                  {worker.location && (
                    <p className="worker-location">📍 {worker.location}</p>
                  )}
                  
                  <p className="worker-jobs">
                    ✅ {worker.jobsCompleted || 0} Jobs Completed
                  </p>

                  {/* ✅ FIX 1: Shifted Price Details inside card-info for correct layout */}
                  {worker.chargeType && worker.chargeAmount > 0 && (
                    <p className="worker-charge" style={{ fontWeight: 'bold', color: '#1a1a1a', margin: '8px 0' }}>
                      💰 ₹{worker.chargeAmount} / {worker.chargeType === 'hour' ? 'hr' : 'day'}
                    </p>
                  )}

                  <button className="book-btn" onClick={() => handleBookClick(worker)}>
                    Rent Worker
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