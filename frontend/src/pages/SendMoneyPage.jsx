
import React from 'react';
import Navbartwo from '../components/Common/Navbartwo';
import SendMoney from '../components/User/SendMoney/SendMoney';
import Footer from '../components/Common/Footer';

function SendMoneyPage() {
  
  return (
    <div className="page-content">
      <Navbartwo/>
      <SendMoney />
      <Footer />
    </div>
  );
}

export default SendMoneyPage;