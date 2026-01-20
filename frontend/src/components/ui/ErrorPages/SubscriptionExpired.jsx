export default function SubscriptionExpired() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black">
      <div className="p-8 text-center bg-white shadow-lg dark:bg-gray-900 rounded-xl">
        <h1 className="mb-2 text-2xl font-bold text-red-600">
          Subscription Expired
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Please renew your subscription to access the dashboard.
        </p>
      </div>
    </div>
  );
}
