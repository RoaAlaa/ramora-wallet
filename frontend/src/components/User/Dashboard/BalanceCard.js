import React, { useEffect, useState } from 'react';
import './BalanceCard.css';

const BalanceCard = ({ userId, refreshTrigger }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          setError('Authentication required.');
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5001/api/users/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('jwtToken');
            setError('Session expired. Please log in again.');
          } else {
            const errorBody = await response.json();
            setError(`Error fetching user data: ${response.status} ${errorBody.error || response.statusText}`);
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        
        if (!data.success || !data.user) {
          setError('Invalid response format from server');
          setLoading(false);
          return;
        }

        const user = {
          ...data.user,
          balance: Number(data.user.balance) || 0,
          buckets: Array.isArray(data.user.buckets) ? data.user.buckets : []
        };

        setUserData(user);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError(`Failed to load user data: ${err.message}`);
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    } else {
      setLoading(false);
      setError('No user ID provided');
    }
  }, [userId, refreshTrigger]);

  if (loading) return <div className="loading-message">Loading balance...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!userData) return <div className="error-message">No user data available</div>;

  return (
    <div className="card-container" onClick={handleCardClick}>
      <div className={`card ${isFlipped ? 'is-flipped' : ''}`}>
        {/* Front of the card */}
        <div className="card-side card-front">
          <div className="card-logo">Wallet</div>
          <div className="user-name">{userData.name || 'User'}</div>
          <div className="card-balance">${userData.balance.toFixed(2)}</div>
          <div className="card-number">**** **** **** 0000</div>
        </div>

        {/* Back of the card */}
        <div className="card-side card-back">
          <h3>Your Buckets</h3>
          <div className="buckets">
            {userData.buckets && userData.buckets.length > 0 ? (
              userData.buckets.map((bucket, index) => (
                <div key={index} className="bucket">
                  <span className="bucket-name">{bucket.name}</span>
                  <span className="bucket-amount">${Number(bucket.amount).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p>No buckets available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
