import React, { useEffect, useState } from 'react';
import './PendingRequestModal.css';

const PendingRequestsModal = ({ isOpen, onClose, userId, onBalanceUpdate, onRequestHandled }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestActionStatus, setRequestActionStatus] = useState({});

  useEffect(() => {
    if (isOpen) {
      const fetchPendingRequests = async () => {
        setLoading(true);
        setError(null);

        try {
          const token = localStorage.getItem('jwtToken');
          if (!token) {
            console.error("Authentication token missing for pending requests list fetch.");
            setError("Authentication required to view pending requests.");
            setLoading(false);
            return;
          }

          const response = await fetch(`http://localhost:5001/api/wallet/${userId}/requests`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            if (response.status === 401) {
              localStorage.removeItem('jwtToken');
              console.error("Session expired fetching pending requests list.");
              setError("Session expired. Please log in again.");
            } else {
              const errorBody = await response.json();
              setError(`Error fetching pending requests: ${response.status} ${errorBody.error || response.statusText}`);
            }
            setLoading(false);
            return;
          }

          const data = await response.json();
          setPendingRequests(data);
          setLoading(false);

        } catch (err) {
          console.error("Failed to fetch pending requests list:", err);
          setError(`Failed to load pending requests: ${err.message}`);
          setLoading(false);
        }
      };

      fetchPendingRequests();
    } else {
      setRequestActionStatus({});
    }
  }, [isOpen, userId]);

  const handleAcceptRequest = async (requestId) => {
    setRequestActionStatus(prevStatus => ({
      ...prevStatus,
      [requestId]: { loading: true, error: null }
    }));

    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        console.error("Authentication token missing for accept request.");
        setRequestActionStatus(prevStatus => ({
          ...prevStatus,
          [requestId]: { loading: false, error: "Auth required" }
        }));
        return;
      }

      const response = await fetch(`http://localhost:5001/api/wallet/${userId}/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response: true }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('jwtToken');
          console.error("Session expired accepting request.");
          setRequestActionStatus(prevStatus => ({
            ...prevStatus,
            [requestId]: { loading: false, error: "Session expired" }
          }));
        } else {
          const errorBody = await response.json();
          setRequestActionStatus(prevStatus => ({
            ...prevStatus,
            [requestId]: { loading: false, error: errorBody.error || 'Failed to accept request' }
          }));
        }
        return;
      }

      setPendingRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
      setRequestActionStatus(prevStatus => {
        const newStatus = { ...prevStatus };
        delete newStatus[requestId];
        return newStatus;
      });

      if (onBalanceUpdate) {
        onBalanceUpdate();
      }
      if (onRequestHandled) {
        onRequestHandled();
      }

      const refreshBudgetStr = localStorage.getItem('refreshBudget');
      if (refreshBudgetStr) {
        try {
          const refreshBudget = new Function('return ' + refreshBudgetStr)();
          refreshBudget();
        } catch (err) {
          console.error('Failed to trigger budget refresh:', err);
        }
      }

      if (pendingRequests.length === 1) {
        onClose();
      }

    } catch (err) {
      console.error("Error accepting request:", err);
      setRequestActionStatus(prevStatus => ({
        ...prevStatus,
        [requestId]: { loading: false, error: `Error: ${err.message}` }
      }));
    }
  };

  const handleRejectRequest = async (requestId) => {
    setRequestActionStatus(prevStatus => ({
      ...prevStatus,
      [requestId]: { loading: true, error: null }
    }));

    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        console.error("Authentication token missing for reject request.");
        setRequestActionStatus(prevStatus => ({
          ...prevStatus,
          [requestId]: { loading: false, error: "Auth required" }
        }));
        return;
      }

      const response = await fetch(`http://localhost:5001/api/wallet/${userId}/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response: false }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('jwtToken');
          console.error("Session expired rejecting request.");
          setRequestActionStatus(prevStatus => ({
            ...prevStatus,
            [requestId]: { loading: false, error: "Session expired" }
          }));
        } else {
          const errorBody = await response.json();
          setRequestActionStatus(prevStatus => ({
            ...prevStatus,
            [requestId]: { loading: false, error: errorBody.error || 'Failed to reject request' }
          }));
        }
        return;
      }

      setPendingRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
      setRequestActionStatus(prevStatus => {
        const newStatus = { ...prevStatus };
        delete newStatus[requestId];
        return newStatus;
      });

      if (onBalanceUpdate) {
        onBalanceUpdate();
      }
      if (onRequestHandled) {
        onRequestHandled();
      }

      const refreshBudgetStr = localStorage.getItem('refreshBudget');
      if (refreshBudgetStr) {
        try {
          const refreshBudget = new Function('return ' + refreshBudgetStr)();
          refreshBudget();
        } catch (err) {
          console.error('Failed to trigger budget refresh:', err);
        }
      }

      if (pendingRequests.length === 1) {
        onClose();
      }

    } catch (err) {
      console.error("Error rejecting request:", err);
      setRequestActionStatus(prevStatus => ({
        ...prevStatus,
        [requestId]: { loading: false, error: `Error: ${err.message}` }
      }));
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Pending Requests</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          {loading && <p>Loading pending requests...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && pendingRequests.length === 0 && (
            <p>No pending requests.</p>
          )}
          {!loading && !error && pendingRequests.length > 0 && (
            <ul className="pending-requests-list">
              {pendingRequests.map(request => {
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
                  <li key={request.id} className="request-item">
                    <div>
                      <strong>{senderName}</strong> requested <strong>${request.amount.toFixed(2)}</strong>
                      <br />
                      <small>{formattedDate}</small>
                    </div>
                    <div>
                      {status.loading ? (
                        <span>Processing...</span>
                      ) : (
                        <>
                          <button className = "accept-button" onClick={() => handleAcceptRequest(request.id)}>Accept</button>
                          <button className = "reject-button" onClick={() => handleRejectRequest(request.id)}>Reject</button>
                        </>
                      )}
                      {status.error && <div className="error-message">{status.error}</div>}
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
