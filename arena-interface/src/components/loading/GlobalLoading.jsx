import React from "react";
import { useAppContext } from "../../context/AppContext";

const GlobalLoading = () => {
  const { isAppLoading, isDarkMode } = useAppContext();

  if (!isAppLoading) return null;

  return (
    <div className="global-loader-overlay">
      <style>{`
        .global-loader-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: ${isDarkMode ? "rgba(10, 15, 30, 0.85)" : "rgba(255, 255, 255, 0.8)"};
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 9999;
          display: flex;
          align-items: center; justify-content: center;
          animation: fadeIn 0.3s ease-out;
        }

        .loader-content {
          display: flex; flex-direction: column;
          align-items: center; gap: 30px;
        }

        .loader-logo {
          width: 80px; height: 80px;
          position: relative;
          display: flex; align-items: center; justify-content: center;
        }

        .loader-ring {
          position: absolute;
          width: 100%; height: 100%;
          border-radius: 24px;
          border: 4px solid var(--primary-color, #2563eb);
          opacity: 0.3;
          animation: ringPulse 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .loader-square {
          width: 40px; height: 40px;
          background: var(--primary-color, #2563eb);
          border-radius: 12px;
          box-shadow: 0 0 30px rgba(37, 99, 235, 0.4);
          animation: squareFlip 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .loader-text {
          font-weight: 800;
          font-size: 1.2rem;
          color: ${isDarkMode ? "#f1f5f9" : "#0f172a"};
          letter-spacing: 0.1em;
          text-transform: uppercase;
          animation: textFade 1.5s ease-in-out infinite alternate;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes ringPulse {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        @keyframes squareFlip {
          0% { transform: rotate(0) scale(1); }
          50% { transform: rotate(180deg) scale(0.85); border-radius: 50%; opacity: 0.8; }
          100% { transform: rotate(360deg) scale(1); }
        }

        @keyframes textFade {
          from { opacity: 0.4; transform: translateY(0); }
          to { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>
      
      <div className="loader-content">
        <div className="loader-logo">
          <div className="loader-ring"></div>
          <div className="loader-ring" style={{ animationDelay: "0.5s" }}></div>
          <div className="loader-square"></div>
        </div>
        <div className="loader-text">Arena</div>
      </div>
    </div>
  );
};

export default GlobalLoading;
