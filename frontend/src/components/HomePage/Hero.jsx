// "use client";

// import { motion } from "framer-motion";
// import { FiTool } from "react-icons/fi";
// import TextType from "@/components/React-bits-components/TextType"; // adjust the path if needed

// export default function Hero() {
//   const phrases = ["Repair Management", "Order Tracking", "Job Completion"];

//   return (
//     <section className="relative bg-gray-900 overflow-hidden">
//       {/* Background animated shapes */}
//       <div className="absolute top-0 left-0 w-full h-full -z-10">
//         <div className="absolute w-72 h-72 bg-blue-600/30 rounded-full -top-16 -left-16 animate-pulse-slow"></div>
//         <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full -bottom-24 -right-24 animate-pulse-slow"></div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-32 text-center">
//         {/* Animated Icon */}

//         {/* Headline with TextType */}
//         <motion.h1
//           initial={{ opacity: 0, y: -30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.4 }}
//           className="text-5xl md:text-6xl font-extrabold text-white"
//         >
//           Simplify{" "}
//           <TextType
//             text={phrases}
//             typingSpeed={80}
//             deletingSpeed={40}
//             pauseDuration={2000}
//             loop={true}
//             showCursor={true}
//             cursorCharacter="|"
//             textColors={["#3B82F6", "#8B5CF6", "#F59E0B"]}
//             className="inline"
//             startOnVisible={true}
//           />
//         </motion.h1>

//         {/* Subtext */}
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.6, delay: 0.7 }}
//           className="mt-6 text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto"
//         >
//           Track, manage, and complete repairs effortlessly with Repairio – the
//           modern solution for repair shops.
//         </motion.p>

//         {/* Buttons */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.6, delay: 1 }}
//           className="mt-10 flex justify-center gap-4 flex-wrap"
//         >
//           <a
//             href="#features"
//             className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition"
//           >
//             Get Started
//           </a>
//           <a
//             href="#how"
//             className="px-6 py-3 border border-blue-500 text-blue-500 font-semibold rounded-lg hover:bg-blue-500 hover:text-white transition"
//           >
//             Learn More
//           </a>
//         </motion.div>
//       </div>
//     </section>
//   );
// }
"use client";

import { motion } from "framer-motion";
import TextType from "@/components/React-bits-components/TextType";

export default function Hero() {
  const phrases = ["Repair Management", "Order Tracking", "Job Completion"];

  return (
    <section className="relative bg-black h-screen flex items-center justify-center overflow-hidden">
      {/* Hero content */}
      <div className="text-center px-6 max-w-4xl">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight whitespace-nowrap"
        >
          Simplify{" "}
          <TextType
            text={phrases}
            typingSpeed={80}
            deletingSpeed={40}
            pauseDuration={2000}
            loop={true}
            showCursor={true}
            cursorCharacter="|"
            startOnVisible={true}
            className="inline"
            textColors={["#3B82F6", "#8B5CF6", "#F59E0B"]} // <-- ensures each phrase has its color
          />
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6 text-lg md:text-xl text-gray-300"
        >
          Track, manage, and complete repairs effortlessly with Repairio – the
          modern solution for repair shops.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-10 flex justify-center gap-6 flex-wrap"
        >
          <a
            href="#features"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            Get Started
          </a>

          <a
            href="#how"
            className="px-8 py-3 border border-blue-600 text-blue-500 font-semibold rounded-lg hover:bg-blue-600 hover:text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            Learn More
          </a>
        </motion.div>
      </div>
    </section>
  );
}
