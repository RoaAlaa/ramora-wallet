import React, { useEffect, useState } from 'react';
// Import useNavigate if you need to redirect on auth errors
// import { useNavigate } from 'react-router-dom';
import './RecentTransactions.css'; // Import the CSS for styling and scrollability

// RecentTransactions component receives userId as a prop from its parent (DashboardPage).
// This userId is needed to fetch transactions specific to the logged-in user.
const RecentTransactions = ({ userId }) => {
  // Initialize the navigate hook if you are using react-router-dom for redirects.
  // const navigate = useNavigate();

  // State to hold the list of transactions fetched from the backend.
  const [transactions, setTransactions] = useState([]);
  // State to track the loading status of the transaction data fetch.
  const [loading, setLoading] = useState(true);
  // State to track any error that occurs during the transaction data fetch.
  const [error, setError] = useState(null);

  // --- BACKEND/API/JWT REQUIREMENT ---
  // useEffect hook to perform side effects. Here, it's used to fetch the list of recent transactions.
  // This effect runs when the component mounts and whenever the 'userId' prop changes.
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
  }, [userId]);


  if (loading) return (
    <div className="transaction-history-box">
      <h3>Transaction History</h3>
      <p>Loading transactions...</p> {/* Show loading message */}
    </div>
  );

  if (error) return (
    <div className="transaction-history-box">
      <h3>Transaction History</h3>
      <p className="error-message">{error}</p> {/* Show error message */}
    </div>
  );

  // Show a specific message if there are no transactions after successfully loading
  if (transactions.length === 0) return (
    <div className="transaction-history-box">
      <h3>Transaction History</h3>
      <p>No recent transactions found.</p> {/* Show message when list is empty */}
    </div>
  );


  // --- RENDERING TRANSACTION LIST WITH API DATA ---
  // If not loading, no error, and transactions exist, render the list.
  return (
    <div className="transaction-history-box">
      <h3>Transaction History</h3>
      {/* --- SCROLLABLE LIST (Requirement) --- */}
      {/* The CSS for .transaction-list handles the scrollability behavior. */}
      <ul className="transaction-list">
        {/* --- POPULATING LIST WITH API DATA --- */}
        {/* Map over the 'transactions' state array (populated by the API fetch) to create a list item for each transaction. */}
        {transactions.map(transaction => (
          // Create a list item for each transaction. Use a unique key (e.g., the transaction ID from the backend).
          <li key={transaction.id} className="transaction-item">
            {/* Display transaction details from the fetched data */}
            {/* Assuming the backend returns objects with fields like 'description', 'amount', and 'date' */}
            <div className="transaction-details">
                <span className="transaction-description">
                  {transaction.type === 'send' ? `Sent to ${transaction.counterpart?.name || transaction.counterpart?.username}` :
                   transaction.type === 'request' ? `Requested from ${transaction.counterpart?.name || transaction.counterpart?.username}` :
                   transaction.note || 'Transaction'}
                </span>
                <span className="transaction-date">{new Date(transaction.createdAt).toLocaleDateString()}</span>
            </div>
            {/* Display the transaction amount. Add styling for positive/negative amounts based on the value. */}
            <span className={`transaction-amount ${transaction.direction === 'sent' ? 'negative' : 'positive'}`}>
                {transaction.direction === 'sent' ? '-' : '+'}${parseFloat(transaction.amount).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTransactions;
