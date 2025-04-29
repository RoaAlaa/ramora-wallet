import React, { useState } from 'react'; 
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './LoginPage.css'; // Keep this import

import user_icon from '../assets/person.png';
import password_icon from '../assets/password.png';
import eye_icon from '../assets/open242.png';       
import eye_off_icon from '../assets/closed32.png'; 

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <Formik
        initialValues={{ name: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log('Form data:', values);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="login-form">
            <h2 className="form-title">Log In</h2>

            {/* Name Input */}
            <div className="input-container">
              <img src={user_icon} alt="User Icon" className="input-icon" />
              <Field
                name="name"
                type="text"
                placeholder="Name"
                className="form-control" // Formik Field will work, ignore extra class
              />
              <ErrorMessage name="name" component="div" className="error-message" />
            </div>

            {/* Password Input */}
            <div className="input-container">
              <img src={password_icon} alt="Password Icon" className="input-icon" />
              <Field
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="form-control"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                <img 
                  src={showPassword ? eye_icon : eye_off_icon} 
                  alt="Toggle Password" 
                  style={{ width: '20px', height: '20px' }}
                />
              </button>
              <ErrorMessage name="password" component="div" className="error-message" />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="submit-button" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
