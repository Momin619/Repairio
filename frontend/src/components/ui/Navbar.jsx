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

  const { isLoggedIn, role } = auth;

  /* ---------------- ROLE BASED LINKS ---------------- */
  const roleLinks = {
    admin: [{ name: "Admin Dashboard", to: "/admin/dashboard" }],
    seller: [
      { name: "Repair Item", to: "/repair-item" },
      { name: "Dashboard", to: "/dashboard" },
    ],
  };

  const currentLinks = isLoggedIn ? roleLinks[role] || [] : [];

  /* ---------------- LINK RENDER ---------------- */
  const renderLinks = (onClick) =>
    currentLinks.map((link) => (
      <Link
        key={link.name}
        to={link.to}
        onClick={onClick}
        className="flex items-center h-10 px-2 text-gray-700 transition rounded-md  dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {link.name}
      </Link>
    ));

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur border-b transition-colors ${
        theme === "dark"
          ? "bg-black/90 border-gray-700 text-white"
          : "bg-white/90 border-gray-300 text-black"
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl">
        {/* Logo → Home */}
        <Link to="/" className="flex items-center gap-2 text-lg font-bold">
          <FiTool className="text-2xl text-blue-500" />
          Repairio
        </Link>

        {/* Desktop */}
        <div className="items-center hidden sm:flex">
          {/* ROLE LINKS */}
          {isLoggedIn && (
            <div className="flex items-center space-x-6">{renderLinks()}</div>
          )}

          {/* AUTH */}
          <div className="flex items-center ml-6 space-x-4">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="btn-green">
                  Login
                </Link>
                <Link to="/signup" className="btn-blue">
                  Signup
                </Link>
              </>
            ) : (
              <button onClick={logout} className="btn-red">
                Logout
              </button>
            )}
          </div>

          {/* THEME */}
          <button onClick={toggleTheme} className="ml-4 icon-btn">
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 sm:hidden">
          <button onClick={toggleTheme} className="icon-btn">
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden transition-all ${
          mobileOpen ? "max-h-screen" : "max-h-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col gap-3 px-4 py-4 border-t dark:border-gray-700">
          {isLoggedIn && renderLinks(() => setMobileOpen(false))}

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="btn-green"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="btn-blue"
              >
                Signup
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                logout();
                setMobileOpen(false);
              }}
              className="btn-red"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
