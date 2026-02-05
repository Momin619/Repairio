import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../../api/api.js";
import Loader from "@/components/ui/Loader.jsx";

const TrackRepair = () => {
  const { token } = useParams();
  const [repair, setRepair] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepair = async () => {
      try {
        const { data } = await API.get(`/repairs/track/${token}`);
        setRepair(data);
      } catch (err) {
        setError("Invalid or expired tracking link", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepair();
  }, [token]);

  if (loading) return <Loader />;
  if (error)
    return (
      <p className="mt-20 font-semibold text-center text-red-500">{error}</p>
    );

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white border shadow-lg rounded-2xl">
        {/* Header */}
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Repair Status
        </h2>

        {/* Item Info */}
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

        {/* Footer */}
        <div className="mt-6 text-sm text-center text-gray-500">
          Thank you for choosing our service
        </div>
      </div>
    </div>
  );
};

export default TrackRepair;
