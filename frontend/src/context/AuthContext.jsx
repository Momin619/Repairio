import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/api.js";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
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

    setAuth({
      isLoggedIn: false,
      role: null,
      userId: null,
      subscription: null,
    });

    Cookies.remove("token");
    navigate(role === "admin" ? "/admin/login" : "/login", {
      replace: true,
    });
  };

  useEffect(() => {
    if (!auth.subscription?.endDate) return;

    const now = Date.now();
    const end = new Date(auth.subscription.endDate).getTime();

    // check if subscription is expired
    if (now >= end && auth.subscription.status !== "expired") {
      console.log("Subscription expired - updating context and redirecting");

      setAuth((prev) => ({
        ...prev,
        subscription: {
          ...prev.subscription,
          status: "expired",
        },
      }));

      navigate("/subscription-expired", { replace: true });
    }
  }, [location.pathname, navigate]); // remove auth.subscription from dependencies

  // ---------------- AUTO EXPIRY REDIRECT ----------------

  // ---------------- FETCH AUTH ON LOAD ----------------
  useEffect(() => {
    // already logged in, no need to fetch

    const fetchAuth = async () => {
      try {
        const res = await API.get("/auth/me");
        if (res.data) login(res.data);
      } catch (err) {
        console.error("Auth fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuth();
  }, [location.pathname, navigate]);

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
