import { FiWifi, FiClock, FiCheckCircle } from "react-icons/fi";

const features = [
  {
    icon: <FiClock />,
    title: "Track Repairs",
    desc: "Manage pending, in-progress, and completed repairs easily.",
  },
  {
    icon: <FiWifi />,
    title: "Offline Support",
    desc: "Works even when internet is unavailable.",
  },
  {
    icon: <FiCheckCircle />,
    title: "Repair History",
    desc: "Completed repairs are stored automatically.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-white text-center">
          Built for Repair Shops
        </h2>

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-6 border border-gray-700 rounded-2xl hover:shadow-lg hover:scale-105 transition-transform duration-300 bg-gray-900"
            >
              <div className="text-blue-500 text-3xl">{f.icon}</div>
              <h3 className="mt-4 text-xl font-medium text-white">{f.title}</h3>
              <p className="mt-2 text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
