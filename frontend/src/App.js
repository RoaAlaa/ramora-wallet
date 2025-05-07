import React from 'react';
import HomePage from './pages/HomePage';
import Footer from './components/Common/Footer';
import SignUpPage from './components/User/Register';
import LoginPage from './pages/LoginPage';
import SendMoneyPage from './pages/SendMoneyPage';
import Navbartwo from './components/Common/Navbartwo';
import ProfilePage from './components/User/ProfilePage/ProfilePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <Router>
        <Navbartwo/>
        <ProfilePage /> 
        <Footer/>
      </Router>
      
    </div>
  );
}

export default App;
