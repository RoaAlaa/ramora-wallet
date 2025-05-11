import React from 'react';
import './ProfilePageConfirmationModal.css';

const ProfilePageConfirmationModal = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  confirmButtonClass = "confirm-button",
  cancelButtonClass = "cancel-button"
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className={confirmButtonClass} onClick={onConfirm}>
            {confirmText}
          </button>
          <button className={cancelButtonClass} onClick={onCancel}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageConfirmationModal; 