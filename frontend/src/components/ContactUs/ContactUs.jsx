import { FiPhone, FiMail } from "react-icons/fi";

export default function ContactUs() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 transition-colors duration-300 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 text-center transition-colors duration-300 bg-white shadow-2xl dark:bg-gray-800 rounded-2xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Contact Repairio
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          We’d love to hear from you! Reach out to us using the details below.
        </p>

        <div className="space-y-6 text-lg">
          {/* Phone */}
          <div className="flex items-center justify-center gap-3">
            <FiPhone className="text-2xl text-blue-600 dark:text-blue-400" />
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-800 transition dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              +92 300 1234567
            </a>
          </div>

          {/* Email */}
          <div className="flex items-center justify-center gap-3">
            <FiMail className="text-2xl text-green-600 dark:text-green-400" />
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=teamrepairio@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-800 transition dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400"
            >
              teamrepairio@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
