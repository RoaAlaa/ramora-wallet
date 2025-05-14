import React from 'react';
import Navbartwo from '../components/Common/Navbartwo';
import About from '../components/HomePage/About';
import Services from '../components/HomePage/Services';
import Footer from '../components/Common/Footer';
import './HomeDashboard.css';

const HomeDashboard = () => {
  return (
    <div className="home-dashboard">
      <Navbartwo />
      <div className="home-dashboard-hero">
        <div className="home-dashboard-hero-content">
          <h1>Welcome to Ramora</h1>
          <p>Your Wallet, Your Way!</p>
          <h6>Manage Your Finances with Ease</h6>
        </div>
      </div>
      <About />
      <Services />
      <Footer />
    </div>
  );
};

export default HomeDashboard; 