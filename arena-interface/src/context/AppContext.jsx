import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("dark_mode");
    return saved === "true" || false;
  });

  const [textSize, setTextSize] = useState(() => {
    return localStorage.getItem("text_size") || "medium";
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  const [user, setUser] = useState(() => {
    const access = localStorage.getItem("access_token");
    const userType = localStorage.getItem("user_type");
    const isStaff = localStorage.getItem("is_staff") === "true";
    const isPremium = localStorage.getItem("is_premium") === "true";
    if (access && userType) {
      return { type: userType, isStaff, isPremium };
    }
    return null;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isAppLoading, setIsAppLoading] = useState(false);

  const triggerAppLoading = (duration = 1500) => {
    setIsAppLoading(true);
    setTimeout(() => {
      setIsAppLoading(false);
    }, duration);
  };

  useEffect(() => {
    localStorage.setItem("dark_mode", isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("text_size", textSize);
    document.documentElement.classList.remove("text-small", "text-medium", "text-large");
    document.documentElement.classList.add(`text-${textSize}`);
  }, [textSize]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_type");
    localStorage.removeItem("is_staff");
    localStorage.removeItem("is_premium");
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
        textSize,
        setTextSize,
        language,
        setLanguage,
        user,
        login,
        logout,
        searchQuery,
        setSearchQuery,
        isAppLoading,
        triggerAppLoading,
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
