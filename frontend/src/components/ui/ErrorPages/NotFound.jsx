import { Link } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full dark:bg-red-900/30">
          <FiAlertTriangle className="text-3xl text-red-600 dark:text-red-400" />
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100">
          404
        </h1>

        {/* Message */}
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        {/* Action */}
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 mt-6 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-500"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
