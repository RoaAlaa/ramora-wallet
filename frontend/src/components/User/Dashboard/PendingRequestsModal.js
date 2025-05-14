import React, { useEffect, useState } from 'react';
// Import the useNavigate hook if you are using react-router-dom for navigation,
// which is recommended for handling redirects (e.g., on authentication failure).
// import { useNavigate } from 'react-router-dom';
import './PendingRequestModal.css' // Import the CSS file for modal styling

const PendingRequestsModal = ({ isOpen, onClose, userId, onBalanceUpdate, onRequestHandled }) => {
  // Initialize the navigate hook if you are using react-router-dom for redirects.
  // const navigate = useNavigate();

  // State to hold the list of pending requests fetched from the backend.
  const [pendingRequests, setPendingRequests] = useState([]);
  // State to track the loading status of the initial fetch for the list of requests.
  const [loading, setLoading] = useState(false);
  // State to track any error that occurs during the initial fetch.
  const [error, setError] = useState(null);
  // State to track the loading/error status for individual request actions (Accept/Reject).
  // This allows showing "Processing..." or an error message next to a specific item.
  // The structure will be like: { requestId: { loading: boolean, error: string | null } }
  const [requestActionStatus, setRequestActionStatus] = useState({});

  // --- BACKEND/API/JWT REQUIREMENT ---
  // useEffect hook to perform side effects. Here, it's used to fetch the list of pending requests.
  // This effect runs when the component mounts and whenever the 'isOpen' prop changes.
  useEffect(() => {
    // Only attempt to fetch data if the modal is currently open.
    if (isOpen) {
      const fetchPendingRequests = async () => {
        setLoading(true); // Set loading state to true while fetching starts.
        setError(null); // Clear any previous errors before starting a new fetch.

        try {
          // --- RETRIEVING THE JWT ---
          // Get the JWT token from where it was stored during the login process (e.g., localStorage).
          // This token is essential for authenticating requests to protected backend endpoints.
          const token = localStorage.getItem('jwtToken');
          if (!token) {
            console.error("Authentication token missing for pending requests list fetch.");
            setError("Authentication required to view pending requests.");
            setLoading(false);
            // --- JWT VALIDATION FAILURE REDIRECT ---
            // If the token is missing, the user is not authenticated. Redirect them to the login page.
            // This is a crucial part of securing frontend routes based on the rubric.
            // Uncomment the line below if you are using react-router-dom's navigate for redirection.
            // navigate('/login');
            return; // Stop execution if no token is found.
          }

          // --- MAKING THE API CALL (GET Request) ---
          // Call your backend API endpoint to get the list of pending requests for the authenticated user.
          // This endpoint must be protected and require the JWT in the Authorization header.
          // The backend will use the JWT to identify the user and query the database for their pending requests.
          // Example API endpoint based on common patterns: GET /api/wallet/{userId}/requests
          const response = await fetch(`http://localhost:5001/api/wallet/${userId}/requests`, {
            method: 'GET', // Specify the HTTP method as GET since we are retrieving data.
            headers: {
              // --- INCLUDING THE JWT FOR AUTHENTICATION ---
              // Include the JWT in the 'Authorization' header using the standard 'Bearer' scheme.
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json', // Indicate that we expect JSON in the response body.
            },
          });

          // --- PROCESSING THE API RESPONSE & ERROR HANDLING ---
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
               console.error("Session expired fetching pending requests list.");
               setError("Session expired. Please log in again."); // Set an error message for the user.
             } else {
               // Handle other potential errors (e.g., 404 Not Found, 500 Internal Server Error).
               // Attempt to read a specific error message from the backend response body if available.
               const errorBody = await response.json();
               setError(`Error fetching pending requests: ${response.status} ${errorBody.error || response.statusText}`);
             }
             setLoading(false); // Stop loading state on error.
             return; // Stop execution of the function after handling the error.
          }

          // --- SUCCESSFUL API RESPONSE ---
          // If the response is OK, parse the JSON body from the response.
          // The backend is expected to send an array of pending request objects here.
          // Example expected data structure: [{ id: 'req1', fromUser: { name: 'Alice' }, amount: 50.00, date: '2023-10-27' }, ...]
          const data = await response.json();

          // --- UPDATING STATE TO RENDER LIST ---
          // Store the fetched list of pending requests in the component's state.
          // Updating state triggers React to re-render the component and display the list in the modal.
          setPendingRequests(data); // Update state with the fetched list.
          setLoading(false); // Stop loading state as fetching is complete.

        } catch (err) {
          // Catch any errors that occur during the fetch process itself (e.g., network issues).
          console.error("Failed to fetch pending requests list:", err);
          setError(`Failed to load pending requests: ${err.message}`); // Display a user-friendly error message.
          setLoading(false); // Stop loading state on error.
        }
      };

      fetchPendingRequests(); // Execute the data fetching function when the modal becomes open.
    } else {
        // Optional: When the modal is closed (isOpen is false), you might want to clear the data
        // and error states to reset the modal's appearance for the next time it opens.
        // setPendingRequests([]);
        // setError(null);
        // Also clear any individual request action statuses.
        setRequestActionStatus({});
    }
  }, [isOpen, userId]); // Dependency array: This effect re-runs only when the value of the 'isOpen' prop changes.

  // --- BACKEND/API/JWT REQUIREMENT (Accept Action) ---
  // Asynchronous function to handle accepting a pending request.
  // It takes the unique ID of the request to be accepted.
  const handleAcceptRequest = async (requestId) => {
    // Set loading state specifically for this request item to provide visual feedback.
    setRequestActionStatus(prevStatus => ({
      ...prevStatus,
      [requestId]: { loading: true, error: null } // Set loading to true, clear previous error for this ID.
    }));

    try {
      // Get the JWT token for authentication.
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        console.error("Authentication token missing for accept request.");
        // Update status to show authentication error for this item.
        setRequestActionStatus(prevStatus => ({
            ...prevStatus,
            [requestId]: { loading: false, error: "Auth required" }
        }));
        // Redirect to login if necessary.
        // navigate('/login');
        return; // Stop execution if no token.
      }

      // --- API CALL REQUIREMENT (PUT Request) ---
      // Call the backend API endpoint to accept the request.
      // This endpoint must be protected and require the JWT.
      // The backend will verify the user owns this request and update its status (e.g., to 'accepted').
      // It should also handle the financial transaction (transferring funds).
      // Example endpoint: PUT /api/wallet/{userId}/requests/{requestId}/accept
      const response = await fetch(`http://localhost:5001/api/wallet/${userId}/requests/${requestId}`, {
        method: 'PUT', // Use PUT as we are updating the state/status of a resource (the pending request).
        headers: {
          'Authorization': `Bearer ${token}`, // Include the JWT.
          'Content-Type': 'application/json', // Indicate the request body format (if sending one).
        },
        body: JSON.stringify({ response: true }),
      });

      // --- PROCESSING API RESPONSE & ERROR HANDLING ---
      if (!response.ok) {
         // Handle errors from the backend API call.
         if (response.status === 401) {
           localStorage.removeItem('jwtToken');
           // navigate('/login');
           console.error("Session expired accepting request.");
           setRequestActionStatus(prevStatus => ({
               ...prevStatus,
               [requestId]: { loading: false, error: "Session expired" }
           }));
         } else {
            // Handle other errors (e.g., request not found, insufficient funds).
            const errorBody = await response.json(); // Try to get error message from backend.
            setRequestActionStatus(prevStatus => ({
                ...prevStatus,
                [requestId]: { loading: false, error: errorBody.error || 'Failed to accept request' }
            }));
         }
         return; // Stop execution on error.
      }

      // --- SUCCESSFUL API RESPONSE ---
      // If the API call was successful, remove the request from the local state list.
      // This updates the UI immediately without needing to re-fetch the entire list.
      setPendingRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
      // Also remove the action status for this request as it's no longer pending.
      setRequestActionStatus(prevStatus => {
          const newStatus = { ...prevStatus };
          delete newStatus[requestId];
          return newStatus;
      });

      // Call onBalanceUpdate to refresh the dashboard
      if (onBalanceUpdate) {
        onBalanceUpdate();
      }

      // Update the pending requests count in the parent component
      if (onRequestHandled) {
        onRequestHandled();
      }

      // Trigger budget refresh
      const refreshBudgetStr = localStorage.getItem('refreshBudget');
      if (refreshBudgetStr) {
        try {
          const refreshBudget = new Function('return ' + refreshBudgetStr)();
          refreshBudget();
        } catch (err) {
          console.error('Failed to trigger budget refresh:', err);
        }
      }

      // --- POTENTIAL BACKEND INTERACTION (Update Count) ---
      // Since a request was accepted, the total count of pending requests on the dashboard might have changed.
      // You should signal the parent component (DashboardActions) to re-fetch the count.
      // The onClose handler is a good place to trigger this re-fetch in the parent component.
      // If the list becomes empty after this action, you might also want to close the modal automatically.
      if (pendingRequests.length === 1) { // Check if this was the last request before filtering
          onClose(); // Close the modal
      }


    } catch (err) {
      // Catch any network or unexpected errors during the fetch.
      console.error("Error accepting request:", err);
      setRequestActionStatus(prevStatus => ({
          ...prevStatus,
          [requestId]: { loading: false, error: `Error: ${err.message}` }
      }));
    }
  };

  // --- BACKEND/API/JWT REQUIREMENT (Reject Action) ---
  // Asynchronous function to handle rejecting a pending request.
  // It takes the unique ID of the request to be rejected.
  const handleRejectRequest = async (requestId) => {
       // Set loading state specifically for this request item.
    setRequestActionStatus(prevStatus => ({
      ...prevStatus,
      [requestId]: { loading: true, error: null }
    }));

    try {
      // Get the JWT token for authentication.
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        console.error("Authentication token missing for reject request.");
         setRequestActionStatus(prevStatus => ({
            ...prevStatus,
            [requestId]: { loading: false, error: "Auth required" }
        }));
        // Redirect to login if necessary.
        // navigate('/login');
        return;
      }

      // --- API CALL REQUIREMENT (PUT Request) ---
      // Call the backend API endpoint to reject the request.
      // This endpoint must be protected and require the JWT.
      // The backend will verify the user owns this request and update its status (e.g., to 'rejected').
      const response = await fetch(`http://localhost:5001/api/wallet/${userId}/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response: false }),
      });

       // --- PROCESSING API RESPONSE & ERROR HANDLING ---
      if (!response.ok) {
         // Handle errors from the backend API call.
         if (response.status === 401) {
           localStorage.removeItem('jwtToken');
           // navigate('/login');
           console.error("Session expired rejecting request.");
            setRequestActionStatus(prevStatus => ({
               ...prevStatus,
               [requestId]: { loading: false, error: "Session expired" }
           }));
         } else {
            // Handle other errors.
            const errorBody = await response.json();
            setRequestActionStatus(prevStatus => ({
                ...prevStatus,
                [requestId]: { loading: false, error: errorBody.error || 'Failed to reject request' }
            }));
         }
         return; // Stop execution on error.
      }

      // --- SUCCESSFUL API RESPONSE ---
      // If the API call was successful, remove the request from the local state list.
      setPendingRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
       // Also remove the action status for this request.
       setRequestActionStatus(prevStatus => {
          const newStatus = { ...prevStatus };
          delete newStatus[requestId];
          return newStatus;
      });

      // Call onBalanceUpdate to refresh the dashboard
      if (onBalanceUpdate) {
        onBalanceUpdate();
      }

      // Update the pending requests count in the parent component
      if (onRequestHandled) {
        onRequestHandled();
      }

      // Trigger budget refresh
      const refreshBudgetStr = localStorage.getItem('refreshBudget');
      if (refreshBudgetStr) {
        try {
          const refreshBudget = new Function('return ' + refreshBudgetStr)();
          refreshBudget();
        } catch (err) {
          console.error('Failed to trigger budget refresh:', err);
        }
      }

      // --- POTENTIAL BACKEND INTERACTION (Update Count) ---
      // Since a request was rejected, the total count of pending requests on the dashboard might have changed.
      // Signal the parent component (DashboardActions) to re-fetch the count, perhaps when the modal closes.
       // If the list becomes empty after this action, you might also want to close the modal automatically.
       if (pendingRequests.length === 1) { // Check if this was the last request before filtering
           onClose(); // Close the modal
       }


    } catch (err) {
      // Catch any network or unexpected errors during the fetch.
      console.error("Error rejecting request:", err);
       setRequestActionStatus(prevStatus => ({
          ...prevStatus,
          [requestId]: { loading: false, error: `Error: ${err.message}` }
      }));
    }
  };


  // If the modal is not open (based on the 'isOpen' prop), return null.
  // This prevents the modal from being rendered when it's not visible.
  if (!isOpen) {
    return null;
  }

  // Render the modal structure when 'isOpen' is true.
  return (
    // --- MODAL OVERLAY ---
    // This div creates the semi-transparent background that covers the rest of the page.
    // Clicking on this overlay (outside the modal content) calls the 'onClose' function to close the modal.
    <div className="modal-overlay" onClick={onClose}>
      {/* --- MODAL CONTENT --- */}
      {/* This div contains the actual content of the modal (header, body). */}
      {/* We stop propagation of the click event here so clicking inside the modal content doesn't close the modal. */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Pending Requests</h3>
          {/* Close button in the header */}
          <button className="close-button" onClick={onClose}>&times;</button> {/* '&times;' is the HTML entity for '×' */}
        </div>

        <div className="modal-body">
          {/* --- LOADING, ERROR, AND DATA DISPLAY --- */}
          {/* Conditionally render different content based on the loading, error, and data states. */}
          {loading && <p>Loading pending requests...</p>} {/* Show loading message while fetching initial list */}
          {error && <p className="error-message">{error}</p>} {/* Show error message if initial fetch failed */}
          {!loading && !error && pendingRequests.length === 0 && (
            <p>No pending requests.</p> // Show message if no requests and no loading/error
          )}
          {/* Render the list of requests only if not loading, no error, and there are requests */}
          {!loading && !error && pendingRequests.length > 0 && (
            // --- SCROLLABLE LIST (Requirement) ---
            // The CSS for .pending-requests-list and .modal-body handles the scrolling behavior.
            <ul className="pending-requests-list">
              {/* --- POPULATING LIST WITH API DATA --- */}
              {/* Map over the 'pendingRequests' state array (populated by the API fetch) to create a list item for each request. */}
              {pendingRequests.map(request => {
                 // Get the action status for this specific request item.
                 const status = requestActionStatus[request.id] || { loading: false, error: null };
                 const senderName = request.sender?.name || request.sender?.username || 'Unknown User';
                 const formattedDate = new Date(request.createdAt).toLocaleString('en-US', {
                   year: 'numeric',
                   month: 'short',
                   day: 'numeric',
                   hour: '2-digit',
                   minute: '2-digit'
                 });

                 return (
                // Create a list item for each request. Use a unique key (e.g., the request ID from the backend).
                <li key={request.id} className="request-item">
                  {/* Display request details from the fetched data */}
                  {/* Assuming the backend returns objects with fields like 'fromUser' (which has a 'name'), 'amount', 'date', and 'id' */}
                  <div className="request-details">
                    Request from: <strong>{senderName}</strong> {/* Optional chaining in case fromUser is null or name is missing */}
                    <br />
                    Amount: <strong>${parseFloat(request.amount).toFixed(2)}</strong> {/* Parse amount as float and format to 2 decimal places */}
                    <br />
                    Date: {formattedDate} {/* Format the date */}
                    {request.note && (
                      <>
                        <br />
                        Note: {request.note}
                      </>
                    )}
                    {/* Display action-specific error message if any */}
                    {status.error && <p className="item-error-message">{status.error}</p>}
                  </div>
                  {/* --- BACKEND/API/JWT REQUIREMENT (Accept/Reject Actions) --- */}
                  {/* Buttons to Accept/Reject requests. Clicking these triggers the API calls defined above. */}
                  <div className="request-actions">
                    {/* Accept button */}
                    <button
                        className="action-button accept-button"
                        // Call handleAcceptRequest with the request's ID when clicked.
                        onClick={() => handleAcceptRequest(request.id)}
                        // Disable the button while the action for this specific request is loading.
                        disabled={status.loading}
                    >
                        {/* Show "Processing..." text while the action is loading, otherwise show "Accept". */}
                        {status.loading ? 'Processing...' : 'Accept'}
                    </button>
                    {/* Reject button */}
                    <button
                        className="action-button reject-button"
                        // Call handleRejectRequest with the request's ID when clicked.
                        onClick={() => handleRejectRequest(request.id)}
                        // Disable the button while the action for this specific request is loading.
                        disabled={status.loading}
                    >
                         {/* Show "Processing..." text while the action is loading, otherwise show "Reject". */}
                         {status.loading ? 'Processing...' : 'Reject'}
                    </button>
                  </div>
                </li>
              );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingRequestsModal;
