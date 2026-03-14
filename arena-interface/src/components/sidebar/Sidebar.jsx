import { BsPerson, BsGear, BsBoxArrowRight } from "react-icons/bs"; // Ajout de l'icône logout
import { RiHome9Line } from "react-icons/ri";
import { LuLayoutDashboard } from "react-icons/lu";
import { GrFavorite } from "react-icons/gr";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const items = [
    {
      id: "home",
      path: "/home",
      icon: <RiHome9Line size={24} />,
      label: "Home",
    },
    {
      id: "dashboard",
      path: "/contributor/dashboard",
      icon: <LuLayoutDashboard size={24} />,
      label: "Dashboard",
    },
    {
      id: "profile",
      path: "/contributor/profile",
      icon: <BsPerson size={24} />,
      label: "Profile",
    },
    {
      id: "favorites",
      path: "/favorites",
      icon: <GrFavorite size={24} />,
      label: "Favorites",
    },
    {
      id: "settings",
      path: "/settings",
      icon: <BsGear size={24} />,
      label: "Settings",
    },
  ];

  const handleLogout = () => {
    // Ajoute ta logique de déconnexion ici (clear token, etc.)
    console.log("Logging out...");
    navigate("/login");
  };

  return (
    <div className="sidebar-container d-flex flex-column align-items-center">
      <div className="nav-links d-flex flex-column align-items-center w-100">
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-item d-flex flex-column align-items-center justify-content-center mb-3 ${
                isActive ? "selected" : ""
              }`
            }
          >
            <div className="icon">{item.icon}</div>
            <small className="mt-1">{item.label}</small>
          </NavLink>
        ))}
      </div>

      {/* Bouton Logout tout en bas */}
      <button
        className="sidebar-item logout-btn d-flex flex-column align-items-center justify-content-center mt-auto"
        onClick={handleLogout}
      >
        <div className="icon">
          <BsBoxArrowRight size={24} />
        </div>
        <small className="mt-1">Logout</small>
      </button>

      <style jsx="true">{`
        .sidebar-container {
          width: 80px;
          height: 100vh;
          background: #ffffff;
          padding: 20px 5px;
          border-right: 1px solid #eee;
        }

        .nav-links {
          flex: 1;
        }

        .sidebar-item {
          width: 100%;
          background: none;
          border: none;
          font-size: 0.75rem;
          text-align: center;
          cursor: pointer;
          border-radius: 12px;
          padding: 12px 5px;
          transition: all 0.2s ease;
          text-decoration: none;
          color: #64748b;
        }

        .sidebar-item:hover {
          background: #f8fafc;
          color: #2563eb;
        }

        .sidebar-item.selected {
          background: #eff6ff;
          color: #2563eb;
          font-weight: 600;
        }

        .logout-btn {
          color: #ef4444; /* Rouge pour le logout */
          margin-bottom: 60px;
        }

        .logout-btn:hover {
          background: #fef2f2;
          color: #dc2626;
        }

        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 992px) {
          .sidebar-container {
            flex-direction: row;
            width: 100%;
            height: auto;
            position: fixed;
            bottom: 0;
            left: 0;
            z-index: 1000;
            border-right: none;
            border-top: 1px solid #eee;
            padding: 5px 0;
            justify-content: space-around;
          }

          .nav-links {
            flex-direction: row;
            justify-content: space-around;
          }

          .sidebar-item {
            flex: 1;
            margin-bottom: 0 !important;
            padding: 10px 0;
          }

          .mt-auto {
            margin-top: 0 !important;
          }

          .sidebar-item small {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
