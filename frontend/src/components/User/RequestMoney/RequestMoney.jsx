import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import RequestConfirmationModal from './RequestConfirmationModal'; 
import styles from './RequestMoney.module.css'; 


const RequestMoneySchema = Yup.object().shape({
  requesterNumber: Yup.string() 
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),

  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .min(0.01, 'Amount must be at least 0.01'),

  note: Yup.string()
    .max(200, 'Note must be less than 200 characters')
});


function RequestMoney() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [valuesToConfirm, setValuesToConfirm] = useState(null);

  const formik = useFormik({
    initialValues: {
      requesterNumber: '', 
      amount: '',
      note: ''
    },
    validationSchema: RequestMoneySchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setMessage('');
      setError('');
      setSubmitting(true);
      setValuesToConfirm(values);
      setShowModal(true);
    },
  });

  const handleConfirmRequest = async () => {
    setShowModal(false);

    if (!valuesToConfirm) {
        setError('Confirmation values are missing.');
        return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('jwtToken');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await fetch(`http://localhost:5001/api/wallet/${userId}/request/${valuesToConfirm.requesterNumber.toLowerCase()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(valuesToConfirm.amount),
          note: valuesToConfirm.note
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to request money');
      }

      const data = await response.json();
      setMessage(data.message);
      setError('');

      formik.resetForm();
      setValuesToConfirm(null);

    } catch (err) {
      console.error('Request money error:', err);
      setError(err.message || 'An error occurred during the request.');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  // Function called when user cancels in the modal
  const handleCancelRequest = () => { 
    setShowModal(false); // Hide the modal
    setValuesToConfirm(null); // Clear confirmed values
  };

  return (
    <div className={styles.pageContainer}>
      {/* Wrap the form content in the styled box */}
      <div className={styles.formBox}>
        <h2>Request Money</h2> {/* Heading text */}

        {/* Display success or error messages */}
        {message && <div className={`${styles.message} ${styles.success}`}>{message}</div>}
        {error && <div className={`${styles.message} ${styles.error}`}>{error}</div>}

        {/* Use Formik's handleSubmit for the form */}
        <form onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="requesterNumber" className={styles.formLabel}>Username to Request From</label>
            <input
              type="text"
              id="requesterNumber" 
              className={styles.formControl}
              name="requesterNumber"
              value={formik.values.requesterNumber} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur} 
              disabled={loading || formik.isSubmitting}
              placeholder="Enter username to request from"
            />
            {formik.touched.requesterNumber && formik.errors.requesterNumber ? ( 
              <div className={`${styles.message} ${styles.error}`}>{formik.errors.requesterNumber}</div> 
            ) : null}
          </div>

          <div>
            {/* Label text */}
            <label htmlFor="amount" className={styles.formLabel}>Amount</label>
            <input
              type="number"
              id="amount"
              className={styles.formControl}
              name="amount" // name must match the key
              value={formik.values.amount} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur} 
              step="0.01"
              min="0"
              disabled={loading || formik.isSubmitting} 
            />
             {/* Display validation errors */}
            {formik.touched.amount && formik.errors.amount ? (
              <div className={`${styles.message} ${styles.error}`}>{formik.errors.amount}</div>
            ) : null}
          </div>

          <div>
            <label htmlFor="note" className={styles.formLabel}>Note (Optional)</label>
            <textarea
              id="note"
              className={styles.formControl}
              name="note"
              value={formik.values.note}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading || formik.isSubmitting}
              placeholder="Add a note to your request"
              rows="3"
            />
            {formik.touched.note && formik.errors.note ? (
              <div className={`${styles.message} ${styles.error}`}>{formik.errors.note}</div>
            ) : null}
          </div>

          {/* The button triggers Formik's onSubmit (Uses requestButton class and "Request Money" text) */}
          <button
            type="submit"
            className={styles.requestButton} 
            disabled={loading || formik.isSubmitting} 
          >
            {loading || formik.isSubmitting ? 'Processing...' : 'Request Money'} 
          </button>
        </form>
      </div>

      {/* Confirmation Modal - use the dedicated RequestConfirmationModal */}
      <RequestConfirmationModal
        show={showModal}
        // Pass the requesterNumber prop
        requesterNumber={valuesToConfirm?.requesterNumber} 
        amount={valuesToConfirm?.amount}
        note={valuesToConfirm?.note}
        // Pass the appropriate confirmation and cancel handlers
        onConfirm={handleConfirmRequest} 
        onCancel={handleCancelRequest}   
      />
    </div>
  );
}

export default RequestMoney;