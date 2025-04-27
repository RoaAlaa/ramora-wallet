import React from 'react';
import './Navbar.css'; // CSS we will create

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar__container">
        <div className="navbar__links">
          <a href="#about">About</a>
          <a href="#services">Services</a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
