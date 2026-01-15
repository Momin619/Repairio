import React from "react";
import "./styles/output.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/HomePage/Home";
import "./styles/app.css";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import ActivateSubscription from "./components/Auth/ActivateSubscription";
import NoSubscription from "./components/Auth/NoSubscription";
import { ProtectedRoute } from "./components/Auth/ProtectedRoutes";
import Unauthorized from "./components/Auth/Unauthorized";
import Dashboard from "./components/Auth/Dashboard";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
export default function App() {
  return (
    <>
      <Router>
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

          {/* No subscription page */}
          <Route path="/no-subscription" element={<NoSubscription />} />

          {/* Unauthorized access */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Redirect unknown routes */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{
          backgroundColor: "#fff",
          color: "#000",
          borderRadius: "12px",
          padding: "12px 16px",
          fontSize: "clamp(0.8rem, 2.5vw, 1rem)", // Responsive font size
          maxWidth: "90vw", // Prevents overflow on small screens
        }}
        bodyClassName="flex items-center justify-center"
      />
    </>
  );
}
