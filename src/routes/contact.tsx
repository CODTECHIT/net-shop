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
        title="Contact Us — Doorstep Online Services | Vayu's Networks Kurnool"
        description="Get in touch with Vayu's Networks. Visit our shop at Balaji Nagar, Kurnool, call us at +91 91000 80233, or message us on WhatsApp for rapid assistance with any online service."
        keywords="contact Vayu's Networks, Kurnool online service address, Vayu's Networks phone number, WhatsApp online services Kurnool, Balaji Nagar Kurnool"
      />
      <Contact />
    </div>
  );
}
