import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api";

const AuthArena = ({ initialIsLogin = true }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [signupType, setSignupType] = useState("user");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    companyName: "",
    number: "",
    type: "",
    link: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      if (isLogin) {
        // Implement login
        const endpoint = signupType === "user" ? "/customers/login/" : "/companies/login/";
        const body = {
          phone_number: form.number.replace(/\s+/g, ""),
          password: form.password,
        };

        const res = await api.post(endpoint, body);
        const { access, refresh, full_name, name } = res.data;
        
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        localStorage.setItem("user_type", signupType);

        if (signupType === "contributor") {
           // Save mock basic data for profile if loggin in as company
           localStorage.setItem("contributorData", JSON.stringify({ companyName: name || "Company", phone: form.number }));
           navigate("/contributor/dashboard");
        } else {
           navigate("/home");
        }
      } else {
        const endpoint = signupType === "user" ? "/customers/" : "/companies/";
        const body =
          signupType === "user"
            ? {
                full_name: form.name,
                phone_number: form.number,
                password: form.password,
              }
            : {
                name: form.companyName,
                phone_number: form.number,
                contribution_type: form.type || "other",
                website: form.link,
                password: form.password,
              };

        const res = await api.post(endpoint, body);

        if (res.status === 201) {
          toast.success("Account created! You can now log in.");
          setIsLogin(true); // Switch to login pane
        }
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data ? JSON.stringify(error.response.data) : "Server error";
      toast.error("Error: " + msg);
    }
  };

  const EyeIcon = () => (
    <svg
      onClick={() => setShowPassword(!showPassword)}
      className="auth-eye-icon"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );

  return (
    <div className="auth-arena-card">
      <div className="auth-arena-switcher">
        <div
          className={`switcher-indicator ${isLogin ? "at-left" : "at-right"}`}
        ></div>
        <button
          className={isLogin ? "active" : ""}
          onClick={() => setIsLogin(true)}
        >
          Sign In
        </button>
        <button
          className={!isLogin ? "active" : ""}
          onClick={() => setIsLogin(false)}
        >
          Sign Up
        </button>
      </div>

      <div className="auth-arena-viewport">
        <div
          className={`auth-arena-slider ${
            isLogin ? "slide-login" : "slide-signup"
          }`}
        >
          {/* LOGIN */}
          <div className="auth-pane">
            <h2 className="auth-pane-title">Welcome Back</h2>
            
            <div className="auth-type-selector">
              <button
                type="button"
                className={signupType === "user" ? "active" : ""}
                onClick={() => setSignupType("user")}
              >
                Individual
              </button>
              <button
                type="button"
                className={signupType === "contributor" ? "active" : ""}
                onClick={() => setSignupType("contributor")}
              >
                Business
              </button>
            </div>

            <form onSubmit={handleSubmit} className="auth-form-stack">
              <input
                type="tel"
                name="number"
                placeholder="Phone Number"
                onChange={handleChange}
                required
              />
              <div className="auth-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                />
                <EyeIcon />
              </div>
              <button type="submit" className="auth-main-btn">
                Sign In
              </button>
            </form>
          </div>

          {/* SIGNUP */}
          <div className="auth-pane">
            <div className="auth-type-selector">
              <button
                type="button"
                className={signupType === "user" ? "active" : ""}
                onClick={() => setSignupType("user")}
              >
                Individual
              </button>
              <button
                type="button"
                className={signupType === "contributor" ? "active" : ""}
                onClick={() => setSignupType("contributor")}
              >
                Business
              </button>
            </div>

            <form onSubmit={handleSubmit} className="auth-form-stack">
              {signupType === "user" ? (
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  required
                />
              ) : (
                <>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name"
                    onChange={handleChange}
                    required
                  />
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Contribution Type</option>
                    <option value="shop">Shop</option>
                    <option value="service">Professional Service</option>
                    <option value="entertainment">
                      Entertainment & Events
                    </option>
                    <option value="education">Education / Training</option>
                    <option value="restauration">Restaurant / Food</option>
                    <option value="art-culture">Art & Culture</option>
                    <option value="health">Health & Wellness</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    type="text"
                    name="link"
                    placeholder="Website or Social Link"
                    onChange={handleChange}
                  />
                </>
              )}

              <input
                type="tel"
                name="number"
                placeholder="Phone Number"
                onChange={handleChange}
                required
              />

              <div className="auth-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                />
                <EyeIcon />
              </div>

              {!isLogin && (
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  required
                />
              )}

              <button type="submit" className="auth-main-btn">
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .auth-arena-card {
          width: 100%;
          max-width: 440px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 28px;
          padding: 30px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
          z-index: 100;
        }
        .auth-arena-switcher {
          position: relative;
          display: flex;
          background: rgba(0, 0, 0, 0.04);
          border-radius: 14px;
          padding: 4px;
          margin-bottom: 25px;
        }
        .switcher-indicator {
          position: absolute;
          top: 4px;
          bottom: 4px;
          width: calc(50% - 4px);
          background: white;
          border-radius: 10px;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
        }
        .at-left {
          transform: translateX(0);
        }
        .at-right {
          transform: translateX(100%);
        }
        .auth-arena-switcher button {
          flex: 1;
          border: none;
          background: none;
          padding: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          color: #64748b;
          cursor: pointer;
          z-index: 1;
        }
        .auth-arena-switcher button.active {
          color: #2563eb;
        }
        .auth-arena-viewport {
          overflow: hidden;
        }
        .auth-arena-slider {
          display: flex;
          width: 200%;
          transition: transform 0.5s ease;
        }
        .slide-login {
          transform: translateX(0%);
        }
        .slide-signup {
          transform: translateX(-50%);
        }
        .auth-pane {
          width: 50%;
          padding: 0 8px;
          box-sizing: border-box;
        }
        .auth-pane-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 20px;
          text-align: center;
          color: #0f172a;
        }
        .auth-type-selector {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          justify-content: center;
        }
        .auth-type-selector button {
          background: none;
          border: none;
          padding: 4px 10px;
          cursor: pointer;
          font-weight: 600;
          color: #94a3b8;
          font-size: 0.85rem;
          border-bottom: 2px solid transparent;
        }
        .auth-type-selector button.active {
          color: #0f172a;
          border-bottom-color: #2563eb;
        }
        .auth-form-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        input,
        select {
          padding: 13px 18px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: white;
          font-size: 0.95rem;
          color: #1e293b;
          width: 100%;
          box-sizing: border-box;
        }
        .auth-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .auth-eye-icon {
          position: absolute;
          right: 15px;
          width: 20px;
          color: #94a3b8;
          cursor: pointer;
        }
        .auth-main-btn {
          margin-top: 10px;
          padding: 16px;
          border-radius: 14px;
          border: none;
          background: #0f172a;
          color: white;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: 0.2s;
        }
        .auth-main-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default AuthArena;
