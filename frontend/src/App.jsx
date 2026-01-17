import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import Dashboard from "./components/Auth/Dashboard";
import ActivateSubscription from "./components/Auth/ActivateSubscription";
import NoSubscription from "./components/Auth/NoSubscription";
import Unauthorized from "./components/Auth/Unauthorized";
import { ProtectedRoute } from "./components/Auth/ProtectedRoutes";
import Navbar from "./components/ui/Navbar";
import "./styles/output.css";
import "./styles/app.css";
export default function App() {
  return (
    <>
      <Navbar />
      <Toaster position="top-center" />

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin-only route */}
        <Route
          path="/admin/activate"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ActivateSubscription />
            </ProtectedRoute>
          }
        />

        {/* No subscription */}
        <Route path="/no-subscription" element={<NoSubscription />} />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Fallback */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </>
  );
}
