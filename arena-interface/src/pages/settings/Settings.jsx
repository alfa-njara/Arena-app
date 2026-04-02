import React, { useState } from "react";
import { BsGlobe, BsShieldLock, BsEye, BsEyeSlash } from "react-icons/bs";
import { useAppContext } from "../../context/AppContext";
import api from "../../api";
import toast from "react-hot-toast";

const Settings = () => {
  const { 
    isDarkMode, 
    toggleTheme,
    textSize, 
    setTextSize,
    language,
    setLanguage
  } = useAppContext();
  // Adjust this value to match your exact Navbar height (e.g., 60px or 80px)
  const navbarHeight = "70px";

  // Password change state
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });

  const toggleVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const submitPasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    
    try {
      await api.post("/change-password/", {
        old_password: passwordData.oldPassword,
        new_password: passwordData.newPassword
      });
      toast.success("Password changed successfully!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.old_password?.[0] || "Failed to change password.");
    }
  };

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
        
        .preference-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid var(--border-color);
        }
        
        .preference-row:last-child {
          border-bottom: none;
        }

        .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }

        .switch input { 
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--card-border);
          transition: .4s;
          border-radius: 34px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #2563eb;
        }

        input:checked + .slider:before {
          transform: translateX(20px);
        }
      `}</style>

      <div className="settings-wrapper">
        <div className="container-fluid h-100 p-0">
          <div className="row h-100 g-3 justify-content-center align-items-center">
            {/* CENTERED: Preferences Card */}
            <div className="col-lg-5 col-md-8 col-sm-10" style={{ maxHeight: '100%', overflowY: 'auto', paddingBottom: '20px' }}>
              <div className="pub-glass-card shadow-sm h-auto pb-4 mb-4">
                <div className="d-flex align-items-center gap-2 mb-4 pb-3 border-bottom border-light border-opacity-10">
                  <div className="p-2 rounded-3 bg-info bg-opacity-10 text-info">
                    <BsGlobe size={24} />
                  </div>
                  <h4 className="mb-0 fw-bold">Preferences</h4>
                </div>
                <div className="px-2">
                  
                  <div className="preference-row py-3">
                    <span className="label-style mb-0" style={{ fontSize: "1rem" }}>Theme (Dark Mode)</span>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={isDarkMode} 
                        onChange={toggleTheme} 
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  
                  <div className="preference-row py-3">
                    <span className="label-style mb-0" style={{ fontSize: "1rem" }}>Text Size</span>
                    <select 
                      className="form-select custom-input border-0 w-auto text-end"
                      value={textSize}
                      onChange={(e) => setTextSize(e.target.value)}
                      style={{ minWidth: "120px" }}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  <div className="preference-row py-3 border-bottom-0">
                    <span className="label-style mb-0" style={{ fontSize: "1rem" }}>Language</span>
                    <select 
                      className="form-select custom-input border-0 w-auto text-end"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      style={{ minWidth: "140px" }}
                    >
                      <option value="fr">Français (FR)</option>
                      <option value="en">English (US)</option>
                      <option value="mg">Malagasy (MG)</option>
                    </select>
                  </div>

                </div>
              </div>

              {/* Password Change Card */}
              <div className="pub-glass-card shadow-sm h-auto pb-4">
                <div className="d-flex align-items-center gap-2 mb-4 pb-3 border-bottom border-light border-opacity-10">
                  <div className="p-2 rounded-3 bg-danger bg-opacity-10 text-danger">
                    <BsShieldLock size={24} />
                  </div>
                  <h4 className="mb-0 fw-bold">Security</h4>
                </div>
                <div className="px-2">
                  <div className="mb-3 position-relative">
                    <label className="label-style">Old Password</label>
                    <div className="position-relative">
                      <input 
                        type={showPassword.old ? "text" : "password"} 
                        name="oldPassword" 
                        className="form-control custom-input w-100 pe-5" 
                        value={passwordData.oldPassword}
                        onChange={handlePasswordChange}
                      />
                      <button 
                        type="button"
                        className="btn position-absolute end-0 top-50 translate-middle-y border-0 text-muted"
                        onClick={() => toggleVisibility('old')}
                      >
                        {showPassword.old ? <BsEyeSlash /> : <BsEye />}
                      </button>
                    </div>
                  </div>
                  <div className="mb-3 position-relative">
                    <label className="label-style">New Password</label>
                    <div className="position-relative">
                      <input 
                        type={showPassword.new ? "text" : "password"} 
                        name="newPassword" 
                        className="form-control custom-input w-100 pe-5" 
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                      />
                      <button 
                        type="button"
                        className="btn position-absolute end-0 top-50 translate-middle-y border-0 text-muted"
                        onClick={() => toggleVisibility('new')}
                      >
                        {showPassword.new ? <BsEyeSlash /> : <BsEye />}
                      </button>
                    </div>
                  </div>
                  <div className="mb-4 position-relative">
                    <label className="label-style">Confirm Password</label>
                    <div className="position-relative">
                      <input 
                        type={showPassword.confirm ? "text" : "password"} 
                        name="confirmPassword" 
                        className="form-control custom-input w-100 pe-5" 
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                      <button 
                        type="button"
                        className="btn position-absolute end-0 top-50 translate-middle-y border-0 text-muted"
                        onClick={() => toggleVisibility('confirm')}
                      >
                        {showPassword.confirm ? <BsEyeSlash /> : <BsEye />}
                      </button>
                    </div>
                  </div>
                  <button 
                    className="btn btn-dark w-100 rounded-3 text-white fw-bold py-2 shadow-sm border-0"
                    style={{ backgroundColor: "#000", color: "#fff" }}
                    onClick={submitPasswordChange}
                    disabled={!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  >
                    Update Password
                  </button>
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
