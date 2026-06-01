import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import Hero from "../components/Hero";

// Lazy load heavy components for better performance
const Stats = lazy(() => import("../components/Stats"));
const About = lazy(() => import("../components/About"));
const Services = lazy(() => import("../components/Services"));
const Products = lazy(() => import("../components/Products"));
const HowItWorks = lazy(() => import("../components/HowItWorks"));
const WhyChooseUs = lazy(() => import("../components/WhyChooseUs"));
const Contact = lazy(() => import("../components/Contact"));

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="font-sans text-gray-900 scroll-smooth">
      <Hero />
      <Suspense fallback={<div className="h-40 bg-[#0A0F1C] animate-pulse" />}>
        <Stats />
        <About />
        <Services limit={8} />
        <Products />
        <HowItWorks />
        <WhyChooseUs />
        <Contact />
      </Suspense>
    </div>
  );
}
