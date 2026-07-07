import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import './ContactUs.css';
import { useToast } from '../context/ToastContext';

// ─── EmailJS Config — 
const EMAILJS_SERVICE_ID  = 'service_9efh2kk';
const EMAILJS_TEMPLATE_ID = 'template_zwmnbfa'; 
const EMAILJS_PUBLIC_KEY  = '3Tg4uLarICy5ScGkD';

// ─── Admin Gmail — 
const ADMIN_EMAIL = 'support.skillgrid@gmail.com'; 

const ContactUs = () => {
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', message: '' });
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const token      = sessionStorage.getItem('token');
  const userString = sessionStorage.getItem('user');
  const user       = userString && userString !== 'undefined'
                      ? JSON.parse(userString) : null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ── Login check ───────────────────────────────────────
    if (!token || !user) {
      showToast('Please login first to send a message.', 'error');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      
      const res = await fetch('http://localhost:5000/api/contact/send', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast('Error: ' + data.message, 'error');
        setLoading(false);
        return;
      }

      
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          admin_email:    ADMIN_EMAIL,
          sender_name:    form.name,
          sender_email:   form.email,
          sender_role:    user.role,
          message:        form.message,
          sent_at:        new Date().toLocaleString('en-IN'),
        },
        EMAILJS_PUBLIC_KEY
      );

      setSent(true);
      setForm({ name: '', email: '', message: '' });

    } catch (err) {
      console.error('Contact submit error:', err);
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact <span>Us</span></h1>
        <p>We are here to help. Reach out anytime!</p>
      </div>

      <div className="contact-body">

        {/* Left — Info */}
        <div className="contact-info">
          <h3>Get in Touch</h3>
          <p>📧 support@skillgrid.in</p>
          <p>📞 +91 98765 43210</p>
          <p>📍 Hazaribagh, Jharkhand, India</p>
          <p>🕐 Mon–Sat: 9am – 6pm</p>

          {/* Login prompt for guests */}
          {!token && (
            <div className="login-prompt">
              <p> You must be logged in to send a message.</p>
              <button onClick={() => navigate('/login')} className="login-prompt-btn">
                Login to Continue
              </button>
            </div>
          )}
        </div>

        {/* Right — Form */}
        <div className="contact-form-box">
          {sent ? (
            <div className="success-msg">
              <h3> Message Sent!</h3>
              <p>We will get back to you within 24 hours.</p>
              <button onClick={() => setSent(false)}>Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>

              <div className="input-group">
                <label>Your Name</label>
                <input
                  name="name"
                  value={form.name}
                  placeholder="Full Name"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  placeholder="your@email.com"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Message</label>
                <textarea
                  name="message"
                  rows="5"
                  value={form.message}
                  placeholder="How can we help you?"
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="contact-submit-btn"
                disabled={loading || !token}
              >
                {loading ? 'Sending...' : !token ? ' Login to Send' : 'Send Message 📨'}
              </button>

              {!token && (
                <p className="not-logged-in-msg">
                  You are not logged in.{' '}
                  <span onClick={() => navigate('/login')} className="login-link">
                    Click here to login
                  </span>
                </p>
              )}

            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default ContactUs;