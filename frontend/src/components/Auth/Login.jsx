import { useForm } from "react-hook-form";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import toast from "react-hot-toast"; // ✅ import toast
import { Link } from "react-router-dom";
export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/auth/login", data);
      setAuth({
        token: res.data.token,
        role: res.data.role,
        userId: res.data.userId,
      });
      localStorage.setItem("token", res.data.token);

      toast.success("Login successful!"); // ✅ success toast
      navigate("/dashboard");
    } catch (err) {
      const code = err.response?.data?.code;
      if (code === "NO_SUBSCRIPTION") {
        toast.error("You don’t have an active subscription."); // ❌ error toast
        navigate("/no-subscription");
      } else if (code === "INACTIVE") {
        toast.error("Your account is not approved yet.");
      } else {
        toast.error("Login failed. Check your credentials.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 dark:bg-black">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400 dark:text-gray-300" />
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Email"
              className={`pl-10 w-full px-4 py-2 rounded-lg focus:outline-none transition
                ${
                  errors.email
                    ? "border border-red-500 focus:ring-2 focus:ring-red-400 text-white placeholder-gray-300 dark:text-white dark:placeholder-gray-400"
                    : "border border-gray-300 focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:focus:ring-gray-400 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400 dark:text-gray-300" />
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Password is required" })}
              placeholder="Password"
              className={`pl-10 pr-10 w-full px-4 py-2 rounded-lg focus:outline-none transition
                ${
                  errors.password
                    ? "border border-red-500 focus:ring-2 focus:ring-red-400 text-white placeholder-gray-300 dark:text-white dark:placeholder-gray-400"
                    : "border border-gray-300 focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:focus:ring-gray-400 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              w-full py-3 font-semibold rounded-lg
              bg-black text-white
              hover:bg-gray-900 dark:bg-white cursor-pointer dark:text-black dark:hover:bg-gray-200
              transition
            "
          >
            {isSubmitting ? "Submitting..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-black dark:text-white hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
