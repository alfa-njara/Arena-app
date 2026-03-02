import React from "react";
import Logo from "../../assets/arena2.png";
import { LuSearch } from "react-icons/lu";

const Search = ({ query, setQuery }) => {
  return (
    <div className="search-bar pb-2 pt-2 d-flex justify-content-between align-items-center">
      <div className="search-title d-flex align-items-center me-3">
        <img src={Logo} alt="Arena Logo" className="arena-logo" />
        <h2 className="arena-text mb-0">Arena</h2>
      </div>

      <div className="search-input-wrapper d-flex align-items-center">
        <input
          type="text"
          placeholder="Rechercher les collaborateurs ou des publications..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <LuSearch className="search-icon" />
      </div>

      <style jsx="true">{`
        .search-title {
          display: flex;
          align-items: center;
          font-weight: bold;
        }

        .arena-logo {
          width: 60px;
          height: 60px;
          object-fit: contain;
          margin-right: 8px;
        }

        .arena-text {
          font-size: 1.7rem;
          color: #000000;
          font-weight: bold;
        }

        .search-bar {
          background: #f5f5f5;
          padding: 0 100px;
          margin-right: 50px;
        }

        .search-input-wrapper {
          position: relative;
          width: 50%;
          max-width: 450px;
        }

        .search-input-wrapper .search-icon {
          position: absolute;
          top: 50%;
          left: 15px;
          transform: translateY(-50%);
          color: #2575fc;
          font-size: 1rem;
          pointer-events: none;
        }

        .search-input-wrapper input {
          width: 100%;
          padding: 10px 15px 10px 40px;
          background: #ffffff;
          border-radius: 50px;
          border: 1px solid #ccc;
          box-shadow: 0 4px 15px rgba(179, 207, 255, 0.15);
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
        }

        .search-input-wrapper input:focus {
          border-color: #2575fc;
          box-shadow: 0 6px 20px rgba(37, 117, 252, 0.25);
        }

        @media (max-width: 768px) {
          .search-bar {
            margin: 16px 0;
          }
          .search-input-wrapper {
            width: 80%;
          }
        }
      `}</style>
    </div>
  );
};

export default Search;
