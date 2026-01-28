import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LoginPage from "./pages/Auth/User/LoginPage";
import SignupPage from "./pages/Auth/User/SignupPage";
import UserDashboardPage from "./pages/Dashboard/User/UserDashboardPage";
import RepairItemFormPage from "./pages/Dashboard/User/RepairItemFormPage";
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
import RepairHistoryPage from "./pages/Dashboard/User/RepairHistoryPage";
import SellerDock from "./components/ui/SellerDock";
import { useAuth } from "./context/AuthContext";
import SettingPage from "./pages/Setting/SettingPage";
export default function App() {
  const {
    auth: { role, isLoggedIn },
  } = useAuth();

  return (
    <>
      <Navbar />
      <Toaster position="top-center" />

      <Routes>
        <Route path="/subscription-expired" element={<SubscriptionExpired />} />
        <Route path="/settings" element={<SettingPage />} />
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<HomePage />} />
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <UserDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/repair-item"
          element={
            <ProtectedRoute allowedRoles={"seller"}>
              <RepairItemFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/repair-history"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <RepairHistoryPage />
            </ProtectedRoute>
          }
        />
        {/* Admin-only route */}
        <Route
          path="/user/:userId"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
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

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {isLoggedIn && role === "seller" && <SellerDock />}
    </>
  );
}
