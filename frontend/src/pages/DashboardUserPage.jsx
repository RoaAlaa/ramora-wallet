import React, { useEffect, useState } from 'react';
// Import necessary hooks from react-router-dom for navigation
import { useNavigate } from 'react-router-dom'; // Still needed for other navigations (e.g., to profile)

// Import the components used on the dashboard page
import Navbar from '../components/Common/Navbartwo'; // Your existing Navbar component
import BalanceCard from '../components/User/Dashboard/BalanceCard'; // The BalanceCard component we created
import DashboardActions from '../components/User/Dashboard/DashboardActions'; // The DashboardActions component (includes buttons and modal)
import RecentTransactions from '../components/User/Dashboard/RecentTransactions'; // The RecentTransactions component (transaction history)
import '../pages/DashboardUserPage.css'; // Import the CSS file for styling the dashboard layout
// Import the CSS file for styling the dashboard layout


// The main DashboardPage component
const DashboardUserPage = () => {
  const navigate = useNavigate();

  // --- TEMPORARY DUMMY DATA (for testing without login) ---
  // Keep this if you are still temporarily bypassing authentication.
  // REMEMBER TO REMOVE THIS AND UNCOMMENT THE useEffect FOR REAL INTEGRATION.
  const [userData, setUserData] = useState({
      id: 'dummy-user-123',
      name: 'Test User', // Dummy User Name
      accountBalance: 12345.67,
      cardDetails: {
          type: 'VISA',
          last4: '9876'
      },
      spendingCategories: [
         { name: 'Groceries', amount: 350.50 },
         { name: 'Transport', amount: 120.00 },
         { name: 'Entertainment', amount: 80.75 },
         { name: 'Utilities', amount: 250.00 },
      ]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- TEMPORARILY COMMENTED OUT AUTH CHECK AND FETCH ---
  // Keep this commented out if you are still temporarily bypassing authentication.
  // REMEMBER TO UNCOMMENT THIS AND REMOVE DUMMY DATA FOR REAL INTEGRATION.
  /*
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          console.error("No authentication token found. Redirecting to login.");
          setError("Please log in to view this page.");
          setLoading(false);
          navigate('/login');
          return;
        }
        const response = await fetch('/api/user/me', { // Example API endpoint
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
           if (response.status === 401) {
             localStorage.removeItem('jwtToken');
             console.error("Session expired fetching user data.");
             setError("Session expired. Please log in again.");
             navigate('/login');
           } else {
             const errorBody = await response.json();
             setError(`Error fetching user data: ${response.status} ${errorBody.message || response.statusText}`);
           }
           setLoading(false);
           return;
        }
        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError(`Failed to load user data: ${err.message}`);
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);
  */


  // --- HANDLER FOR CLICKABLE WELCOME MESSAGE ---
  // This function is still needed to navigate to the profile page.
  // The click handler is on the parent .welcome-message div.
  const handleUserNameClick = () => {
    // Navigate to the profile page. You might pass the user ID.
    navigate('/profile'); // Example route
  };

  // --- LOADING AND ERROR STATES ---
  // These will depend on whether you kept the temporary dummy data or the fetch useEffect.
  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar /> {/* Render Navbar even while loading */}
        <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
       <div className="dashboard-container">
         <Navbar /> {/* Render Navbar even on error */}
         <p className="error-message" style={{ textAlign: 'center', marginTop: '50px' }}>{error}</p>
       </div>
     );
  }


  // Render the dashboard content
  return (
    <div className="dashboard-container">
      {/* Navbar - Pass user name if needed */}
      <Navbar userName={userData?.name} />

      {/* Hero Section - Split into two sections */}
      <div className="hero-section">
        {/* Left Hero Section */}
        <div className="hero-left">
          {/* --- WELCOME MESSAGE WITH STYLED PARTS --- */}
          {/* This div is the clickable container for the hover underline effect */}
          <div className="welcome-message" onClick={handleUserNameClick}>
             <h2>
                 {/* Span for "Welcome Back," - styled bold and black */}
                 <span className="welcome-text">Welcome Back,</span>
                 {' '} {/* Add a space between the texts */}
                 {/* Span for User Name - styled black (underline on parent hover) */}
                 <span className="user-name-text">{userData?.name}!</span>
             </h2>
             {/* --- REMOVED (View Profile) TEXT --- */}
             {/* The span with class="profile-link-text" is removed */}
          </div>

          {/* You can add other components here if needed */}
        </div>

        {/* Right Hero Section with Balance Card */}
        <div className="hero-right">
          {/* Balance Card Component - Pass fetched/dummy user data */}
          <BalanceCard
            userName={userData?.name}
            balance={userData?.accountBalance || 0}
            cardType={userData?.cardDetails?.type || 'Wallet'}
            lastFourDigits={userData?.cardDetails?.last4 || '0000'}
            spendingCategories={userData?.spendingCategories || []}
          />
        </div>
      </div>

      {/* Action Buttons Section */}
      {/* Includes Send, Request, and Pending Requests buttons and the modal */}
      <DashboardActions userId={userData?.id} />

      {/* Transaction History Section */}
      <RecentTransactions userId={userData?.id} />

      {/* Add more dashboard sections */}
    </div>
  );
};

export default DashboardUserPage;
