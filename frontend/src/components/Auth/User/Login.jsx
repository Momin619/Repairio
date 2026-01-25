import { useForm } from "react-hook-form";
import API from "../../../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import toast from "react-hot-toast"; // ✅ import toast
import { Link } from "react-router-dom";
export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange" });
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/user/login", data);

      // Save auth info in context
      setAuth({
        token: res.data.token,
        role: res.data.role,
        userId: res.data.userId,
        isLoggedIn: res.data.isLoggedIn,
      });

      // Store subscription info in localStorage (for sellers)

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      const code = err.response?.data?.code;

      if (code === "EXPIRED") {
        toast.error(err.response.data.message || "Subscription expired");
        navigate("/subscription-expired"); // optional page for expired subscription
      } else if (code === "INACTIVE") {
        toast.error(err.response.data.message || "Account not active");
      } else if (code === "INVALID") {
        toast.error("Invalid email or password");
      } else {
        toast.error(err.response?.data?.message || "Login failed. Try again");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md p-4 bg-white shadow-lg sm:p-8 dark:bg-gray-900 rounded-2xl">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-900 dark:text-white">
          Login
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 sm:space-y-5"
        >
          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute text-gray-400 left-3 top-3 dark:text-gray-300" />
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // strict email regex
                  message: "Please enter a valid email address",
                },
              })}
              className={`pl-10 w-full px-4 py-2 rounded-lg focus:outline-none border
    ${
      errors.email
        ? "border-red-500 focus:ring-2 focus:ring-red-400 dark:border-red-500 dark:focus:ring-red-400"
        : "border-gray-300 focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:focus:ring-gray-400"
    }
    text-gray-900 dark:text-white placeholder-black dark:placeholder-white
  `}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute text-gray-400 left-3 top-3 dark:text-gray-300" />
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Password is required" })}
              placeholder="Password"
              className={`pl-10 pr-10 w-full px-4 py-2 rounded-lg focus:outline-none border
    ${
      errors.password
        ? "border-red-500 focus:ring-2 focus:ring-red-400 dark:border-red-500 dark:focus:ring-red-400"
        : "border-gray-300 focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:focus:ring-gray-400"
    }
    text-gray-900 dark:text-white placeholder-black dark:placeholder-white
  `}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 font-semibold text-white transition bg-black rounded-lg cursor-pointer hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            {isSubmitting ? "Submitting..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-300">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-black dark:text-white hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
