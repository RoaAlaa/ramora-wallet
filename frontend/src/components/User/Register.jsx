import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import user_icon from '../../assets/person.png';
import email_icon from '../../assets/email.png';
import password_icon from '../../assets/password.png';
import phone_icon from '../../assets/phone1.png';

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .required('Name is required'),
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  phoneNumber: Yup.string()
    // .matches(/^[0-9]{10,11}$/, 'Phone number must be 10-11 digits')
    .required('Phone number is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
});

const SignUpPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    setMessage(null);
  
    console.log("Submitting values:", values); // Ensure this logs all 5 fields
  
    try {
      const response = await axios.post('http://localhost:5001/api/users/register', values);
  
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Registration successful! Redirecting to login...' });
        resetForm();
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="signup-page">
      <Formik
        initialValues={{
          name: '',
          username: '',
          email: '',
          phoneNumber: '',
          password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, submitCount }) => (
          <Form className="signup-form">
            <h2 className="form-title">Sign Up</h2>

            {/* Name */}
            <div className="input-container">
              <img src={user_icon} alt="Name Icon" className="input-icon" />
              <Field name="name" type="text" placeholder="Name" className="form-control" />
            </div>
            {submitCount > 0 && errors.name && touched.name && (
              <div className="error-message">{errors.name}</div>
            )}

            {/* Username */}
            <div className="input-container">
              <img src={user_icon} alt="Username Icon" className="input-icon" />
              <Field name="username" type="text" placeholder="Username" className="form-control" />
            </div>
            {submitCount > 0 && errors.username && touched.username && (
              <div className="error-message">{errors.username}</div>
            )}

            {/* Email */}
            <div className="input-container">
              <img src={email_icon} alt="Email Icon" className="input-icon" />
              <Field name="email" type="email" placeholder="Email" className="form-control" />
            </div>
            {submitCount > 0 && errors.email && touched.email && (
              <div className="error-message">{errors.email}</div>
            )}

            {/* Phone Number */}
            <div className="input-container">
              <img src={phone_icon} alt="Phone Icon" className="input-icon" />
              <Field name="phoneNumber" type="text" placeholder="Phone Number" className="form-control" />
            </div>
            {submitCount > 0 && errors.phoneNumber && touched.phoneNumber && (
              <div className="error-message">{errors.phoneNumber}</div>
            )}

            {/* Password */}
            <div className="input-container">
              <img src={password_icon} alt="Password Icon" className="input-icon" />
              <Field
                name="password"
                type={passwordVisible ? 'text' : 'password'}
                placeholder="Password"
                className="form-control"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? 'Hide' : 'Show'}
              </button>
            </div>
            {submitCount > 0 && errors.password && touched.password && (
              <div className="error-message">{errors.password}</div>
            )}

            {/* Success/Error Message */}
            {message && (
              <div className={`feedback-message ${message.type}`}>
                {message.text}
              </div>
            )}


            {/* Submit Button */}
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Signing up...' : 'Sign Up'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUpPage;
