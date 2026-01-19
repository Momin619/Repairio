import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import MUIProvider from "./components/ui/Tabel/MUIProvider";
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <MUIProvider>
          <App />
        </MUIProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
