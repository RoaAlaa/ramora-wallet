import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Common/Navbartwo';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { FaPlus, FaEdit } from 'react-icons/fa';
import './BudgetTrackingPage.css';
import Footer from '../components/Common/Footer';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const BudgetTrackingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalError, setModalError] = useState(null);
  const [showAddBucketModal, setShowAddBucketModal] = useState(false);
  const [showEditBucketModal, setShowEditBucketModal] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [newBucketName, setNewBucketName] = useState('');
  const [newBucketAmount, setNewBucketAmount] = useState('');
  const [userData, setUserData] = useState({
    totalBalance: 0,
    buckets: []
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const userId = localStorage.getItem('userId');
        
        if (!token || !userId) {
          navigate('/login');
          return;
        }

        const response = await fetch(`http://localhost:5001/api/users/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('jwtToken');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        if (!data.success || !data.user) {
          throw new Error('Invalid response format');
        }

        setUserData({
          totalBalance: data.user.balance || 0,
          buckets: data.user.buckets || []
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError(`Failed to load user data: ${err.message}`);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleAddBucket = async () => {
    try {
      if (!newBucketName.trim()) {
        setModalError('Bucket name is required');
        return;
      }

      const amount = parseFloat(newBucketAmount);
      if (isNaN(amount) || amount < 0) {
        setModalError('Please enter a valid amount');
        return;
      }

      // Check if user has sufficient funds
      if (amount > userData.totalBalance) {
        setModalError('Insufficient funds');
        return;
      }

      const token = localStorage.getItem('jwtToken');
      const userId = localStorage.getItem('userId');
      
      const response = await fetch(`http://localhost:5001/api/buckets/${userId}/buckets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          bucketName: newBucketName, 
          amount: amount
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create bucket');
      }

      const data = await response.json();
      setUserData({
        totalBalance: data.user.balance,
        buckets: data.user.buckets
      });
      setShowAddBucketModal(false);
      setNewBucketName('');
      setNewBucketAmount('');
      setModalError(null);
    } catch (err) {
      setModalError(err.message);
    }
  };

  const handleEditBucket = async () => {
    try {
      if (!selectedBucket) {
        throw new Error('No bucket selected');
      }

      const token = localStorage.getItem('jwtToken');
      const userId = localStorage.getItem('userId');

      const response = await fetch(`http://localhost:5001/api/buckets/${userId}/buckets/${selectedBucket._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: newBucketName || selectedBucket.name,
          amount: parseFloat(newBucketAmount) || selectedBucket.amount 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update bucket');
      }

      const data = await response.json();
      setUserData({
        totalBalance: data.user.balance,
        buckets: data.user.buckets
      });
      setShowEditBucketModal(false);
      setSelectedBucket(null);
      setNewBucketName('');
      setNewBucketAmount('');
    } catch (err) {
      setError(err.message);
    }
  };

  const prepareChartData = () => {
    return userData.buckets.map(bucket => ({
      name: bucket.name,
      value: bucket.amount
    }));
  };

  if (loading) {
    return (
      <div className="budget-page">
        <Navbar />
        <div className="loading">Loading budget data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="budget-page">
        <Navbar />
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="budget-page">
      <Navbar />
      <div className="budget-container">
        <div className="budget-header">
          <h1>Budget Tracking</h1>
          <div className="total-balance">Total Balance: ${userData.totalBalance.toFixed(2)}</div>
        </div>

        <section className="visualization-section">
          <h2>Budget Distribution</h2>
          {userData.buckets.length > 0 ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareChartData()}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    label
                  >
                    {prepareChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="no-buckets-message">
              <p>No buckets created yet</p>
              <p>Create a bucket to start tracking your budget</p>
            </div>
          )}
        </section>

        <section className="buckets-management-section">
          <div className="section-header">
            <h2>Your Buckets</h2>
            <button className="add-bucket-btn" onClick={() => setShowAddBucketModal(true)}>
              <FaPlus /> Add Bucket
            </button>
          </div>
          
          <div className="buckets-grid">
            {userData.buckets.map((bucket, index) => (
              <div key={bucket._id || index} className="bucket-card">
                <div className="bucket-header">
                  <h3>{bucket.name}</h3>
                  <button 
                    className="edit-button"
                    onClick={() => {
                      setSelectedBucket(bucket);
                      setNewBucketName(bucket.name);
                      setNewBucketAmount(bucket.amount.toString());
                      setShowEditBucketModal(true);
                    }}
                  >
                    <FaEdit />
                  </button>
                </div>
                <p className="amount">${bucket.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Add Bucket Modal */}
        {showAddBucketModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Create New Bucket</h3>
              <input
                type="text"
                placeholder="Bucket Name"
                value={newBucketName}
                onChange={(e) => {
                  setNewBucketName(e.target.value);
                  setModalError(null);
                }}
              />
              <input
                type="number"
                placeholder="Initial Amount"
                value={newBucketAmount}
                onChange={(e) => {
                  setNewBucketAmount(e.target.value);
                  setModalError(null);
                }}
              />
              <div className="modal-buttons">
                <button onClick={handleAddBucket}>Create</button>
                <button onClick={() => {
                  setShowAddBucketModal(false);
                  setNewBucketName('');
                  setNewBucketAmount('');
                  setModalError(null);
                }}>Cancel</button>
              </div>
              {modalError && (
                <div className="error-message">
                  {modalError === 'Insufficient funds' ? (
                    <>
                      <p>Insufficient funds</p>
                      <p>Your current balance: ${userData.totalBalance.toFixed(2)}</p>
                    </>
                  ) : (
                    <p>{modalError}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit Bucket Modal */}
        {showEditBucketModal && selectedBucket && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edit {selectedBucket.name}</h3>
              <input
                type="text"
                placeholder="Bucket Name"
                value={newBucketName}
                onChange={(e) => setNewBucketName(e.target.value)}
              />
              <input
                type="number"
                placeholder="Amount"
                value={newBucketAmount}
                onChange={(e) => setNewBucketAmount(e.target.value)}
              />
              <div className="modal-buttons">
                <button onClick={handleEditBucket}>Save Changes</button>
                <button onClick={() => {
                  setShowEditBucketModal(false);
                  setSelectedBucket(null);
                  setNewBucketName('');
                  setNewBucketAmount('');
                  setError(null);
                }}>Cancel</button>
              </div>
              {error && <p className="error-message">{error}</p>}
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default BudgetTrackingPage; 