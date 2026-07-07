import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { useToast } from '../context/ToastContext';

const AdminDashboard = () => {
  const [users, setUsers]       = useState([]);
  const [messages, setMessages] = useState([]);
  const [tab, setTab]           = useState('all');
  const { showToast } = useToast();

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/api/admin/users", {
      headers: { 'auth-token': sessionStorage.getItem('token') }
    });
    setUsers(await res.json());
  };

  const fetchMessages = async () => {
    const res = await fetch("http://localhost:5000/api/contact/all", {
      headers: { 'auth-token': sessionStorage.getItem('token') }
    });
    setMessages(await res.json());
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchUsers(); fetchMessages(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Sure? This cannot be undone.")) return;
    const res = await fetch(`http://localhost:5000/api/admin/user/${id}`, {
      method: 'DELETE',
      headers: { 'auth-token': sessionStorage.getItem('token') }
    });
    if (res.ok) { showToast('User deleted!', 'success'); fetchUsers(); }
    else showToast('Failed to delete user', 'error');
  };

  const handleMarkRead = async (id) => {
    await fetch(`http://localhost:5000/api/contact/read/${id}`, {
      method: 'PUT',
      headers: { 'auth-token': sessionStorage.getItem('token') }
    });
    fetchMessages();
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    await fetch(`http://localhost:5000/api/contact/delete/${id}`, {
      method: 'DELETE',
      headers: { 'auth-token': sessionStorage.getItem('token') }
    });
    fetchMessages();
  };

  const filtered = tab === 'all' || tab === 'worker' || tab === 'client'
    ? (tab === 'all' ? users : users.filter(u => u.role === tab))
    : [];

  const workers  = users.filter(u => u.role === 'worker').length;
  const clients  = users.filter(u => u.role === 'client').length;
  const unread   = messages.filter(m => !m.isRead).length;

  return (
    <div className="admin-container">
      <h1>🛡️ Admin Panel</h1>

      {/* Stats */}
      <div className="admin-stats">
        <div className="stat-card"><h3>{users.length}</h3><p>Total Users</p></div>
        <div className="stat-card"><h3>{workers}</h3><p>Workers</p></div>
        <div className="stat-card"><h3>{clients}</h3><p>Clients</p></div>
        <div className="stat-card" style={{ background: unread > 0 ? '#e53e3e' : '#2d6a4f' }}>
          <h3>{unread}</h3><p>Unread Messages</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {['all', 'worker', 'client', 'messages'].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'messages' ? `📩 Messages ${unread > 0 ? `(${unread})` : ''}` : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* USERS TABLE */}
      {tab !== 'messages' && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Photo</th><th>Name</th><th>Email</th>
              <th>Phone</th><th>Role</th><th>Profession</th>
              <th>Location</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user._id}>
                <td>
                  <img
                    src={user.photo
                      ? `http://localhost:5000${user.photo}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=fdb441&color=1a1a1a&bold=true`}
                    alt={user.name}
                    className="admin-user-photo"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=fdb441&color=1a1a1a&bold=true`;
                    }}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td><span className={`role-badge role-${user.role}`}>{user.role.toUpperCase()}</span></td>
                <td>{user.profession || '—'}</td>
                <td>{user.location || '—'}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(user._id)}>🗑 Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MESSAGES SECTION */}
      {tab === 'messages' && (
        <div className="messages-section">
          {messages.length === 0 ? (
            <p className="no-msg">No messages till now.</p>
          ) : (
            <div className="messages-grid">
              {messages.map(msg => (
                <div className={`msg-card ${msg.isRead ? 'read' : 'unread'}`} key={msg._id}>
                  <div className="msg-header">
                    <div>
                      <h4>{msg.name}</h4>
                      <p className="msg-email">📧 {msg.email}</p>
                    </div>
                    <div className="msg-meta">
                      <span className={`msg-badge ${msg.isRead ? 'read' : 'unread'}`}>
                        {msg.isRead ? '✅ Read' : '🔴 New'}
                      </span>
                      <small>{new Date(msg.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}</small>
                    </div>
                  </div>
                  <p className="msg-body">💬 {msg.message}</p>
                  <div className="msg-actions">
                    {!msg.isRead && (
                      <button className="msg-btn read-btn" onClick={() => handleMarkRead(msg._id)}>
                        ✅ Mark as Read
                      </button>
                    )}
                    <button className="msg-btn delete-btn" onClick={() => handleDeleteMessage(msg._id)}>
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;