import { useEffect, useState, useRef } from "react";
import API from "../../../api/api.js";
import Loader from "../../ui/Loader.jsx";
import toast from "react-hot-toast";
import RevenueTable from "../../ui/Tabel/RevenueTable.jsx";

export default function Revenue() {
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);

  const controllerRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;

    const fetchRevenue = async () => {
      try {
        const res = await API.get("/revenue", { signal: controller.signal });
        if (!controller.signal.aborted) setMonthly(res.data.monthly || []);
      } catch (err) {
        if (!controller.signal.aborted) {
          toast.error(err.response?.data?.message || "Something went wrong");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchRevenue();

    return () => {
      controller.abort();
    };
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">
        Revenue Dashboard
      </h1>
      <RevenueTable monthly={monthly} />
    </div>
  );
}
