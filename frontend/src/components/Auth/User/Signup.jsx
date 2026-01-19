import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api.js";
import {
  FaUser,
  FaStore,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import toast from "react-hot-toast"; // ✅ import toast
import { Link } from "react-router-dom";
import { FaPhone } from "react-icons/fa";

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange" });

  const onSubmit = async (data) => {
    try {
      delete data.confirmPassword; // remove confirmPassword before sending
      const res = await API.post("/auth/signup", data);

      toast.success(res.data.message || "Account created!"); // ✅ toast
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed"); // ❌ toast
    }
  };

  // Common input classes
  const inputClass = `
    pl-10 w-full px-4 py-2 rounded-lg focus:outline-none transition
    text-gray-900 dark:text-white placeholder-black dark:placeholder-white
    border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 dark:bg-gray-700
  `;

  const errorInputClass = `
    pl-10 w-full px-4 py-2 rounded-lg focus:outline-none transition
    text-gray-900 dark:text-white placeholder-black dark:placeholder-white
    border border-red-500 focus:ring-2 focus:ring-red-400 dark:border-red-500 dark:focus:ring-red-400 dark:bg-gray-700
  `;

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100 dark:bg-black">
      <div className="w-full max-w-md p-8 bg-white shadow-lg dark:bg-gray-900 rounded-2xl">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-900 dark:text-white">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div className="relative">
            <FaUser className="absolute text-gray-400 left-3 top-3 dark:text-gray-300" />
            <input
              type="text"
              placeholder="Full Name"
              {...register("name", {
                required: "Full name is required",
                minLength: {
                  value: 5,
                  message: "Name must be at least 5 characters",
                },
              })}
              className={errors.name ? errorInputClass : inputClass}
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Shop Name */}
          <div className="relative">
            <FaStore className="absolute text-gray-400 left-3 top-3 dark:text-gray-300" />
            <input
              type="text"
              placeholder="Shop Name"
              {...register("shopName", { required: "Shop Name is required" })}
              className={errors.shopName ? errorInputClass : inputClass}
            />
            {errors.shopName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.shopName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute text-gray-400 left-3 top-3 dark:text-gray-300" />
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              })}
              className={errors.email ? errorInputClass : inputClass}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
          {/* Phone Number */}
          <div className="relative">
            <FaPhone className="absolute text-gray-400 left-3 top-3 dark:text-gray-300" />
            <input
              type="tel"
              placeholder="Phone Number (WhatsApp no only)"
              {...register("phoneNumber", {
                required: "Mobile number is required",
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: "Phone number must be 10–15 digits",
                },
              })}
              className={errors.phoneNumber ? errorInputClass : inputClass}
            />

            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute text-gray-400 left-3 top-3 dark:text-gray-300" />
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
              className={errors.password ? errorInputClass : inputClass}
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

          {/* Confirm Password */}
          <div className="relative">
            <FaLock className="absolute text-gray-400 left-3 top-3 dark:text-gray-300" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              className={errors.confirmPassword ? errorInputClass : inputClass}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 font-semibold text-white transition bg-black rounded-lg cursor-pointer hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            {isSubmitting ? "Submitting..." : "Sign Up"}
          </button>
        </form>

        {/* Redirect */}
        <p className="mt-6 text-sm text-center text-gray-600 cursor-pointer dark:text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-black dark:text-white hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
