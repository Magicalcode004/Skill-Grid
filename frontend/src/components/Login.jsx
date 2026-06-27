import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css'; 

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        alert(" " + data.message);
        
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        
        if (data.user.role === 'worker') {
          navigate('/worker-dashboard');
        } else {
          navigate('/dashboard'); // Client Dashboard
        }
      } else {
        alert(" Login Failed: " + data.message);
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Server error!.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        
        <div className="auth-left" style={{
          backgroundImage: "linear-gradient(rgba(26, 26, 26, 0.8), rgba(26, 26, 26, 0.85)), url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"
        }}>
          <div className="auth-left-content">
            <h2>Welcome Back to <span style={{ color: '#fdb441' }}>SkillGrid</span></h2>
            <p>Log in to your dashboard and take advantage of the best local services.</p>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-header">
            <h2>Login</h2>
            <p>Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder='Enter email' onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="Enter Your Password" onChange={handleChange} required />
            </div>

            <button type="submit" className="auth-btn">Log In</button>
          </form>

          <p className="auth-footer-text">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;