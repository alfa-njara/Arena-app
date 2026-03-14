import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import Home from "./pages/Home";
import Choice from "./pages/choice/Choice";
import ContributorProfile from "./components/profile/ContributorProfile";
import Layout from "./pages/layout/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import Favorites from "./pages/favorites/Favorites";
import Settings from "./pages/settings/Settings";
import AuthArena from "./components/log_sign/AuthArena";
import LandingPage from "./pages/landing/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        {/* Redirection automatique vers /choice si on arrive sur "/" */}
        <Route path="/" element={<Navigate to="/landing" replace />} />

        {/* Pages avec Navbar + Sidebar */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/contributor/profile" element={<ContributorProfile />} />
          <Route path="/contributor/dashboard" element={<Dashboard />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Pages plein écran */}
        <Route path="/choice" element={<Choice />} />
        <Route path="/contributor/form" element={<AuthArena />} />
        <Route path="/landing" element={<LandingPage />} />

        {/* Route inconnue */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
