import React, { useState } from 'react';
import './BookingModel.css';

const BookingModel = ({ worker, onClose }) => {
  const [bookingData, setBookingData] = useState({ date: '', address: '', serviceNeeded: '' });

  const handleChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert("Login First...!");

    const response = await fetch("http://localhost:5000/api/requests/book", {
      method: "POST",
      headers: { "Content-Type": "application/json", "auth-token": token },
      body: JSON.stringify({ workerId: worker._id, ...bookingData })
    });

    const data = await response.json();
    if (response.ok) { alert(" " + data.message); onClose(); }
    else alert(" " + (data.message || "Something went wrong"));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-pop-in" onClick={(e) => e.stopPropagation()}>
        
        {/* LEFT — Dark Image Background with Text (Like your screenshot) */}
        {/* Background image me linear-gradient use kiya hai text ko readable banane ke liye */}
        <div className="modal-left" style={{
            background: `linear-gradient(rgba(26, 26, 26, 0.7), rgba(26, 26, 26, 0.9)), url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
          <h2>Book Your <br /><span className="text-yellow">Professional</span></h2>
          <p className="modal-subtitle">Provide your details to connect with <strong>{worker.name}</strong> for the best local services.</p>

          <div className="worker-mini-profile">
            <img
              src={worker.photo ? `http://localhost:5000${worker.photo}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name)}&background=fdb441&color=1a1a1a`}
              alt={worker.name}
              className="mini-worker-photo"
              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name)}&background=fdb441&color=1a1a1a`; }}
            />
            <div className="mini-worker-details">
              <h4>{worker.name}</h4>
              <p>{worker.profession || 'Worker'}</p>
              <div className="mini-stats">
                <span>⭐ {worker.rating || '4.5'}</span>
                <span>🔧 {worker.experience || '2'} yrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Clean White Form */}
        <div className="modal-right">
          <button className="close-btn" onClick={onClose}>✖</button>
          
          <h3 className="form-heading">Service Details</h3>
          <p className="form-subheading">Please enter the booking details below.</p>

          <form onSubmit={handleSubmit} className="booking-form">
            <div className="input-group">
              <label>Preferred Date</label>
              <input type="date" name="date" onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Service Address</label>
              <input type="text" name="address" placeholder="Enter your full address" onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Describe Your Problem</label>
              <textarea name="serviceNeeded" rows="3" placeholder="e.g. Fan not working, pipe leaking..." onChange={handleChange} required></textarea>
            </div>
            
            <button type="submit" className="confirm-book-btn">Confirm Booking</button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default BookingModel;