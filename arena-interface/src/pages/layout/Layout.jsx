import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";

const Layout = () => {
  return (
    <div className="layout-page">
      <div className="blur-bg d-flex">
        <Sidebar />

        <div className="main-content">
          <Outlet />
        </div>
      </div>

      <style jsx="true">{`
        .layout-page {
          position: relative;
          min-height: 100vh;
          width: 100vw;
          background: #ffffff;
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
          border-left: 1px solid #ccc;
        }

        .main-content {
          flex: 1;
          padding: 0;
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

export default Layout;
