import React from "react";
import PublicationsList from "../components/publication/PublicationsList";
import Search from "../components/search/Search";
import Sidebar from "../components/sidebar/Sidebar";

const Home = () => {
  return (
    <div className="home-page">
      <div className="blur-bg d-flex">
        <div className="main-content">
          <Search />
          <PublicationsList />
        </div>
        <Sidebar />
      </div>

      <style jsx="true">{`
        .home-page {
          position: relative;
          min-height: 100vh;
          width: 100vw;
          background: #f5f5f5;
          overflow-x: hidden;
          font-family: "Segoe UI", sans-serif;
        }

        .blur-bg {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: flex;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.15);
          box-sizing: border-box;
        }

        .main-content {
          flex: 1;
        }

        @media (max-width: 992px) {
          .blur-bg {
            flex-direction: column;
          }
        }

        @media (max-width: 768px) {
          .blur-bg {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
