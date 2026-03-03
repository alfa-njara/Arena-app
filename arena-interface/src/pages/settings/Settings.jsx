import React from "react";
import {
  BsPerson,
  BsShieldLock,
  BsCamera,
  BsTelephone,
  BsGlobe,
} from "react-icons/bs";

const Settings = ({ isDarkMode }) => {
  // Adjust this value to match your exact Navbar height (e.g., 60px or 80px)
  const navbarHeight = "70px";

  return (
    <>
      <style>{`
        .settings-wrapper {
          --card-bg: ${isDarkMode ? "rgba(35, 35, 35, 0.9)" : "rgba(255, 255, 255, 0.8)"};
          --card-border: ${isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"};
          --text-main: ${isDarkMode ? "#ffffff" : "#1a1a1a"};
          --text-muted: ${isDarkMode ? "#a0a0a0" : "#6c757d"};
          --input-bg: ${isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)"};
          
          width: 100%;
          /* Subtract navbar height to prevent page scrolling */
          height: calc(100vh - ${navbarHeight}); 
          overflow: hidden; 
          color: var(--text-main);
          padding: 20px;
          display: flex;
        }

        .pub-glass-card {
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--card-border);
          border-radius: 15px;
          padding: 20px;
          transition: none !important;
          height: 100%;
        }

        /* Strict No-Hover Policy */
        .pub-glass-card:hover {
          transform: none !important;
          box-shadow: none !important;
          background: var(--card-bg) !important;
        }

        .custom-input {
          background-color: var(--input-bg) !important;
          border: 1px solid var(--card-border) !important;
          border-radius: 10px !important;
          color: var(--text-main) !important;
          font-size: 0.85rem;
          padding: 10px 12px;
        }

        .minimal-visit-btn {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-main) !important;
          background: var(--input-bg);
          padding: 8px 20px;
          border-radius: 8px;
          border: 1px solid var(--card-border);
          cursor: pointer;
        }

        .minimal-visit-btn:hover {
          background: #0d6efd !important;
          color: #fff !important;
        }

        .avatar-img {
          width: 60px;
          height: 60px;
          border-radius: 10px;
          object-fit: cover;
        }

        .label-style { 
          font-size: 0.8rem; 
          font-weight: 600; 
          margin-bottom: 5px; 
          display: block;
          opacity: 0.8; 
        }

        .x-small { font-size: 0.75rem; }
      `}</style>

      <div className="settings-wrapper">
        <div className="container-fluid h-100 p-0">
          <div className="row h-100 g-3">
            {/* LEFT SIDE: Profile (Occupies more space) */}
            <div className="col-lg-8 h-100">
              <div className="pub-glass-card shadow-sm">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                    <BsPerson size={20} />
                  </div>
                  <h5 className="mb-0 fw-bold">Account Settings</h5>
                </div>

                <div className="d-flex align-items-center gap-3 mb-4 pb-4 border-bottom border-light border-opacity-10">
                  <div className="position-relative">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                      alt="profile"
                      className="avatar-img shadow-sm"
                    />
                    <button
                      className="btn btn-primary position-absolute bottom-0 end-0 rounded-circle p-0 border-2 border-white d-flex align-items-center justify-content-center"
                      style={{ width: "20px", height: "20px" }}
                    >
                      <BsCamera size={10} />
                    </button>
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold x-small">Profile Picture</h6>
                    <p className="text-muted x-small mb-0">Identity image</p>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12">
                    <label className="label-style">Full Name</label>
                    <input
                      type="text"
                      className="form-control custom-input"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="col-12">
                    <label className="label-style">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-0 opacity-50 pe-2">
                        <BsTelephone size={14} />
                      </span>
                      <input
                        type="tel"
                        className="form-control custom-input"
                        placeholder="+261 34 00 000 00"
                      />
                    </div>
                  </div>
                  <div className="col-12 mt-4">
                    <button className="minimal-visit-btn w-100">
                      Save All Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Security & Regional (Stacked) */}
            <div className="col-lg-4 h-100 d-flex flex-column gap-3">
              {/* Security Card */}
              <div className="pub-glass-card shadow-sm flex-fill">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="p-2 rounded-3 bg-warning bg-opacity-10 text-warning">
                    <BsShieldLock size={18} />
                  </div>
                  <h6 className="mb-0 fw-bold">Security</h6>
                </div>
                <div className="p-2">
                  <p className="mb-1 fw-bold x-small">Password</p>
                  <p className="mb-3 x-small text-muted">
                    Last changed: 2 months ago
                  </p>
                  <button className="minimal-visit-btn w-100">Change</button>
                </div>
              </div>

              {/* Regional Card */}
              <div className="pub-glass-card shadow-sm flex-fill">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="p-2 rounded-3 bg-info bg-opacity-10 text-info">
                    <BsGlobe size={18} />
                  </div>
                  <h6 className="mb-0 fw-bold">Regional</h6>
                </div>
                <div>
                  <label className="label-style">Language</label>
                  <select className="form-select custom-input border-0">
                    <option>English (US)</option>
                    <option>Français (FR)</option>
                    <option>Malagasy (MG)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
