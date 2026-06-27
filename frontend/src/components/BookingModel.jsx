import React, { useState } from 'react';
import './BookingModel.css';

const BookingModel = ({ worker, onClose }) => {
  const [bookingData, setBookingData] = useState({
    date: '',
    address: '',
    serviceNeeded: '' 
  });

  const handleChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // LocalStorage 
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert("Login First...!");
        return;
      }

      //  Backend Booking Request
      
      const response = await fetch("http://localhost:5000/api/requests/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token //  Token checkauth middleware 
        },
        body: JSON.stringify({
          workerId: worker._id, // fached Database original ID
          serviceNeeded: bookingData.serviceNeeded,
          address: bookingData.address,
          date: bookingData.date
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(" " + data.message); 
        onClose(); 
      } else {
        alert(" Booking Failed: " + (data.message || "Something gone wrong"));
      }
    } catch (error) {
      console.error("Booking Error:", error);
      alert("Not able to connect with server!");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-pop-in">
        <button className="close-btn" onClick={onClose}>✖</button>
        
        <h2>Book {worker.profession}</h2>
        
        <div className="worker-mini-profile">
          <img 
            src={`https://ui-avatars.com/api/?name=${worker.name}&background=fdb441&color=1a1a1a&bold=true`} 
            alt={worker.name} 
            className="mini-avatar" 
          />
          <div>
            <h3>{worker.name}</h3>
            <p>⭐ 4.5 | Exp: {worker.experience}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="input-group">
            <label>When do you need the service?</label>
            <input type="date" name="date" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Service Address</label>
            <textarea name="address" rows="2" placeholder="Full address..." onChange={handleChange} required></textarea>
          </div>

          <div className="input-group">
            <label>Describe your problem</label>
            
            <textarea name="serviceNeeded" rows="3" placeholder="Your Issue..? (e.g., Fan not working, Pipe leaking)" onChange={handleChange} required></textarea>
          </div>

          <button type="submit" className="confirm-book-btn">Confirm Booking</button>
        </form>
      </div>
    </div>
  );
};

export default BookingModel;