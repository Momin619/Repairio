import { useAuth } from "../../../context/AuthContext";
import API from "../../../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import RepairItemList from "./RepairItemList";
export default function Dashboard() {
  const navigate = useNavigate();

  const checkSubscription = async () => {
    try {
      const res = await API.get("/user/dashboard");
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
      <RepairItemList />
    </div>
  );
}
