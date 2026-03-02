import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { LuHandshake } from "react-icons/lu";
import { FaSearch } from "react-icons/fa";
import { BsRocketTakeoffFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import "./Intro.css";

const slides = [
  {
    title: "Welcome to Arena!",
    text: "Discover amazing places, restaurants, shops and more!",
    icon: <LuHandshake size={60} color="white" />,
  },
  {
    title: "Find What You Love",
    text: "Search by categories and filter easily through all locations in Arena.",
    icon: <FaSearch size={60} color="white" />,
  },
  {
    title: "Get Started with Arena",
    text: "Join now and start exploring! Click below to begin.",
    icon: <BsRocketTakeoffFill size={60} color="white" />,
  },
];

const Intro = ({ onFinish }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const isLastSlide = currentSlide === slides.length - 1;

  const handleNext = () => {
    if (!isLastSlide) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onFinish();
      navigate("/choice");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000000",
        zIndex: 9999,
      }}
    >
      <div className="background">
        {[...Array(8)].map((_, i) => (
          <span key={i} className="ball"></span>
        ))}
      </div>

      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          color: "white",
          zIndex: 10000,
        }}
      >
        <div style={{ marginBottom: "1rem" }}>{slides[currentSlide].icon}</div>
        <h1 className="mb-3">{slides[currentSlide].title}</h1>
        <p className="mb-4">{slides[currentSlide].text}</p>

        <div className="d-flex justify-content-center mb-5">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`mx-1 rounded-circle d-inline-block ${
                index === currentSlide ? "bg-primary" : "bg-secondary"
              }`}
              style={{ width: 10, height: 10 }}
            ></span>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 10001,
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          color: isLastSlide ? "white" : "#000",
          backgroundColor: isLastSlide ? "#22ff0072" : "#ffffff",
          border: "none",
          borderRadius: "1.1rem",
          cursor: "pointer",
        }}
      >
        {isLastSlide ? "Get Started" : "Next"}
      </button>
    </div>
  );
};

export default Intro;
