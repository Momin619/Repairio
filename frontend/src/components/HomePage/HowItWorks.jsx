const steps = [
  "Log the device and customer",
  "Track repair progress",
  "Mark completed and move to history",
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-24 bg-gray-900">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold text-white">How it works</h2>

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-gray-700 bg-gray-800 hover:scale-105 hover:shadow-lg transition-transform duration-300"
            >
              <div className="text-blue-500 font-bold text-2xl">{i + 1}</div>
              <p className="mt-4 text-gray-300">{s}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
