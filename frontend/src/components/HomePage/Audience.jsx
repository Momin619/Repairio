export default function Audience() {
  return (
    <section className="py-20 bg-white dark:bg-black">
      <div className="max-w-5xl px-6 mx-auto text-center">
        <h2 className="mb-10 text-3xl font-bold">Who Is Repairio For?</h2>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="p-6 bg-gray-100 rounded-xl dark:bg-gray-900">
            <h3 className="mb-2 text-xl font-semibold">Repair Shops</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Manage repair items, track progress, and serve customers faster.
            </p>
          </div>

          <div className="p-6 bg-gray-100 rounded-xl dark:bg-gray-900">
            <h3 className="mb-2 text-xl font-semibold">Admins</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Control sellers, activate subscriptions, and manage access.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
