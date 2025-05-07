// component contains 3 buttons sendmoney, requestmoney, and pendingtransactions
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import PendingRequestsModal from './PendingRequestsModal'; // We'll create this next
import './DashboardActions.css'; // CSS for styling the buttons and layout

const DashboardActions = () => {
  const navigate = useNavigate(); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0); // State to hold the count

  // --- BACKEND/API/JWT REQUIREMENT ---
  // This useEffect will fetch the count of pending requests when the component mounts.
  // This is needed to determine the style of the "Pending Requests" button.
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        // Get the JWT token
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          console.error("Authentication token missing for pending count fetch.");
          return; 
        }

        // Call your backend API endpoint to get the count of pending requests for the user.
        // This endpoint should be protected and require the JWT.
        // The backend identifies the user from the JWT and queries the database for their pending requests count.
        const response = await fetch('/api/user/pending-requests/count', { // Example API endpoint
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include JWT
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          // Handle API errors (e.g., 401 Unauthorized if JWT is bad)
          if (response.status === 401) {
             localStorage.removeItem('jwtToken');
             // navigate('/login'); // Redirect if token is invalid
             console.error("Session expired fetching pending count.");
           }
          throw new Error(`Error fetching pending requests count: ${response.statusText}`);
        }

        const data = await response.json();
        // --- PROCESSING API RESPONSE ---
        // Assuming the backend response is like { count: 5 }
        setPendingRequestsCount(data.count); // Update state with the fetched count

      } catch (err) {
        console.error("Failed to fetch pending requests count:", err);
        // Optionally set an error state to display a message
      }
    };

    fetchPendingCount();
  }, []); // Empty dependency array means this runs once on mount

  const handleSendMoneyClick = () => {
    // --- FRONTEND ROUTING ---
    // Navigate to the Send Money page. This doesn't directly call an API yet,
    // but the Send Money page itself will likely interact with the backend API
    // (e.g., fetching contact list, submitting the transaction).
    navigate('/send-money'); // Example route
  };

  const handleRequestMoneyClick = () => {
    // --- FRONTEND ROUTING ---
    // Navigate to the Request Money page. Similar to Send Money, this page
    // will handle backend interactions.
    navigate('/request-money'); // Example route
  };

  const handlePendingRequestsClick = () => {
    // Open the modal when the button is clicked
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    // Close the modal
    setIsModalOpen(false);
    // --- POTENTIAL BACKEND INTERACTION ---
    // After closing the modal (especially if requests were acted upon),
    // you might want to re-fetch the pending count to update the button's appearance.
    // fetchPendingCount(); // Call the fetch function again
  };

  return (
    <div className="dashboard-actions">
      {/* Row of Send and Request buttons */}
      <div className="action-buttons-row">
        <button className="action-button" onClick={handleSendMoneyClick}>
          Send Money
        </button>
        <button className="action-button" onClick={handleRequestMoneyClick}>
          Request Money
        </button>
      </div>

      {/* Pending Requests button */}
      <button
        className={`action-button pending-button ${pendingRequestsCount > 0 ? 'has-pending' : ''}`}
        onClick={handlePendingRequestsClick}
      >
        Pending Requests ({pendingRequestsCount}) {/* Display the count */}
      </button>

      {/* Pending Requests Modal */}
      {/* --- BACKEND/API/JWT REQUIREMENT --- */}
      {/* The modal component will need to fetch the *list* of pending requests. */}
      <PendingRequestsModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default DashboardActions;