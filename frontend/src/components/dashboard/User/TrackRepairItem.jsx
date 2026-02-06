import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import API from "../../../api/api.js";
import Loader from "@/components/ui/Loader.jsx";

const TrackRepair = () => {
  const { token } = useParams();
  const [repair, setRepair] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  // Fetch repair data
  const fetchRepair = async () => {
    console.log("Fetching repair data for token:", token);
    try {
      const { data } = await API.get(`/repairs/track/${token}`);
      console.log("Fetched repair data:", data);
      setRepair(data);
      setError("");

      // Stop polling if repair completed
      if (data.status === "completed") stopPolling();
    } catch (err) {
      console.error("Error fetching repair:", err);
      setError("Invalid or expired tracking link");
      stopPolling();
    } finally {
      setLoading(false);
    }
  };

  const startPolling = () => {
    // Don't start polling if repair already completed
    if (repair?.status === "completed") return;

    if (!intervalRef.current) {
      console.log("Starting polling...");
      intervalRef.current = setInterval(() => {
        console.log("Polling API...");
        fetchRepair();
      }, 5000);
    }
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      console.log("Stopping polling...");
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    console.log("Setting up polling effect");

    fetchRepair(); // initial fetch

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") startPolling();
      else stopPolling();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Start polling immediately if tab is visible
    if (document.visibilityState === "visible") startPolling();

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [token]); // include repair to check status before starting polling

  if (loading) return <Loader />;
  if (error)
    return (
      <p className="mt-20 font-semibold text-center text-red-500">{error}</p>
    );

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white border shadow-lg rounded-2xl">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Repair Status
        </h2>

        <div className="space-y-3 text-gray-700">
          <p className="flex justify-between">
            <span className="font-semibold">Item</span>
            <span>{repair.itemName}</span>
          </p>

          <p className="flex justify-between">
            <span className="font-semibold">Customer</span>
            <span>{repair.customer.name}</span>
          </p>

          <p className="flex items-center justify-between">
            <span className="font-semibold">Status</span>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full capitalize
                ${
                  repair.status === "completed"
                    ? "bg-green-50 text-green-600 border border-green-200"
                    : repair.status === "in-repair"
                      ? "bg-amber-50 text-amber-600 border border-amber-200"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                }`}
            >
              {repair.status.replace("-", " ")}
            </span>
          </p>

          <p className="flex justify-between">
            <span className="font-semibold">Repair Cost</span>
            <span className="font-bold text-gray-900">
              Rs {repair.repairCost}
            </span>
          </p>

          {repair.completedAt && (
            <p className="flex justify-between">
              <span className="font-semibold">Completed At</span>
              <span>{new Date(repair.completedAt).toLocaleDateString()}</span>
            </p>
          )}
        </div>

        <div className="mt-6 text-sm text-center text-gray-500">
          Thank you for choosing our service
        </div>
      </div>
    </div>
  );
};

export default TrackRepair;
