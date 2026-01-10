import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const VerifyUser = () => {
  const { authUser } = useAuth();
 console.log("authUser:", authUser);

  return authUser ? <Outlet /> : <Navigate to="/login" />;
  
};

export default VerifyUser;
