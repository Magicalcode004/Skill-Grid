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

        const response = await fetch(
          'http://localhost:5000/api/auth/profile',
          {
            headers: {
              'auth-token': token,
            },
          }
        );

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        'http://localhost:5000/api/auth/profile',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token,
          },
          body: JSON.stringify(formData),
        }
      );

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
        <h2>Loading Profile...</h2>
      </div>
    );
  }

  return (
   <div className="worker-profile-page">
  <div className="worker-profile-container">

    <div className="worker-profile-header">
      <h2>My Profile</h2>
      <p>{userData.role.toUpperCase()} ACCOUNT</p>
    </div>

    {!isEditing ? (
      <div className="worker-profile-details">

        {userData.photo && (
          <div className="worker-profile-image">
            <img
              src={`http://localhost:5000${userData.photo}`}
              alt="Profile"
            />
          </div>
        )}

        <div className="worker-profile-card">
          <strong>Name</strong>
          <span>{userData.name}</span>
        </div>

        <div className="worker-profile-card">
          <strong>Email</strong>
          <span>{userData.email}</span>
        </div>

        <div className="worker-profile-card">
          <strong>Phone</strong>
          <span>{userData.phone}</span>
        </div>

        {userData.role === "worker" && (
          <>
            <div className="worker-profile-card">
              <strong>Profession</strong>
              <span>{userData.profession}</span>
            </div>

            <div className="worker-profile-card">
              <strong>Location</strong>
              <span>{userData.location}</span>
            </div>

            <div className="worker-profile-card">
              <strong>Experience</strong>
              <span>{userData.experience} Years</span>
            </div>
          </>
        )}

        <button
          className="worker-profile-btn"
          onClick={() => setIsEditing(true)}
        >
          Edit Profile
        </button>
      </div>
    ) : (
      <form onSubmit={handleUpdate} className="worker-profile-form">

        <div className="worker-profile-input-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
          />
        </div>

        <div className="worker-profile-input-group">
          <label>Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
          />
        </div>

        {userData.role === "worker" && (
          <>
            <div className="worker-profile-input-group">
              <label>Profession</label>
              <input
                type="text"
                name="profession"
                value={formData.profession || ""}
                onChange={handleChange}
              />
            </div>

            <div className="worker-profile-input-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location || ""}
                onChange={handleChange}
              />
            </div>

            <div className="worker-profile-input-group">
              <label>Experience</label>
              <input
                type="number"
                name="experience"
                value={formData.experience || ""}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <div className="worker-profile-button-group">
          <button
            type="submit"
            className="worker-profile-btn"
          >
            Save Changes
          </button>

          <button
            type="button"
            className="worker-profile-cancel-btn"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>

      </form>
    )}
  </div>
</div>
  );
};

export default Profile;