import React, { useState } from "react";
import { RiRocketLine, RiTeamLine, RiLayoutMasonryLine } from "react-icons/ri";
import { RiCompassLine } from "react-icons/ri";
import Logo from "../../assets/arena.png";
import AuthArena from "../../components/log_sign/AuthArena";

const LandingPage = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [initialMode, setInitialMode] = useState("login");

  const handleOpenAuth = (mode) => {
    setInitialMode(mode);
    setShowAuth(true);
  };

  const handleExplore = () => {
    const section = document.getElementById("explore-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="landing-wrapper">
      {/* Background Blobs */}
      <div className="bg-decorations">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo-container">
          <img src={Logo} alt="Arena Logo" />
          <div className="logo-text">ARENA</div>
        </div>

        <div className="nav-links">
          <button
            className="login-link-btn"
            onClick={() => handleOpenAuth("login")}
          >
            Sign In
          </button>
          <button
            className="signup-nav-btn"
            onClick={() => handleOpenAuth("signup")}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* MAIN HERO */}
      <main className="main-content">
        <div className="split-layout">
          {/* TEXT SIDE */}
          <section className="hero-text-side">
            <div className="badge-promo">Coming Soon v1.0</div>
            <h1 className="hero-title">
              Elevate Your <span className="gradient-text">Business</span>{" "}
              <br />
              to the Next Level
            </h1>
            <p className="hero-subtitle">
              The all-in-one ecosystem for professionals. Showcase your talent,
              collaborate with experts, and grow your digital presence.
            </p>
            <div className="hero-cta">
              <button
                className="main-cta"
                onClick={() => handleOpenAuth("signup")}
              >
                Join the Arena
              </button>
              <button className="secondary-cta" onClick={handleExplore}>
                Learn More
              </button>
            </div>
          </section>

          {/* VISUAL SIDE - 3D ANIMATION INTEGRATED HERE */}
          <section className="hero-visual-side">
            <div
              className={`visual-container ${showAuth ? "auth-active" : ""}`}
            >
              {showAuth ? (
                <div className="auth-card-entrance">
                  <AuthArena defaultIsLogin={initialMode === "login"} />
                </div>
              ) : (
                <div className="hero-illustration">
                  <div className="scene-3d">
                    <div className="circle-main">
                      <RiRocketLine className="floating-icon" />
                    </div>
                    <div className="orbit-3d orbit-x"></div>
                    <div className="orbit-3d orbit-y"></div>
                    <div className="orbit-3d orbit-z"></div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* EXPLORE SECTION */}
      <section id="explore-section" className="explore-section">
        <div className="section-header">
          <h2 className="section-title">Why Arena?</h2>
          <p className="section-desc">
            Discover tools built for modern growth.
          </p>
        </div>

        <div className="explore-grid">
          {[
            {
              title: "Project Showcase",
              desc: "Create an Arena to present your website, app, shop or any digital project.",
              icon: <RiLayoutMasonryLine />,
            },
            {
              title: "Collaboration",
              desc: "Discover other Arenas and collaborate with creators and developers.",
              icon: <RiTeamLine />,
            },
            {
              title: "Arena Discovery",
              desc: "Explore Arenas from different fields: apps, websites, stores and more.",
              icon: <RiCompassLine />,
            },
          ].map((item, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 ARENA. Empowering professional growth.</p>
      </footer>

      <style jsx="true">{`
        .landing-wrapper {
          width: 100%;
          min-height: 100vh;
          background: #fcfcfd;
          display: flex;
          flex-direction: column;
          font-family: "Inter", sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        .bg-decorations {
          position: fixed;
          inset: 0;
          z-index: 0;
        }
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          animation: blobPulse 8s infinite alternate;
        }
        .blob-1 {
          width: 50vw;
          height: 50vw;
          background: #3b82f6;
          top: -10%;
          right: -5%;
        }
        .blob-2 {
          width: 40vw;
          height: 40vw;
          background: #8b5cf6;
          bottom: -10%;
          left: -5%;
        }

        @keyframes blobPulse {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.1) translate(-20px, 20px);
          }
        }

        .navbar {
          height: 90px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 10%;
          z-index: 100;
          backdrop-filter: blur(10px);
        }
        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo-container img {
          height: 75px;
        }
        .logo-text {
          font-size: 1.8rem;
          font-weight: 900;
          letter-spacing: -1px;
          color: #0f172a;
        }

        .nav-links {
          display: flex;
          gap: 30px;
          align-items: center;
        }
        .login-link-btn {
          background: none;
          border: 1px solid #475569;
          padding: 8px 20px;
          border-radius: 8px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: 0.2s;
        }
        .login-link-btn:hover {
          color: #2563eb;
          border-color: #2563eb;
        }
        .signup-nav-btn {
          background: #0f172a;
          color: white;
          border: none;
          padding: 12px 28px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.15);
        }

        .main-content {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 200px 10%;
          z-index: 10;
        }
        .split-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          width: 100%;
        }

        .badge-promo {
          display: inline-block;
          background: #dbeafe;
          color: #2563eb;
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .hero-title {
          font-size: clamp(2.8rem, 5vw, 4.5rem);
          font-weight: 900;
          line-height: 1.1;
          color: #0f172a;
          margin-bottom: 30px;
        }
        .gradient-text {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 1.25rem;
          color: #475569;
          max-width: 520px;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .hero-cta {
          display: flex;
          gap: 20px;
        }
        .main-cta {
          background: #2563eb;
          color: white;
          border: none;
          padding: 20px 40px;
          border-radius: 18px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          box-shadow: 0 20px 40px rgba(37, 99, 235, 0.25);
          transition: 0.3s ease;
        }
        .main-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 25px 50px rgba(37, 99, 235, 0.35);
        }
        .secondary-cta {
          background: white;
          border: 1px solid #e2e8f0;
          padding: 20px 40px;
          border-radius: 18px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: 0.3s;
        }
        .secondary-cta:hover {
          background: #f8fafc;
        }

        /* --- NEW 3D ANIMATION STYLES --- */
        .hero-visual-side {
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
        .visual-container {
          width: 100%;
          max-width: 550px;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hero-illustration {
          height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1200px;
        }

        .scene-3d {
          position: relative;
          width: 300px;
          height: 300px;
          transform-style: preserve-3d;
          animation: sceneRotate 20s infinite linear;
        }

        .circle-main {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 140px;
          height: 140px;
          margin: -70px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          box-shadow: 0 0 50px rgba(59, 130, 246, 0.5);
          transform-style: preserve-3d;
          animation: corePulse 4s infinite ease-in-out;
        }

        .floating-icon {
          font-size: 3.5rem;
          color: white;
          transform: translateZ(30px);
          filter: drop-shadow(0 10px 10px rgba(0, 0, 0, 0.2));
        }

        .orbit-3d {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 2px solid rgba(59, 130, 246, 0.2);
          border-radius: 50%;
          transform-style: preserve-3d;
        }

        .orbit-x {
          transform: rotateX(70deg);
          animation: orbitRotate 8s infinite linear;
          border-top: 3px solid #3b82f6;
        }
        .orbit-y {
          transform: rotateY(70deg);
          animation: orbitRotate 12s infinite linear reverse;
          border-right: 3px solid #8b5cf6;
        }
        .orbit-z {
          transform: rotateZ(45deg) rotateX(70deg);
          animation: orbitRotate 15s infinite linear;
          border-bottom: 3px solid #6366f1;
        }

        @keyframes corePulse {
          0%,
          100% {
            transform: scale(1) translateZ(0);
            box-shadow: 0 0 50px rgba(59, 130, 246, 0.5);
          }
          50% {
            transform: scale(1.1) translateZ(50px);
            box-shadow: 0 0 80px rgba(139, 92, 246, 0.7);
          }
        }

        @keyframes orbitRotate {
          from {
            transform: inherit rotate(0deg);
          }
          to {
            transform: inherit rotate(360deg);
          }
        }

        @keyframes sceneRotate {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(360deg);
          }
        }

        /* ------------------------------- */

        .auth-card-entrance {
          animation: cardSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes cardSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .explore-section {
          padding: 150px 10%;
          background: #ffffff;
          position: relative;
          z-index: 10;
          border-top: 1px solid #f1f5f9;
        }
        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }
        .section-title {
          font-size: 3rem;
          font-weight: 900;
          color: #0f172a;
        }
        .section-desc {
          font-size: 1.2rem;
          color: #64748b;
        }

        .explore-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 30px;
        }
        .feature-card {
          background: #f8fafc;
          padding: 40px;
          border-radius: 24px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 1px solid transparent;

          /* Centrage du contenu */
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .feature-card:hover {
          background: white;
          border-color: #e2e8f0;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
          transform: translateY(
            -12px
          ); /* Légèrement plus accentué pour le style */
        }

        .feature-icon {
          font-size: 2.8rem; /* Un peu plus grand pour l'impact */
          color: #2563eb;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }

        /* Petit effet bonus : l'icône bouge aussi au hover */
        .feature-card:hover .feature-icon {
          transform: scale(1.1);
        }

        .feature-card h3 {
          font-size: 1.4rem;
          font-weight: 800;
          margin-bottom: 15px;
          color: #0f172a;
        }

        .feature-card p {
          color: #64748b;
          line-height: 1.6;
          max-width: 280px; /* Évite que le texte soit trop large une fois centré */
        }

        .footer {
          padding: 60px 0;
          border-top: 1px solid #f1f5f9;
          text-align: center;
          color: #94a3b8;
        }

        @media (max-width: 1100px) {
          .split-layout {
            grid-template-columns: 1fr;
            gap: 80px;
            text-align: center;
          }
          .hero-text-side {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-visual-side {
            justify-content: center;
          }
          .hero-subtitle {
            max-width: 600px;
          }
          .hero-illustration {
            height: 350px;
          }
          .scene-3d {
            width: 200px;
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
