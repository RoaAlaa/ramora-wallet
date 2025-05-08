import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // For navigation
import '../pages/LoginPage.css';
//Login page done waiting for the register page to test it

// Importing icons
import user_icon from '../assets/person.png';
import password_icon from '../assets/password.png';

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('http://localhost:5001/api/users/login', {
        username: values.username,
        password: values.password,
      });

      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');  // Redirect to route, not file
    } catch (error) {
      setError('Invalid credentials, please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="login-form">
            <h2 className="form-title">Log in</h2>

            {/* Username input with icon */}
            <div className="mb-3">
              <div className="input-container">
                <img src={user_icon} alt="User Icon" className="input-icon" />
                <Field
                  name="username"
                  type="text"
                  placeholder="Username"
                  className="form-control"
                />
              </div>
              <ErrorMessage name="username" component="div" className="error-message" />
            </div>

            {/* Password input with icon */}
            <div className="mb-3">
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
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <ErrorMessage name="password" component="div" className="error-message" />
            </div>

            {/* Show login error */}
            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
