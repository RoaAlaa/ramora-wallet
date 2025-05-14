import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const location = useLocation();
  const isHome = location.pathname === '/' || 
  
                           location.pathname === '/dashboard/home';

  return (
    <footer className={`footer ${!isHome ? 'footer-fixed' : ''}`}>
      <div className="footer-left">
        © 2025 Ramora
      </div>
      <div className="footer-right">
        <Link to="/feedback" className="contact-link">Contact Us</Link>
      </div>
    </footer>
  );
};

export default Footer;
