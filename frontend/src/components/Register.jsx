import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'client',
    profession: '',
    experience: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      
      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json(); 
      } else {
        data = { message: await response.text() }; 
      }

      if (response.ok) {
        alert(" " + data.message);
        navigate('/login');
      } else {
        alert(" Error: " + data.message);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Server Close?");
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

        {/* RIGHT SIDE: Form */}
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
                <div className="input-group" style={{ marginBottom: '15px' }}>
                  <label>Profession (e.g., Electrician, Plumber)</label>
                  <input type="text" name="profession" onChange={handleChange} required />
                </div>
                <div className="input-group">
  <label>Experience (in Years, e.g., 5)</label>
  <input 
    type="number" 
    name="experience" 
    placeholder="Enter Only in number (e.g., 2)" 
    onChange={handleChange} 
    required 
    min="0" 
  />
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