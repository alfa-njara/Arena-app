import React from "react";
import { FaSearch } from "react-icons/fa";

const Search = ({ query, setQuery }) => {
  return (
    <div className="search-bar mb-4 mt-4 d-flex justify-content-center">
      <div className="search-input-wrapper">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Rechercher les collaborateurs ou des publications..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <style jsx="true">{`
        .search-input-wrapper {
          position: relative;
          width: 50%;
          max-width: 500px;
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
