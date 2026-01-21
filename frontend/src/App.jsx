import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import LoginPage from "./pages/Auth/User/LoginPage";
import SignupPage from "./pages/Auth/User/SignupPage";
import Dashboard from "./components/dashboard/User/Dashboard";
import NoSubscription from "./components/ui/ErrorPages/NoSubscription";
import NotFound from "./components/ui/ErrorPages/NotFound";
import Unauthorized from "./components/ui/ErrorPages/Unauthorized";
import { ProtectedRoute } from "./components/Auth/User/ProtectedRoutes";
import Navbar from "./components/ui/Navbar";
import AdminLoginPage from "./pages/Auth/Admin/AdminLoginPage";
import AdminSingupPage from "./pages/Auth/Admin/AdminSignupPage";
import AdminDashboardPage from "./pages/Dashboard/Admin/AdminDashboardPage";
import HomePage from "./pages/Home/HomePage";
import AdminUserDetailsPage from "./pages/Dashboard/Admin/AdminUserDetailsPage";
import "./styles/output.css";
import "./styles/app.css";
import SubscriptionExpired from "./components/ui/ErrorPages/SubscriptionExpired";
import { jwtDecode } from "jwt-decode";
export default function App() {
  useEffect(() => {
    let token = localStorage.getItem("token");

    const decoded_value = jwtDecode(token);

    let token_object = {
      id: decoded_value.id,
      expiryDate: new Date(decoded_value.exp * 1000).toLocaleString(),
      creationDate: new Date(decoded_value.exp * 1000).toLocaleString(),
      role: decoded_value.role,
    };
    console.table(token_object);
  }, []);

  return (
    <>
      <Navbar />
      <Toaster position="top-center" />

      <Routes>
        <Route path="/subscription-expired" element={<SubscriptionExpired />} />
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<HomePage />} />
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={"seller"}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin-only route */}
        <Route
          path="/user/:userId"
          element={
            <ProtectedRoute allowedRoles={"admin"}>
              <AdminUserDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/signup" element={<AdminSingupPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={"admin"}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        {/* No subscription */}
        <Route path="/no-subscription" element={<NoSubscription />} />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
