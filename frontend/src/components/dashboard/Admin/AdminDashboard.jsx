import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import API from "../../../api/api";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users", {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  const approveUser = async (userId) => {
    try {
      const res = await API.post(
        `/admin/approve/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        },
      );
      toast.success(res.data.message);
      fetchUsers(); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Approval failed");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-black">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-400">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Active</th>
            <th className="px-4 py-2">Subscription</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u._id}
              className="border-b border-gray-300 dark:border-gray-700"
            >
              <td className="px-4 py-2">{u.name}</td>
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2">{u.isActive ? "Yes" : "No"}</td>
              <td className="px-4 py-2">
                {u.subscription ? "Active" : "None"}
              </td>
              <td className="px-4 py-2">
                {!u.isActive && (
                  <button
                    onClick={() => approveUser(u._id)}
                    className="px-2 py-1 text-white bg-green-500 rounded-lg"
                  >
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
