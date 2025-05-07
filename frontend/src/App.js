import React from 'react';
// Import necessary components from react-router-dom
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Import your page and component files
import HomePage from './pages/HomePage'; // Still imported, but not used for the root route
// import Footer from './components/Common/Footer'; // Footer might be outside the Routes or within a layout component
import SignUpPage from './components/User/Register'; // Still imported
import LoginPage from './pages/LoginPage'; // Still imported
import SendMoneyPage from './pages/SendMoneyPage'; // Still imported
// import Navbartwo from './components/Common/Navbartwo'; // Navbar component
import ProfilePage from './components/User/ProfilePage/ProfilePage'; // Still imported
import DashboardUserPage from './pages/DashboardUserPage'; // Your dashboard page

// --- PROTECTED ROUTE COMPONENT (Still needed for other routes) ---
// This component checks if the user is authenticated (has a JWT) before rendering the route's element.
// This is a frontend check. The backend API calls will perform the definitive validation using the JWT.
const ProtectedRoute = ({ element }) => {
  // Check if the JWT token exists in localStorage.
  // This assumes your login process successfully stores the JWT here.
  const isAuthenticated = localStorage.getItem('jwtToken');

  // If the token exists, render the requested element (the page component).
  if (isAuthenticated) {
    return element;
  } else {
    // --- REDIRECT ON UNAUTHENTICATED ACCESS (Rubric Requirement) ---
    // If no token is found, the user is not authenticated. Redirect them to the login page.
    // 'replace' ensures the login page replaces the current history entry in the browser.
    return <Navigate to="/login" replace />;
  }
};

// The main App component where routing is configured.
function App() {
  return (
    <div className="App">
      {/* --- ROUTER CONTEXT --- */}
      {/* Wrap your entire application's routes within <BrowserRouter>. */}
      {/* This provides the routing context needed for hooks like useNavigate(), useLocation(), etc. */}
      <Router>
        {/*
          Components that appear on multiple pages (like a Navbar or Footer)
          can be placed outside of the <Routes> container if they should render on *every* route.
          Alternatively, they can be part of a layout component rendered by a Route.
        */}

        {/* --- ROUTES CONTAINER --- */}
        {/* <Routes> is essential in react-router-dom v6+. It matches the URL to the first <Route> inside it. */}
        <Routes>
          {/* --- TEMPORARY ROOT ROUTE (for direct access to Dashboard) --- */}
          {/* This route now directly renders the DashboardUserPage */}
          {/* NOTE: This bypasses the ProtectedRoute for the root path '/' */}
          <Route
            path="/"
            element={<DashboardUserPage />} // Directly render DashboardUserPage
          />

          {/* --- PUBLIC ROUTES (Still defined but not the default landing) --- */}
          <Route path="/signup" element={<SignUpPage />} /> {/* Sign Up page */}
          <Route path="/login" element={<LoginPage />} /> {/* Login page */}

          {/* --- PROTECTED ROUTES (Still require authentication when accessed directly by their path) --- */}
          {/* Note: Accessing '/dashboard' directly will still use ProtectedRoute. */}
          {/* Accessing '/' will bypass it with this temporary setup. */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<DashboardUserPage />} />}
          />
          <Route
            path="/sendmoney"
            element={<ProtectedRoute element={<SendMoneyPage />} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute element={<ProfilePage />} />}
          />
          {/* Add other protected routes here */}

          {/* --- FALLBACK/REDIRECT ROUTE --- */}
          {/* This route handles cases where the user navigates to a path that doesn't match any defined routes. */}
          {/* It checks for the JWT and redirects either to the dashboard (if authenticated) or login (if not). */}
          {/* This route is less likely to be hit with '/' now directly rendering dashboard, but it's good practice. */}
           <Route
             path="*" // Matches any path not matched by the routes above
             element={localStorage.getItem('jwtToken') ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
           />

        </Routes>

        {/* <Footer /> */} {/* Example: If Footer is global */}

      </Router>

    </div>
  );
}

export default App;
