// src/features/requestMoney/RequestMoney.js
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// Import the dedicated Request Confirmation Modal
import RequestConfirmationModal from './RequestConfirmationModal'; 
// Import styles from the new CSS file
import styles from './RequestMoney.module.css'; 

// Validation Schema (uses requesterNumber)
const RequestMoneySchema = Yup.object().shape({
  requesterNumber: Yup.string() 
    .required('Requester phone number is required') 
    .matches(/^[0-9]+$/, 'Requester number must contain only digits') 
    .min(10, 'Requester number must be at least 10 digits'), 

  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .min(0.01, 'Amount must be at least 0.01'), 
});

// Functional component for Request Money
function RequestMoney() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [valuesToConfirm, setValuesToConfirm] = useState(null); // Stores form values before showing modal

  // Formik setup (initialValues and validationSchema use requesterNumber)
  const formik = useFormik({
    initialValues: {
      requesterNumber: '', 
      amount: '',
    },
    validationSchema: RequestMoneySchema, 
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setMessage('');
      setError('');
      setSubmitting(true);
      setValuesToConfirm(values); // Store values for confirmation
      setShowModal(true); // Show the confirmation modal
    },
  });

  // Function called when user confirms in the modal (Simulates requesting)
  const handleConfirmRequest = async () => {
    setShowModal(false); // Hide the modal

    if (!valuesToConfirm) {
        setError('Confirmation values are missing.');
        return;
    }

    setLoading(true);
    setError('');

    try {
      // ** Simulate an API call to your backend to request money **
      console.log(`Attempting to request ${valuesToConfirm.amount} from ${valuesToConfirm.requesterNumber}`); 

      // Replace with your actual backend API endpoint and logic for requesting money
      // const response = await fetch('/api/transactions/request', { 
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     // Include authorization token if needed
      //     // 'Authorization': `Bearer ${yourAuthToken}`
      //   },
      //   body: JSON.stringify({
      //      requesterNumber: valuesToConfirm.requesterNumber, 
      //      amount: parseFloat(valuesToConfirm.amount)
      //   }),
      // });
      // const data = await response.json();
      // if (!response.ok) {
      //   throw new Error(data.error || 'Failed to request money'); 
      // }

      // ** Simulate a successful API call for requesting money **
      await new Promise(resolve => setTimeout(resolve, 1500));
      const data = { message: 'Money request sent successfully!' }; // Success message

      setMessage(data.message);
      setError('');

      formik.resetForm(); // Reset the form after success
      setValuesToConfirm(null); // Clear confirmed values

    } catch (err) {
      console.error('Request money error:', err);
      setError(err.message || 'An error occurred during the request.'); 
      setMessage('');
    } finally {
      setLoading(false); // Stop loading
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
            {/* Label text and htmlFor use requesterNumber */}
            <label htmlFor="requesterNumber" className={styles.formLabel}>Requester Phone Number</label>
            <input
              type="text"
              id="requesterNumber" 
              className={styles.formControl}
              name="requesterNumber" // name must match the key
              value={formik.values.requesterNumber} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur} 
              disabled={loading || formik.isSubmitting} 
            />
            {/* Display validation errors */}
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
        // Pass the appropriate confirmation and cancel handlers
        onConfirm={handleConfirmRequest} 
        onCancel={handleCancelRequest}   
      />
    </div>
  );
}

export default RequestMoney;