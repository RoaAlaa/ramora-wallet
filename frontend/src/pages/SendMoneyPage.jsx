// src/pages/SendMoneyPage.jsx
import React, { useState } from 'react';
import ConfirmationModal from '../components/User/SendMoney/ConfirmationModal'; // Adjust the import path as necessary
import styles from '../components/User/SendMoney/SendMoney.module.css'; // Adjust the import path as necessary

function SendMoneyPage() {
  const [recipientNumber, setRecipientNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  // Function to handle the initial form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    setError('');

    // Basic validation
    if (!recipientNumber || !amount) {
      setError('Please enter both recipient number and amount.');
      return;
    }
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }

    // If validation passes, show the confirmation modal
    setShowModal(true);
  };

  // Function called when user confirms in the modal
  const handleConfirmSend = async () => {
    setShowModal(false); // Hide the modal
    setLoading(true); // Start loading

    try {
      // ** Here you would make the actual API call to your backend **
      // Replace with your actual backend API endpoint and logic
      console.log(`Attempting to send ${amount} to ${recipientNumber}`);
      // Example placeholder for API call:
      // const response = await fetch('/api/transactions/send', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     // Include authorization token if needed
      //     // 'Authorization': `Bearer ${yourAuthToken}`
      //   },
      //   body: JSON.stringify({ recipientNumber, amount: parseFloat(amount) }),
      // });

      // const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.error || 'Failed to send money');
      // }

      // ** Simulate a successful API call **
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      const data = { message: 'Money sent successfully!' };
      setMessage(data.message);
      setRecipientNumber(''); // Clear form on success
      setAmount('');

    } catch (err) {
      console.error('Send money error:', err);
      setError(err.message || 'An error occurred during transaction.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Function called when user cancels in the modal
  const handleCancelSend = () => {
    setShowModal(false); // Hide the modal
  };

  return (
    <div className={styles.pageContainer}>
      {/* Wrap the form content in the styled box */}
      <div className={styles.formBox}>
        <h2>Send Money</h2>

        {/* Display success or error messages */}
        {message && <div className={`${styles.message} ${styles.success}`}>{message}</div>}
        {error && <div className={`${styles.message} ${styles.error}`}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="recipientNumber" className={styles.formLabel}>Recipient Phone Number</label>
            <input
              type="text"
              id="recipientNumber"
              className={styles.formControl}
              value={recipientNumber}
              onChange={(e) => setRecipientNumber(e.target.value)}
              disabled={loading} // Disable inputs while loading
            />
          </div>

          <div>
            <label htmlFor="amount" className={styles.formLabel}>Amount</label>
            <input
              type="number"
              id="amount"
              className={styles.formControl}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
              disabled={loading} // Disable inputs while loading
            />
          </div>

          {/* The button triggers the modal first */}
          <button type="submit" className={styles.sendButton} disabled={loading}>
            {loading ? 'Processing...' : 'Send Money'}
          </button>
        </form>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showModal}
        recipientNumber={recipientNumber}
        amount={amount} // Pass amount to modal
        onConfirm={handleConfirmSend}
        onCancel={handleCancelSend}
      />
    </div>
  );
}

export default SendMoneyPage;