import { useEffect, useState } from "react";
import API from "../../../api/api.js";
import Loader from "@/components/ui/Loader.jsx";
function Revenue() {
  const [revenue, setRevenue] = useState({
    daily: [],
    weekly: [],
    monthly: [],
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await API.get("/revenue");
        setRevenue(res.data);
      } catch (err) {
        console.error("Error fetching revenue:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, []);

  const monthName = (year, month) =>
    new Date(year, month - 1).toLocaleString("default", { month: "long" });

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        Revenue Dashboard
      </h1>

      {/* ---------------- DAILY ---------------- */}
      <div className="p-6 mb-8 shadow rounded-xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">
          Daily Revenue
        </h2>

        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-sm text-left text-gray-500">
                Date
              </th>
              <th className="px-4 py-2 text-sm text-left text-gray-500">
                Revenue (PKR)
              </th>
            </tr>
          </thead>
          <tbody>
            {revenue.daily.map((d) => (
              <tr key={d.date} className="border-t">
                <td className="px-4 py-2 text-black">{d.date}</td>
                <td className="px-4 py-2 font-semibold text-green-600">
                  {d.total.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------- WEEKLY ---------------- */}
      {/* ---------------- WEEKLY ---------------- */}
      <div className="p-6 mb-8 bg-white shadow rounded-xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">
          Weekly Revenue
        </h2>

        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-sm text-left text-gray-500">
                Week Period
              </th>
              <th className="px-4 py-2 text-sm text-left text-gray-500">
                Revenue (PKR)
              </th>
            </tr>
          </thead>
          <tbody>
            {revenue.weekly.map((w, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2 text-black">
                  {w.start} - {w.end}
                </td>
                <td className="px-4 py-2 font-semibold text-blue-600">
                  {w.total.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------- MONTHLY ---------------- */}
      <div className="p-6 mb-8 bg-white shadow rounded-xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">
          Monthly Revenue
        </h2>

        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-sm text-left text-gray-500">
                Month
              </th>
              <th className="px-4 py-2 text-sm text-left text-gray-500">
                Revenue (PKR)
              </th>
            </tr>
          </thead>
          <tbody>
            {revenue.monthly.map((m, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2 text-black">
                  {monthName(m.year, m.month)} {m.year}
                </td>
                <td className="px-4 py-2 font-semibold text-purple-600">
                  {m.total.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Revenue;
