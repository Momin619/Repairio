import { useEffect, useState } from "react";
import API from "../../../api/api.js";
import Loader from "@/components/ui/Loader.jsx";

function Revenue() {
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);
  const ordinal = (n) => {
    if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
    switch (n % 10) {
      case 1:
        return `${n}st`;
      case 2:
        return `${n}nd`;
      case 3:
        return `${n}rd`;
      default:
        return `${n}th`;
    }
  };

  const formatPrettyDate = (dateStr) => {
    const date = new Date(dateStr);

    const day = ordinal(date.getDate());
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return `${day} ${month}, ${year}`;
  };

  const formatRange = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);

    const sameMonth =
      s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();

    if (sameMonth) {
      return `${ordinal(s.getDate())}–${ordinal(e.getDate())} ${s.toLocaleString(
        "default",
        { month: "long" },
      )}, ${s.getFullYear()}`;
    }

    return `${formatPrettyDate(start)} → ${formatPrettyDate(end)}`;
  };

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await API.get("/revenue");
        setMonthly(res.data.monthly || []);
      } catch (err) {
        console.error("Error fetching revenue:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        Revenue Dashboard
      </h1>

      {/* ---------------- ROLLING MONTHLY ---------------- */}
      <div className="p-6 bg-white shadow rounded-xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">
          Monthly Revenue (30-Day Cycles)
        </h2>

        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-sm text-left text-gray-500">
                Cycle
              </th>
              <th className="px-4 py-2 text-sm text-left text-gray-500">
                Period
              </th>
              <th className="px-4 py-2 text-sm text-left text-gray-500">
                Revenue (PKR)
              </th>
            </tr>
          </thead>

          <tbody>
            {monthly.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-4 py-6 text-center text-gray-500">
                  No revenue data available
                </td>
              </tr>
            ) : (
              monthly.map((m, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2 font-medium text-black">
                    {m.cycle}
                  </td>
                  <td className="px-4 py-2 text-black">
                    {formatRange(m.start, m.end)}
                  </td>
                  <td className="px-4 py-2 font-semibold text-green-600">
                    {m.total.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Revenue;
