// AuthContext.jsx
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
    subscription: null, // null means no subscription
  });
  const [loading, setLoading] = useState(true);

  const login = (data) => {
    setAuth({
      isLoggedIn: true,
      role: data.role,
      userId: data.userId,
      subscription: data.subscription
        ? {
            ...data.subscription,
            startDate: new Date(data.subscription.startDate),
            endDate: new Date(data.subscription.endDate),
          }
        : null,
    });
  };

  const logout = async () => {
    setAuth({
      isLoggedIn: false,
      role: null,
      userId: null,
      subscription: null,
    });
    try {
      await API.post("/user/logout", {}, { withCredentials: true });
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get("/auth/me", { withCredentials: true });
        login(res.data); // reuse login function
      } catch (err) {
        setAuth({
          isLoggedIn: false,
          role: null,
          userId: null,
          subscription: null,
        });
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
