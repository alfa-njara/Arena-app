import React, { useState } from "react";
import api from "../../api";
import toast from "react-hot-toast";

const CompleteProfileModal = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [contributionType, setContributionType] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSkip = () => {
    sessionStorage.setItem("skip_complete_profile", "true");
    onComplete();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!logoFile) {
      toast.error("Please upload a logo to continue.");
      return;
    }
    setLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append("description", description);
      formPayload.append("location", location);
      formPayload.append("website", website);
      formPayload.append("contribution_type", contributionType);
      formPayload.append("logo_url", logoFile);

      await api.patch("/companies/me/", formPayload);
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
        <p>Welcome to Arena! Please provide a logo and a description for your company to continue.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Upload Logo</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "10px" }}>
              {previewUrl && (
                <div style={{ width: "80px", height: "80px", borderRadius: "10px", overflow: "hidden", border: "1px solid var(--border-color)" }}>
                  <img src={previewUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="Where is your company located?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Website or Social Link</label>
            <input
              type="url"
              placeholder="https://..."
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Contribution Type</label>
            <select
              value={contributionType}
              onChange={(e) => setContributionType(e.target.value)}
              required
            >
              <option value="">Select a type...</option>
              <option value="Shop">Shop</option>
              <option value="Professional service">Professional service</option>
              <option value="Entertainment & Events">Entertainment & Events</option>
              <option value="Education / Training">Education / Training</option>
              <option value="Restaurant / Food">Restaurant / Food</option>
              <option value="Health & Wellness">Health & Wellness</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Company Description</label>
            <textarea
              placeholder="Tell us about your company..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="3"
            />
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button type="submit" disabled={loading} style={{ flex: 2 }}>
              {loading ? "Saving..." : "Save and Continue"}
            </button>
            <button 
              type="button" 
              onClick={handleSkip} 
              disabled={loading} 
              className="btn-skip"
              style={{ flex: 1 }}
            >
              Skip
            </button>
          </div>
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
          max-height: 90vh;
          overflow-y: auto;
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
        .btn-skip {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-muted);
        }
        .btn-skip:hover {
          background: var(--bg-main);
          color: var(--text-main);
          border-color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default CompleteProfileModal;
