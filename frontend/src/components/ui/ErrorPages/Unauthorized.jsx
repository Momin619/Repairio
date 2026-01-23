import { FiLock } from "react-icons/fi";

export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-md p-6 text-center bg-white border border-gray-200 shadow-sm rounded-2xl dark:bg-gray-900 dark:border-gray-700">
        {/* Icon */}
        <div className="flex items-center justify-center mx-auto mb-4 bg-yellow-100 rounded-full w-14 h-14 dark:bg-yellow-900/30">
          <FiLock className="text-2xl text-yellow-600 dark:text-yellow-400" />
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Unauthorized Access
        </h1>

        {/* Message */}
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          You don’t have permission to view this page.
        </p>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Please contact your administrator if you believe this is a mistake.
        </p>

        {/* Action */}
      </div>
    </div>
  );
}
