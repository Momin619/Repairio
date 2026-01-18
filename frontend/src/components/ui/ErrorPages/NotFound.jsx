import { Link } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gray-50 dark:bg-black">
      <FiAlertTriangle className="mb-4 text-6xl text-red-500 animate-pulse" />

      <h1 className="mb-2 text-5xl font-bold text-gray-800 dark:text-white">
        404
      </h1>

      <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
        Oops! The page you’re looking for doesn’t exist.
      </p>

      <Link
        to="/"
        className="px-6 py-3 text-white transition bg-blue-500 rounded-lg hover:bg-blue-400"
      >
        Go Back Home
      </Link>
    </div>
  );
}
