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
    subscription: null,
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
            status: data.subscription.status,
          }
        : null,
    });
  };

  const logout = async () => {
    const role = auth.role;
    try {
      if (role === "admin") await API.post("/admin/logout");
      else await API.post("/user/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setAuth({
        isLoggedIn: false,
        role: null,
        userId: null,
        subscription: null,
      });
      navigate(role === "admin" ? "/admin/login" : "/login", { replace: true });
    }
  };

  // ------------------------------
  // FRONTEND AUTO REDIRECT LOGIC
  // ------------------------------
  const checkSubscription = async () => {
    if (!auth.isLoggedIn || auth.role !== "seller") return;

    try {
      // Always fetch latest auth + subscription from backend
      const res = await API.get("/auth/me");
      if (res.data.subscription) {
        setAuth((prev) => ({
          ...prev,
          subscription: {
            ...res.data.subscription,
            startDate: new Date(res.data.subscription.startDate),
            endDate: new Date(res.data.subscription.endDate),
            status: res.data.subscription.status,
          },
        }));

        if (res.data.subscription.status === "expired") {
          navigate("/subscription-expired", { replace: true });
        }
      }
    } catch (err) {
      console.error("[AuthContext] Failed to fetch subscription:", err);
    }
  };

  // Check subscription **on mount** and **every 30 seconds**
  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const res = await API.get("/auth/me");
        if (res.data) login(res.data);
      } catch (err) {
        console.error("Error fetching auth info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuth();

    // Poll subscription every 30 seconds
    const interval = setInterval(checkSubscription, 30000);
    return () => clearInterval(interval);
  }, [auth.isLoggedIn]); // only start polling if logged in

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
