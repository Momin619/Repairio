import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const expiryTimerRef = useRef(null);

  const [auth, setAuth] = useState({
    isLoggedIn: false,
    role: null,
    userId: null,
    subscription: null,
  });

  const [loading, setLoading] = useState(true);

  // ---------------- LOGIN ----------------
  const login = (data) => {
    setAuth({
      isLoggedIn: true,
      role: data.role,
      userId: data.userId,
      subscription: data.subscription
        ? {
            _id: data.subscription._id,
            startDate: new Date(data.subscription.startDate),
            endDate: new Date(data.subscription.endDate),
            status: data.subscription.status, // just copy, do NOT mutate
          }
        : null,
    });
  };

  // ---------------- LOGOUT ----------------
  const logout = async () => {
    const role = auth.role;

    try {
      if (role === "admin") {
        await API.post("/admin/logout");
      } else {
        await API.post("/user/logout");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }

    clearTimeout(expiryTimerRef.current);

    setAuth({
      isLoggedIn: false,
      role: null,
      userId: null,
      subscription: null,
    });

    navigate(role === "admin" ? "/admin/login" : "/login", {
      replace: true,
    });
  };

  useEffect(() => {
    if (!auth.subscription?.endDate || auth.subscription.status === "expired")
      return;

    const checkExpiry = async () => {
      const now = Date.now();
      const end = new Date(auth.subscription.endDate).getTime();

      if (now >= end) {
        console.log("[SUBSCRIPTION EXPIRED] Redirecting user");

        // Update frontend state
        setAuth((prev) => ({
          ...prev,
          subscription: { ...prev.subscription, status: "expired" },
        }));

        // Call backend once
        try {
          await API.post("/subscription/expire", {
            subscriptionId: auth.subscription._id,
          });
          console.log("[BACKEND UPDATED] Subscription marked expired");
        } catch (err) {
          console.error("[BACKEND ERROR] Failed to update subscription", err);
        }

        // Stop interval
        clearInterval(interval);

        // Redirect user
        navigate("/subscription-expired", { replace: true });
      }
    };

    // Run immediately
    checkExpiry();

    // Run every 10s for testing
    const interval = setInterval(checkExpiry, 10 * 1000);

    return () => clearInterval(interval);
  }, [auth.subscription?.endDate, auth.subscription?.status]);

  // ---------------- AUTO EXPIRY REDIRECT ----------------

  // ---------------- FETCH AUTH ON LOAD ----------------
  useEffect(() => {
    let isMounted = true; // flag to track if component is still mounted

    const fetchAuth = async () => {
      try {
        const res = await API.get("/auth/me");
        if (isMounted && res.data) {
          login(res.data); // only call login if still mounted
        }
      } catch (err) {
        if (isMounted) {
          console.error("Auth fetch failed:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false); // only update state if mounted
        }
      }
    };

    fetchAuth();

    // cleanup function runs on unmount
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
