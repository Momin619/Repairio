"use client";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-24 transition-colors duration-500 bg-white dark:bg-black">
      <div className="w-full max-w-3xl text-center">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-extrabold text-black dark:text-white leading-tight text-[clamp(1.5rem,5vw,3rem)] sm:text-[clamp(2rem,5vw,3.5rem)] text-center"
        >
          Manage Repairs Smartly
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-gray-700 dark:text-gray-300 text-[clamp(0.875rem,2.5vw,1.125rem)] sm:text-[clamp(1rem,2.5vw,1.25rem)] transition-colors duration-500"
        >
          Track, manage, and complete repairs effortlessly with Repairio – the
          modern solution for repair shops.
        </motion.p>

        {/* Additional tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-4 text-gray-500 dark:text-gray-400 text-[clamp(0.75rem,2vw,0.95rem)] sm:text-[clamp(0.875rem,2vw,1rem)] transition-colors duration-500"
        >
          From appointment scheduling to order completion, everything in one
          place for a seamless workflow.
        </motion.p>

        {/* Buttons */}
      </div>
    </section>
  );
}
