import React from "react";
import Logo from "../../assets/arena2.png";
import { LuSearch } from "react-icons/lu";

const Search = ({ query, setQuery }) => {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top shadow-sm py-2 px-4"
      style={{ zIndex: 1020 }}
    >
      <div className="container">
        {/* Left Side: Logo & Brand */}
        <div className="d-flex align-items-center">
          <img
            src={Logo}
            alt="Arena Logo"
            className="arena-logo me-2"
            style={{ width: "45px", transition: "transform 0.3s ease" }}
          />
          <span className="fs-4 fw-bold tracking-tighter text-dark">Arena</span>
        </div>

        {/* Center/Right: Search Bar (Expanded) */}
        <div className="search-input-wrapper ms-auto">
          <LuSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search collaborators or publications..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <style jsx="true">{`
        .tracking-tighter {
          letter-spacing: -1px;
        }

        .search-input-wrapper {
          position: relative;
          width: 100%;
          max-width: 450px;
        }

        .search-icon {
          position: absolute;
          top: 50%;
          left: 16px;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 1.1rem;
          pointer-events: none;
          transition: color 0.2s ease;
        }

        .search-input {
          width: 100%;
          padding: 10px 16px 10px 45px;
          background: #f3f4f6;
          border-radius: 12px;
          border: 1px solid transparent;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.2s ease;
          outline: none;
        }

        .search-input::placeholder {
          color: #9ca3af;
          font-weight: 400;
        }

        .search-input:focus {
          background: #ffffff;
          border-color: #000000;
          box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.05);
        }

        .search-input:focus + .search-icon {
          color: #000000;
        }

        .arena-logo:hover {
          transform: rotate(-10deg);
        }

        @media (max-width: 768px) {
          .search-input-wrapper {
            max-width: 100%;
            margin-top: 10px;
          }
        }
      `}</style>
    </nav>
  );
};

export default Search;
