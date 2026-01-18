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
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-black">
      {/* Header */}
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>

      {/* Table Card */}
      <div className="overflow-x-auto bg-white shadow-xl dark:bg-gray-900 rounded-2xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr className="text-gray-700 dark:text-gray-300">
              <th className="px-6 py-4 text-left">User</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Subscription</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="transition border-t border-gray-200  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {/* User Info */}
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {u.name}
                  </div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                </td>

                {/* Active Status */}
                <td className="px-6 py-4">
                  {u.isActive ? (
                    <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <FaCheckCircle /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-yellow-500">
                      <FaUserClock /> Pending
                    </span>
                  )}
                </td>

                {/* Subscription */}
                <td className="px-6 py-4">
                  {u.subscription ? (
                    <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <FaCheckCircle /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-red-500">
                      <FaTimesCircle /> None
                    </span>
                  )}
                </td>

                {/* Action */}
                <td className="px-6 py-4 text-center">
                  {!u.isActive && (
                    <button
                      onClick={() => approveUser(u._id)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition bg-green-600 rounded-lg  hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/30"
                    >
                      <FaUserCheck />
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty state */}
        {users.length === 0 && (
          <div className="p-6 text-center text-gray-500">No users found</div>
        )}
      </div>
    </div>
  );
}
