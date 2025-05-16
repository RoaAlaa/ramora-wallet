import React, { useEffect, useState } from 'react';

import './RecentTransactions.css'; 


const RecentTransactions = ({ userId, refreshTrigger }) => {

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); 


  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          setError('Authentication required.');
          setLoading(false);
          return;
        }
        const response = await fetch(`http://localhost:5001/api/wallet/${userId}/transactions`, {
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
            setError(`Error fetching transactions: ${response.status} ${errorBody.message || response.statusText}`);
          }
          setLoading(false);
          return;
        }
        const data = await response.json();
        setTransactions(data.transactions || []);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        setError(`Failed to load transactions: ${err.message}`);
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [userId, refreshTrigger]);


  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };


  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  if (loading) return (
    <div className="transaction-history-box">
      <h3>Transaction History</h3>
      <p>Loading transactions...</p>
    </div>
  );

  if (error) return (
    <div className="transaction-history-box">
      <h3>Transaction History</h3>
      <p className="error-message">{error}</p> 
    </div>
  );


  if (transactions.length === 0) return (
    <div className="transaction-history-box">
      <h3>Transaction History</h3>
      <p>No recent transactions found.</p> 
    </div>
  );



  return (
    <div className="transaction-history-box">
      <div className="transaction-header">
        <h3>Transaction History</h3>
        <div className="transaction-filter">
          <select 
            value={filter} 
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All Transactions</option>
            <option value="send">Sent Money</option>
            <option value="request">Money Requests</option>
            <option value="deposit">Deposits</option>
          </select>
        </div>
      </div>
 
      <ul className="transaction-list">
        {filteredTransactions.map(transaction => (
          <li key={transaction.id} className="transaction-item">

            <div className="transaction-details">
                <span className="transaction-description">
                  {transaction.type === 'send' ? 
                    (transaction.direction === 'sent' ? 
                      `Sent to ${transaction.counterpart?.name || transaction.counterpart?.username}` :
                      `Received from ${transaction.counterpart?.name || transaction.counterpart?.username}`) :
                   transaction.type === 'request' ? 
                    (transaction.direction === 'sent' ?
                      `Requested from ${transaction.counterpart?.name || transaction.counterpart?.username}` :
                      `Requested by ${transaction.counterpart?.name || transaction.counterpart?.username}`) :
                   transaction.type === 'deposit' ? 'Deposit' :
                   transaction.note || 'Transaction'}
                </span>
                <span className="transaction-date">{new Date(transaction.createdAt).toLocaleDateString()}</span>
                <span className={`transaction-status status-${transaction.status.toLowerCase()}`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
            </div>
            {/* Display the transaction amount with status-based colors */}
            <span className={`transaction-amount ${
              transaction.status === 'completed' ? 'positive' :
              transaction.status === 'pending' ? 'pending' :
              transaction.status === 'rejected' ? 'negative' :
              transaction.direction === 'sent' ? 'negative' : 'positive'
            }`}>
                ${parseFloat(transaction.amount).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTransactions;
