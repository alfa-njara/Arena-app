import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PublicationsList.css";
import {
  BsTelephone,
  BsHeart,
  BsHeartFill,
  BsGrid,
  BsFire,
  BsClock,
  BsWhatsapp,
  BsStarFill,
  BsGeoAlt,
} from "react-icons/bs";
import toast from "react-hot-toast";
import api, { BASE_URL } from "../../api";
import { useAppContext } from "../../context/AppContext";
import CompanyProfileModal from "../profile/CompanyProfileModal";

const typeStyles = {
  Shop: { bg: "#e3f2fd", color: "#0d6efd" },
  "Professional service": { bg: "#f3e5f5", color: "#9c27b0" },
  "Entertainment & Events": { bg: "#fff3e0", color: "#ef6c00" },
  "Education / Training": { bg: "#e8f5e9", color: "#2e7d32" },
  "Restaurant / Food": { bg: "#ffebee", color: "#c62828" },
  "Health & Wellness": { bg: "#e0f2f1", color: "#00796b" },
  "Art & Culture": { bg: "#fce4ec", color: "#d81b60" },
  Other: { bg: "#f8f9fa", color: "#6c757d" },
  Default: { bg: "#f8f9fa", color: "#6c757d" },
};

// We will dynamically compute categories based on fetched data inside the component.
const PublicationsList = () => {
  const { isDarkMode, searchQuery } = useAppContext();
  const [activeFilter, setActiveFilter] = useState("All");
  const [publications, setPublications] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    fetchPublications();
    fetchFavorites();
  }, []);

  const fetchPublications = async () => {
    try {
      const res = await api.get("/companies/list/");
      const mapped = res.data.map((item) => ({
        id: item.id,
        companyName: item.name,
        number: item.phone_number,
        type: item.contribution_type,
        link: item.website,
        description: item.description,
        logo:
          item.logo_url && !item.logo_url.startsWith("http")
            ? `${BASE_URL}${item.logo_url}`
            : item.logo_url,
        location: item.location,
        is_premium: item.is_premium,
        total_views: item.total_views,
        total_visits: item.total_visits,
        total_favorites: item.total_favorites,
        ranking_score: item.ranking_score,
        created_at: item.created_at,
      }));
      setPublications(mapped);
    } catch (err) {
      toast.error("Failed to load publications");
      console.error(err);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await api.get("/favorites/");
      const favSet = new Set(res.data.map((f) => f.company));
      setFavorites(favSet);
    } catch (err) {
      toast.error("Failed to load favorites");
      console.error(err);
    }
  };

  const toggleFavorite = async (companyId) => {
    try {
      if (favorites.has(companyId)) {
        await api.delete(`/favorites/${companyId}/`);
        const newFavs = new Set(favorites);
        newFavs.delete(companyId);
        setFavorites(newFavs);
      } else {
        await api.post("/favorites/", { company: companyId });
        const newFavs = new Set(favorites);
        newFavs.add(companyId);
        setFavorites(newFavs);
        toast.success("Added to favorites");
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.detail) {
        toast.error(err.response.data.detail);
      } else {
        toast.error("Error updating favorite");
      }
    }
  };

  const filteredPublications = publications
    .filter((pub) => {
      const isFilteredByCategory =
        activeFilter === "All" ||
        activeFilter === "Recent" ||
        activeFilter === "Popular" ||
        pub.type === activeFilter;

      if (!isFilteredByCategory) return false;

      if (!searchQuery) return true;

      const lowerQuery = searchQuery.toLowerCase();
      return (
        pub.companyName?.toLowerCase().includes(lowerQuery) ||
        pub.type?.toLowerCase().includes(lowerQuery) ||
        pub.description?.toLowerCase().includes(lowerQuery) ||
        pub.number?.toLowerCase().includes(lowerQuery) ||
        pub.location?.toLowerCase().includes(lowerQuery) ||
        pub.link?.toLowerCase().includes(lowerQuery)
      );
    })
    .sort((a, b) => {
      if (activeFilter === "Recent") {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      if (activeFilter === "Popular") {
        const scoreA =
          (a.total_views || 0) +
          (a.total_visits || 0) * 3 +
          (a.total_favorites || 0) * 5;
        const scoreB =
          (b.total_views || 0) +
          (b.total_visits || 0) * 3 +
          (b.total_favorites || 0) * 5;
        if (scoreA !== scoreB) return scoreB - scoreA;
        return new Date(b.created_at) - new Date(a.created_at);
      }
      // Default: Sort by Ranking Score (Backend provided) then Recency
      if (a.ranking_score !== b.ranking_score) {
        return (b.ranking_score || 0) - (a.ranking_score || 0);
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });

  return (
    <div className={`publications-page ${isDarkMode ? "dark-mode" : ""}`}>
      <style>{`
        .filter-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow-x: auto;
          white-space: nowrap;
          padding: 8px 0;
          scrollbar-width: none; /* Firefox */
          margin-bottom: 15px;
        }
        .filter-bar::-webkit-scrollbar { display: none; } /* Chrome/Safari */

        .filter-btn {
          background: ${isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"};
          border: 1px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"};
          color: var(--text-main);
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .filter-btn.active {
          background: #0d6efd;
          color: white;
          border-color: #0d6efd;
        }

        /* Fixed Viewport logic */
        .publications-page {
          height: calc(100vh - 70px); /* Adjusted for navbar */
          overflow-y: auto;
        }
        
        .pub-glass-card {
           cursor: pointer;
        }
        
        .btn-favorite-icon, .minimal-visit-btn {
           position: relative;
           z-index: 2;
        }
        .pub-glass-card.premium-card {
           background: rgba(255, 235, 180, 0.1);
           border: 1px solid rgba(255, 184, 0, 0.4);
           box-shadow: 0 0 15px rgba(255, 184, 0, 0.15);
           position: relative;
           overflow: visible;
        }
        
        .pub-glass-card.premium-card::before {
           content: "";
           position: absolute;
           top: 0;
           left: 0;
           right: 0;
           bottom: 0;
           background: radial-gradient(circle at top right, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
           pointer-events: none;
           border-radius: 22px;
           z-index: 0;
        }

        .pub-glass-card.premium-card:hover {
           border-color: rgba(255, 184, 0, 0.8);
           box-shadow: 0 0 20px rgba(255, 184, 0, 0.25);
        }

        .premium-star-badge {
           position: absolute;
           top: -10px;
           right: -10px;
           background: #ffb800;
           color: #fff;
           width: 32px;
           height: 32px;
           display: flex;
           align-items: center;
           justify-content: center;
           border-radius: 50%;
           box-shadow: 0 4px 10px rgba(255, 184, 0, 0.4);
           z-index: 10;
           border: 2px solid #fff;
        }
      `}</style>

      {selectedCompany && (
        <CompanyProfileModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}

      <div className="container-fluid">
        <div className="filter-bar">
          {[
            "All",
            "Recent",
            "Popular",
            ...Object.keys(typeStyles).filter((t) => t !== "Default"),
          ].map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${activeFilter === cat ? "active" : ""}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat === "All" && <BsGrid size={14} />}
              {cat === "Recent" && <BsClock size={14} />}
              {cat === "Popular" && <BsFire size={14} />}
              {cat}
            </button>
          ))}
        </div>

        {/* LISTING */}
        <div className="row g-3">
          {filteredPublications.map((pub, idx) => {
            const style = typeStyles[pub.type] || typeStyles.Default;
            return (
              <div key={idx} className="col-xl-3 col-lg-4 col-md-6">
                <div
                  className={`pub-glass-card h-100 ${pub.is_premium ? "premium-card" : ""}`}
                  onClick={() => setSelectedCompany(pub)}
                >
                  {pub.is_premium && (
                    <div className="premium-star-badge">
                      <BsStarFill size={16} />
                    </div>
                  )}

                    <div className="card-hover-overlay">
                      <div className="hover-content">
                        <BsGeoAlt size={22} className="mb-2" />
                        <span className="location-text">
                          {pub.location || "Localisation non spécifiée"}
                        </span>
                        <span className="click-hint">Cliquez pour voir le profil</span>
                      </div>
                    </div>

                  <div className="pub-card-header d-flex justify-content-between align-items-center mb-3">
                    <div className="user-info d-flex align-items-center gap-2">
                      <img
                        src={
                          pub.logo ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${pub.companyName}`
                        }
                        alt="avatar"
                        className="avatar-img shadow-sm"
                      />
                      <h6 className="mb-0 fw-bold company-title">
                        {pub.companyName}
                      </h6>
                    </div>
                    <span
                      className="badge-category"
                      style={{
                        backgroundColor: style.bg,
                        color: style.color,
                        padding: "4px 8px",
                        fontSize: "0.7rem",
                        fontWeight: "700",
                        borderRadius: "6px",
                        textTransform: "uppercase",
                      }}
                    >
                      {pub.type}
                    </span>
                  </div>

                  <div className="pub-card-body flex-grow-1">
                    <p className="description-text">{pub.description}</p>
                  </div>

                  <div className="pub-card-footer mt-auto pt-3 border-top border-light border-opacity-10">
                    <div className="d-flex justify-content-between align-items-center">
                      <a
                        href={`https://wa.me/${pub.number.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="phone-info x-small"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <BsWhatsapp size={12} className="me-1 text-success" />
                        {pub.number}
                      </a>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn-favorite-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(pub.id);
                          }}
                        >
                          {favorites.has(pub.id) ? (
                            <BsHeartFill color="#dc3545" size={16} />
                          ) : (
                            <BsHeart size={16} />
                          )}
                        </button>
                        <a
                          href={pub.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="minimal-visit-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            api
                              .post(`/companies/${pub.id}/visit/`, {
                                visit_type: "website_click",
                              })
                              .catch((err) =>
                                console.error(
                                  "Website click tracking failed",
                                  err,
                                ),
                              );
                          }}
                        >
                          Visit
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PublicationsList;
