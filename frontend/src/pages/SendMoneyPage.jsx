// src/pages/SendMoneyPage.jsx
import React from 'react';
import SendMoney from '../components/User/SendMoney/SendMoney'; // Adjust the import path

function SendMoneyPage() {
  // This page component is now just a simple wrapper
  // All the complex form logic is inside the SendMoney component
  return (
    // The SendMoney component already includes the pageContainer styling
    // You could add additional layout here if needed, but for this example,
    // just rendering SendMoney is sufficient as it contains the main structure.
    <SendMoney />
  );
}

export default SendMoneyPage;