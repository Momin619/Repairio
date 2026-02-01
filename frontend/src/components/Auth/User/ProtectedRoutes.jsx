// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Loader from "@/components/ui/Loader";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const {
    auth: { isLoggedIn, role, subscription },
    loading,
  } = useAuth();

  if (loading) return <Loader />;

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  // Seller subscription check
  if (role === "seller") {
    if (!subscription) return <Navigate to="/subscription-expired" replace />;

    if (subscription.status !== "active")
      return <Navigate to="/subscription-expired" replace />;

    const now = new Date();
    const endDate = new Date(subscription.endDate);
    if (now >= endDate) return <Navigate to="/subscription-expired" replace />;
  }

  // Role authorization
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  if (!roles.includes(role)) return <Navigate to="/unauthorized" replace />;

  return children;
};
