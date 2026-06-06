import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import Hero from "../components/Hero";
import SEO from "../components/SEO";

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
      <SEO
        title="Vayu's Networks — Any Online Service at Your Doorstep | Kurnool"
        description="Simplify your civic and online needs in Kurnool. We handle government certificates, property registrations, APSPDCL bill payments, transport services, and more from 9 AM to 9 PM."
        keywords="online services Kurnool, government certificates Kurnool, property registration Kurnool, APSPDCL bill payment, transport services AP, doorstep online services Kurnool, Vayu's Networks"
      />
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
