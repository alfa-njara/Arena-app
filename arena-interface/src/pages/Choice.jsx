import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaRegUser, FaBuilding } from "react-icons/fa";

const Choice = () => {
  const navigate = useNavigate();

  const handleChoice = (role) => {
    if (role === "client") navigate("/client/home");
    else if (role === "contributor") navigate("/contributor/form");
  };

  return (
    <div className="choice-container">
      <div className="bubbles">
        <span className="bubble bubble1"></span>
        <span className="bubble bubble2"></span>
        <span className="bubble bubble3"></span>
        <span className="bubble bubble4"></span>
        <span className="bubble bubble5"></span>
      </div>

      <div className="content-wrapper">
        <h1 className="title">Welcome to Arena</h1>
        <p className="subtitle">Choose your role:</p>

        <div className="roles d-flex flex-column flex-md-row justify-content-center gap-4">
          <div
            className="role-card"
            onClick={() => handleChoice("contributor")}
          >
            <FaBuilding size={40} />
            <h3>Contributor</h3>
            <p>Submit your contributions</p>
          </div>

          <div className="role-card" onClick={() => handleChoice("client")}>
            <FaRegUser size={40} />
            <h3>Client</h3>
            <p>Explore your personal hub</p>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        html,
        body {
          height: 100%;
          margin: 0;
        }

        .choice-container {
          position: relative;
          min-height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f5f5f5;
          font-family: "Segoe UI", sans-serif;
          overflow: hidden;
        }

        .bubbles {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
          filter: blur(10px);
        }

        .bubble {
          position: absolute;
          border-radius: 50%;
          background: rgba(0, 123, 255, 0.15); /* bleu clair transparent */
        }

        .bubble1 {
          width: 100px;
          height: 100px;
          top: 10%;
          left: 15%;
        }
        .bubble2 {
          width: 150px;
          height: 150px;
          top: 30%;
          left: 70%;
        }
        .bubble3 {
          width: 80px;
          height: 80px;
          top: 60%;
          left: 40%;
        }
        .bubble4 {
          width: 120px;
          height: 120px;
          top: 75%;
          left: 20%;
        }
        .bubble5 {
          width: 90px;
          height: 90px;
          top: 50%;
          left: 85%;
        }

        .content-wrapper {
          position: relative;
          text-align: center;
          color: #333;
          padding: 20px;
          z-index: 1;
        }

        .title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #222;
        }

        .subtitle {
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }

        .role-card {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 15px;
          padding: 20px 15px;
          width: 180px;
          transition:
            transform 0.3s,
            background 0.3s;
          cursor: pointer;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
          color: #222;
        }

        .role-card:hover {
          transform: translateY(-10px);
          background: rgba(255, 255, 255, 0.9);
        }

        .role-card h3 {
          margin-top: 15px;
          margin-bottom: 10px;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .role-card p {
          font-size: 0.85rem;
        }

        @media (max-width: 768px) {
          .roles {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Choice;
