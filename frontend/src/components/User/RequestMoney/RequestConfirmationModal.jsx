// src/features/requestMoney/RequestConfirmationModal.jsx
import React from 'react';
// CHANGED: Import styles from the RequestMoney module
import styles from './RequestMoney.module.css'; 

// CHANGED: Component name and prop name (requesterNumber instead of recipientNumber)
function RequestConfirmationModal({ show, requesterNumber, amount, note, onConfirm, onCancel }) {
  // If show is false, don't render the modal
  if (!show) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        {/* CHANGED: Modal Title */}
        <h3>Confirm Money Request</h3>
        {/* CHANGED: Display amount and number - use strong tags for emphasis */}
        {/* CHANGED: Confirmation message for requesting */}
        <p>Are you sure you want to request <strong>${amount}</strong> from <strong>{requesterNumber}</strong>?</p>
        {note && (
          <p className={styles.noteText}>
            Note: <em>{note}</em>
          </p>
        )}
        <div className={styles.modalButtons}>
          {/* Cancel button remains the same */}
          <button className={styles.cancelButton} onClick={onCancel}>No</button>
          {/* CHANGED: Confirmation button text */}
          <button className={styles.confirmButton} onClick={onConfirm}>Request</button>
        </div>
      </div>
    </div>
  );
}

// CHANGED: Export name
export default RequestConfirmationModal;