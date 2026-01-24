export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="px-6 py-10 mx-auto text-sm text-center text-gray-700 max-w-7xl dark:text-gray-400">
        © {new Date().getFullYear()} Repairio. All rights reserved.
      </div>
    </footer>
  );
}
