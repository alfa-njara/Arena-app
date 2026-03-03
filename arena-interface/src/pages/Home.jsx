import React from "react";
import PublicationsList from "../components/publication/PublicationsList";

const Home = () => {
  return (
    <div className="home-page">
      {/* On ne met plus la Sidebar ni le Search ici car ils sont 
         déjà présents dans le Layout parent.
      */}
      <div className="blur-bg d-flex">
        <div className="main-content">
          <PublicationsList />
        </div>
      </div>

      <style jsx="true">{`
        .home-page {
          position: relative;
          /* On retire min-height 100vh ici car c'est géré par le layout */
          width: 100%;
          background: transparent;
          font-family: "Segoe UI", sans-serif;
        }

        .blur-bg {
          width: 100%;
          display: flex;
          box-sizing: border-box;
        }

        .main-content {
          flex: 1;
          /* Ajoute un padding si tu veux que le contenu ne colle pas à la Navbar */
          padding: 20px;
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
