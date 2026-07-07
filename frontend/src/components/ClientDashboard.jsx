import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ClientDashboard.css';
import LiveChat from './LiveChat';
import { useToast } from '../context/ToastContext';

const ClientDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [otpInputs, setOtpInputs] = useState({});
  const [tab, setTab] = useState('all');
  const [activeChat, setActiveChat] = useState(null);
  const { showToast } = useToast();

  const token = sessionStorage.getItem('token');
  const userString = sessionStorage.getItem('user');
  const currentUser = userString ? JSON.parse(userString):null;

  const fetchData = async () => {
    try {
      const [profileRes, bookingsRes] = await Promise.all([
        fetch('http://localhost:5000/api/auth/profile',        { headers: { 'auth-token': token } }),
        fetch('http://localhost:5000/api/requests/mybookings', { headers: { 'auth-token': token } }),
      ]);

      const profileData  = await profileRes.json();
      const bookingsData = await bookingsRes.json();

      setUser(profileData);

      // Safety check — agar array nahi aaya toh empty array set karo
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);

    } catch (err) {
      console.error(err);
      setBookings([]); // error pe bhi crash mat karo
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchData(); }, []);

  const handleVerifyOtp = async (bookingId) => {
    const otp = otpInputs[bookingId];
    if (!otp) return showToast('Enter OTP.!', 'error');
    const res = await fetch(`http://localhost:5000/api/requests/verify-otp/${bookingId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'auth-token': token },
      body: JSON.stringify({ otp })
    });
    const data = await res.json();
    if (res.ok) { showToast(data.message, 'success'); fetchData(); }
    else showToast(data.message, 'error');
  };

  if (loading) return <div className="cd-loading">Loading your dashboard...</div>;

  const stats = {
    total:     bookings.length,
    pending:   bookings.filter(b => b.status === 'pending').length,
    accepted:  bookings.filter(b => b.status === 'accepted').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    rejected:  bookings.filter(b => b.status === 'rejected').length,
  };

  const filtered = tab === 'all' ? bookings : bookings.filter(b => b.status === tab);

  const statusColor = { pending: '#f0a820', accepted: '#2d6a4f', completed: '#1a1a2e', rejected: '#e53e3e' };
  const statusIcon  = { pending: '⏳', accepted: '✅', completed: '🎉', rejected: '❌' };

  return (
    <div className="cd-page">

      {/* TOP HEADER */}
      <div className="cd-header">
        <div className="cd-header-left">
          <img
            src={user?.photo
              ? `http://localhost:5000${user.photo}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name||'U')}&background=fdb441&color=1a1a1a&bold=true&size=200`}
            alt="profile"
            className="cd-avatar"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name||'U')}&background=fdb441&color=1a1a1a&bold=true&size=200`;
            }}
          />
          <div>
            <h2>Welcome back, {user?.name}! 👋</h2>
            <p>📧 {user?.email}</p>
            <p>📞 {user?.phone}</p>
          </div>
        </div>
        <div className="cd-header-actions">
          <Link to="/browse-workers" className="cd-action-btn primary">🔍 Browse Workers</Link>
          <Link to="/profile"   className="cd-action-btn secondary">✏️ Edit Profile</Link>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="cd-stats">
        <div className="cd-stat-card total">
          <h3>{stats.total}</h3><p>Total Bookings</p>
        </div>
        <div className="cd-stat-card pending">
          <h3>{stats.pending}</h3><p>⏳ Pending</p>
        </div>
        <div className="cd-stat-card accepted">
          <h3>{stats.accepted}</h3><p>✅ Accepted</p>
        </div>
        <div className="cd-stat-card completed">
          <h3>{stats.completed}</h3><p>🎉 Completed</p>
        </div>
        <div className="cd-stat-card rejected">
          <h3>{stats.rejected}</h3><p>❌ Rejected</p>
        </div>
      </div>

      {/* TABS */}
      <div className="cd-body">
        <div className="cd-section-header">
          <h2>My Bookings</h2>
          <div className="cd-tabs">
            {['all','pending','accepted','completed','rejected'].map(t => (
              <button key={t} className={`cd-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="cd-empty">
            <p>No bookings. <Link to="/dashboard">Browse Worker!</Link></p>
          </div>
        ) : (
          <table className="cd-table">
            <thead>
              <tr>
                <th>Worker</th>
                <th>Service</th>
                <th>Date</th>
                <th>Address</th>
                <th>Status</th>
                <th>Contact / Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => {
                const st = b.status || 'pending';
                return (
                  <tr key={b._id}>
                    <td>
                      <div className="cd-worker-cell">
                        <img
                          src={b.worker?.photo
                            ? `http://localhost:5000${b.worker.photo}`
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(b.worker?.name||'W')}&background=fdb441&color=1a1a1a&bold=true`}
                          alt="w"
                          className="cd-table-avatar"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(b.worker?.name||'W')}&background=fdb441&color=1a1a1a&bold=true`;
                          }}
                        />
                        <div>
                          <strong>{b.worker?.name || '—'}</strong>
                          <small>{b.worker?.profession || ''}</small>
                        </div>
                      </div>
                    </td>
                    <td>{b.serviceNeeded}</td>
                    <td>{b.date}</td>
                    <td>{b.address}</td>
                    <td>
                      <span className="cd-status-badge" style={{ background: statusColor[st] }}>
                        {statusIcon[st]} {st.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {st === 'accepted' && (
                        <div className="cd-action-cell">
                          <p className="cd-phone">📞 {b.worker?.phone}</p>
                          <div className="cd-otp-row">
                            <input
                              type="text" maxLength="4"
                              placeholder="OTP"
                              value={otpInputs[b._id] || ''}
                              onChange={(e) => setOtpInputs({ ...otpInputs, [b._id]: e.target.value })}
                              className="cd-otp-input"
                            />
                            <button className="cd-otp-btn" onClick={() => handleVerifyOtp(b._id)}>
                              Verify ✅
                            </button>
                          </div>
                          <button className='cd-chat-btn'
                          onClick={()=> setActiveChat(
                            {
                                requestId:b._id,
                                otherUser:b.worker
                            }
                          )}
                          >Live Chat</button>
                        </div>
                      )}
                      {st === 'completed' && <span className="cd-done">🎉 Done!</span>}
                      {st === 'pending'   && <span className="cd-wait">Awaiting response...</span>}
                      {st === 'rejected'  && <span className="cd-rej">Try another worker</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {activeChat && currentUser &&(
        <LiveChat
        requestId={activeChat.requestId}
        currentUser={currentUser}
        otherUser={activeChat.otherUser}
        onClose={()=> setActiveChat(null)}
        />
      )}
    </div>
  );
};

export default ClientDashboard;