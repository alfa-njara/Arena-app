import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("dark_mode");
    return saved === "true" || false;
  });

  const [user, setUser] = useState(() => {
    const access = localStorage.getItem("access_token");
    const userType = localStorage.getItem("user_type");
    if (access && userType) {
      return { type: userType };
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem("dark_mode", isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_type");
    localStorage.removeItem("contributorData");
    setUser(null);
  };

  const login = (userData) => {
    setUser(userData);
  };

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
