import React from 'react';
import HomePage from './pages/HomePage';
import Footer from './components/Common/Footer';
import SignUpPage from './components/User/Register';
import LoginPage from './pages/LoginPage';
import SendMoneyPage from './pages/SendMoneyPage';
import Navbartwo from './components/Common/Navbartwo';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Footer />
    </Router>
  </div>
  );
}

export default App;
