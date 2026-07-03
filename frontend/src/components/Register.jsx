import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '',
    role: 'client', profession: '', experience: '', location: ''
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      return alert(" Please fill in all the basic details (Name, Email, Phone, Password).");
    }

    
    if (!photo) {
      return alert(" Profile Picture is mandatory! Please upload a photo.");
    }

   
    if (formData.role === 'worker') {
      if (!formData.profession || !formData.experience || !formData.location) {
        return alert(" As a worker, you must provide your Profession, Experience, and Location.");
      }
    }

    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (photo) data.append('photo', photo);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        body: data
      });

      const contentType = response.headers.get("content-type");
      let result;
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = { message: await response.text() };
      }

      if (response.ok) {
        alert(" " + result.message);
        navigate('/login');
      } else {
        alert(" Error: " + result.message);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Server Closed or Unreachable!");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        <div className="auth-left">
          <div className="auth-left-content">
            <h2>Start Your Journey With <span style={{ color: '#fdb441' }}>SkillGrid</span></h2>
            <p>Whether you need a skilled worker or you're looking for work yourself, everything is available on a single platform.</p>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-header">
            <h2>Create an Account</h2>
            <p>Join us today and get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">

            <div className="input-group">
              <label>Full Name</label>
              <input type="text" name="name" placeholder='Enter your name' onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder='Enter your email' onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input type="text" name="phone" placeholder='Enter your phone number' onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input type="password" name="password" placeholder='Create strong password' onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>I want to join as a:</label>
              <select name="role" onChange={handleChange}>
                <option value="client">Client (Book Services)</option>
                <option value="worker">Worker (Provide Services)</option>
              </select>
            </div>

            {formData.role === 'worker' && (
              <div className="animate-slide-down">
                <div className="input-group">
                  <label>Profession (e.g., Electrician, Plumber)</label>
                  <input type="text" name="profession" onChange={handleChange} required />
                </div>

                <div className="input-group">
                  <label>Experience (in Years)</label>
                  <input type="number" name="experience" placeholder="e.g. 5" onChange={handleChange} required min="0" />
                </div>

              
                <div className="input-group">
                  <label>Location / Area</label>
                  <input type="text" name="location" placeholder="e.g. Boddom Bazar, Hazaribagh" onChange={handleChange} required />
                </div>

                <div className="input-group">
                  <label>Profile Photo</label>
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    onChange={handlePhotoChange}
                    style={{ padding: '8px', border: '2px dashed #fdb441', borderRadius: '8px', width: '100%' }}
                  />
                  {preview && (
                    <img src={preview} alt="Preview"
                      style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginTop: '10px', border: '3px solid #fdb441' }}
                    />
                  )}
                </div>
              </div>
            )}

            <button type="submit" className="auth-btn">Register Now</button>
          </form>

          <p className="auth-footer-text">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;