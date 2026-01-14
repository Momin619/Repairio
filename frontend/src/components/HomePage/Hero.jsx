"use client";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 transition-colors duration-500 bg-white dark:bg-black">
      <div className="text-center max-w-3xl w-full">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-extrabold text-black dark:text-white leading-tight text-[clamp(1.875rem,5vw,3.5rem)] text-center"
        >
          Manage Repairs Smartly
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-gray-700 dark:text-gray-300 text-[clamp(0.875rem,2.5vw,1.25rem)] transition-colors duration-500"
        >
          Track, manage, and complete repairs effortlessly with Repairio – the
          modern solution for repair shops.
        </motion.p>

        {/* Additional tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-4 text-gray-500 dark:text-gray-400 text-[clamp(0.75rem,2vw,1rem)] transition-colors duration-500"
        >
          From appointment scheduling to order completion, everything in one
          place for a seamless workflow.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 sm:mt-10 flex justify-center gap-6 flex-wrap"
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
