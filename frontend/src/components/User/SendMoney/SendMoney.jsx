import React, { useState } from 'react';
import { useFormik } from 'formik'; 
import * as Yup from 'yup'; 
import ConfirmationModal from './ConfirmationModal'; 
import styles from './SendMoney.module.css'; 

//Validation 


const SendMoneySchema = Yup.object().shape({
  recipientNumber: Yup.string()
    .required('Recipient phone number is required')
    .matches(/^[0-9]+$/, 'Recipient number must contain only digits')
    .min(10, 'Recipient number must be at least 10 digits'),
   
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .min(0.01, 'Amount must be at least 0.01'), // Minimum amount
});


//functional component : could recive props if needed, and returns JSX

function SendMoney() {

    //useState is a React hook that allows you to add state to functional components
 
    //useState has two elements: the current state and a function to update it

  const [loading, setLoading] = useState(false);
  // want to use it reset : setLoading(true) or setLoading(false)
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [valuesToConfirm, setValuesToConfirm] = useState(null);


 //awl haga nhdd el hagt elly 3ayzeen n3mlha fel form 
 //wel values el hnkhodha mn el form
  const formik = useFormik({
    initialValues: {
      recipientNumber: '',
      amount: '',
    },
    //validtion 
    
     // Use the schema defined ba2aa
    validationSchema: SendMoneySchema, 
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setMessage(''); 
      setError('');
      setSubmitting(true);
      setValuesToConfirm(values);

      setShowModal(true);

      
    },
  });


  // Function called when user confirms in the modal
  const handleConfirmSend = async () => {
    setShowModal(false);

    if (!valuesToConfirm) {
        setError('Confirmation values are missing.');
        return;
    }

    setLoading(true); 
    setError('');

    try {
      // ** Here you would make the actual API call to your backend **
      // Use the values from valuesToConfirm
      console.log(`Attempting to send ${valuesToConfirm.amount} to ${valuesToConfirm.recipientNumber}`);

      // Replace with your actual backend API endpoint and logic
      // const response = await fetch('/api/transactions/send', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     // Include authorization token if needed
      //     // 'Authorization': `Bearer ${yourAuthToken}`
      //   },
      //   body: JSON.stringify({
      //      recipientNumber: valuesToConfirm.recipientNumber,
      //      amount: parseFloat(valuesToConfirm.amount)
      //   }),
      // });
      // const data = await response.json();
      // if (!response.ok) {
      //   throw new Error(data.error || 'Failed to send money');
      // }

      // ** Simulate a successful API call **
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      const data = { message: 'Money sent successfully!' };

      setMessage(data.message); 
      setError(''); 

      formik.resetForm();
      setValuesToConfirm(null); 

    } catch (err) {
      console.error('Send money error:', err);
      setError(err.message || 'An error occurred during transaction.');
      setMessage(''); 
    } finally {
      setLoading(false); // Stop loading
      // Formik's isSubmitting would typically be set to false here if
      // the async logic was directly in onSubmit. Since it's not,
      // Formik's isSubmitting already became false after onSubmit returned.
    }
  };

  // Function called when user cancels in the modal
  const handleCancelSend = () => {
    setShowModal(false); // Hide the modal
    // Optionally, clear valuesToConfirm or leave them
    // setValuesToConfirm(null); // Clearing means if they re-open the modal without resubmitting, it won't confirm the old values. This is safer.
    setValuesToConfirm(null);
    // Form values remain unchanged in Formik state, allowing the user to easily edit.
  };


//looks like a html : its JSX XML 
// className used instead of class


//ROKII STOPPED HERE HKML FHM BOOKRAA
  return (
    <div className={styles.pageContainer}>
      {/* Wrap the form content in the styled box */}
      <div className={styles.formBox}>
        <h2>Send Money</h2>

        {/* Display success or error messages */}
        {message && <div className={`${styles.message} ${styles.success}`}>{message}</div>}
        {error && <div className={`${styles.message} ${styles.error}`}>{error}</div>}

        {/* Use Formik's handleSubmit for the form */}
        <form onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="recipientNumber" className={styles.formLabel}>Recipient Phone Number</label>
            <input
              type="text"
              id="recipientNumber"
              className={styles.formControl}
              name="recipientNumber" // IMPORTANT: name must match the key in initialValues and validationSchema
              value={formik.values.recipientNumber} // Bind input value to Formik state
              onChange={formik.handleChange} // Use Formik's change handler
              onBlur={formik.handleBlur} // Use Formik's blur handler to track 'touched' state
              disabled={loading || formik.isSubmitting} // Disable while async loading OR formik is processing submit/validation
            />
            {/* Display validation errors only if the field has been touched and has an error */}
            {formik.touched.recipientNumber && formik.errors.recipientNumber ? (
              <div className={`${styles.message} ${styles.error}`}>{formik.errors.recipientNumber}</div>
            ) : null}
          </div>

          <div>
            <label htmlFor="amount" className={styles.formLabel}>Amount</label>
            <input
              type="number"
              id="amount"
              className={styles.formControl}
              name="amount" // IMPORTANT: name must match the key
              value={formik.values.amount} // Bind value
              onChange={formik.handleChange} // Use change handler
              onBlur={formik.handleBlur} // Use blur handler
              step="0.01"
              min="0"
              disabled={loading || formik.isSubmitting} // Disable while async loading OR formik is processing submit/validation
            />
             {/* Display validation errors */}
            {formik.touched.amount && formik.errors.amount ? (
              <div className={`${styles.message} ${styles.error}`}>{formik.errors.amount}</div>
            ) : null}
          </div>

          {/* The button triggers Formik's onSubmit */}
          <button
            type="submit"
            className={styles.sendButton}
            // Disable button while async loading OR Formik is processing (validating/calling onSubmit)
            disabled={loading || formik.isSubmitting}
          >
            {loading || formik.isSubmitting ? 'Processing...' : 'Send Money'}
          </button>
        </form>
      </div>

      {/* Confirmation Modal - pass the confirmed values and handlers */}
      <ConfirmationModal
        show={showModal}
        // Pass values that were stored when the form was valid and submitted
        recipientNumber={valuesToConfirm?.recipientNumber}
        amount={valuesToConfirm?.amount}
        onConfirm={handleConfirmSend}
        onCancel={handleCancelSend}
      />
    </div>
  );
}

export default SendMoney;