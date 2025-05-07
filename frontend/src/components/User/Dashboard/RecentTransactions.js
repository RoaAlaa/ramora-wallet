import React, { useEffect, useState } from 'react';
// Import useNavigate if you need to redirect on auth errors
// import { useNavigate } from 'react-router-dom';
import './RecentTransactions.css'; // Import the CSS for styling and scrollability

// RecentTransactions component receives userId as a prop from its parent (DashboardPage).
// This userId is needed to fetch transactions specific to the logged-in user.
const RecentTransactions = ({ userId }) => {
  // Initialize the navigate hook if you are using react-router-dom for redirects.
  // const navigate = useNavigate();

  // State to hold the list of transactions fetched from the backend.
  const [transactions, setTransactions] = useState([]);
  // State to track the loading status of the transaction data fetch.
  const [loading, setLoading] = useState(true);
  // State to track any error that occurs during the transaction data fetch.
  const [error, setError] = useState(null);

  // --- BACKEND/API/JWT REQUIREMENT ---
  // useEffect hook to perform side effects. Here, it's used to fetch the list of recent transactions.
  // This effect runs when the component mounts and whenever the 'userId' prop changes.
  useEffect(() => {
    const fetchTransactions = async () => {
      // --- DEPENDENCY ON PARENT DATA ---
      // Ensure userId is available before attempting to fetch transactions.
      // The userId is typically obtained from the primary user data fetch in the parent component (DashboardPage).
      if (!userId) {
          setLoading(false); // Stop loading if no user ID is available yet.
          // Optionally set an error or message indicating user data is needed first.
          return; // Stop execution of the fetch function if no userId.
      }

      setLoading(true); // Set loading state to true while fetching starts.
      setError(null); // Clear any previous errors before starting a new fetch.

      try {
        // --- RETRIEVING JWT ---
        // Get the JWT token from where it was stored during the login process (e.g., localStorage).
        // This token is required for authenticating requests to protected backend endpoints.
        const token = localStorage.getItem('jwtToken');

        if (!token) {
           console.error("Authentication token missing for transaction fetch.");
           setError("Authentication required to view transactions."); // Set a user-friendly error message.
           setLoading(false); // Stop loading state.
           // --- JWT VALIDATION FAILURE REDIRECT ---
           // If the token is missing, the user is not authenticated. Redirect them to the login page.
           // Uncomment the line below if you are using react-router-dom's navigate for redirection.
           // navigate('/login');
           return; // Stop execution if no token is found.
        }

        // --- MAKING THE API CALL (GET Request with Dynamic URL or Query Param) ---
        // Call your backend API endpoint to get recent transactions for the authenticated user.
        // This endpoint must be protected and require the JWT.
        // The backend will use the JWT (and possibly the userId from the URL/query)
        // to query the database for that specific user's transactions.
        // Example 1: User ID included in the URL path (common RESTful pattern)
        const response = await fetch(`/api/user/${userId}/transactions`, {
        // Example 2: User ID passed as a query parameter
        // const response = await fetch(`/api/transactions?userId=${userId}`, {
          method: 'GET', // Specify the HTTP method as GET since we are retrieving data.
          headers: {
            // --- INCLUDING JWT FOR AUTHENTICATION ---
            // Include the JWT in the 'Authorization' header using the standard 'Bearer' scheme.
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', // Indicate that we expect JSON in the response body.
          },
        });

        // --- PROCESSING API RESPONSE & ERROR HANDLING ---
        // Check if the HTTP response status is OK (status code 200-299).
        if (!response.ok) {
           // If the response status is not OK, it indicates an error.
           // Handle specific HTTP error codes, especially 401 for authentication failures.
           if (response.status === 401) {
             // --- JWT VALIDATION FAILURE ---
             // If the backend returns 401 (Unauthorized), it means the JWT is invalid or expired.
             // Clear the old token from storage and force the user to log in again.
             localStorage.removeItem('jwtToken');
             // Redirect to login page:
             // navigate('/login'); // Uncomment if using navigate
             console.error("Session expired fetching transactions.");
             setError("Session expired. Please log in again."); // Set an error message for the user.
           } else {
             // Handle other potential errors (e.g., 404 Not Found, 500 Internal Server Error).
             // Attempt to read a specific error message from the backend response body if available.
             const errorBody = await response.json();
             setError(`Error fetching transactions: ${response.status} ${errorBody.message || response.statusText}`);
           }
           setLoading(false); // Stop loading state on error.
           return; // Stop execution of the function after handling the error.
        }

        // --- SUCCESSFUL API RESPONSE ---
        // If the response is OK, parse the JSON body from the response.
        // The backend is expected to send an array of transaction objects here.
        // Example expected data structure: [{ id: 'tx1', description: 'Coffee Shop', amount: 4.50, date: '2023-10-26' }, ...]
        const data = await response.json();

        // --- UPDATING STATE TO RENDER LIST ---
        // Store the fetched list of transactions in the component's state.
        // Updating state triggers React to re-render the component and display the list.
        setTransactions(data); // Update state with the fetched list.
        setLoading(false); // Stop loading state as fetching is complete.

      } catch (err) {
        // Catch any errors that occur during the fetch process itself (e.g., network issues).
        console.error("Failed to fetch transactions:", err);
        setError(`Failed to load transactions: ${err.message}`); // Display a user-friendly error message.
        setLoading(false); // Stop loading state on error.
      }
    };

    fetchTransactions(); // Execute the data fetching function when the component mounts or userId changes.
  }, [userId]); // Dependency array: This effect re-runs whenever the value of the 'userId' prop changes.

  // --- LOADING, ERROR, AND EMPTY STATES ---
  // Render different UI based on the loading, error, and data availability states.
  // This provides feedback to the user while data is being fetched or if there's an issue.

  if (loading) return (
    <div className="transaction-history-box">
      <h3>Transaction History</h3>
      <p>Loading transactions...</p> {/* Show loading message */}
    </div>
  );

  if (error) return (
    <div className="transaction-history-box">
      <h3>Transaction History</h3>
      <p className="error-message">Error loading transactions: {error}</p> {/* Show error message */}
    </div>
  );

  // Show a specific message if there are no transactions after successfully loading
  if (transactions.length === 0) return (
    <div className="transaction-history-box">
      <h3>Transaction History</h3>
      <p>No recent transactions found.</p> {/* Show message when list is empty */}
    </div>
  );


  // --- RENDERING TRANSACTION LIST WITH API DATA ---
  // If not loading, no error, and transactions exist, render the list.
  return (
    <div className="transaction-history-box">
      <h3>Transaction History</h3>
      {/* --- SCROLLABLE LIST (Requirement) --- */}
      {/* The CSS for .transaction-list handles the scrollability behavior. */}
      <ul className="transaction-list">
        {/* --- POPULATING LIST WITH API DATA --- */}
        {/* Map over the 'transactions' state array (populated by the API fetch) to create a list item for each transaction. */}
        {transactions.map(transaction => (
          // Create a list item for each transaction. Use a unique key (e.g., the transaction ID from the backend).
          <li key={transaction.id} className="transaction-item">
            {/* Display transaction details from the fetched data */}
            {/* Assuming the backend returns objects with fields like 'description', 'amount', and 'date' */}
            <div className="transaction-details">
                <span className="transaction-description">{transaction.description}</span>
                <span className="transaction-date">{new Date(transaction.date).toLocaleDateString()}</span> {/* Format the date */}
            </div>
            {/* Display the transaction amount. Add styling for positive/negative amounts based on the value. */}
            <span className={`transaction-amount ${transaction.amount < 0 ? 'negative' : 'positive'}`}>
                ${parseFloat(transaction.amount).toFixed(2)} {/* Parse amount as float and format to 2 decimal places */}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTransactions;
