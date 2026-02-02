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

  // ---- LOGIN ----
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

  // ---- LOGOUT ----
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
  useEffect(() => {
    if (!auth.subscription || auth.subscription.status === "expired") return;

    const now = new Date();
    const endDate = new Date(auth.subscription.endDate);
    const timeLeft = endDate - now;

    // Capture the subscription object
    const subscription = auth.subscription;

    const handleExpiry = async (sub) => {
      try {
        if (!sub) return;
        // Call backend to mark subscription as expired
        await API.patch(`/user/subscription/expire/${sub._id}`);
        console.log("[AuthContext] Subscription marked expired in DB");

        // Update frontend state
        setAuth((prev) => ({
          ...prev,
          subscription: prev.subscription
            ? { ...prev.subscription, status: "expired" }
            : null,
        }));

        // Redirect to subscription expired page
        navigate("/subscription-expired", { replace: true });
      } catch (err) {
        console.error("[AuthContext] Failed to expire subscription:", err);
      }
    };

    if (timeLeft <= 0) {
      // Already expired
      handleExpiry(subscription);
      return;
    }

    const timer = setTimeout(() => handleExpiry(subscription), timeLeft);

    return () => clearTimeout(timer);
  }, [auth.subscription, navigate]);

  // ---- FETCH CURRENT AUTH ----
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
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
