// src/components/ConfirmationModal.jsx
import React from 'react';
import styles from './SendMoney.module.css'; // Import styles

function Confirmation({ show, recipientNumber, amount, onConfirm, onCancel }) {
  // If show is false, don't render the modal
  if (!show) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h3>Confirm Transaction</h3>
        <p>Are you sure you want to send **${amount}** to **{recipientNumber}**?</p> {/* Display amount and number */}
        <div className={styles.modalButtons}>
          <button className={styles.cancelButton} onClick={onCancel}>No</button>
          <button className={styles.confirmButton} onClick={onConfirm}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Confirmation;