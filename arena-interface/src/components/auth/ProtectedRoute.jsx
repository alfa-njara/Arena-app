import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const token = localStorage.getItem("access_token");
  const userType = localStorage.getItem("user_type");

  if (!token) {
    return <Navigate to="/landing" replace />;
  }

  if (allowedRoles.length > 0) {
    const isAllowed = allowedRoles.includes(userType) || (allowedRoles.includes("admin") && localStorage.getItem("is_staff") === "true");
    if (!isAllowed) {
      return <Navigate to="/home" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
