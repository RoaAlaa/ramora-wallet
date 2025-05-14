// src/pages/SendMoneyPage.jsx
import React from 'react';
import Navbartwo from '../components/Common/Navbartwo';
import SendMoney from '../components/User/SendMoney/SendMoney';
import Footer from '../components/Common/Footer';

function SendMoneyPage() {
  // This page component is now just a simple wrapper
  // All the complex form logic is inside the SendMoney component
  return (
    <div className="page-content">
      <Navbartwo/>
      <SendMoney />
      <Footer />
    </div>
  );
}

export default SendMoneyPage;