import Hero from "./Hero";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import Footer from "../ui/Footer";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  );
}
