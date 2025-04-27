import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Importing icons
import user_icon from '../assets/person.png';
import password_icon from '../assets/password.png';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginPage = () => {
  return (
    <div className="login-page">
      <h2>Login Form</h2>
      
      <Formik
        initialValues={{ name: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log('Form data:', values);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="login-form">
            {/* Name input with icon */}
            <div className="mb-3">
              <div className="input-container">
                <img src={user_icon} alt="User Icon" className="input-icon" />
                <Field
                  name="name"
                  type="text"
                  placeholder="Name"
                  className="form-control"
                />
              </div>
              <ErrorMessage name="name" component="div" className="text-danger" />
            </div>

            {/* Password input with icon */}
            <div className="mb-3">
              <div className="input-container">
                <img src={password_icon} alt="Password Icon" className="input-icon" />
                <Field
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="form-control"
                />
              </div>
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
