import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; 

const Footer = () => {
  return (
    <footer className="footer">
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
