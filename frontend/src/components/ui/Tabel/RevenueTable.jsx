import React from "react";

export default function RevenueTable({ monthly }) {
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

  return (
    <div className="p-4 overflow-x-auto transition-colors duration-300 bg-white shadow rounded-xl dark:bg-gray-800">
      <h2 className="mb-4 text-lg font-semibold text-gray-700 sm:text-xl dark:text-gray-200">
        Monthly Revenue (30-Day Cycles)
      </h2>

      <table className="min-w-full divide-y divide-gray-200 table-auto dark:divide-gray-700">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700">
            <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 sm:text-sm dark:text-gray-300">
              Cycle
            </th>
            <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 sm:text-sm dark:text-gray-300">
              Period
            </th>
            <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 sm:text-sm dark:text-gray-300">
              Revenue (PKR)
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {monthly.length === 0 ? (
            <tr>
              <td
                colSpan="3"
                className="px-3 py-6 text-sm text-center text-gray-500 dark:text-gray-300 sm:text-base"
              >
                No revenue data available
              </td>
            </tr>
          ) : (
            monthly.map((m, i) => (
              <tr
                key={i}
                className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-3 py-2 text-sm font-medium text-black sm:text-base dark:text-gray-100">
                  {m.cycle}
                </td>
                <td className="px-3 py-2 text-sm text-black sm:text-base dark:text-gray-100">
                  {formatRange(m.start, m.end)}
                </td>
                <td className="px-3 py-2 text-sm font-semibold text-green-600 sm:text-base dark:text-green-400">
                  {m.total.toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
