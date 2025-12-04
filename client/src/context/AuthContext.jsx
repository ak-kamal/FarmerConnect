import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the Context object
const AuthContext = createContext(null);

// 2. Custom Hook to easily consume the context
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Provider Component
export const AuthProvider = ({ children }) => {
  // Retrieve token and user from localStorage on initial load
  const [token, setToken] = useState(localStorage.getItem('userToken') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [isLoading, setIsLoading] = useState(true);

  // --- Utility Function: Store token and user data ---
  const saveAuthData = (token, userData) => {
    localStorage.setItem('userToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };

  // --- Logout Function (FR-1 Requirement) ---
  const logout = async () => {
    try {
      // 1. Call the server endpoint (from userController.js)
      // We don't strictly need to await this, as the JWT is client-side deleted.
      await fetch('/api/users/logout', { 
        method: 'POST', 
        headers: {
            'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
        console.error("Logout API call failed, proceeding with local cleanup:", error);
    }

    // 2. CLEAR LOCAL STORAGE: This is the critical step for JWT logout
    localStorage.removeItem('userToken'); 
    localStorage.removeItem('user'); 

    // 3. RESET STATE
    setToken(null);
    setUser(null);
    
    // 4. REDIRECT: Send the user to the login page (or refresh if using a global router)
    // We use window.location.replace to force a full page reload and ensure state is reset everywhere.
    window.location.replace('/login'); 
  };
  
  // --- Check initial token and user data on load ---
  useEffect(() => {
    // If a token exists, we should validate it or just assume it's valid 
    // until an API call fails (standard practice).
    if (token && user) {
        setIsLoading(false);
    } else {
        // No token, ensure state is clean
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsLoading(false);
    }
  }, []); // Run only on mount

  // --- Context Value ---
  const contextValue = {
    token,
    user,
    isLoading,
    saveAuthData, // Used by login/set-password components
    logout,       // Used by the dashboard/navbar components
    // You will add login, signup, verify functions here later, 
    // which call the server API and then call saveAuthData().
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
// End of AuthContext.jsx