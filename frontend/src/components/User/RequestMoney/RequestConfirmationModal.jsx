
import React from 'react';

import styles from './RequestMoney.module.css'; 


function RequestConfirmationModal({ show, requesterNumber, amount, note, onConfirm, onCancel }) {

  if (!show) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
   
        <h3>Confirm Money Request</h3>
    
        <p>Are you sure you want to request <strong>${amount}</strong> from <strong>{requesterNumber}</strong>?</p>
        {note && (
          <p className={styles.noteText}>
            Note: <em>{note}</em>
          </p>
        )}
        <div className={styles.modalButtons}>
 
          <button className={styles.cancelButton} onClick={onCancel}>No</button>
 
          <button className={styles.confirmButton} onClick={onConfirm}>Request</button>
        </div>
      </div>
    </div>
  );
}

// CHANGED: Export name
export default RequestConfirmationModal;