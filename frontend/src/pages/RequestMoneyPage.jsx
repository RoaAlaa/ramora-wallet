import React from 'react';
import RequestMoney from '../components/User/RequestMoney/RequestMoney'; // Adjust the import path

function RequestMoneyPage() {
  // This page component is just a simple wrapper
  // All the complex form logic is inside the RequestMoney component
  return (
    // The RequestMoney component already includes the pageContainer styling
    <RequestMoney />
  );
}

export default RequestMoneyPage;
