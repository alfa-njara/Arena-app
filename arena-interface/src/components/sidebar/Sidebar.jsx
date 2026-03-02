import { BsPerson, BsQuestionCircle, BsGear } from "react-icons/bs";
import { RiHome9Line } from "react-icons/ri";
import { LuLayoutDashboard } from "react-icons/lu";
import { GrFavorite } from "react-icons/gr";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const items = [
    {
      id: "home",
      path: "/home",
      icon: <RiHome9Line size={24} />,
      label: "Home",
    },
    {
      id: "dashboard",
      path: "/dashboard",
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
      id: "help",
      path: "/help",
      icon: <BsQuestionCircle size={24} />,
      label: "Help",
    },
    {
      id: "settings",
      path: "/settings",
      icon: <BsGear size={24} />,
      label: "Settings",
    },
  ];

  return (
    <div className="sidebar-container d-flex flex-column align-items-center">
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

      <style jsx="true">{`
        .sidebar-container {
          width: 70px;
          height: 100vh;
          background: #f5f5f5;
          border-left: 1px solid #ccc;
          padding: 10px 5px;
        }

        .sidebar-item {
          width: 100%;
          font-size: 0.75rem;
          text-align: center;
          cursor: pointer;
          border-radius: 12px;
          padding: 10px;
          transition: all 0.3s ease;
          text-decoration: none;
          color: inherit;
        }

        .sidebar-item:hover {
          background: #f0f0f0;
        }

        .sidebar-item.selected {
          background: #e0f0ff;
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
            border-left: none;
            border-top: 1px solid #ccc;
            padding: 10px 0;
            justify-content: space-around;
          }

          .sidebar-item {
            flex: 1;
            margin-bottom: 0;
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
