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
        title="About Us | Vayus Enterprises Kurnool"
        description="Learn about Vayus Enterprises, Kurnool's premier civic-tech hub. We are dedicated to simplifying your government needs with speed, integrity, and local expertise."
        keywords="about Vayus Enterprises, civic tech hub Kurnool, online service providers AP, Vayus Enterprises team"
      />
      <About />
    </div>
  );
}
