import { FiTool } from "react-icons/fi";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-white">
          <FiTool className="text-blue-500 text-2xl animate-pulse" />
          Repairio
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-300">
          <a
            href="#features"
            className="hover:text-white transition-colors duration-300"
          >
            Features
          </a>
          <a
            href="#how"
            className="hover:text-white transition-colors duration-300"
          >
            How it works
          </a>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
