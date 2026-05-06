import React, { useEffect, useRef } from "react";
import { BsTelephone, BsGlobe, BsX, BsGeoAlt, BsWhatsapp } from "react-icons/bs";
import { useAppContext } from "../../context/AppContext";
import api from "../../api";

const CompanyProfileModal = ({ company, onClose }) => {
  const visitLogged = useRef(false);
  const { isDarkMode } = useAppContext();
  
  useEffect(() => {
    if (company?.id && !visitLogged.current) {
      visitLogged.current = true;
      api.post(`/companies/${company.id}/visit/`, { 
        visit_type: 'profile_view',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      })
        .catch(err => {
          console.error("Profile view tracking failed", err);
          visitLogged.current = false;
        });
    }
  }, [company?.id]);

  if (!company) return null;

  const hasMap = !!company.location;

  return (
    <div className={`cpm-overlay ${isDarkMode ? "cpm-dark" : ""}`} onClick={onClose}>
      <div 
        className="cpm-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button className="cpm-close" onClick={onClose}>
          <BsX size={22} />
        </button>

        <div className="cpm-layout">
          {/* LEFT — Info */}
          <div className="cpm-info">
            <div className="cpm-header">
              <div className="cpm-avatar">
                <img 
                  src={company.logo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${company.companyName}`} 
                  alt={company.companyName} 
                />
              </div>
              <div>
                <h2 className="cpm-name">{company.companyName}</h2>
                <span className="cpm-badge">{company.type}</span>
              </div>
            </div>

            {company.description && (
              <div className="cpm-section">
                <h6 className="cpm-section-title">About</h6>
                <p className="cpm-desc">{company.description}</p>
              </div>
            )}

            <div className="cpm-section">
              <h6 className="cpm-section-title">Contact</h6>
              <div className="cpm-contacts">
                {company.number && (
                  <a
                    href={`https://wa.me/${company.number.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cpm-row"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <BsWhatsapp className="cpm-row-icon" style={{ color: "#25d366" }} />
                    <div>
                      <small>WhatsApp</small>
                      <span>{company.number}</span>
                    </div>
                  </a>
                )}
                
                {company.link && (
                  <a 
                    href={company.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="cpm-row"
                    onClick={(e) => {
                      e.stopPropagation();
                      api.post(`/companies/${company.id}/visit/`, { 
                        visit_type: 'website_click',
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                      })
                        .catch(err => console.error(err));
                    }}
                  >
                    <BsGlobe className="cpm-row-icon" style={{ color: "#2563eb" }} />
                    <div>
                      <small>Website 1</small>
                      <span>{company.link.replace("https://", "").replace("http://", "")}</span>
                    </div>
                  </a>
                )}

                {company.is_premium && company.website_2 && (
                   <a 
                    href={company.website_2} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="cpm-row"
                    onClick={(e) => {
                      e.stopPropagation();
                      api.post(`/companies/${company.id}/visit/`, { 
                        visit_type: 'website_click',
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                      })
                        .catch(err => console.error(err));
                    }}
                  >
                    <BsGlobe className="cpm-row-icon" style={{ color: "#059669" }} />
                    <div>
                      <small>Website 2</small>
                      <span>{company.website_2.replace("https://", "").replace("http://", "")}</span>
                    </div>
                  </a>
                )}

                {company.is_premium && company.website_3 && (
                   <a 
                    href={company.website_3} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="cpm-row"
                    onClick={(e) => {
                      e.stopPropagation();
                      api.post(`/companies/${company.id}/visit/`, { 
                        visit_type: 'website_click',
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                      })
                        .catch(err => console.error(err));
                    }}
                  >
                    <BsGlobe className="cpm-row-icon" style={{ color: "#7c3aed" }} />
                    <div>
                      <small>Website 3</small>
                      <span>{company.website_3.replace("https://", "").replace("http://", "")}</span>
                    </div>
                  </a>
                )}

                {company.location && (
                  <div className="cpm-row">
                    <BsGeoAlt className="cpm-row-icon" style={{ color: "#f59e0b" }} />
                    <div>
                      <small>Location</small>
                      <span>{company.location}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT — Map */}
          {hasMap && (
            <div className="cpm-map">
              <iframe
                title="Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(company.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                loading="lazy"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>

      <style jsx="true">{`
        .cpm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          animation: cpmFade 0.2s ease forwards;
        }
        @keyframes cpmFade { from { opacity:0 } to { opacity:1 } }

        .cpm-modal {
          width: 90vw;
          height: 90vh;
          background: ${isDarkMode ? "#1a1a2e" : "#ffffff"};
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 16px 48px rgba(0,0,0,0.2);
          animation: cpmUp 0.3s ease forwards;
        }
        @keyframes cpmUp { from { transform:translateY(20px);opacity:0 } to { transform:translateY(0);opacity:1 } }

        .cpm-layout {
          display: flex;
          height: 100%;
        }

        /* ── LEFT PANEL ── */
        .cpm-info {
          width: 420px;
          flex-shrink: 0;
          overflow-y: auto;
          padding: 32px;
          border-right: 1px solid ${isDarkMode ? "rgba(255,255,255,0.08)" : "#eee"};
        }

        .cpm-info::-webkit-scrollbar { width: 3px; }
        .cpm-info::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.15); border-radius: 10px; }

        .cpm-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
          padding-bottom: 24px;
          border-bottom: 1px solid ${isDarkMode ? "rgba(255,255,255,0.08)" : "#eee"};
        }

        .cpm-avatar {
          width: 64px;
          height: 64px;
          border-radius: 14px;
          overflow: hidden;
          flex-shrink: 0;
          border: 2px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "#eee"};
        }

        .cpm-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cpm-name {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 0 4px;
          color: ${isDarkMode ? "#f1f5f9" : "#111"};
        }

        .cpm-badge {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #2563eb;
          background: rgba(37,99,235,0.08);
          padding: 3px 10px;
          border-radius: 6px;
        }

        .cpm-section {
          margin-bottom: 24px;
        }

        .cpm-section-title {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: ${isDarkMode ? "#64748b" : "#94a3b8"};
          margin: 0 0 12px;
        }

        .cpm-desc {
          font-size: 0.9rem;
          line-height: 1.7;
          color: ${isDarkMode ? "#94a3b8" : "#555"};
          margin: 0;
        }

        /* ── CONTACT ROWS ── */
        .cpm-contacts {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cpm-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 10px;
          text-decoration: none;
          color: inherit;
          transition: background 0.15s ease;
        }

        a.cpm-row:hover {
          background: ${isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"};
        }

        .cpm-row-icon {
          font-size: 18px;
          flex-shrink: 0;
        }

        .cpm-row small {
          display: block;
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: ${isDarkMode ? "#64748b" : "#94a3b8"};
          margin-bottom: 1px;
        }

        .cpm-row span {
          font-size: 0.85rem;
          font-weight: 500;
          color: ${isDarkMode ? "#e2e8f0" : "#333"};
        }

        /* ── MAP ── */
        .cpm-map {
          flex: 1;
          background: #e5e7eb;
        }

        .cpm-map iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }

        /* ── CLOSE ── */
        .cpm-close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 34px;
          height: 34px;
          border-radius: 8px;
          border: 1px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "#eee"};
          background: ${isDarkMode ? "rgba(255,255,255,0.05)" : "#fff"};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: ${isDarkMode ? "#94a3b8" : "#666"};
          z-index: 20;
          transition: all 0.15s ease;
        }

        .cpm-close:hover {
          background: ${isDarkMode ? "rgba(255,255,255,0.1)" : "#f5f5f5"};
          color: ${isDarkMode ? "#fff" : "#111"};
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .cpm-modal {
            width: 95vw;
            height: 93vh;
            border-radius: 12px;
          }
          .cpm-layout {
            flex-direction: column;
          }
          .cpm-info {
            width: 100%;
            max-height: 50%;
            border-right: none;
            border-bottom: 1px solid ${isDarkMode ? "rgba(255,255,255,0.08)" : "#eee"};
            padding: 20px;
          }
          .cpm-map {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default CompanyProfileModal;
