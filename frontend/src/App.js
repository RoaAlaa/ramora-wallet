import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import SignUpPage from './components/User/Register';
import LoginPage from './pages/LoginPage';
import SendMoneyPage from './pages/SendMoneyPage';
import RequestMoneyPage from './pages/RequestMoneyPage';
import ProfilePage from './components/User/ProfilePage/ProfilePage';
import DashboardUserPage from './pages/DashboardUserPage';
import BudgetTrackingPageWrapper from './pages/BudgetTrackingPageWrapper';
import UserFeedback from './components/User/Feedback/UserFeedback';
import HomeDashboard from './pages/HomeDashboard';

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('jwtToken');
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <div className="App">
      <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Public Routes */}
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute element={<DashboardUserPage />} />} />
            <Route path="/dashboard/home" element={<ProtectedRoute element={<HomeDashboard />} />} />
            <Route path="/sendmoney" element={<ProtectedRoute element={<SendMoneyPage />} />} />
            <Route path="/requestmoney" element={<ProtectedRoute element={<RequestMoneyPage />} />} />
            <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
            <Route path="/budget-tracking" element={<ProtectedRoute element={<BudgetTrackingPageWrapper />} />} />
            <Route path="/feedback" element={<ProtectedRoute element={<UserFeedback />} />} />

            {/* Fallback Route */}
            <Route
              path="*"
              element={
                localStorage.getItem('jwtToken') ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
      </Router>
    </div>
  );
}

export default App;