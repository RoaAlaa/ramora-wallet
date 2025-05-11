import React, { useState } from 'react';
import './Navbartwo.css';

function Navbartwo() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="custom-navbar">
      <div className="nav-left">
        <div className="brand">Ramora</div>
        <a href="#" className="nav-link">Home</a>
        <a href="#" className="nav-link">Dashboard</a>
        <a href="#" className="nav-link">Profile</a>

        <div
          className="nav-dropdown"
          onMouseEnter={toggleDropdown}
          onMouseLeave={toggleDropdown}
        >
          <span className="nav-link no-underline">Services ▾</span>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <a href="#" className="dropdown-item">Add Money</a>
              <a href="#" className="dropdown-item">Send Money</a>
              <a href="#" className="dropdown-item">Request Money</a>
            </div>
          )}
        </div>
      </div>

      <div className="nav-right">
        <input type="text" placeholder="Search" className="search-input" />
        <button className="search-button">Search</button>
      </div>
    </nav>
  );
}

export default Navbartwo;
