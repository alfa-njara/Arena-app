import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PublicationsList.css";
import { BsTelephone, BsHeart, BsGrid, BsFire, BsClock } from "react-icons/bs";

const staticData = [
  // ... (Your existing data)
  {
    companyName: "Arena Boutique",
    number: "0341234567",
    type: "Shop",
    link: "https://example.com",
    description: "Trendy clothing and high-quality accessories.",
  },
  {
    companyName: "Pro Services",
    number: "0329876543",
    type: "Service",
    link: "https://example.com",
    description: "Professional services for individuals and businesses.",
  },
  {
    companyName: "Fun Events",
    number: "0337711122",
    type: "Entertainment",
    link: "https://example.com",
    description: "Unforgettable event planning and shows.",
  },
  {
    companyName: "Learn Academy",
    number: "034556677",
    type: "Education",
    link: "https://example.com",
    description: "Training and coaching for all skill levels.",
  },
  {
    companyName: "Tasty Food",
    number: "032448899",
    type: "Restaurant",
    link: "https://example.com",
    description: "Delicious dining experiences and premium takeout.",
  },
  {
    companyName: "Wellness Center",
    number: "032778899",
    type: "Health",
    link: "https://example.com",
    description: "Care, well-being, and fitness tailored for you.",
  },
  {
    companyName: "Art Hub",
    number: "034332211",
    type: "Culture",
    link: "https://example.com",
    description: "Exhibitions and cultural workshops.",
  },
  {
    companyName: "Tech Solutions",
    number: "032112233",
    type: "Tech",
    link: "https://example.com",
    description: "Software and hardware support.",
  },
];

const typeStyles = {
  Shop: { bg: "#e3f2fd", color: "#0d6efd" },
  Service: { bg: "#f3e5f5", color: "#9c27b0" },
  Entertainment: { bg: "#fff3e0", color: "#ef6c00" },
  Education: { bg: "#e8f5e9", color: "#2e7d32" },
  Restaurant: { bg: "#ffebee", color: "#c62828" },
  Health: { bg: "#e0f2f1", color: "#00796b" },
  Culture: { bg: "#fce4ec", color: "#ad1457" },
  Tech: { bg: "#e8eaf6", color: "#283593" },
  Default: { bg: "#f8f9fa", color: "#6c757d" },
};

// Filter categories
const categories = [
  "All",
  "Recent",
  "Popular",
  ...Object.keys(typeStyles).filter((t) => t !== "Default"),
];

const PublicationsList = ({ isDarkMode }) => {
  const [activeFilter, setActiveFilter] = useState("All");

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
      `}</style>

      <div className="container-fluid">
        {/* HORIZONTAL FILTERS */}
        <div className="filter-bar">
          {categories.map((cat) => (
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
          {staticData
            .filter(
              (pub) =>
                activeFilter === "All" ||
                activeFilter === "Recent" ||
                activeFilter === "Popular" ||
                pub.type === activeFilter,
            )
            .map((pub, idx) => {
              const style = typeStyles[pub.type] || typeStyles.Default;
              return (
                <div key={idx} className="col-xl-3 col-lg-4 col-md-6">
                  <div className="pub-glass-card h-100">
                    <div className="pub-card-header d-flex justify-content-between align-items-center mb-3">
                      <div className="user-info d-flex align-items-center gap-2">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${pub.companyName}`}
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

                    <div className="pub-card-footer mt-auto pt-3 border-top border-light border-opacity-10">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="phone-info x-small">
                          <BsTelephone size={12} className="me-1" />
                          {pub.number}
                        </span>
                        <div className="d-flex align-items-center gap-2">
                          <button className="btn-favorite-icon">
                            <BsHeart size={16} />
                          </button>
                          <a
                            href={pub.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="minimal-visit-btn"
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
