"use client";
import { Link } from "react-router-dom";
import { FiTool, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { auth, logout } = useAuth();

  const isLoggedIn = auth.isLoggedIn;
  const isAdmin = auth.role === "admin";

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur transition-colors duration-500 border-b ${
        theme === "dark"
          ? "bg-black/90 border-gray-700 text-white"
          : "bg-white/90 border-gray-300 text-black"
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white"
        >
          <FiTool className="text-2xl text-blue-500" />
          Repairio
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-3 text-sm font-medium sm:gap-5">
          {/* Links */}
          <Link
            to="/features"
            className="px-2 py-1 text-gray-700 rounded-md dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Features
          </Link>

          <Link
            to="/how"
            className="px-2 py-1 text-gray-700 rounded-md dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            How it works
          </Link>

          {/* Auth */}
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-500"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500"
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link
                to={isAdmin ? "/admin/dashboard" : "/dashboard"}
                className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-500"
              >
                {isAdmin ? "Admin" : "Profile"}
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-500"
              >
                Logout
              </button>
            </>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-800 transition bg-gray-200 rounded-lg  dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>
        </div>
      </div>
    </nav>
  );
}
