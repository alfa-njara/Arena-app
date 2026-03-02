import React, { useEffect, useState } from "react";
import {
  FaBuilding,
  FaPhone,
  FaTag,
  FaGlobe,
  FaInfoCircle,
  FaEdit,
  FaSave,
} from "react-icons/fa";

const defaultProfile = {
  companyName: "Arena Boutique",
  number: "+261 34 00 000 00",
  type: "boutique",
  link: "https://arena-mg.com",
  description:
    "Nous sommes une boutique partenaire d’Arena spécialisée dans les produits innovants et locaux.",
};

const ContributorProfile = () => {
  const [profile, setProfile] = useState(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("contributorData");
    if (savedData) {
      setProfile(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    localStorage.setItem("contributorData", JSON.stringify(profile));
    setIsEditing(false);
    alert("Profil mis à jour 🚀");
  };

  return (
    <div className="container-fluid py-5">
      <div className="card shadow-lg border-0 rounded-4">
        {/* Header large */}
        <div className="card-header bg-primary text-white py-4 px-5 rounded-top-4">
          <h2 className="mb-0">
            <FaBuilding className="me-2" />
            {profile.companyName}
          </h2>
        </div>

        <div className="card-body p-5">
          {isEditing ? (
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label">
                  <FaBuilding className="me-2 text-primary" />
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  className="form-control"
                  value={profile.companyName}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  <FaPhone className="me-2 text-primary" />
                  Phone
                </label>
                <input
                  type="text"
                  name="number"
                  className="form-control"
                  value={profile.number}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  <FaTag className="me-2 text-primary" />
                  Type
                </label>
                <select
                  name="type"
                  className="form-select"
                  value={profile.type}
                  onChange={handleChange}
                >
                  <option value="boutique">Boutique</option>
                  <option value="service">Professional Service</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="education">Education</option>
                  <option value="restauration">Restaurant</option>
                  <option value="art-culture">Art & Culture</option>
                  <option value="health">Health</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  <FaGlobe className="me-2 text-primary" />
                  Website
                </label>
                <input
                  type="text"
                  name="link"
                  className="form-control"
                  value={profile.link}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label className="form-label">
                  <FaInfoCircle className="me-2 text-primary" />
                  Description
                </label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  value={profile.description}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <button
                  className="btn btn-success w-100 rounded-pill mt-3"
                  onClick={handleUpdate}
                >
                  <FaSave className="me-2" />
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              <div className="col-md-6">
                <div className="p-4 bg-light rounded-3 h-100">
                  <FaPhone className="me-2 text-primary" />
                  <strong>Phone:</strong>
                  <p className="mt-2 mb-0">{profile.number}</p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-4 bg-light rounded-3 h-100">
                  <FaTag className="me-2 text-primary" />
                  <strong>Type:</strong>
                  <p className="mt-2 mb-0">{profile.type}</p>
                </div>
              </div>

              <div className="col-12">
                <div className="p-4 bg-light rounded-3">
                  <FaGlobe className="me-2 text-primary" />
                  <strong>Website:</strong>
                  <p className="mt-2 mb-0">
                    <a href={profile.link} target="_blank" rel="noreferrer">
                      {profile.link}
                    </a>
                  </p>
                </div>
              </div>

              <div className="col-12">
                <div className="p-4 bg-light rounded-3">
                  <FaInfoCircle className="me-2 text-primary" />
                  <strong>Description:</strong>
                  <p className="mt-2 mb-0">{profile.description}</p>
                </div>
              </div>

              <div className="col-12">
                <button
                  className="btn btn-outline-primary w-100 rounded-pill mt-3"
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit className="me-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContributorProfile;
