import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("userToken"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  const saveAuthData = (newToken, userData) => {
    localStorage.setItem("userToken", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
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
      console.error("Logout API call failed, proceeding with local cleanup:", error);
    }

    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);

    window.location.replace("/login");
  };

  useEffect(() => {
    // If one exists but the other doesn't, treat as invalid session
    if ((token && !user) || (!token && user)) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading,
        saveAuthData,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
