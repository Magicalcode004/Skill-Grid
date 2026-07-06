import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: { 'auth-token': token },
        });

        const data = await response.json();
        if (response.ok) {
          setUserData(data);
          setFormData(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert(' ' + result.message);
        setUserData(formData);
        setIsEditing(false);
      } else {
        alert(' Error updating profile');
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!userData) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <h2>Loading Profile...</h2>
      </div>
    );
  }

  return (
    <div className="worker-profile-page">
      <div className="worker-profile-container animate-fade-in">
        
        <div className="worker-profile-header">
          <div className="header-bg"></div>
          
          <div className="worker-profile-image">
            <img
              src={userData.photo 
                ? `http://localhost:5000${userData.photo}` 
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=fdb441&color=1a1a1a&bold=true&size=150`}
              alt="Profile"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=fdb441&color=1a1a1a&bold=true&size=150`;
              }}
            />
          </div>
          <h2>{userData.name}</h2>
          <span className="role-badge">{userData.role.toUpperCase()} ACCOUNT</span>
        </div>

        {!isEditing ? (
          <div className="worker-profile-details">
            <div className="details-grid">
              <div className="worker-profile-card">
                <strong>📧 Email Address</strong>
                <span>{userData.email}</span>
              </div>
              <div className="worker-profile-card">
                <strong>📱 Phone Number</strong>
                <span>{userData.phone}</span>
              </div>

              {userData.role === "worker" && (
                <>
                  <div className="worker-profile-card">
                    <strong>🔧 Profession</strong>
                    <span>{userData.profession || 'Not specified'}</span>
                  </div>
                  <div className="worker-profile-card">
                    <strong>📍 Location</strong>
                    <span>{userData.location || 'Not specified'}</span>
                  </div>
                  <div className="worker-profile-card">
                    <strong>⭐ Experience</strong>
                    <span>{userData.experience ? `${userData.experience} Years` : 'Not specified'}</span>
                  </div>
                  <div className="worker-profile-card">
                    <strong>💰 Service Charge</strong>
                    <span>
                      {userData.chargeAmount && userData.chargeType 
                        ? `₹${userData.chargeAmount} / ${userData.chargeType}` 
                        : 'Not specified'}
                    </span>
                  </div>
                </>
              )}
            </div>

            <button className="worker-profile-btn" onClick={() => setIsEditing(true)}>
              ✏️ Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="worker-profile-form">
            <div className="form-grid">
              <div className="worker-profile-input-group">
                <label>Full Name</label>
                <input type="text" name="name" value={formData.name || ""} onChange={handleChange} required />
              </div>
              
              <div className="worker-profile-input-group">
                <label>Phone Number</label>
                <input type="text" name="phone" value={formData.phone || ""} onChange={handleChange} required />
              </div>

              {userData.role === "worker" && (
                <>
                  <div className="worker-profile-input-group">
                    <label>Profession</label>
                    <input type="text" name="profession" value={formData.profession || ""} onChange={handleChange} />
                  </div>
                  <div className="worker-profile-input-group">
                    <label>Location</label>
                    <input type="text" name="location" value={formData.location || ""} onChange={handleChange} />
                  </div>
                  <div className="worker-profile-input-group">
                    <label>Experience (Years)</label>
                    <input type="number" name="experience" value={formData.experience || ""} onChange={handleChange} />
                  </div>
                  
                  {/* New Charge Fields (Grid takes 2 columns, so we wrap these beautifully) */}
                  <div className="charge-inputs-wrapper">
                     <div className="worker-profile-input-group">
                        <label>Charge Amount (₹)</label>
                        <input type="number" name="chargeAmount" value={formData.chargeAmount || ""} onChange={handleChange} placeholder="e.g. 500" />
                      </div>
                      <div className="worker-profile-input-group">
                        <label>Charge Type</label>
                        <select name="chargeType" value={formData.chargeType || ""} onChange={handleChange} className="styled-select">
                          <option value="">Select Type</option>
                          <option value="hour">Per Hour</option>
                          <option value="day">Per Day</option>
                          <option value="visit">Per Visit</option>
                        </select>
                      </div>
                  </div>
                </>
              )}
            </div>

            <div className="worker-profile-button-group">
              <button type="submit" className="worker-profile-btn save-btn">💾 Save Changes</button>
              <button type="button" className="worker-profile-cancel-btn" onClick={() => setIsEditing(false)}>✖ Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;