export default function SubscriptionExpired() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md p-6 text-center bg-white border border-gray-200 shadow-sm rounded-2xl dark:bg-gray-900 dark:border-gray-700">
        {/* Icon */}
        <div className="flex items-center justify-center mx-auto mb-4 bg-red-100 rounded-full w-14 h-14 dark:bg-red-900/30">
          <span className="text-2xl">⚠️</span>
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Subscription Expired
        </h1>

        {/* Description */}
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Your subscription has expired and access to the dashboard is currently
          restricted.
        </p>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Please renew your subscription to continue using Repairio.
        </p>

        {/* Divider */}
        <div className="my-5 border-t border-gray-200 dark:border-gray-700" />

        {/* Footer note */}
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Need help? Contact support or your account administrator.
        </p>
      </div>
    </div>
  );
}
