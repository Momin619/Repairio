import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./styles/app.css";
import "./styles/output.css";
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
import SubscriptionExpired from "./components/ui/ErrorPages/SubscriptionExpired";
import RepairHistoryPage from "./pages/Dashboard/User/RepairHistoryPage";
import SellerDock from "./components/ui/SellerDock";
import { useAuth } from "./context/AuthContext";
import SettingPage from "./pages/Setting/SettingPage";
import RevenuePage from "./pages/Dashboard/User/RevenuePage";
import TrackRepairItemPage from "./pages/Dashboard/User/TrackRepairItemPage";
import ContactUsPage from "./pages/ContactUs/ContactUsPage";
export default function App() {
  const {
    auth: { role, isLoggedIn },
  } = useAuth();

  // get current path
  const location = useLocation();

  // List of pages where Navbar/SellerDock should NOT be shown

  // Function to check if current path is in hideLayoutPaths
  const hideLayout = location.pathname.startsWith("/track/");

  return (
    <>
      <Toaster position="top-center" />

      {/* Only show Navbar if not a public tracking page */}
      {!hideLayout && <Navbar />}

      <Routes>
        {/* Public tracking page */}
        <Route path="/track/:token" element={<TrackRepairItemPage />} />

        {/* Other public routes */}
        <Route path="/subscription-expired" element={<SubscriptionExpired />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        {/* Protected routes for seller */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <UserDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/revenue"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <RevenuePage />
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

        {/* Admin-only */}
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

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Only show SellerDock if logged in as seller AND not on tracking page */}
      {isLoggedIn && role === "seller" && !hideLayout && <SellerDock />}
    </>
  );
}
