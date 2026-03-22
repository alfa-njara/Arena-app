import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const token = localStorage.getItem("access_token");
  const userType = localStorage.getItem("user_type");

  if (!token) {
    return <Navigate to="/landing" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userType)) {
    // If user is logged in but doesn't have the right role, redirect to home
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
