import { useParams } from "react-router-dom";
import { useState } from "react";
import API from "../../../api/api.js";
import Loader from "../../ui/Loader.jsx";

const TrackRepair = () => {
  const { token } = useParams();
  const [repair, setRepair] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRepair = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/repairs/track/${token}`);
      setRepair(data);
      setError("");
    } catch (err) {
      setError("Invalid or expired tracking link", err);
    } finally {
      setLoading(false);
    }
  };

  const isCompleted = repair?.status === "completed";

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white border shadow-lg rounded-2xl">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Repair Status
        </h2>

        {error && (
          <p className="mb-4 font-semibold text-center text-red-500">{error}</p>
        )}

        <div className="space-y-3 text-gray-700">
          {repair && (
            <>
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
                  <span>
                    {new Date(repair.completedAt).toLocaleDateString()}
                  </span>
                </p>
              )}
            </>
          )}
        </div>

        {/* Button to fetch status */}
        {!isCompleted && (
          <button
            onClick={fetchRepair}
            disabled={loading}
            className="w-full px-4 py-2 mt-6 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Fetching..." : "View Status"}
          </button>
        )}
      </div>
    </div>
  );
};

export default TrackRepair;
