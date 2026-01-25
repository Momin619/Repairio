import Hero from "./Hero";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import Audience from "./Audience";
import FinalCTA from "./FinalCTA";
export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Features />

      <HowItWorks />
      <FinalCTA />
    </div>
  );
}
