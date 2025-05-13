// component contains 3 buttons sendmoney, requestmoney, and pendingtransactions
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import PendingRequestsModal from './PendingRequestsModal';
import AddMoney from './AddMoney';
import './DashboardActions.css';

const DashboardActions = ({ userId, onBalanceUpdate }) => {
  const navigate = useNavigate(); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [error, setError] = useState(null);

  const fetchPendingCount = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('Authentication required.');
        return;
      }
      const response = await fetch(`http://localhost:5001/api/wallet/${userId}/requests`, {
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
          setError(`Error fetching pending requests: ${response.status} ${errorBody.message || response.statusText}`);
        }
        return;
      }
      const data = await response.json();
      setPendingRequestsCount(data.length);
    } catch (err) {
      console.error('Failed to fetch pending requests:', err);
      setError(`Failed to load pending requests: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchPendingCount();
  }, [userId]);

  const handleSendMoneyClick = () => {
    navigate('/sendmoney', { state: { userId } });
  };

  const handleRequestMoneyClick = () => {
    navigate('/requestmoney', { state: { userId } });
  };

  const handlePendingRequestsClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard-actions">
      {/* Top row with Add Money button */}
      <div className="action-buttons-row">
        <AddMoney userId={userId} onBalanceUpdate={onBalanceUpdate} />
      </div>

      {/* Middle row with Send and Request buttons */}
      <div className="action-buttons-row">
        <button className="action-button" onClick={handleSendMoneyClick}>
          Send Money
        </button>
        <button className="action-button" onClick={handleRequestMoneyClick}>
          Request Money
        </button>
      </div>

      {/* Bottom row with Pending Requests button */}
      <button
        className={`action-button pending-button ${pendingRequestsCount > 0 ? 'has-pending' : ''}`}
        onClick={handlePendingRequestsClick}
      >
        Pending Requests ({pendingRequestsCount})
      </button>

      <PendingRequestsModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        userId={userId} 
        onBalanceUpdate={onBalanceUpdate}
        onRequestHandled={fetchPendingCount}
      />
    </div>
  );
};

export default DashboardActions;