import { createFileRoute } from "@tanstack/react-router";
import Contact from "@/components/Contact";
import SEO from "@/components/SEO";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="pt-20">
      <SEO
        title="Contact Vayus Enterprises | Get in Touch for Services"
        description="Contact Vayus Enterprises in Balaji Nagar, Kurnool. Call or WhatsApp us at +91 91000 80233 for immediate assistance with any online or civic services."
        keywords="contact Vayus Enterprises, Vayus phone number, online services WhatsApp Kurnool, Vayus address Balaji Nagar"
      />
      <Contact />
    </div>
  );
}
