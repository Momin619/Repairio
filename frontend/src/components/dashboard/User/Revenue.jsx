import { useEffect, useState } from "react";
import API from "../../../api/api.js";
import Loader from "@/components/ui/Loader.jsx";
import toast from "react-hot-toast";
import RevenueTable from "@/components/ui/Tabel/RevenueTable.jsx";

export default function Revenue() {
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await API.get("/revenue");
        setMonthly(res.data.monthly || []);
      } catch (err) {
        const msg =
          err.response?.data?.message || err.message || "Something went wrong";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen p-4 transition-colors duration-300 sm:p-6 bg-gray-50 dark:bg-gray-900">
      <h1 className="mb-6 text-2xl font-bold text-gray-800 sm:text-3xl dark:text-gray-100">
        Revenue Dashboard
      </h1>

      <RevenueTable monthly={monthly} />
    </div>
  );
}
