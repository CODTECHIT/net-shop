import { createFileRoute } from "@tanstack/react-router";
import About from "@/components/About";
import SEO from "@/components/SEO";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="pt-20">
      <SEO
        title="About Us — Your Trusted Civic-Tech Hub | Vayu's Networks Kurnool"
        description="Established in 2025, Vayu's Networks bridges the gap between Kurnool citizens and essential government & online services. Learn about our commitment to speed, accessibility, and integrity."
        keywords="about Vayu's Networks, civic-tech Kurnool, trusted online services, doorstep service provider, Kurnool government services helper"
      />
      <About />
    </div>
  );
}
