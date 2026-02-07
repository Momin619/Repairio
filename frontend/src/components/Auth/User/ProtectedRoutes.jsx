import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Loader from "../../ui/Loader";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const {
    auth: { isLoggedIn, role, subscription },
    loading,
  } = useAuth();

  if (loading) return <Loader />;

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  // Seller subscription check
  if (role === "seller" && subscription?.status === "expired") {
    return <Navigate to="/subscription-expired" replace />;
  }

  // Role authorization
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!roles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
