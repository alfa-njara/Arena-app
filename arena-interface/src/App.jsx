import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import Choice from "./pages/Choice";
import Intro from "./pages/Intro";
import FormContributor from "./pages/FormContributor";

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function App() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const introShown = localStorage.getItem("introShown");
    if (!introShown) setShowIntro(true);
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/choice" element={<Choice />} />
        <Route path="/contributor/form" element={<FormContributor />} />
      </Routes>

      {showIntro && <Intro onFinish={() => setShowIntro(false)} />}
    </>
  );
}

export default AppWrapper;
