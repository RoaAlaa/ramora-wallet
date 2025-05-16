import Navbar from '../components/HomePage/Navbar';
import Hero from '../components/HomePage/Hero';
import About from '../components/HomePage/About';
import Services from '../components/HomePage/Services';
import '../components/HomePage/CursorMagic.css';
import Footer from '../components/Common/Footer';
import SplashCursor from './SplashCursor';

const HomePage = () => {
  return (
    <div className="content">
      {/* <SplashCursor /> */}
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Footer/>
    </div>
  );
};

export default HomePage;
