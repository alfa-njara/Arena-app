import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./App.css";

import Home from "./pages/Home";
import Choice from "./pages/Choice";
import Intro from "./pages/Intro";
import FormContributor from "./pages/FormContributor";

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
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/choice" element={<Choice />} />
        <Route path="/contributor/form" element={<FormContributor />} />
      </Routes>

      {showIntro && <Intro onFinish={handleFinishIntro} />}
    </BrowserRouter>
  );
}

export default App;
