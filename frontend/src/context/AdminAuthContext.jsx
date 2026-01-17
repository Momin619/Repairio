import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("adminToken") || null,
    role: localStorage.getItem("adminRole") || null,
    userId: localStorage.getItem("adminId") || null,
    isLoggedIn: localStorage.getItem("adminLoggedIn") === "true",
  });

  // Attach token to axios
  useEffect(() => {
    if (auth.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [auth.token]);

  return (
    <AdminAuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
