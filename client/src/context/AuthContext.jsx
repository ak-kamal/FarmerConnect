// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("userToken") || null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [isLoading, setIsLoading] = useState(true);

  const saveAuthData = (token, userData) => {
    localStorage.setItem("userToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(
        "Logout API call failed, proceeding with local cleanup:",
        error
      );
    }

    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);

    window.location.replace("/login");
  };

  useEffect(() => {
    if (token || user) {
      setIsLoading(false);
    } else {
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      setIsLoading(false);
    }
  }, []); // run once on mount

  const contextValue = {
    token,
    user,
    isLoading,
    saveAuthData,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
