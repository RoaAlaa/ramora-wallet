import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // For navigation
import '../pages/LoginPage.css';
import Footer from '../components/Common/Footer'; 
//Login page done waiting for the register page to test it

// Importing icons
import user_icon from '../assets/person.png';
import password_icon from '../assets/password.png';
import eye_icon from '../assets/open-eye.png';
import eye_closed from '../assets/closed-eye.png';



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

      if (response.data && response.data.token && response.data.user) {
        localStorage.setItem('jwtToken', response.data.token);
        localStorage.setItem('userId', response.data.user._id);
        navigate('/dashboard');  // Redirect to dashboard
      } else {
        setError('Invalid response from server.');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || 'Invalid credentials, please try again.');
      } else {
        setError('Network error. Please try again later.');
      }
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

                <img
                  src={showPassword ? eye_icon : eye_closed}
                  alt="Toggle Password Visibility"
                  className="toggle-password-icon"
                  onClick={togglePasswordVisibility}
                />
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
      <Footer/>
    </div>
  );
};

export default LoginPage;