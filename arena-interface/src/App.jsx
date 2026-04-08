import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import Home from "./pages/Home";
import Choice from "./pages/choice/Choice";
import ContributorProfile from "./components/profile/ContributorProfile";
import Layout from "./pages/layout/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import Favorites from "./pages/favorites/Favorites";
import Settings from "./pages/settings/Settings";
import AuthArena from "./components/log_sign/AuthArena";
import LandingPage from "./pages/landing/LandingPage";
import { AppProvider } from "./context/AppContext";

import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Toaster position="top-center" />
        <Routes>
          {/* Redirection automatique vers /landing si on arrive sur "/" */}
          <Route path="/" element={<Navigate to="/landing" replace />} />

          {/* Pages avec Navbar + Sidebar - Protected */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/contributor/profile" element={<ContributorProfile />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Dashboard only for contributors */}
              <Route element={<ProtectedRoute allowedRoles={["contributor"]} />}>
                <Route path="/contributor/dashboard" element={<Dashboard />} />
              </Route>

              {/* Admin Dashboard */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
            </Route>

            {/* Fullscreen Pages - Protected */}
            <Route path="/choice" element={<Choice />} />
            <Route path="/contributor/form" element={<AuthArena />} />
          </Route>

          <Route path="/landing" element={<LandingPage />} />

          {/* Route inconnue */}
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
