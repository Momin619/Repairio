import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.js";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    role: null,
    userId: null,
  });
  const [loading, setLoading] = useState(true);
  const login = (data) => {
    setAuth({
      isLoggedIn: true,
      role: data.role,
      userId: data.userId,
    });
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get("/auth/me");
        login(res.data);
        console.log(res.data);
      } catch (error) {
        console.log("not logged in or token expired", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const logout = async () => {
    const currentRole = auth.role; // capture role before clearing

    setAuth({ isLoggedIn: false, role: null, userId: null });

    try {
      if (currentRole === "admin") {
        await API.post("/admin/logout", {}, { withCredentials: true });
        navigate("/admin/login", { replace: true });
      } else {
        await API.post("/user/logout", {}, { withCredentials: true });
        navigate("/login", { replace: true });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
