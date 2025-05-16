import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

import Navbar from '../components/Common/Navbartwo'; 
import BalanceCard from '../components/User/Dashboard/BalanceCard'; 
import DashboardActions from '../components/User/Dashboard/DashboardActions'; 
import RecentTransactions from '../components/User/Dashboard/RecentTransactions'; 
import Footer from '../components/Common/Footer';
import '../pages/DashboardUserPage.css'; 


const DashboardUserPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

 
  const refreshDashboard = () => {
    setRefreshTrigger(prev => prev + 1);
  };


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
          console.error("No authentication token or userId found. Redirecting to login.");
          setError("Please log in to view this page.");
          setLoading(false);
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5001/api/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userId');
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
        console.log('Dashboard received user data:', data);
        
        if (!data.success || !data.user) {
          setError("Invalid response format from server");
          setLoading(false);
          return;
        }

        setUserData(data.user);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError(`Failed to load user data: ${err.message}`);
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

 
  const handleUserNameClick = () => {
    navigate('/profile', { state: { userId: userData?._id } });
  };

 
  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
       <div className="dashboard-container">
         <Navbar />
         <p className="error-message" style={{ textAlign: 'center', marginTop: '50px' }}>{error}</p>
       </div>
     );
  }

  
  return (
    <div className="dashboard-container">
      <Navbar userName={userData?.name} />
      <div className="hero-section">
        <div className="hero-left">
          <div className="welcome-message" onClick={handleUserNameClick}>
             <h2>
                 <span className="welcome-text">Welcome Back,</span>
                 {' '}
                 <span className="user-name-text">{userData?.name}!</span>
             </h2>
          </div>
          <div className="actions-container">
            <DashboardActions 
              userId={userData?._id} 
              onBalanceUpdate={refreshDashboard} 
            />
          </div>
        </div>
        <div className="hero-right">
          {console.log('Rendering BalanceCard with userId:', userData?._id)} {/* Debug log */}
          <BalanceCard 
            userId={userData?._id} 
            refreshTrigger={refreshTrigger} 
          />
        </div>
      </div>
      <RecentTransactions 
        userId={userData?._id} 
        refreshTrigger={refreshTrigger} 
      />
      <Footer />
    </div>
  );
};

export default DashboardUserPage;
