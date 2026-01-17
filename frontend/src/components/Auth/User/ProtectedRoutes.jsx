import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { auth } = useAuth();

  if (!auth.token) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(auth.role))
    return <Navigate to="/unauthorized" />;

  return children;
};
