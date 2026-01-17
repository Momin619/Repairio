import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import App from "./App";

import "./styles/output.css";
import "./styles/app.css";
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AdminAuthProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </AdminAuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
