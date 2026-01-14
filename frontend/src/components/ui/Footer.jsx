export default function Footer() {
  return (
    <footer className="py-10 border-t border-gray-700 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Repairio. All rights reserved.
      </div>
    </footer>
  );
}
