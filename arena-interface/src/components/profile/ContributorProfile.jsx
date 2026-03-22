import React, { useEffect, useState, useRef } from "react";
import api from "../../api";
import toast from "react-hot-toast";
import {
  FaPhone,
  FaTag,
  FaGlobe,
  FaInfoCircle,
  FaEdit,
  FaSave,
  FaMapMarkerAlt,
  FaCamera,
  FaStore,
} from "react-icons/fa";

const DEFAULT_PROFILE = {
  companyName: "Arena Boutique",
  phone: "+261 34 00 000 00",
  category: "Shop",
  website: "https://arena-mg.com",
  description:
    "We are an Arena partner boutique specializing in innovative and local products from Madagascar.",
  location: "Antananarivo, MG",
  logoUrl: null,
  logoUrl: null,
};

const ContributorProfile = () => {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [tempProfile, setTempProfile] = useState(DEFAULT_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/companies/me/");
      const data = {
        companyName: res.data.name || "",
        phone: res.data.phone_number || "",
        category: res.data.contribution_type || "Shop",
        website: res.data.website || "",
        description: res.data.description || "",
        location: res.data.location || "",
        logoUrl: res.data.logo_url || null,
      };
      setProfile(data);
      setTempProfile(data);
    } catch (err) {
      console.error("Failed to load profile", err);
      toast.error("Failed to load profile");
    }
  };

  const handleChange = (e) => {
    setTempProfile({ ...tempProfile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      // Create a preview URL
      setTempProfile({ ...tempProfile, logoUrl: URL.createObjectURL(file) });
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", tempProfile.companyName);
      formData.append("phone_number", tempProfile.phone);
      formData.append("contribution_type", tempProfile.category);
      formData.append("website", tempProfile.website);
      formData.append("description", tempProfile.description);
      formData.append("location", tempProfile.location);
      
      if (logoFile) {
        formData.append("logo_url", logoFile); // Backend should handle this field as a file
      }

      const res = await api.patch("/companies/me/", formData);
      
      // Update local state with the actual URL returned from server if available
      const updatedData = {
        ...tempProfile,
        logoUrl: res.data.logo_url || tempProfile.logoUrl
      };
      
      setProfile(updatedData);
      setLogoFile(null);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setLogoFile(null);
    setIsEditing(false);
  };

  return (
    <div className="profile-wrapper">
      <main className="container py-5 mt-5">
        {/* justify-content-center permet de bien centrer le bloc main dans l'espace disponible */}
        <div className="row g-4 justify-content-center">
          {/* --- GAUCHE: INFOS DÉTAILLÉES --- */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 pb-4 overflow-hidden bg-white">
              <div className="p-4 border-bottom bg-white d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold mb-1 text-dark">
                    General Information
                  </h4>
                  <p className="text-muted small mb-0">
                    Manage your public business details.
                  </p>
                </div>
                {isEditing && (
                  <span className="badge bg-primary-subtle text-primary px-3">
                    Editing Mode
                  </span>
                )}
              </div>

              <div className="card-body p-4 pt-5">
                {isEditing ? (
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        className="form-control custom-input"
                        value={tempProfile.companyName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted">
                        Category
                      </label>
                      <select
                        name="category"
                        className="form-select custom-input"
                        value={tempProfile.category}
                        onChange={handleChange}
                      >
                        <option value="Shop">Shop</option>
                        <option value="Professional service">Professional service</option>
                        <option value="Entertainment & Events">Entertainment & Events</option>
                        <option value="Education / Training">Education / Training</option>
                        <option value="Restaurant / Food">Restaurant / Food</option>
                        <option value="Health & Wellness">Health & Wellness</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted">
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        className="form-control custom-input"
                        value={tempProfile.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted">
                        Website
                      </label>
                      <input
                        type="text"
                        name="website"
                        className="form-control custom-input"
                        value={tempProfile.website}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-muted">
                        Description
                      </label>
                      <textarea
                        name="description"
                        rows="4"
                        className="form-control custom-input"
                        value={tempProfile.description}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-muted">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        className="form-control custom-input"
                        value={tempProfile.location}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-muted">
                        Logo Image
                      </label>
                      <div className="d-flex align-items-center gap-3">
                        <div 
                          className="rounded-circle bg-light d-flex align-items-center justify-content-center overflow-hidden"
                          style={{ width: "60px", height: "60px", border: "2px dashed #ccc" }}
                        >
                          {tempProfile.logoUrl ? (
                            <img src={tempProfile.logoUrl} className="w-100 h-100 object-fit-cover" alt="Logo preview" />
                          ) : (
                            <FaCamera className="text-muted opacity-50" />
                          )}
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="d-none"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                        <button 
                          type="button" 
                          className="btn btn-sm btn-outline-primary rounded-3"
                          onClick={() => fileInputRef.current.click()}
                        >
                          Upload new logo
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="p-4 rounded-4 border border-light-subtle bg-white h-100 transition-hover shadow-xs">
                        <div className="d-flex align-items-center mb-2 text-muted small fw-bold text-uppercase">
                          <FaTag className="me-2 opacity-50" /> Category
                        </div>
                        <p className="h5 fw-bold mb-0 text-dark">
                          {profile.category}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-4 rounded-4 border border-light-subtle bg-white h-100 transition-hover shadow-xs">
                        <div className="d-flex align-items-center mb-2 text-muted small fw-bold text-uppercase">
                          <FaPhone className="me-2 opacity-50" /> Contact
                        </div>
                        <p className="h5 fw-bold mb-0 text-dark">
                          {profile.phone}
                        </p>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="p-4 rounded-4 border border-light-subtle bg-white shadow-xs">
                        <div className="d-flex align-items-center mb-3 text-muted small fw-bold text-uppercase">
                          <FaInfoCircle className="me-2 opacity-50" /> About
                        </div>
                        <p
                          className="lead text-secondary mb-0"
                          style={{ fontSize: "1.05rem" }}
                        >
                          {profile.description}
                        </p>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex align-items-center p-4 bg-dark rounded-4 shadow-lg text-white">
                        <div className="bg-white bg-opacity-20 p-3 rounded-3 me-4">
                          <FaGlobe size={24} />
                        </div>
                        <div className="flex-grow-1">
                          <small
                            className="text-white-50 d-block fw-bold text-uppercase"
                            style={{ fontSize: "0.65rem" }}
                          >
                            Official Website
                          </small>
                          <a
                            href={profile.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-white text-decoration-none fw-bold fs-5"
                          >
                            {profile.website.replace("https://", "")}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- DROITE: RÉSUMÉ --- */}
          <div className="col-lg-4">
            {/* Le sticky-top ici se réfère maintenant au scroll du main-content du Layout */}
            <div className="sticky-column">
              <div className="card border-0 shadow-sm rounded-4 mb-4 bg-white text-center p-4 pt-5">
                <div
                  className="position-absolute start-50 translate-middle-x shadow-md rounded-circle bg-white p-1"
                  style={{ top: "-45px" }}
                >
                  <div
                    className="rounded-circle overflow-hidden bg-light d-flex align-items-center justify-content-center"
                    style={{ width: "90px", height: "90px" }}
                  >
                    {profile.logoUrl ? (
                      <img
                        src={profile.logoUrl}
                        className="w-100 h-100 object-fit-cover"
                        alt="Logo"
                      />
                    ) : (
                      <FaStore size={35} className="opacity-20" />
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <h1 className="h4 fw-bold mb-1 text-dark">
                    {profile.companyName}
                  </h1>
                  <div className="text-muted small">
                    <FaMapMarkerAlt className="me-1" />
                    {profile.location}
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-lg rounded-4 overflow-hidden p-3">
                {!isEditing ? (
                  <button
                    className="btn btn-outline-dark w-100 py-3 rounded-4 fw-bold btn-hover-effect"
                    onClick={() => setIsEditing(true)}
                  >
                    <FaEdit className="me-2" /> Edit Profile
                  </button>
                ) : (
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-dark py-3 rounded-4 fw-bold"
                      onClick={handleUpdate}
                    >
                      <FaSave className="me-2" /> Save
                    </button>
                    <button
                      className="btn btn-link text-muted py-2 small fw-medium"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx="true">{`
        .profile-wrapper {
          width: 100%;
        }
        .sticky-column {
          position: sticky;
          top: 2rem; /* Espace sous la navbar fixe */
        }
        .shadow-xs {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
        }
        .shadow-md {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .transition-hover:hover {
          transform: translateY(-3px);
          border-color: #000 !important;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        .custom-input {
          padding: 0.8rem 1rem;
          border-radius: 12px;
          border: 1px solid #eaeaea;
          background-color: #fbfbfc;
        }
        .custom-input:focus {
          border-color: #000;
          box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.03);
          outline: none;
        }
        .btn-hover-effect:hover {
          background-color: #000;
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default ContributorProfile;
