import React, { useState } from "react";
import {
  BsSpeedometer2,
  BsPerson,
  BsChatDots,
  BsQuestionCircle,
  BsGear,
} from "react-icons/bs";
import { RiHome9Line } from "react-icons/ri";
const Sidebar = () => {
  const [selected, setSelected] = useState("dashboard");

  const items = [
    { id: "Home", icon: <RiHome9Line size={24} />, label: "Home" },
    { id: "profile", icon: <BsPerson size={24} />, label: "Profile" },
    { id: "messages", icon: <BsChatDots size={24} />, label: "Messages" },
    { id: "help", icon: <BsQuestionCircle size={24} />, label: "Help" },
    { id: "settings", icon: <BsGear size={24} />, label: "Settings" },
  ];

  return (
    <div className="sidebar-container d-flex flex-column align-items-center">
      {items.map((item) => (
        <div
          key={item.id}
          className={`sidebar-item d-flex flex-column align-items-center justify-content-center mb-3 ${
            selected === item.id ? "selected" : ""
          }`}
          onClick={() => setSelected(item.id)}
        >
          <div className="icon">{item.icon}</div>
          <small className="mt-1">{item.label}</small>
        </div>
      ))}

      <style jsx="true">{`
        .sidebar-container {
          width: 100px;
          height: 100vh;
          background: #fff;
          border-left: 1px solid #ccc;
          padding: 20px 5px;
          position: relative;
        }

        .sidebar-item {
          width: 100%;
          font-size: 0.75rem;
          text-align: center;
          cursor: pointer;
          border-radius: 12px;
          padding: 10px;
          transition: all 0.3s ease;
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
            border-left: none;
            border-top: 1px solid #ccc;
            padding: 10px 0;
            justify-content: space-around;
          }

          .sidebar-item {
            flex: 1;
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
