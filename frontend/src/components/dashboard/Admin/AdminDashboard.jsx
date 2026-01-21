import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import API, { setToken } from "../../../api/api";
import toast from "react-hot-toast";
import UsersTable from "@/components/ui/Tabel/UsersTable";
import Loader from "@/components/ui/Loader";
export default function AdminDashboard() {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setToken(auth.token);
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen p-4 bg-gray-100 sm:p-6 md:p-8 dark:bg-black">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>

      {loading ? <Loader /> : <UsersTable users={users} />}
    </div>
  );
}
