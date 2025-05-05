import React from 'react';
import HomePage from './pages/HomePage';
import Footer from './components/Common/Footer';
import SignUpPage from './components/User/Register'
import LoginPage from './pages/LoginPage'
import SendMoneyPage from './pages/SendMoneyPage'
import RequestMoneyPage from './components/User/RequestMoney/RequestMoney'
function App() {
  return (
    <div className="App">
      {/* <HomePage /> */}

      {/* <SendMoneyPage /> */}
      {/* <Footer /> */}
      
      <RequestMoneyPage />
      {/* <SignUpPage/> */}
      
    </div>
  );
}

export default App;
