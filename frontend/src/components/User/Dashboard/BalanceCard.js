import React, { useState } from 'react';
import './BalanceCard.css'; // Import the CSS file for styling

// BalanceCard component receives data as props.
// This data would typically be fetched from your backend API in a parent component (like DashboardPage).
const BalanceCard = ({ userName, balance, cardType, lastFourDigits, spendingCategories }) => {

  // State to manage whether the card is flipped or not.
  const [isFlipped, setIsFlipped] = useState(false);

  // Function to toggle the 'isFlipped' state when the card is clicked.
  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  // --- BACKEND/API REQUIREMENT ---
  // The data displayed by this component (userName, balance, cardType, lastFourDigits, spendingCategories)
  // comes from props, which are populated by data fetched from your backend API
  // in the parent component (e.g., DashboardPage's fetch for /api/user/me).

  return (
    // The main container for the card, handles the click event to flip.
    <div className="" onClick={handleCardClick}>
      {/* The card element itself, applies the flip transformation based on state. */}
      <div className={`card ${isFlipped ? 'is-flipped' : ''}`}>

        {/* --- FRONT SIDE OF THE CARD --- */}
        <div className="card-side card-front">
          {/* Card Logo/Type - Data from backend via props */}
          <div className="card-logo">{cardType || 'Wallet'}</div> {/* Display card type, default to 'Wallet' */}

          {/* User Name - Data from backend via props */}
          <div className="user-name">{userName || 'User Name'}</div> {/* Display user's name */}

          {/* Balance - Data from backend via props */}
          {/* The blur effect is handled in CSS and removed on hover */}
          {/* Format balance to two decimal places */}
          <div className="card-balance">${typeof balance === 'number' ? balance.toFixed(2) : '0.00'}</div>

          {/* Card Number (Last 4 Digits) - Data from backend via props */}
          <div>**** **** **** {lastFourDigits || '0000'}</div>
        </div>

        {/* --- BACK SIDE OF THE CARD --- */}
        <div className="card-side card-back">
          <h3>Spending</h3>
          {/* Spending Categories - Data from backend via props */}
          {/* Map over the spendingCategories array to display each category and its amount */}
          <div className="categories">
            {/* --- BACKEND/API REQUIREMENT --- */}
            {/* The 'spendingCategories' array is passed as a prop, populated by data from your backend API. */}
            {/* Ensure your backend endpoint (e.g., /api/user/me or a dedicated spending endpoint) returns this data structure. */}
            {spendingCategories && spendingCategories.length > 0 ? (
              spendingCategories.map((category, index) => (
                // Use a unique key for each item in the list
                <div key={index} className="category">
                  {category.name} <br /> ${typeof category.amount === 'number' ? category.amount.toFixed(2) : '0.00'}
                </div>
              ))
            ) : (
              // Display a message if no spending data is available
              <p>No spending data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
