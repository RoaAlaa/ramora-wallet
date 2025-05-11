import React, { useState } from 'react';
import './AddMoney.css';

const AddMoney = ({ userId, onBalanceUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddMoney = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('Please log in to add money.');
      }

      if (!userId) {
        throw new Error('User ID is required.');
      }

      console.log('Adding money:', { userId, amount: parseFloat(amount) });
      const response = await fetch(`http://localhost:5001/api/wallet/${userId}/add-balance`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });

      const data = await response.json();
      console.log('Add money response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add money');
      }

      // Clear form and close modal
      setAmount('');
      setShowModal(false);
      
      // Notify parent component to update balance
      if (onBalanceUpdate) {
        onBalanceUpdate();
      }
    } catch (err) {
      console.error('Add money error:', err);
      setError(err.message || 'Failed to add money. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="add-money-btn" onClick={() => setShowModal(true)}>
        <i className="fas fa-plus-circle"></i> Add Money
      </button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Money to Wallet</h3>
            <form onSubmit={handleAddMoney}>
              <div className="input-group">
                <label htmlFor="amount">Amount ($)</label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="Enter amount"
                />
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <div className="modal-buttons">
                <button 
                  type="submit" 
                  className="confirm-button"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Money'}
                </button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setShowModal(false);
                    setAmount('');
                    setError('');
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddMoney; 