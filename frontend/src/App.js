import React from 'react';
import HomePage from './pages/HomePage';
import Footer from './components/Common/Footer';
import SignUpPage from './components/User/Register'
import LoginPage from './pages/LoginPage'
import SendMoneyPage from './pages/SendMoneyPage'
function App() {
  return (
    <div className="App">
      {/* <HomePage /> */}

      <SendMoneyPage />
      <Footer />
      
      {/* <SignUpPage/> */}
      
    </div>
  );
}

export default App;
