import React, { useState, useEffect } from 'react';
import './MyBooking.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        
        const response = await fetch("http://localhost:5000/api/requests/mybookings", {
          method: "GET",
          headers: {
            "auth-token": token
          }
        });

        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          console.error("Failed to fetch bookings");
        }
      } catch (error) {
        console.error("Server error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, []);

  return (
    <div className="my-bookings-page">
      <div className="bookings-header">
        <h1>My Booking History 📜</h1>
        <p>Track all your service requests here.</p>
      </div>

      <div className="bookings-container">
        {loading ? (
          <p className="loading-text">Loading your bookings...</p>
        ) : bookings.length === 0 ? (
          <div className="no-bookings">
            <h3>No Bookings Yet!</h3>
            <p>Jaldi se kisi professional ko book karein.</p>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => {
              const safeStatus = booking.status ? booking.status.toLowerCase() : 'pending';
              
              return (
                <div className={`booking-card ${safeStatus === 'rejected' ? 'declined' : safeStatus}`} key={booking._id}>
                  <div className="booking-status-badge">
                    {booking.status.toUpperCase()}
                  </div>
                  
                  <div className="booking-details">
                    <h3>{booking.worker ? booking.worker.name : "Unknown Worker"}</h3>
                    <p><strong>Service:</strong> {booking.serviceNeeded}</p>
                    <p><strong>Date:</strong> 📅 {booking.date}</p>
                    <p><strong>Address:</strong> 📍 {booking.address}</p>

                    {/* Show phone number if accepted by worker */}
                    {safeStatus === 'accepted' && booking.worker?.phone && (
                      <p className="worker-contact">
                        📞 Worker Contact: {booking.worker.phone}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;