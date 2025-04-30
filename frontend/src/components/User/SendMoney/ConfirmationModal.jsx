// src/features/sendMoney/ConfirmationModal.jsx
import React from 'react';
import styles from './SendMoney.module.css'; // Import styles from the same directory

function ConfirmationModal({ show, recipientNumber, amount, onConfirm, onCancel }) {
  // If show is false, don't render the modal
  if (!show) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h3>Confirm Transaction</h3>
        {/* Display amount and number - use strong tags for emphasis */}
        <p>Are you sure you want to send <strong>${amount}</strong> to <strong>{recipientNumber}</strong>?</p>
        <div className={styles.modalButtons}>
          <button className={styles.cancelButton} onClick={onCancel}>No</button>
          <button className={styles.confirmButton} onClick={onConfirm}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal; // Consistent export name