import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useAppContext } from "../../context/AppContext";
import api from "../../api";
import CompleteProfileModal from "../../components/profile/CompleteProfileModal";

const Layout = () => {
  const { isDarkMode } = useAppContext();
  const location = useLocation();
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);

  const isProfilePage = location.pathname === "/contributor/profile";
  const isHomePage = location.pathname === "/home";

  useEffect(() => {
    const userType = localStorage.getItem("user_type");
    if (userType === "contributor") {
      checkProfile();
    }
  }, []);

  const checkProfile = async () => {
    try {
      const res = await api.get("/companies/me/");
      if (!res.data.logo_url || !res.data.description) {
        setShowCompleteProfile(true);
      }
    } catch (err) {
      console.error("Checking profile failed", err);
    }
  };

  return (
    <div className={`layout-container ${isDarkMode ? "dark" : ""}`}>
      {showCompleteProfile && (
        <CompleteProfileModal onComplete={() => setShowCompleteProfile(false)} />
      )}
      <div className="layout-header">
        <Navbar showSearch={isHomePage} isVerified={isProfilePage} />
      </div>

      <div className="layout-body">
        <aside className="layout-sidebar">
          <Sidebar />
        </aside>
        <main className="layout-main">
          <Outlet />
        </main>
      </div>

      <style>{`
        .layout-container {
          display: flex; flex-direction: column;
          height: 100vh; width: 100vw; overflow: hidden;
          background-color: var(--bg-main);
          color: var(--text-main);
          transition: background-color 0.3s, color 0.3s;
        }
        .layout-header { flex-shrink: 0; z-index: 1000; }
        .layout-body { display: flex; flex: 1; overflow: hidden; }
        .layout-sidebar {
          flex-shrink: 0; background: var(--bg-main);
          border-right: 1px solid var(--border-color);
          height: 100%; transition: background-color 0.3s, border-color 0.3s;
        }
        .layout-main {
          flex: 1; overflow-y: auto; background: var(--bg-main);
          height: 100%; transition: background-color 0.3s;
        }
        @media (max-width: 992px) {
          .layout-sidebar { display: none; }
        }
      `}</style>
    </div>
  );
};

export default Layout;
