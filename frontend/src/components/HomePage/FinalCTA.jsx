"use client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function FinalCTA() {
  return (
    <section className="py-24 transition-colors bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl px-6 mx-auto text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-black sm:text-4xl dark:text-white"
        >
          Ready to Simplify Your Repair Business?
        </motion.h2>

        {/* Subtext */}
        <p className="max-w-2xl mx-auto mt-4 text-gray-600 dark:text-gray-400">
          Start managing repairs, tracking progress, and notifying customers —
          all from one powerful dashboard.
        </p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <Link
            to="/signup"
            className="inline-block px-8 py-4 text-sm font-semibold text-white transition-all duration-300 transform bg-blue-600 rounded-lg shadow-lg hover:bg-blue-500 hover:shadow-xl hover:-translate-y-1 sm:text-base"
          >
            Get Started
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
