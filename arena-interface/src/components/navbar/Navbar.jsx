// src/components/Navbar.js
import React from "react";
import { useLocation } from "react-router-dom";
import Logo from "../../assets/arena2.png";
import { LuSearch, LuMoon, LuSun } from "react-icons/lu";
import { FaCheckCircle, FaHome, FaRegEye } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { useAppContext } from "../../context/AppContext";

const Navbar = ({ query, setQuery, showSearch = true }) => {
  const { isDarkMode, toggleTheme, searchQuery, setSearchQuery } = useAppContext();
  const location = useLocation();

  const finalQuery = query || searchQuery;
  const finalSetQuery = setQuery || setSearchQuery;

  const getBadgeContent = () => {
    const path = location.pathname;
    if (path === "/home" || path === "/") {
      return { text: "Explore", icon: <FaHome className="me-1" />, color: "info" };
    }
    if (path.includes("/contributor/profile")) {
      return { text: "Verified", icon: <FaCheckCircle className="me-1" />, color: "success" };
    }
    if (path.includes("/contributor/dashboard")) {
      return { text: "Overview", icon: <FaRegEye className="me-1" />, color: "primary" };
    }
    if (path.includes("/favorites")) {
      return { text: "My Collection", icon: <FaRegHeart className="me-1" />, color: "danger" };
    }
    if (path.includes("/settings")) {
      return { text: "Settings", icon: <IoSettingsOutline className="me-1" />, color: "secondary" };
    }
    return null;
  };

  const badge = getBadgeContent();

  return (
    <>
      <nav
        className={`navbar border-bottom sticky-top shadow-sm main-navbar ${isDarkMode ? "navbar-dark border-secondary" : ""}`}
        style={{ backgroundColor: isDarkMode ? "var(--bg-main)" : "#fff" }}
      >
        <div className="container-fluid d-flex align-items-center justify-content-between h-100 px-lg-5">
          <div className="d-flex align-items-center flex-shrink-0" style={{ minWidth: "150px" }}>
            <img src={Logo} alt="Logo" className="arena-logo me-2" style={{ height: "32px" }} />
            <span className={`fs-5 fw-bold ${isDarkMode ? "text-white" : "text-dark"}`}>Arena</span>
          </div>

          <div className="flex-grow-1 d-flex justify-content-center mx-4">
            {showSearch && (
              <div className="search-input-wrapper" style={{ position: "relative", width: "100%", maxWidth: "500px" }}>
                <LuSearch style={{ position: "absolute", top: "50%", left: "16px", transform: "translateY(-50%)", color: "#9ca3af" }} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={finalQuery}
                  onChange={(e) => finalSetQuery(e.target.value)}
                  className={`search-input ${isDarkMode ? "search-dark" : "search-light"}`}
                />
              </div>
            )}
          </div>

          <div className="d-flex align-items-center justify-content-end gap-3 flex-shrink-0" style={{ minWidth: "150px" }}>
            <div style={{ minHeight: "32px", display: "flex", alignItems: "center" }}>
              {badge && (
                <span
                  className={`badge rounded-pill px-3 py-2 border small ${
                    isDarkMode
                      ? "bg-dark text-light border-secondary"
                      : `bg-${badge.color}-subtle text-${badge.color} border-${badge.color}-subtle`
                  }`}
                >
                  {badge.icon}
                  <span className="d-none d-md-inline">{badge.text}</span>
                </span>
              )}
            </div>

            <div
              onClick={toggleTheme}
              className={`theme-switch-btn ${isDarkMode ? "text-warning" : "text-secondary"}`}
            >
              {isDarkMode ? <LuSun size={22} /> : <LuMoon size={22} />}
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        .main-navbar { height: 70px; padding: 0; transition: all 0.3s ease; }
        .search-input { width: 100%; padding: 8px 16px 8px 45px; border-radius: 12px; border: 1px solid transparent; height: 40px; font-size: 0.95rem; transition: 0.2s; }
        .search-light { background: #f3f4f6; color: #000; }
        .search-dark { background: #2a2a2a; color: #fff; border: 1px solid #444; }
        .search-input:focus { outline: none; border-color: #0d6efd; box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1); }
        .theme-switch-btn { cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 10px; transition: 0.2s; }
        .theme-switch-btn:hover { background: rgba(128, 128, 128, 0.1); }
      `}</style>
    </>
  );
};

export default Navbar;
