import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './Register.css';
import user_icon from '../../assets/person.png';
import email_icon from '../../assets/email.png';
import password_icon from '../../assets/password.png';
import phone_icon from '../../assets/phone1.png';
import birthday_icon from '../../assets/birthday.png';
import eye_icon from '../../assets/open242.png';       
import eye_off_icon from '../../assets/closed32.png'; 

// Validation schema
const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{11}$/, 'Phone number must be 11 digits')
    .required('Phone number is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  birthday: Yup.date().required('Birthday is required'),
});

const SignUpPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  return (
    <div className="signup-page">
      
      <Formik
        initialValues={{
          username: '',
          email: '',
          phone: '',
          password: '',
          birthday: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          console.log('Form data:', values);
          resetForm(); 
        }}
      >
        {({ isSubmitting, touched, errors, submitCount }) => (
          <Form className="signup-form">
            <h2 className="form-title">Sign Up</h2>

            {/* Username input with icon */}
            <div className="input-container">
              <img src={user_icon} alt="Username Icon" className="input-icon" />
              <Field
                name="username"
                type="text"
                placeholder="Username"
                className="form-control"
              />
            </div>
            {submitCount > 0 && errors.username && (
              <div className="error-message">{errors.username}</div>
            )}

            {/* Email input with icon */}
            <div className="input-container">
              <img src={email_icon} alt="Email Icon" className="input-icon" />
              <Field
                name="email"
                type="email"
                placeholder="Email"
                className="form-control"
              />
            </div>
            {submitCount > 0 && errors.email && (
              <div className="error-message">{errors.email}</div>
            )}

            {/* Phone input with icon */}
            <div className="input-container">
              <img src={phone_icon} alt="Phone Icon" className="input-icon" />
              <Field
                name="phone"
                type="text"
                placeholder="Phone Number"
                className="form-control"
              />
            </div>
            {submitCount > 0 && errors.phone && (
              <div className="error-message">{errors.phone}</div>
            )}

            {/* Password input with icon and show/hide toggle */}
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
                <img
                  src={passwordVisible ? eye_icon : eye_off_icon
                  }
                  alt="Toggle Password Visibility"
                  className="eye-icon"
                />
              </button>

            </div>
            {submitCount > 0 && errors.password && (
              <div className="error-message">{errors.password}</div>
            )}

            {/* Birthday input with icon */}
            <div className="input-container">
              <img src={birthday_icon} alt="Birthday Icon" className="input-icon" />
              <Field
                name="birthday"
                type="date"
                placeholder="MM/DD/YYYY" 
                className="form-control"
              />
            </div>
            {submitCount > 0 && errors.birthday && (
              <div className="error-message">{errors.birthday}</div>
            )}

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
