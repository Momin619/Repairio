"use client";
import { Link } from "react-router-dom"; // import Link
import { FiTool, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { auth, setAuth } = useAuth();
  const isLoggedIn = auth.isLoggedIn;
  console.log(auth);

  const handleLogout = () => {
    setAuth({ token: null, role: null, userId: null, isLoggedIn: false });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur border-b border-gray-300 dark:border-gray-700 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 font-semibold text-black dark:text-white transition-colors duration-500">
          <FiTool className="text-blue-500 text-2xl animate-pulse" />
          Repairio
        </div>

        {/* Menu + Theme Button */}
        <div className="flex items-center gap-6 text-sm transition-colors duration-500">
          <Link
            to="/features"
            className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300"
          >
            Features
          </Link>
          <Link
            to="/how"
            className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300"
          >
            How it works
          </Link>

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors duration-300"
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 transition-colors duration-300"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition-colors duration-300"
              >
                Logout
              </button>
            </>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="ml-2 p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors duration-500"
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>
        </div>
      </div>
    </nav>
  );
}
