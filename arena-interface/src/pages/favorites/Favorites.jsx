import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../components/publication/PublicationsList.css";
import { BsTelephone, BsHeartFill } from "react-icons/bs";
import api from "../../api";

// Uniformisation des clés sur 'color'
const typeStyles = {
  Shop: { bg: "#e3f2fd", color: "#0d6efd" },
  Restaurant: { bg: "#ffebee", color: "#c62828" },
  Tech: { bg: "#e8eaf6", color: "#283593" },
  Default: { bg: "#f8f9fa", color: "#6c757d" },
};

const Favorites = ({ isDarkMode }) => {
  const [favoriteItems, setFavoriteItems] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await api.get("/customers/favorites/");
      const mapped = res.data.map(item => ({
        id: item.company,
        companyName: item.company_details?.name || "Company",
        number: item.company_details?.phone_number || "",
        type: item.company_details?.contribution_type || "Shop",
        link: item.company_details?.website || "",
        description: item.company_details?.description || "",
        logo: item.company_details?.logo_url || null
      }));
      setFavoriteItems(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFavorite = async (companyId) => {
    try {
      await api.delete(`/customers/favorites/${companyId}/`);
      setFavoriteItems(favoriteItems.filter(item => item.id !== companyId));
    } catch (err) {
      console.error(err);
      alert("Error removing favorite");
    }
  };

  return (
    <div className={`publications-page ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="container-fluid py-4">
        {/* Le titre a été supprimé pour un look plus clean */}

        {favoriteItems.length > 0 ? (
          <div className="row g-3">
            {favoriteItems.map((pub, idx) => {
              const style = typeStyles[pub.type] || typeStyles.Default;

              return (
                <div key={idx} className="col-xl-3 col-lg-4 col-md-6">
                  <div className="pub-glass-card h-100">
                    <div className="pub-card-header d-flex justify-content-between align-items-center mb-3">
                      <div className="user-info d-flex align-items-center gap-2">
                        <img
                          src={pub.logo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${pub.companyName}`}
                          alt="avatar"
                          className="avatar-img shadow-sm"
                        />
                        <h6
                          className="mb-0 fw-bold text-truncate"
                          style={{ maxWidth: "85px" }}
                        >
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

                    <div className="pub-card-footer mt-auto pt-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="phone-info">
                          <BsTelephone size={12} className="me-1" />
                          {pub.number}
                        </span>

                        <div className="d-flex align-items-center gap-2">
                          <button className="btn-favorite-active" onClick={() => removeFavorite(pub.id)}>
                            <BsHeartFill size={16} />
                          </button>
                          {pub.link && (
                            <a
                              href={pub.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="minimal-visit-btn"
                            >
                              Visit Site
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted">No favorites found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
