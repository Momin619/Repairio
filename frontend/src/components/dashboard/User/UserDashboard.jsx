import API from "../../../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import RepairItemList from "./RepairItemList";
export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const subscriptionStatus = localStorage.getItem("subscriptionStatus");
    const subscriptionEndDate = localStorage.getItem("subscriptionEndDate");
    console.log(subscriptionEndDate, subscriptionStatus);

    if (!subscriptionStatus || subscriptionStatus !== "active") {
      toast.error("Your subscription is not active");
      navigate("/subscription-expired");
      return;
    }

    if (subscriptionEndDate && new Date(subscriptionEndDate) < new Date()) {
      toast.error("Your subscription has expired");
      navigate("/subscription-expired");
    }
  }, []);

  return (
    <div>
      <RepairItemList />
    </div>
  );
}
