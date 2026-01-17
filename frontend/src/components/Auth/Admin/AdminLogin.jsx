import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import API from "../../../api/api"; // axios instance
import toast from "react-hot-toast";

export default function AdminLogin() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { setAuth } = useAdminAuth();

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/admin/login", data);
      setAuth({
        token: res.data.token,
        role: res.data.role,
        userId: res.data.userId,
        isLoggedIn: res.data.isLoggedIn,
      });
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminRole", res.data.role);
      localStorage.setItem("adminId", res.data.userId);
      localStorage.setItem("adminLoggedIn", res.data.isLoggedIn);

      toast.success("Admin login successful!");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black">
      <div className="w-full max-w-md p-8 bg-white shadow-lg dark:bg-gray-900 rounded-2xl">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-900 dark:text-white">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
