import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

const Layout = () => {
  const location = useLocation();

  const isProfilePage = location.pathname === "/contributor/profile";
  const isHomePage = location.pathname === "/home";

  return (
    <div className="layout-container">
      {/* NAVBAR FIXE EN HAUT */}
      <div className="layout-header">
        <Navbar showSearch={isHomePage} isVerified={isProfilePage} />
      </div>

      <div className="layout-body">
        {/* SIDEBAR FIXE A GAUCHE */}
        <aside className="layout-sidebar">
          <Sidebar />
        </aside>

        {/* CONTENU SCROLLABLE */}
        <main className="layout-main">
          <Outlet />
        </main>
      </div>

      <style>{`
        .layout-container {
          display: flex;
          flex-direction: column;
          height: 100vh; /* Toute la hauteur de l'écran */
          width: 100vw;
          overflow: hidden; /* Empêche le scroll global */
        }

        .layout-header {
          flex-shrink: 0; /* Empêche la navbar de s'écraser */
          z-index: 1000;
        }

        .layout-body {
          display: flex;
          flex: 1; /* Prend tout l'espace restant */
          overflow: hidden; /* Prépare le scroll interne */
        }

        .layout-sidebar {
          flex-shrink: 0;
          background: #fff;
          border-right: 1px solid #eee;
          height: 100%;
        }

        .layout-main {
          flex: 1;
          overflow-y: auto; /* SEULE CETTE ZONE SCROLLE */
          background: #f7f7f7;
          height: 100%;
        }

        @media (max-width: 992px) {
          .layout-sidebar {
            display: none; /* Cache la sidebar sur mobile pour le test */
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
