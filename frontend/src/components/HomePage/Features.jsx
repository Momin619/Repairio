import { motion } from "framer-motion";
import { FiTool, FiClock, FiMessageCircle } from "react-icons/fi";

const features = [
  {
    icon: <FiTool />,
    title: "Repair Management",
    desc: "Create, update, and track repair items with ease.",
  },
  {
    icon: <FiClock />,
    title: "Repair History",
    desc: "View completed repairs and time taken per job.",
  },
  {
    icon: <FiMessageCircle />,
    title: "WhatsApp Updates",
    desc: "Notify customers instantly when repairs are completed.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-20 transition-colors bg-gray-50 dark:bg-gray-900"
    >
      <div className="max-w-6xl px-6 mx-auto text-center">
        <h2 className="mb-12 text-3xl font-bold text-black dark:text-white">
          Powerful Features
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true, amount: 1 }}
              className="p-6 bg-white shadow-md dark:bg-black rounded-xl"
            >
              <div className="mb-4 text-3xl text-blue-600">{f.icon}</div>
              <h3 className="mb-2 text-xl font-semibold">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
