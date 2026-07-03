import { createFileRoute } from "@tanstack/react-router";
// Removed lazy and Suspense imports
import Hero from "../components/Hero";
import SEO from "../components/SEO";

// Static imports to fix Vite build warnings since these are statically imported in their respective routes
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
      <SEO
        title="Vayus Enterprises | Premium Civic & Online Services in Kurnool"
        description="Your trusted premium civic-tech hub in Kurnool, Andhra Pradesh. We provide doorstep delivery for PAN cards, Passports, Driving Licenses, and all online government services with bank-grade security."
        keywords="Vayus Enterprises, online services Kurnool, civic services AP, PAN card agent Kurnool, passport services Kurnool, driving license services, F Mart Kurnool"
      />
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
