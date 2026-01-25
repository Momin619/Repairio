"use client";
import { motion } from "framer-motion";
import { ClipboardList, Wrench, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Create Repair Job",
    description:
      "Add customer details, item info, and problem description in seconds.",
  },
  {
    icon: Wrench,
    title: "Track Progress",
    description:
      "Update repair status as work progresses and manage everything from one dashboard.",
  },
  {
    icon: CheckCircle,
    title: "Complete & Notify",
    description:
      "Mark repairs as completed and instantly notify customers via WhatsApp.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 transition-colors bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl px-6 mx-auto text-center">
        {/* Heading */}
        <h2 className="mb-12 text-3xl font-bold text-black dark:text-white">
          How Repairio Works
        </h2>

        {/* Steps */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true, amount: 1 }}
              className="p-6 bg-white shadow-md dark:bg-black rounded-xl"
            >
              <step.icon className="w-10 h-10 mb-4 text-blue-600" />

              <h3 className="mb-2 text-xl font-semibold text-black dark:text-white">
                {step.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-400">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
