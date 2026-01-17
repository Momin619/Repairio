"use client";
import { Link } from "react-router-dom";
import { FiTool, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { auth, logout } = useAuth();

  const isLoggedIn = auth.isLoggedIn;
  const isAdmin = auth.role === "admin"; // check if logged in user is admin

  return (
    <nav className="sticky top-0 z-50 transition-colors duration-500 border-b border-gray-300 bg-white/80 dark:bg-black/80 backdrop-blur dark:border-gray-700">
      <div className="flex items-center justify-between h-16 px-6 mx-auto max-w-7xl">
        {/* Logo */}
        <div className="flex items-center gap-2 font-semibold text-black transition-colors duration-500 dark:text-white">
          <FiTool className="text-2xl text-blue-500 animate-pulse" />
          Repairio
        </div>

        {/* Menu + Theme Button */}
        <div className="flex items-center gap-6 text-sm transition-colors duration-500">
          <Link
            to="/features"
            className="transition-colors duration-300 hover:text-blue-500 dark:hover:text-blue-400"
          >
            Features
          </Link>
          <Link
            to="/how"
            className="transition-colors duration-300 hover:text-blue-500 dark:hover:text-blue-400"
          >
            How it works
          </Link>

          {/* Auth Buttons */}
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-400"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-400"
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link
                to={isAdmin ? "/admin/dashboard" : "/dashboard"}
                className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-400"
              >
                {isAdmin ? "Admin Dashboard" : "Profile"}
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-400"
              >
                Logout
              </button>
            </>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 ml-2 text-gray-800 bg-gray-200 rounded-lg dark:bg-gray-800 dark:text-gray-200"
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>
        </div>
      </div>
    </nav>
  );
}
