import React, { useEffect } from "react";
import { BsTelephone, BsGlobe, BsX, BsGeoAlt, BsTag } from "react-icons/bs";
import { useAppContext } from "../../context/AppContext";
import api from "../../api";

const CompanyProfileModal = ({ company, onClose }) => {
  const { isDarkMode } = useAppContext();

  useEffect(() => {
    if (company?.id) {
      api.post(`/companies/${company.id}/visit/`).catch(err => console.error("Visit tracking failed", err));
    }
  }, [company]);

  if (!company) return null;

  return (
    <div className={`company-modal-overlay ${isDarkMode ? "dark" : ""}`} onClick={onClose}>
      <div 
        className="company-modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          <BsX size={28} />
        </button>

        <div className="modal-header-section">
          <div className="logo-container">
            <img 
              src={company.logo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${company.companyName}`} 
              alt={company.companyName} 
            />
          </div>
          <h2 className="company-title">{company.companyName}</h2>
          <span className="category-badge">{company.type}</span>
        </div>

        <div className="modal-body-section">
          <p className="company-description">
            {company.description || "No description provided."}
          </p>

          <div className="contact-grid">
            {company.number && (
              <div className="contact-item">
                <div className="icon-wrapper bg-primary-light text-primary">
                  <BsTelephone size={20} />
                </div>
                <div>
                  <small>Phone</small>
                  <strong>{company.number}</strong>
                </div>
              </div>
            )}
            
            {company.link && (
              <a href={company.link} target="_blank" rel="noopener noreferrer" className="contact-item link-item">
                <div className="icon-wrapper bg-success-light text-success">
                  <BsGlobe size={20} />
                </div>
                <div>
                  <small>Website</small>
                  <strong>Visit Site</strong>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .company-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          padding: 20px;
          opacity: 0;
          animation: fadeIn 0.3s forwards;
        }
        
        @keyframes fadeIn {
          to { opacity: 1; }
        }

        .company-modal-content {
          background: var(--bg-surface);
          color: var(--text-main);
          width: 100%;
          max-width: 500px;
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          transform: translateY(20px);
          opacity: 0;
          animation: slideUp 0.4s forwards cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid var(--border-color);
        }

        @keyframes slideUp {
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(0,0,0,0.05);
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-main);
          transition: background 0.2s;
          z-index: 10;
        }

        .close-btn:hover {
          background: rgba(0,0,0,0.1);
        }

        .dark .close-btn {
          background: rgba(255,255,255,0.1);
        }
        
        .dark .close-btn:hover {
          background: rgba(255,255,255,0.2);
        }

        .modal-header-section {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(37, 99, 235, 0.1));
          padding: 40px 20px 30px;
          text-align: center;
          border-bottom: 1px solid var(--border-color);
        }

        .dark .modal-header-section {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(37, 99, 235, 0.2));
        }

        .logo-container {
          width: 100px;
          height: 100px;
          margin: 0 auto 15px;
          background: white;
          border-radius: 24px;
          padding: 5px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.08);
          overflow: hidden;
          border: 2px solid white;
        }

        .dark .logo-container {
          background: var(--bg-main);
          border-color: var(--bg-surface);
        }

        .logo-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 18px;
        }

        .company-title {
          font-weight: 800;
          font-size: 1.6rem;
          margin-bottom: 10px;
          color: var(--text-main);
        }

        .category-badge {
          display: inline-block;
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #2563eb;
          letter-spacing: 0.5px;
        }

        .modal-body-section {
          padding: 30px;
        }

        .company-description {
          font-size: 1.05rem;
          line-height: 1.6;
          color: var(--text-muted);
          margin-bottom: 30px;
          text-align: center;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 16px;
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .link-item {
          text-decoration: none;
          color: currentColor;
        }

        .link-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border-color: #2563eb;
        }

        .icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bg-primary-light { background: rgba(37, 99, 235, 0.1); }
        .text-primary { color: #2563eb; }
        .bg-success-light { background: rgba(16, 185, 129, 0.1); }
        .text-success { color: #10b981; }

        .contact-item small {
          display: block;
          color: var(--text-muted);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }

        .contact-item strong {
          display: block;
          font-size: 1.05rem;
          color: var(--text-main);
        }
      `}</style>
    </div>
  );
};

export default CompanyProfileModal;
