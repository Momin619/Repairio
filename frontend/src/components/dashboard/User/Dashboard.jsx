import { useAuth } from "../../../context/AuthContext";
import API, { setToken } from "../../../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function Dashboard() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const checkSubscription = async () => {
    try {
      setToken(auth.token);
      const res = await API.get("/auth/dashboard");
      console.log(res.data);
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error(error.response.data.message);
        navigate("/subscription-expired");
      }
    }
  };

  useEffect(() => {
    checkSubscription();
  }, []);
  return (
    <div>
      <h1>Welcome, {auth.role}</h1>
      <p>User ID: {auth.userId}</p>
    </div>
  );
}
