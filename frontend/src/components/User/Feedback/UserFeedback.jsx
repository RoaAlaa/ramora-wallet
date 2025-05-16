import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserFeedback.css';

const UserFeedback = () => {
  const navigate = useNavigate();
  const [feedbackData, setFeedbackData] = useState({
    name: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFeedbackData({
      ...feedbackData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setStatus({ type: 'error', message: 'Please log in to submit feedback' });
        return;
      }

      const response = await fetch('http://localhost:5001/api/feedback/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(feedbackData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit feedback');
      }

      const data = await response.json();
      setStatus({ type: 'success', message: data.message || 'Thank you for your feedback!' });
      
      // Clear form after successful submission
      setFeedbackData({ name: '', message: '' });
      
      // Navigate back to dashboard after success
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Something went wrong. Please try again.' });
      console.error('Feedback submission error:', error);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="ramora-feedback-container">
      <div className="ramora-feedback-card">
        <h2 className="ramora-feedback-title">
          <span className="ramora-feedback-icon">💭</span>
          Your Voice Shapes Our Future
        </h2>
        <p className="ramora-feedback-subtitle">
          We're all ears! Share your thoughts and help us make Ramora even better.
        </p>

        {status.message && (
          <div className={`ramora-feedback-status ${status.type}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="ramora-feedback-form">
          <div className="ramora-feedback-input-group">
            <label htmlFor="name" className="ramora-feedback-label">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={feedbackData.name}
              onChange={handleChange}
              className="ramora-feedback-input"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="ramora-feedback-input-group">
            <label htmlFor="message" className="ramora-feedback-label">Your Message</label>
            <textarea
              id="message"
              name="message"
              value={feedbackData.message}
              onChange={handleChange}
              className="ramora-feedback-textarea"
              placeholder="Share your thoughts, suggestions, or concerns..."
              required
              rows="5"
            />
          </div>

          <div className="ramora-feedback-buttons">
            <button type="submit" className="ramora-feedback-submit">
              Send Feedback
            </button>
            <button 
              type="button" 
              className="ramora-feedback-cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFeedback; 