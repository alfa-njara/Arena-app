import React, { useState } from "react";
import { RiRocketLine, RiTeamLine, RiLayoutMasonryLine } from "react-icons/ri";
import { RiCompassLine } from "react-icons/ri";
import Logo from "../../assets/arena.png";
import AuthArena from "../../components/log_sign/AuthArena";
import {
  LuStore,
  LuBriefcase,
  LuMusic,
  LuGraduationCap,
  LuUtensils,
  LuHeartPulse,
  LuEllipsis,
} from "react-icons/lu";
import { BsGem } from "react-icons/bs";
import { useAppContext } from "../../context/AppContext";
import Globe from "react-globe.gl";
import * as THREE from "three";
import countriesData from "./world.json";
import { renderToStaticMarkup } from "react-dom/server";

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

  // ── DATA FOR 3D GLOBE (Arena Contribution Types - DENSE VERSION) ──
  const contributionHubs = [
    // Primary Hubs (with labels and icons)
    { name: "Shop", lat: 37.77, lng: -122.42, color: "#3b82f6", icon: <LuStore />, size: 0.3 },
    { name: "Professional", lat: 51.51, lng: -0.13, color: "#6366f1", icon: <LuBriefcase />, size: 0.25 },
    { name: "Events", lat: 48.86, lng: 2.35, color: "#8b5cf6", icon: <LuMusic />, size: 0.3 },
    { name: "Education", lat: 40.71, lng: -74.01, color: "#a855f7", icon: <LuGraduationCap />, size: 0.25 },
    { name: "Food", lat: 35.68, lng: 139.65, color: "#ec4899", icon: <LuUtensils />, size: 0.3 },
    { name: "Health", lat: 25.20, lng: 55.27, color: "#3b82f6", icon: <LuHeartPulse />, size: 0.25 },
    
    { name: "Market", lat: -33.87, lng: 151.21, color: "#3b82f6", size: 0.15, icon: <LuStore /> },
    { name: "Creative", lat: -23.55, lng: -46.63, color: "#8b5cf6", size: 0.15, icon: <LuBriefcase /> },
    { name: "Tech", lat: 1.35, lng: 103.82, color: "#60a5fa", size: 0.15, icon: <LuEllipsis /> },
    { name: "Retail", lat: 31.23, lng: 121.47, color: "#ec4899", size: 0.15 }, // Removed icon to de-clutter
    { name: "Startup", lat: 55.75, lng: 37.61, color: "#3b82f6", size: 0.15 }, // Removed icon to de-clutter
    { name: "Clinic", lat: -1.29, lng: 36.82, color: "#3b82f6", size: 0.15, icon: <LuHeartPulse /> },
    { name: "Studio", lat: 34.05, lng: -118.24, color: "#8b5cf6", size: 0.15 }, // Removed icon to de-clutter
    { name: "Gallery", lat: 19.43, lng: -99.13, color: "#a855f7", size: 0.15, icon: <LuEllipsis /> },
    { name: "Office", lat: 52.52, lng: 13.40, color: "#6366f1", size: 0.15 }, // Removed icon to de-clutter
    { name: "Store", lat: 39.9, lng: 116.4, color: "#ec4899", size: 0.15, icon: <LuStore /> },
    { name: "Gym", lat: -34.6, lng: -58.38, color: "#3b82f6", size: 0.15 }, // Removed icon to de-clutter
    { name: "Pub", lat: 53.34, lng: -6.26, color: "#ec4899", size: 0.15 }, // Removed icon to de-clutter
    { name: "Labs", lat: 42.36, lng: -71.05, color: "#6366f1", size: 0.15, icon: <LuBriefcase /> },
    { name: "Hub", lat: 22.31, lng: 114.16, color: "#8b5cf6", size: 0.15 }, // Removed icon to de-clutter
    { name: "Arena", lat: 6.52, lng: 3.37, color: "#3b82f6", size: 0.15, icon: <BsGem /> },
    { name: "Point", lat: 28.61, lng: 77.2, color: "#a855f7", size: 0.15 },
    { name: "Mall", lat: 3.13, lng: 101.68, color: "#3b82f6", size: 0.15 },
    { name: "Design", lat: 45.46, lng: 9.18, color: "#8b5cf6", size: 0.15 },
    { name: "Software", lat: 12.97, lng: 77.59, color: "#60a5fa", size: 0.15 },
    { name: "Hospital", lat: 30.04, lng: 31.23, color: "#ec4899", size: 0.15, icon: <LuHeartPulse /> },
    { name: "Center", lat: -26.2, lng: 28.04, color: "#3b82f6", size: 0.15 },
    { name: "Shop", lat: -18.76, lng: 46.86, color: "#ec4899", size: 0.2, icon: <BsGem /> }, // ADDED MADAGASCAR
    { name: "Spot", lat: -37.81, lng: 144.96, color: "#8b5cf6", size: 0.1 },
    { name: "Workshop", lat: 59.32, lng: 18.06, color: "#6366f1", size: 0.1 },
    { name: "Factory", lat: 34.69, lng: 135.5, color: "#ec4899", size: 0.1 },
    { name: "Agency", lat: 51.5, lng: -0.12, color: "#3b82f6", size: 0.15 },
    { name: "Boutique", lat: 41.9, lng: 12.49, color: "#8b5cf6", size: 0.1 },
    { name: "School", lat: -33.44, lng: -70.66, color: "#a855f7", size: 0.1 },
    { name: "Bank", lat: 1.28, lng: 103.85, color: "#6366f1", size: 0.1 },
    { name: "University", lat: 35.68, lng: 139.75, color: "#ec4899", size: 0.1 },
    { name: "Lab", lat: 37.33, lng: -121.88, color: "#3b82f6", size: 0.15 },
    { name: "Media", lat: 40.41, lng: -3.7, color: "#8b5cf6", size: 0.1 },
    { name: "Cinema", lat: 2.35, lng: 48.85, color: "#a855f7", size: 0.1 },
    // More points
    { name: "Tech", lat: 12.05, lng: -61.75, color: "#3b82f6", size: 0.1 },
    { name: "Hub", lat: 14.67, lng: -17.44, color: "#8b5cf6", size: 0.1 },
    { name: "Shop", lat: -4.32, lng: 15.32, color: "#ec4899", size: 0.1 },
    { name: "Store", lat: -1.28, lng: 36.82, color: "#3b82f6", size: 0.1 },
    { name: "Mall", lat: -25.75, lng: 28.19, color: "#6366f1", size: 0.1 },
    { name: "Point", lat: -33.92, lng: 18.42, color: "#a855f7", size: 0.1 },
    { name: "Clinic", lat: 22.57, lng: 88.36, color: "#3b82f6", size: 0.1 },
    { name: "Office", lat: 13.08, lng: 80.27, color: "#8b5cf6", size: 0.1 },
    { name: "Hub", lat: 23.13, lng: 113.26, color: "#ec4899", size: 0.1 },
    { name: "Store", lat: 22.39, lng: 114.1, color: "#3b82f6", size: 0.1 },
    { name: "Market", lat: 1.35, lng: 103.82, color: "#6366f1", size: 0.1 },
    { name: "Crafts", lat: -8.41, lng: 115.19, color: "#a855f7", size: 0.1 },
    { name: "Service", lat: 37.56, lng: 126.97, color: "#3b82f6", size: 0.1 },
    { name: "Trade", lat: 31.23, lng: 121.47, color: "#8b5cf6", size: 0.1 },
    { name: "Design", lat: 39.9, lng: 116.4, color: "#ec4899", size: 0.1 },
    { name: "Show", lat: 35.67, lng: 139.65, color: "#3b82f6", size: 0.1 },
    { name: "Arena", lat: 34.69, lng: 135.5, color: "#6366f1", size: 0.1 },
    { name: "Spot", lat: -37.81, lng: 144.96, color: "#a855f7", size: 0.1 },
    { name: "Market", lat: -36.84, lng: 174.76, color: "#3b82f6", size: 0.1 },
    { name: "Studio", lat: -41.28, lng: 174.77, color: "#8b5cf6", size: 0.1 },
    { name: "Agency", lat: 45.42, lng: -75.69, color: "#ec4899", size: 0.1 },
    { name: "Web", lat: 43.65, lng: -79.38, color: "#3b82f6", size: 0.1 },
    { name: "Art", lat: 49.28, lng: -123.12, color: "#6366f1", size: 0.1 },
    { name: "Dev", lat: 47.6, lng: -122.33, color: "#a855f7", size: 0.1 },
    { name: "Code", lat: 34.05, lng: -118.24, color: "#3b82f6", size: 0.1 },
    { name: "App", lat: 32.71, lng: -117.16, color: "#8b5cf6", size: 0.1 },
    { name: "Store", lat: 25.76, lng: -80.19, color: "#ec4899", size: 0.1 },
    { name: "Shop", lat: 29.76, lng: -95.36, color: "#3b82f6", size: 0.1 },
    { name: "Clinic", lat: 33.74, lng: -84.38, color: "#6366f1", size: 0.1 },
    { name: "Office", lat: 39.73, lng: -104.99, color: "#a855f7", size: 0.1 },
    { name: "Point", lat: 40.71, lng: -74, color: "#3b82f6", size: 0.1 },
  ];

  const connections = [
    { startLat: 37.77, startLng: -122.42, endLat: 48.86, endLng: 2.35, color: ["#3b82f6", "#8b5cf6"] },
    { startLat: 40.71, startLng: -74.01, endLat: 35.68, endLng: 139.65, color: ["#6366f1", "#ec4899"] },
    { startLat: 25.2, startLng: 55.27, endLat: -33.87, endLng: 151.21, color: ["#8b5cf6", "#3b82f6"] },
    { startLat: -33.87, startLng: 151.21, endLat: 37.77, startLng: -122.42, color: ["#3b82f6", "#3b82f6"] },
    { startLat: 1.35, startLng: 103.82, endLat: 31.23, endLng: 121.47, color: ["#60a5fa", "#ec4899"] },
    { startLat: 52.52, startLng: 13.4, endLat: 55.75, endLng: 37.61, color: ["#6366f1", "#3b82f6"] },
    { startLat: -23.55, startLng: -46.63, endLat: 19.43, endLng: -99.13, color: ["#8b5cf6", "#a855f7"] },
    { startLat: 3.13, startLng: 101.68, endLat: 12.97, endLng: 77.59, color: ["#3b82f6", "#60a5fa"] },
    { startLat: 30.04, startLng: 31.23, endLat: -26.2, startLng: 28.04, color: ["#ec4899", "#3b82f6"] },
    { startLat: 59.32, startLng: 18.06, endLat: 41.9, endLng: 12.49, color: ["#6366f1", "#8b5cf6"] },
    { startLat: -33.44, startLng: -70.66, endLat: -34.6, startLng: -58.38, color: ["#a855f7", "#3b82f6"] },
    { startLat: 34.69, startLng: 135.5, endLat: 22.31, endLng: 114.16, color: ["#ec4899", "#8b5cf6"] },
    { startLat: 45.46, startLng: 9.18, endLat: 51.5, startLng: -0.12, color: ["#8b5cf6", "#3b82f6"] },
    { startLat: 37.33, startLng: -121.88, endLat: 40.41, startLng: -3.7, color: ["#3b82f6", "#8b5cf6"] },
    { startLat: -18.76, startLng: 46.86, endLat: 25.2, endLng: 55.27, color: ["#ec4899", "#3b82f6"] }, // Madagascar to Dubai
    // More connections for density
    { startLat: 14.67, startLng: -17.44, endLat: 6.52, endLng: 3.37, color: ["#8b5cf6", "#3b82f6"] },
    { startLat: -4.32, startLng: 15.32, endLat: -1.28, startLng: 36.82, color: ["#ec4899", "#3b82f6"] },
    { startLat: 37.56, startLng: 126.97, endLat: 35.67, endLng: 139.65, color: ["#3b82f6", "#3b82f6"] },
    { startLat: 43.65, startLng: -79.38, endLat: 49.28, endLng: -123.12, color: ["#3b82f6", "#6366f1"] },
  ];

  return (
    <div className="landing-wrapper">
      {/* Background Blobs (Original Style) */}
      <div className="bg-decorations">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo-container" onClick={() => setShowAuth(false)}>
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
                <div className="hero-globe-container">
                  <Globe
                    width={750}
                    height={750}
                    backgroundColor="rgba(0,0,0,0)"
                    
                    // Stylized Globe Appearance
                    showGlobe={true}
                    showAtmosphere={true}
                    atmosphereColor="#3b82f6"
                    atmosphereAltitude={0.15}
                    
                    globeMaterial={new THREE.MeshPhongMaterial({
                        color: "#3b82f6",
                        transparent: true,
                        opacity: 0.15,
                        emissive: "#6366f1",
                        emissiveIntensity: 0.5
                    })}
                    
                    hexPolygonsData={countriesData.features}
                    hexPolygonResolution={3}
                    hexPolygonMargin={0.3}
                    hexPolygonColor={() => `rgba(168, 85, 247, ${Math.random() * 0.5 + 0.3})`} // Vibrant Purple (Arena)
                    
                    // HTML Elements for Cyber Labels
                    htmlElementsData={contributionHubs.filter(h => h.icon)} // Only Show icons for primary hubs
                    htmlElement={(d) => {
                        const el = document.createElement('div');
                        el.innerHTML = renderToStaticMarkup(
                            <div className="cyber-label-wrapper">
                                <div className="cyber-label-icon" style={{ borderColor: d.color, color: '#0f172a', background: 'white' }}>
                                    {React.cloneElement(d.icon, { color: '#0f172a' })}
                                </div>
                                <div className="cyber-label-text" style={{ background: d.color }}>
                                    {d.name}
                                </div>
                                <div className="cyber-label-line" style={{ background: `linear-gradient(to top, ${d.color}, transparent)` }}></div>
                            </div>
                        );
                        return el;
                    }}
                    htmlAltitude={0.06}

                    // Dense points for "Many" effect
                    pointsData={contributionHubs}
                    pointColor="color"
                    pointRadius="size"
                    pointAltitude={0.02}
                    pointsMerge={false}

                    // Arcs (Connections)
                    arcsData={connections}
                    arcColor="color"
                    arcDashLength={0.6}
                    arcDashGap={1}
                    arcDashAnimateTime={2500}
                    arcStroke={0.8}
                    
                    enablePointerInteraction={true}
                    animateIn={true}
                    
                    onGlobeReady={(globe) => {
                      globe.controls().autoRotate = true;
                      globe.controls().autoRotateSpeed = 1.0;
                      globe.controls().enableZoom = true;
                      globe.controls().enableDamping = true; 
                      globe.controls().dampingFactor = 0.05;
                      
                      const light = new THREE.PointLight(0xffffff, 2);
                      light.position.set(10, 10, 10);
                      globe.scene().add(light);
                    }}
                  />
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
        .blob-1 { width: 50vw; height: 50vw; background: #3b82f6; top: -10%; right: -5%; }
        .blob-2 { width: 40vw; height: 40vw; background: #8b5cf6; bottom: -10%; left: -5%; }

        @keyframes blobPulse {
          from { transform: scale(1); }
          to { transform: scale(1.1) translate(-20px, 20px); }
        }

        .navbar {
          position: fixed;
          top: 30px; /* Slightly more offset */
          left: 5%;
          width: 90%;
          height: 80px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
          z-index: 1000;
          background: transparent;
          backdrop-filter: none;
          border: none;
          box-shadow: none;
        }
        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .logo-container:active {
          transform: scale(0.95);
        }
        .logo-text {
          font-size: 1.8rem;
          font-weight: 900;
          letter-spacing: -1px;
          color: #0f172a;
        }

        .nav-links {
          display: flex;
          gap: 24px;
          align-items: center;
        }

        .login-link-btn {
          background: none;
          border: 1px solid #475569;
          padding: 10px;
          border-radius: 12px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: 0.2s;
          width: 160px; /* Fixed width */
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          white-space: nowrap;
        }
        .login-link-btn:hover {
          color: #2563eb;
          border-color: #2563eb;
        }
        .signup-nav-btn {
          background: #0f172a;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.15);
          width: 160px; /* Fixed width */
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          white-space: nowrap;
        }

        .main-content {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 150px 10% 120px; /* Increased top padding for fixed nav */
          z-index: 10;
        }
        .split-layout {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr; /* Better balance for large globe */
          align-items: center;
          gap: 40px;
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

        /* --- NEW 3D GLOBE STYLES --- */
        .hero-visual-side {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          min-height: 750px; /* Forces stable layout even when globe is gone */
        }
        .visual-container {
          width: 100%;
          min-height: 750px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hero-globe-container {
          position: relative;
          width: 750px;
          height: 750px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: grab;
        }
        .hero-globe-container:active { cursor: grabbing; }

        /* CYBER LABELS */
        .cyber-label-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          cursor: pointer;
          filter: drop-shadow(0 0 10px rgba(0,0,0,0.5));
          pointer-events: auto !important;
        }

        .cyber-label-icon {
          width: 32px;
          height: 32px;
          background: white;
          border: 2px solid;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          animation: cyberBlink 2s infinite alternate;
        }

        .cyber-label-text {
          margin-top: 6px;
          padding: 2px 8px;
          border-radius: 4px;
          color: white;
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        .cyber-label-line {
          width: 2px;
          height: 20px;
          margin-top: 2px;
        }

        @keyframes cyberBlink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
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

          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .feature-card:hover {
          background: white;
          border-color: #e2e8f0;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
          transform: translateY(-12px);
        }

        .feature-icon {
          font-size: 2.8rem;
          color: #2563eb;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }

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
          max-width: 280px;
        }

        .footer {
          padding: 60px 0;
          background: #ffffff;
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
