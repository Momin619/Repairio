"use client";
import { FiTool, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

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
          <a
            href="#features"
            className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300"
          >
            Features
          </a>
          <a
            href="#how"
            className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300"
          >
            How it works
          </a>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors duration-300">
            Get Started
          </button>

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
