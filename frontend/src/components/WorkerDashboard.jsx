import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './WorkerDashboard.css';
import LiveChat from './LiveChat';
import { useToast } from '../context/ToastContext';

const WorkerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState('all');
  const [activeChat,setActiveChat]= useState(null);
  const userString = sessionStorage.getItem('user');
  const currentUser = userString ? JSON.parse(userString): null;

  const token = sessionStorage.getItem('token');
  const {showToast} = useToast;


const fetchData = async () => {
    try {
      const [profileRes, requestsRes] = await Promise.all([
        fetch('http://localhost:5000/api/auth/profile',       { headers: { 'auth-token': token } }),
        fetch('http://localhost:5000/api/requests/myrequest', { headers: { 'auth-token': token } }),
      ]);
      const profileData  = await profileRes.json();
      const requestsData = await requestsRes.json();

      setUser(profileData);
      setRequests(Array.isArray(requestsData) ? requestsData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
};

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchData(); }, []);

const handleAction = async (id, status) => {
    const res = await fetch(`http://localhost:5000/api/requests/updatestatus/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'auth-token': token },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    console.log('Update status response:', data);
    if (res.ok) {
      setRequests(requests.map(r => r._id === id ? { ...r, status } : r));
    } else {
      showToast('Update failed: ' + (data.error || data.message || 'Unknown error'));
    }
};

  const handleGenerateOtp = async (id) => {
    const res = await fetch(`http://localhost:5000/api/requests/generate-otp/${id}`, {
      method: 'POST',
      headers: { 'auth-token': token }
    });
    const data = await res.json();
    if (res.ok) showToast(` OTP for client: ${data.otp}\n\nUpdate this OTP to client if work is done.`);
    else showToast(' ' + data.message);
  };

  if (loading) return <div className="wd-loading">Loading your dashboard...</div>;

  const stats = {
    total:     requests.length,
    pending:   requests.filter(r => r.status === 'pending').length,
    accepted:  requests.filter(r => r.status === 'accepted').length,
    completed: requests.filter(r => r.status === 'completed').length,
    rejected:  requests.filter(r => r.status === 'rejected').length,
  };

  const totalEarnings = requests
    .filter(r => r.status === 'completed')
    .length * (user?.chargeAmount || 0);

  const filtered = tab === 'all' ? requests : requests.filter(r => r.status === tab);

  const statusColor = { pending:'#f0a820', accepted:'#2d6a4f', completed:'#1a1a2e', rejected:'#e53e3e' };

  return (
    <div className="wd-page">

      {/* HEADER */}
      <div className="wd-header">
        <div className="wd-header-left">
          <img
            src={user?.photo
              ? `http://localhost:5000${user.photo}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name||'W')}&background=fdb441&color=1a1a1a&bold=true&size=200`}
            alt="profile"
            className="wd-avatar"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name||'W')}&background=fdb441&color=1a1a1a&bold=true&size=200`;
            }}
          />
          <div>
            <h2>{user?.name} 👷</h2>
            <p>🔧 {user?.profession || 'Worker'} &nbsp;|&nbsp; 📍 {user?.location || '—'}</p>
            <p>⭐ {user?.rating || 4.5} Rating &nbsp;|&nbsp; ✅ {user?.jobsCompleted || 0} Jobs Done</p>
            {user?.chargeAmount > 0 && (
              <p>💰 ₹{user.chargeAmount}/{user.chargeType === 'hour' ? 'hr' : 'day'}</p>
            )}
          </div>
        </div>
        <div className="wd-header-actions">
          <Link to="/profile" className="wd-action-btn secondary">✏️ Edit Profile</Link>
        </div>
      </div>

      {/* STATS */}
      <div className="wd-stats">
        <div className="wd-stat-card total">
          <h3>{stats.total}</h3><p>Total Requests</p>
        </div>
        <div className="wd-stat-card pending">
          <h3>{stats.pending}</h3><p>⏳ Pending</p>
        </div>
        <div className="wd-stat-card accepted">
          <h3>{stats.accepted}</h3><p>🔨 Active Jobs</p>
        </div>
        <div className="wd-stat-card completed">
          <h3>{stats.completed}</h3><p>🎉 Completed</p>
        </div>
        {user?.chargeAmount > 0 && (
          <div className="wd-stat-card earnings">
            <h3>₹{totalEarnings}</h3>
            <p>💰 Est. Earnings</p>
          </div>
        )}
      </div>

      {/* REQUESTS TABLE */}
      <div className="wd-body">
        <div className="wd-section-header">
          <h2>Job Requests</h2>
          <div className="wd-tabs">
            {['all','pending','accepted','completed','rejected'].map(t => (
              <button key={t} className={`wd-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="wd-empty">
            <p>No requests.</p>
          </div>
        ) : (
          <table className="wd-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Service</th>
                <th>Date</th>
                <th>Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(req => {
                const st = req.status || 'pending';
                return (
                  <tr key={req._id}>
                    <td>
                      <div className="wd-client-cell">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(req.client?.name||'C')}&background=1a1a2e&color=fdb441&bold=true`}
                          alt="c" className="wd-table-avatar"
                        />
                        <div>
                          <strong>{req.client?.name || '—'}</strong>
                          {st === 'accepted' && req.client?.phone && (
                            <small className="wd-client-phone">📞 {req.client.phone}</small>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{req.serviceNeeded}</td>
                    <td>{req.date}</td>
                    <td>{req.address}</td>
                    <td>
                      <span className="wd-status-badge" style={{ background: statusColor[st] }}>
                        {st.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="wd-actions-cell">
                        {st === 'pending' && (
                          <>
                            <button className="wd-btn accept" onClick={() => handleAction(req._id, 'accepted')}>
                              ✅ Accept
                            </button>
                            <button className="wd-btn decline" onClick={() => handleAction(req._id, 'rejected')}>
                              ❌ Decline
                            </button>
                          </>
                        )}
                        {st === 'accepted' && (
                          <>
                          <button className="wd-btn otp" onClick={() => handleGenerateOtp(req._id)}>
                            🔐 Gen OTP
                          </button>

                          <button className='wd-btn chat'
                          onClick={()=> setActiveChat({
                            requestId : req._id,
                            otherUser : req.client
                          })}>Chat</button>
                          </>
                        )}
                        {st === 'completed' && <span className="wd-done">✔ Done</span>}
                        {st === 'rejected'  && <span className="wd-rej">—</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {activeChat && currentUser && (
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

export default WorkerDashboard;