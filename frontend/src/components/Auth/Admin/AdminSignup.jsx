import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import API from "../../../api/api";
import toast from "react-hot-toast";

export default function AdminSignup() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/admin/signup", data);

      setAuth({
        token: res.data.token,
        role: "admin",
        userId: res.data.adminId,
        isLoggedIn: true,
      });

      toast.success("Admin created successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black">
      <div className="w-full max-w-md p-8 bg-white shadow-lg dark:bg-gray-900 rounded-2xl">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-900 dark:text-white">
          Admin Signup
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            {...register("name", { required: true })}
            className="w-full px-4 py-2 border rounded-lg"
          />

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
            className="w-full py-2 text-white transition bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Create Admin
          </button>
        </form>
      </div>
    </div>
  );
}
