import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbartwo.css';

const Navbartwo = ({ userName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300); // 300ms delay before closing
  };

  const handleProfileClick = () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      navigate('/profile', { state: { userId } });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    navigate('/');
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className="custom-navbar">
      <div className="nav-left">
        <div className="brand" onClick={() => navigate('/')}>Ramora</div>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/profile" className="nav-link" onClick={handleProfileClick}>Profile</Link>

        <div 
          className="nav-dropdown"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ref={dropdownRef}
        >
          <span className="nav-link no-underline">Services ▾</span>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/sendmoney" className="dropdown-item">Send Money</Link>
              <Link to="/requestmoney" className="dropdown-item">Request Money</Link>
              <Link to="/budget-tracking" className="dropdown-item">Budget Tracking</Link>
            </div>
          )}
        </div>
      </div>

      <div className="nav-right">
        {userName && (
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbartwo;
