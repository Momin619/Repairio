import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Loader from "@/components/ui/Loader";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const {
    auth: { isLoggedIn, role, subscription },
    loading,
  } = useAuth();

  // Wait until auth status is loaded
  if (loading) return <Loader />;

  // If not logged in, redirect to login
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  // If subscription is expired or not present, redirect to subscribe page
  if (role === "seller" && (!subscription || subscription.status !== "active"))
    return <Navigate to="/subscription-expired" replace />;

  // Check role access
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  if (!roles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User passed all checks, render children
  return children;
};
