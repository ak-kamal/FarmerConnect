import React, { useState, useEffect } from 'react';
// Import Auth Provider/Hook
import { AuthProvider, useAuth } from './context/AuthContext.jsx'; 

// Import all FR-1 components
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Verification from './pages/Verification.jsx';
import SetPassword from './pages/SetPassword.jsx';
// Import Dashboard (FR-2)
import Dashboard from './pages/Dashboard.jsx'; 


// --- 1. Top-Level Router Component ---
// This handles which "page" the user sees based on their state and URL path.
const Router = () => {
  const { user, isLoading } = useAuth();
  
  // State to manage the multi-step signup process client-side
  const [authStage, setAuthStage] = useState({
    page: window.location.pathname.startsWith('/verify') ? 'VERIFY' : 'LOGIN',
    email: '', // Email context passed from Signup -> Verification -> SetPassword
  });

  // Simple path-based routing (simulating React Router)
  const path = window.location.pathname;

  // Function to handle successful signup and transition to verification
  const handleSignupSuccess = (email) => {
    localStorage.setItem('verificationEmail', email);
    setAuthStage({ page: 'VERIFY', email });
    window.history.pushState({}, '', '/verify');
  };

  // Function to handle successful verification and transition to password setup
  const handleVerificationSuccess = (email) => {
    localStorage.setItem('verifiedEmail', email);
    setAuthStage({ page: 'SET_PASSWORD', email });
    window.history.pushState({}, '', '/set-password');
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <h1 className="text-2xl text-gray-500">Loading Application...</h1>
      </div>
    );
  }

  // --- Protected Routes ---
  if (user && user.token) {
    // If the user is authenticated, always show the Dashboard (FR-2)
    return <Dashboard />;
  }

  // --- Public Routes (FR-1 Workflow) ---

  // Handle manual navigation back to auth pages
  if (path === '/login') {
    return <Login />;
  }
  
  if (path === '/signup') {
    return <Signup onSignupSuccess={handleSignupSuccess} />;
  }

  // Handle the multi-step flow when not logged in
  if (authStage.page === 'VERIFY' || path === '/verify' || authStage.page === 'SET_PASSWORD' || path === '/set-password') {
    
    // Check if the user is verified but needs a password set (from context or local storage)
    const verifiedEmail = authStage.email || localStorage.getItem('verifiedEmail');
    if (verifiedEmail && (authStage.page === 'SET_PASSWORD' || path === '/set-password')) {
        return <SetPassword verifiedEmail={verifiedEmail} />;
    }
    
    // Check if the user needs verification
    const verificationEmail = authStage.email || localStorage.getItem('verificationEmail');
    if (verificationEmail) {
        return <Verification 
            verificationEmail={verificationEmail} 
            onVerificationSuccess={handleVerificationSuccess} 
        />;
    }
  }

  // Default to Login if path is '/' or unrecognized (and not authenticated)
  return <Login />;
};

// --- 2. Main Application Component with Provider ---
const App = () => {
    return (
        // Wrap the entire application in the AuthProvider to make auth context available
        <AuthProvider>
            <Router />
        </AuthProvider>
    );
};

export default App;