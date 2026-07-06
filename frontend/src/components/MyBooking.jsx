import React, { useState, useEffect } from 'react';
import './MyBooking.css';

const statusConfig = {
  pending:   { label: 'Pending',   color: '#f0a820', icon: '⏳' },
  accepted:  { label: 'Accepted',  color: '#2d6a4f', icon: '✅' },
  rejected:  { label: 'Rejected',  color: '#e53e3e', icon: '❌' },
  completed: { label: 'Completed', color: '#1a1a2e', icon: '🎉' },
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otpInputs, setOtpInputs] = useState({});

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch("http://localhost:5000/api/requests/mybookings", {
        headers: { "auth-token": token }
      });
      if (res.ok) setBookings(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyBookings(); }, []);

  const handleVerifyOtp = async (bookingId) => {
    const otp = otpInputs[bookingId];
    if (!otp) return alert('Enter OTP first!');
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/requests/verify-otp/${bookingId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'auth-token': token },
      body: JSON.stringify({ otp })
    });
    const data = await res.json();
    if (res.ok) { alert(' ' + data.message); fetchMyBookings(); }
    else alert(' ' + data.message);
  };

  if (loading) return <div className="loading-screen"><h2>Loading your bookings...</h2></div>;

  return (
    <div className="my-bookings-page">
      <div className="bookings-header">
        <h1>My Booking History 📜</h1>
        <p>Track all your service requests and their status in real time.</p>
      </div>

      <div className="bookings-container">
        {bookings.length === 0 ? (
          <div className="no-bookings">
            <h3>No Bookings Yet!</h3>
            <p>Go to Dashboard and book a professional.</p>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => {
              const st = booking.status?.toLowerCase() || 'pending';
              const cfg = statusConfig[st] || statusConfig.pending;

              return (
                <div className={`booking-card status-${st}`} key={booking._id}>

                  {/* Status Bar */}
                  <div className="booking-status-bar" style={{ background: cfg.color }}>
                    <span>{cfg.icon} {cfg.label}</span>
                  </div>

                  <div className="booking-details">
                    <div className="booking-worker-row">
                      <img
                        src={booking.worker?.photo
                          ? `http://localhost:5000${booking.worker.photo}`
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.worker?.name || 'W')}&background=fdb441&color=1a1a1a&bold=true`}
                        alt="worker"
                        className="booking-worker-avatar"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.worker?.name || 'W')}&background=fdb441&color=1a1a1a&bold=true`;
                        }}
                      />
                      <div>
                        <h3>{booking.worker?.name || 'Unknown Worker'}</h3>
                        <p className="booking-profession">{booking.worker?.profession || ''}</p>
                      </div>
                    </div>

                    <p><strong>🔧 Service:</strong> {booking.serviceNeeded}</p>
                    <p><strong>📅 Date:</strong> {booking.date}</p>
                    <p><strong>📍 Address:</strong> {booking.address}</p>

                    {st === 'accepted' && booking.worker?.phone && (
                      <p className="worker-contact">📞 <strong>{booking.worker.phone}</strong></p>
                    )}

                    {/* OTP section — only when accepted */}
                    {st === 'accepted' && (
                      <div className="otp-section">
                        <p className="otp-hint">🔐 Work done? Enter OTP given by worker:</p>
                        <div className="otp-row">
                          <input
                            type="text"
                            maxLength="4"
                            placeholder="4-digit OTP"
                            value={otpInputs[booking._id] || ''}
                            onChange={(e) => setOtpInputs({ ...otpInputs, [booking._id]: e.target.value })}
                            className="otp-input"
                          />
                          <button className="otp-btn" onClick={() => handleVerifyOtp(booking._id)}>
                            Verify
                          </button>
                        </div>
                      </div>
                    )}

                    {st === 'completed' && (
                      <p className="completed-msg">🎉 Work successfully completed!</p>
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