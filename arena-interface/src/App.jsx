import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./App.css";

import Home from "./pages/Home";
import Choice from "./pages/choice/Choice";
import Intro from "./pages/intro/Intro";
import FormContributor from "./pages/FormContributor";
import ContributorProfile from "./components/profile/ContributorProfile";
import Layout from "./pages/layout/Layout";
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
          {/* Pages avec Sidebar */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route
              path="/contributor/profile"
              element={<ContributorProfile />}
            />
          </Route>

          {/* Pages sans Sidebar */}
          <Route path="/choice" element={<Choice />} />
          <Route path="/contributor/form" element={<FormContributor />} />

          {/* Redirect ou 404 si tu veux */}
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
