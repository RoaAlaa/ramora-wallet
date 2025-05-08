import React from 'react';
import SignUpPage from './components/User/Register';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage'; // optional

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
