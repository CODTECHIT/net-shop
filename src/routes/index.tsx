import { createFileRoute } from "@tanstack/react-router";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import About from "../components/About";
import Services from "../components/Services";
import Products from "../components/Products";
import HowItWorks from "../components/HowItWorks";
import WhyChooseUs from "../components/WhyChooseUs";
import Contact from "../components/Contact";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="font-sans text-gray-900 scroll-smooth">
      <Hero />
      <Stats />
      <About />
      <Services limit={8} />
      <Products />
      <HowItWorks />
      <WhyChooseUs />
      <Contact />
    </div>
  );
}
