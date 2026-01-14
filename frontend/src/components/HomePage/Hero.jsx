"use client";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function Hero() {
  const { theme } = useTheme();

  return (
    <section className="relative h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 transition-colors duration-500 bg-white dark:bg-black">
      <div className="text-center max-w-3xl">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-extrabold leading-tight text-4xl sm:text-5xl md:text-6xl text-black dark:text-white transition-colors duration-500"
        >
          Manage Repairs Smartly
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 transition-colors duration-500"
        >
          Track, manage, and complete repairs effortlessly with Repairio – the
          modern solution for repair shops.
        </motion.p>

        {/* Additional tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 transition-colors duration-500"
        >
          From appointment scheduling to order completion, everything in one
          place for a seamless workflow.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-6 sm:mt-10 flex justify-center gap-4 flex-wrap w-full"
        >
          <a className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
            Get Started
          </a>
          <a className="px-6 py-3 border border-blue-600 text-blue-500 font-semibold rounded-lg hover:bg-blue-600 hover:text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
            Learn More
          </a>
        </motion.div>
      </div>
    </section>
  );
}
