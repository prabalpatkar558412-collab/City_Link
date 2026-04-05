import { memo } from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Slider from "../components/ProblemSlider";
import heroImage from "../assets/Hero.png";

function Home({ issues = [] }) {
  return (
    <main className="bg-gray-50">
      
      {/* Hero */}
      <Hero heroImage={heroImage} />

      {/* Features */}
      <Features issues={issues} />

      {/* Slider */}
      <section className="px-6 md:px-16 pb-16">
        <Slider />
      </section>

    </main>
  );
}

export default memo(Home);