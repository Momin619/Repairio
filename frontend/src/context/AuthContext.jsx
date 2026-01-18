import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"), // "user" | "admin"
    userId: localStorage.getItem("userId"),
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  });

  // Sync axios + localStorage
  useEffect(() => {
    if (auth.token) {
      axios.defaults.headers.common.Authorization = `Bearer ${auth.token}`;
      localStorage.setItem("token", auth.token);
      localStorage.setItem("role", auth.role);
      localStorage.setItem("userId", auth.userId);
      localStorage.setItem("isLoggedIn", "true");
    } else {
      delete axios.defaults.headers.common.Authorization;
      localStorage.clear();
    }
  }, [auth]);

  // ✅ ROLE-AWARE LOGOUT
  const logout = () => {
    const role = auth.role;

    setAuth({
      token: null,
      role: null,
      userId: null,
      isLoggedIn: false,
    });

    // redirect after logout
    if (role === "admin") {
      navigate("/admin/login", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
