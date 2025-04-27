import Navbar from '../components/Common/Navbar';
import './HomePage.css'; // CSS for the HomePage
const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className="hero">
      <div className="hero-content">
        <h1>Welcome to Ramora</h1>
        <p>Your Wallet, Your Way!</p>
        <h6>Join Us NOW!</h6>
        <div className="buttons">
          <button className="btn">Login</button>
          <button className="btn">Sign Up</button>
        </div>
      </div>
    </div>

    </>
    

  );
};

export default HomePage;
