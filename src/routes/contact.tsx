import { createFileRoute } from "@tanstack/react-router";
import Contact from "@/components/Contact";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="pt-20">
      <Contact />
    </div>
  );
}
