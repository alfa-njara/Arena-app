import React, { useState } from "react";
import api from "../../api";
import toast from "react-hot-toast";

const CompleteProfileModal = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    logo_url: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch("/companies/me/", formData);
      toast.success("Profile updated successfully!");
      onComplete();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Complete Your Profile</h2>
        <p>Welcome to Arena! Please provide a logo URL and a description for your company to continue.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Logo URL</label>
            <input
              type="url"
              placeholder="https://example.com/logo.png"
              value={formData.logo_url}
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Company Description</label>
            <textarea
              placeholder="Tell us about your company..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows="4"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save and Continue"}
          </button>
        </form>
      </div>

      <style jsx="true">{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }
        .modal-content {
          background: var(--bg-surface);
          color: var(--text-main);
          padding: 30px;
          border-radius: 20px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-color);
        }
        h2 {
          margin-top: 0;
          font-weight: 800;
        }
        p {
          color: var(--text-muted);
          margin-bottom: 25px;
          font-size: 0.9rem;
        }
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          font-size: 0.9rem;
        }
        input, textarea {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          background: var(--bg-main);
          color: var(--text-main);
          font-size: 0.95rem;
        }
        button {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: #2563eb;
          color: white;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        button:hover {
          background: #1d4ed8;
        }
        button:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default CompleteProfileModal;
