import { useEffect, useState } from "react";
import API from "../../../api/api.js";
import Loader from "@/components/ui/Loader";
export default function RepairHistory() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepairs = async () => {
      try {
        const res = await API.get("/repair-items/history/completed");

        // ✅ Only completed repairs
        const completedRepairs = res.data.filter(
          (item) => item.status === "completed",
        );

        setRepairs(completedRepairs);
      } catch (err) {
        console.error("Failed to fetch repair history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepairs();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50 dark:bg-black">
      <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">
        Repair History
      </h1>

      {repairs.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No completed repairs found.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {repairs.map((item) => (
            <div
              key={item._id}
              className="p-4 bg-white rounded-lg shadow dark:bg-gray-900"
            >
              <img
                src={`http://localhost:4500/${item.images?.[0]}`}
                alt={item.itemName}
                className="object-cover w-full h-40 mb-4 rounded"
              />

              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {item.itemName}
              </h2>

              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Problem: {item.problem}
              </p>

              <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                <p>Customer: {item.customer?.name}</p>
                <p>Phone: {item.customer?.phone}</p>
              </div>

              <span className="inline-block px-3 py-1 mt-4 text-sm text-green-700 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                Completed
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
