import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './Auth.css';
import {useToast} from '../context/ToastContext';



// ─── Steps 
const STEP_BASIC   = 1; // Name, Email, Phone
const STEP_OTP     = 2; // OTP verification
const STEP_DETAILS = 3; // Role + Worker fields + Password

const Register = () => {
  const navigate = useNavigate();
  const { showToast} = useToast();

  const [step, setStep]           = useState(STEP_BASIC);
  const [loading, setLoading]     = useState(false);
  const [otpInput, setOtpInput]   = useState('');
  const [photo, setPhoto]         = useState(null);
  const [preview, setPreview]     = useState(null);
  const [regToken, setRegToken] = useState('');



  const [formData, setFormData] = useState({
    name:         '',
    email:        '',
    phone:        '',
    password:     '',
    confirmPassword: '',
    role:         'client',
    profession:   '',
    experience:   '',
    location:     '',
    chargeType:   'day',
    chargeAmount: '',
  });

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

  // ── STEP 1: Send OTP 
const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
        return showToast('Please fill all fields.','error');
    }
    setLoading(true);
    try {
        const res = await fetch('http://localhost:5000/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: formData.email, name: formData.name }),
});
const data = await res.json();
if (!res.ok) {
    showToast(data.message);
    setLoading(false);
    return;
}

showToast(`OTP sent to ${formData.email}. Please check your inbox.`);
setStep(STEP_OTP);

    } catch (err) {
    console.error('OTP send error:', err);
    showToast('Failed to send OTP. Please try again.');
}finally {
        setLoading(false);
    }
};

  // ── STEP 2: Verify OTP 
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpInput) return showToast('Please enter the OTP.');

    setLoading(true);
    try {
        const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email, otp: otpInput }),
        });
        const data = await res.json();

        if (!res.ok) { showToast(data.message); return; }

        setRegToken(data.regToken);
        setStep(STEP_DETAILS);

    } catch (err) {
        showToast('OTP verification failed. Try again.');
    } finally {
        setLoading(false);
    }
};

  // ── Resend OTP
 const handleResendOtp = async () => {
    setLoading(true);
    try {
        const res = await fetch('http://localhost:5000/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: formData.email, name: formData.name }),
});
const data = await res.json();
if (!res.ok) { showToast(data.message); return; }

setOtpInput('');
showToast('New OTP sent to your email.');
    } catch (err) {
        showToast('Failed to resend OTP.');
    } finally {
        setLoading(false);
    }
};

  // ── STEP 3: Final Registration 
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.password) {
      return showToast('Please enter a password.');
    }
    if (formData.password !== formData.confirmPassword) {
      return showToast('Passwords do not match.');
    }
    if (formData.password.length < 6) {
      return showToast('Password must be at least 6 characters.');
    }
    if (formData.role === 'worker' && !photo) {
      return showToast('Profile photo is required for workers.');
    }
    if (formData.role === 'worker' &&
        (!formData.profession || !formData.experience || !formData.location)) {
      return showToast('Please fill all worker details.');
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (photo) data.append('photo', photo);
      data.append('regToken',regToken);

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        body:   data,
      });

      const result = await response.json();

      if (response.ok) {
        showToast('Account created successfully! Please login.');
        navigate('/login');
      } else {
        showToast('Error: ' + result.message);
      }
    } catch (err) {
      console.error('Register error:', err);
      showToast('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Render 
  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* LEFT PANEL */}
        <div className="auth-left">
          <div className="auth-left-content">
            <h2>Join <span style={{ color: '#fdb441' }}>SkillGrid</span></h2>
            <p>Connect with local skilled professionals or offer your services on a single platform.</p>

            {/* Step indicator */}
            <div className="step-indicator">
              <div className={`step-dot ${step >= STEP_BASIC   ? 'active' : ''}`}>1</div>
              <div className={`step-line ${step >= STEP_OTP    ? 'active' : ''}`}></div>
              <div className={`step-dot ${step >= STEP_OTP     ? 'active' : ''}`}>2</div>
              <div className={`step-line ${step >= STEP_DETAILS ? 'active' : ''}`}></div>
              <div className={`step-dot ${step >= STEP_DETAILS ? 'active' : ''}`}>3</div>
            </div>
            <div className="step-labels">
              <span>Basic Info</span>
              <span>Verify OTP</span>
              <span>Details</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-right">

          {/* ── STEP 1: Basic Info ── */}
          {step === STEP_BASIC && (
            <>
              <div className="auth-header">
                <h2>Create Account</h2>
                <p>Step 1 of 3 — Basic Information</p>
              </div>
              <form onSubmit={handleSendOtp} className="auth-form">
                <div className="input-group">
                  <label>Full Name</label>
                  <input
                    type="text" name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange} required
                  />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input
                    type="email" name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange} required
                  />
                </div>
                <div className="input-group">
                  <label>Phone Number</label>
                  <input
                    type="text" name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange} required
                  />
                </div>
                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Send OTP to Email →'}
                </button>
              </form>
              <p className="auth-footer-text">
                Already have an account? <Link to="/login">Login here</Link>
              </p>
            </>
          )}

          {/* ── STEP 2: OTP Verification ── */}
          {step === STEP_OTP && (
            <>
              <div className="auth-header">
                <h2>Verify Your Email</h2>
                <p>Step 2 of 3 — OTP sent to <strong>{formData.email}</strong></p>
              </div>
              <form onSubmit={handleVerifyOtp} className="auth-form">
                <div className="input-group">
                  <label>Enter OTP</label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="otp-big-input"
                    required
                  />
                  <small style={{ color: '#888', marginTop: '6px', display: 'block' }}>
                    Check your inbox (and spam folder).
                  </small>
                </div>
                <button type="submit" className="auth-btn">
                  Verify OTP →
                </button>
                <button
                  type="button"
                  className="auth-btn-outline"
                  onClick={handleResendOtp}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Resend OTP'}
                </button>
              </form>
              <button
                className="back-btn"
                onClick={() => setStep(STEP_BASIC)}
              >
                ← Back
              </button>
            </>
          )}

          {/* ── STEP 3: Role + Details ── */}
          {step === STEP_DETAILS && (
            <>
              <div className="auth-header">
                <h2>Almost Done!</h2>
                <p>Step 3 of 3 — Set your role and password</p>
              </div>
              <form onSubmit={handleRegister} className="auth-form">

                <div className="input-group">
                  <label>I want to join as</label>
                  <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="client">Client — I need services</option>
                    <option value="worker">Worker — I provide services</option>
                  </select>
                </div>

                {/* Worker only fields */}
                {formData.role === 'worker' && (
                  <div className="animate-slide-down">
                    <div className="input-group">
                      <label>Profession</label>
                      <input
                        type="text" name="profession"
                        placeholder="e.g. Electrician, Plumber"
                        value={formData.profession}
                        onChange={handleChange} required
                      />
                    </div>
                    <div className="input-group">
                      <label>Years of Experience</label>
                      <input
                        type="number" name="experience"
                        placeholder="e.g. 5"
                        value={formData.experience}
                        onChange={handleChange} required min="0"
                      />
                    </div>
                    <div className="input-group">
                      <label>Location / Area</label>
                      <input
                        type="text" name="location"
                        placeholder="e.g. Hazaribagh, Jharkhand"
                        value={formData.location}
                        onChange={handleChange} required
                      />
                    </div>
                    <div className="input-group">
                      <label>Charge Type</label>
                      <select name="chargeType" value={formData.chargeType} onChange={handleChange}>
                        <option value="day">Per Day</option>
                        <option value="hour">Per Hour</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Charge Amount (₹)</label>
                      <input
                        type="number" name="chargeAmount"
                        placeholder="e.g. 500"
                        value={formData.chargeAmount}
                        onChange={handleChange} min="0"
                      />
                    </div>
                    <div className="input-group">
                      <label>Profile Photo</label>
                      <input
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        onChange={handlePhotoChange}
                        className="file-input"
                      />
                      {preview && (
                        <img
                          src={preview} alt="Preview"
                          className="photo-preview-circle"
                        />
                      )}
                    </div>
                  </div>
                )}

                <div className="input-group">
                  <label>Password</label>
                  <input
                    type="password" name="password"
                    placeholder="Create a strong password (min 6 chars)"
                    value={formData.password}
                    onChange={handleChange} required
                  />
                </div>
                <div className="input-group">
                  <label>Confirm Password</label>
                  <input
                    type="password" name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange} required
                  />
                </div>

                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
              <button className="back-btn" onClick={() => setStep(STEP_OTP)}>
                ← Back
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Register;