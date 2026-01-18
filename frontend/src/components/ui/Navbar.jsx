"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiTool, FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { auth, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoggedIn = auth.isLoggedIn;
  const isAdmin = auth.role === "admin";

  const links = [
    { name: "Features", to: "/features" },
    { name: "How it works", to: "/how" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur transition-colors duration-500 border-b ${
        theme === "dark"
          ? "bg-black/90 border-gray-700 text-white"
          : "bg-white/90 border-gray-300 text-black"
      }`}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold dark:text-white"
          >
            <FiTool className="text-2xl text-blue-500" />
            Repairio
          </Link>

          {/* Desktop Links */}
          <div className="hidden sm:flex sm:items-center sm:gap-4 lg:gap-6">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className="px-3 py-1 text-gray-700 transition rounded-md dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {link.name}
              </Link>
            ))}

            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-white transition bg-green-600 rounded-lg hover:bg-green-500"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-500"
                >
                  Signup
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={isAdmin ? "/admin/dashboard" : "/dashboard"}
                  className="px-4 py-2 text-white transition bg-gray-600 rounded-lg hover:bg-gray-500"
                >
                  {isAdmin ? "Admin" : "Profile"}
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-white transition bg-red-600 rounded-lg hover:bg-red-500"
                >
                  Logout
                </button>
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-800 transition bg-gray-200 rounded-lg dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <FiSun /> : <FiMoon />}
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-800 transition bg-gray-200 rounded-lg dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <FiSun /> : <FiMoon />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-gray-800 transition rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden transition-all duration-300 ${
          mobileOpen ? "max-h-screen" : "max-h-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col gap-2 px-4 pt-2 pb-4 bg-white border-t border-gray-300 dark:bg-black dark:border-gray-700">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className="px-3 py-2 text-gray-700 transition rounded-md dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-white transition bg-green-600 rounded-lg hover:bg-green-500"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-500"
                onClick={() => setMobileOpen(false)}
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link
                to={isAdmin ? "/admin/dashboard" : "/dashboard"}
                className="px-4 py-2 text-white transition bg-gray-600 rounded-lg hover:bg-gray-500"
                onClick={() => setMobileOpen(false)}
              >
                {isAdmin ? "Admin" : "Profile"}
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="px-4 py-2 text-white transition bg-red-600 rounded-lg hover:bg-red-500"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
