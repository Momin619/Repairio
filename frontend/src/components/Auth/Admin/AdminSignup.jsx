import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import API from "../../../api/api";

export default function AdminSignup() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange" });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const redirect = useNavigate();
  const onSubmit = async (data) => {
    try {
      const res = await API.post("/admin/signup", data);
      toast.success(res.data.message || "Admin created successfully!");
      redirect("/admin/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  const password = watch("password");

  return (
    <div className="flex items-center justify-center min-h-[100vh] px-4 bg-gray-100 dark:bg-black">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl dark:bg-gray-900 sm:p-8">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-900 dark:text-white">
          Create Admin
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="relative">
            <input
              type="text"
              placeholder="Name"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 5,
                  message: "Name must be at least 5 characters",
                },
              })}
              className={`w-full px-4 py-2 border rounded-lg
                text-black dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                ${errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className={`w-full px-4 py-2 border rounded-lg
                text-black dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", {
                required: "Password is required",

                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/,
                  message:
                    "Password must include uppercase, lowercase, number & special character",
                },
              })}
              className={`w-full px-4 py-2 border rounded-lg
                text-black dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                ${errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className={`w-full px-4 py-2 border rounded-lg
                text-black dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                ${errors.confirmPassword ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white cursor-pointer"
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 text-white transition-colors bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
