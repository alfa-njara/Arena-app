import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import "./App.css";

import Home from "./pages/Home";
import Choice from "./pages/choice/Choice";
import Intro from "./pages/intro/Intro";
import FormContributor from "./pages/FormContributor";
import ContributorProfile from "./components/profile/ContributorProfile";
import Layout from "./pages/layout/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import Favorites from "./pages/favorites/Favorites";
import Settings from "./pages/settings/Settings";

function App() {
  const [showIntro, setShowIntro] = useState(
    !localStorage.getItem("introShown"),
  );

  const handleFinishIntro = () => {
    localStorage.setItem("introShown", "true");
    setShowIntro(false);
  };

  return (
    <BrowserRouter>
      {showIntro && <Intro onFinish={handleFinishIntro} />}

      {!showIntro && (
        <Routes>
          {/* 1. Redirection automatique vers /home si on arrive sur la racine "/" */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* 2. Pages avec l'interface complète (Navbar fixe + Sidebar fixe) */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route
              path="/contributor/profile"
              element={<ContributorProfile />}
            />
            <Route path="/contributor/dashboard" element={<Dashboard />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* 3. Pages en plein écran (sans Navbar ni Sidebar) */}
          <Route path="/choice" element={<Choice />} />
          <Route path="/contributor/form" element={<FormContributor />} />

          {/* 4. Gestion des erreurs 404 / Routes inconnues */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
