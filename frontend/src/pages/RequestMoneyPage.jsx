import React from 'react';
import Navbartwo from '../components/Common/Navbartwo';
import RequestMoney from '../components/User/RequestMoney/RequestMoney';
import Footer from '../components/Common/Footer';
 // Adjust the import path

function RequestMoneyPage() {
  // This page component is just a simple wrapper
  // All the complex form logic is inside the RequestMoney component
  return (
    // The RequestMoney component already includes the pageContainer styling
    <div >
       <Navbartwo/>
      <RequestMoney />
      <Footer />
    </div>
  );
}

export default RequestMoneyPage;
