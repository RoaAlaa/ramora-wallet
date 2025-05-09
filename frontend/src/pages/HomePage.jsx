import Navbar from '../components/HomePage/Navbar';
import Hero from '../components/HomePage/Hero';
import About from '../components/HomePage/About';
import Services from '../components/HomePage/Services';
import '../components/HomePage/CursorMagic.css';
import SplashCursor from './SplashCursor';
import './HomePage.css'; // Optional: Add a CSS file for styling
const HomePage = () => {
  return (
    <div className="content">
      <SplashCursor />
      <Navbar />
      <Hero />
      <About />
      <Services />
    </div>
  );
};

export default HomePage;
