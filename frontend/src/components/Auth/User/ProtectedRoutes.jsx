import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Loader from "@/components/ui/Loader";
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const {
    auth: { isLoggedIn, role },
    loading,
  } = useAuth();

  if (loading || !isLoggedIn) return <Loader />; // wait for auth check

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!roles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
