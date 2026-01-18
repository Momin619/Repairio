import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import API from "../../../api/api";
import toast from "react-hot-toast";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaUserCheck,
  FaUserClock,
} from "react-icons/fa";
import ReactVirtualizedTable from "@/components/Test";
export default function AdminDashboard() {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users", {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setUsers(res.data);
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  const approveUser = async (userId) => {
    try {
      const res = await API.post(
        `/admin/approve/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${auth.token}` } },
      );
      toast.success(res.data.message);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Approval failed");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen p-4 bg-gray-100 sm:p-6 md:p-8 dark:bg-black">
      {/* Header */}
      <h1 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
        Admin Dashboard
      </h1>
      <ReactVirtualizedTable />
      {/* Table Card */}
      <div className="w-full overflow-x-auto bg-white shadow-xl dark:bg-gray-900 rounded-2xl">
        <table className="w-full text-sm min-w-150 sm:text-base">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr className="text-gray-700 dark:text-gray-300">
              <th className="px-4 py-3 text-left sm:px-6">User</th>
              <th className="px-4 py-3 sm:px-6">Status</th>
              <th className="px-4 py-3 sm:px-6">Subscription</th>
              <th className="px-4 py-3 text-center sm:px-6">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="transition border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {/* User Info */}
                <td className="px-4 sm:px-6 py-3 wrap-break-words max-w-37.5 sm:max-w-none">
                  <div className="font-semibold text-gray-900 truncate dark:text-white">
                    {u.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate sm:text-sm dark:text-gray-300">
                    {u.email}
                  </div>
                </td>

                {/* Active Status */}
                <td className="px-4 py-3 text-sm sm:px-6 sm:text-base">
                  {u.isActive ? (
                    <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <FaCheckCircle /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-yellow-500 dark:text-yellow-400">
                      <FaUserClock /> Pending
                    </span>
                  )}
                </td>

                {/* Subscription */}
                <td className="px-4 py-3 text-sm sm:px-6 sm:text-base">
                  {u.subscription ? (
                    <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <FaCheckCircle /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-red-500 dark:text-red-400">
                      <FaTimesCircle /> None
                    </span>
                  )}
                </td>

                {/* Action */}
                <td className="px-4 py-3 text-center sm:px-6">
                  {!u.isActive && (
                    <button
                      onClick={() => approveUser(u._id)}
                      className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white transition bg-green-600 rounded-lg hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/30"
                    >
                      <FaUserCheck /> Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty state */}
        {users.length === 0 && (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No users found
          </div>
        )}
      </div>
    </div>
  );
}
