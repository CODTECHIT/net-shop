import { Link } from "@tanstack/react-router";
import { Youtube, Instagram, MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { waLink } from "@/lib/services-data";

export function Footer() {
  return (
    <footer className="mt-24 bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            <span
              className="grid h-11 w-11 place-items-center rounded-lg font-display text-lg font-extrabold tracking-tight text-white"
              style={{ background: "linear-gradient(135deg, var(--sky-deep), var(--sky))" }}
            >
              VN
            </span>
            <div>
              <div className="font-display text-lg font-bold">Vayu's Networks</div>
              <div className="text-xs uppercase tracking-widest text-white/60">Kurnool · AP</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/70">
            Any online service at your doorstep — government, property, transport & more.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/90">
            Quick Links
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {[
              ["/", "Home"],
              ["/services", "Services"],
              ["/products", "Products"],
              ["/about", "About"],
              ["/contact", "Contact"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-sky">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/90">
            Contact
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-sky" /> Shop 2, Balaji Nagar, Kurnool
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 text-sky" />{" "}
              <a href="tel:+919100080233" className="hover:text-sky">
                +91 91000 80233
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 text-sky" />{" "}
              <a href="mailto:vayusnetworks@gmail.com" className="hover:text-sky">
                vayusnetworks@gmail.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/90">
            Connect
          </h4>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://youtube.com/@vayusproductions"
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition"
              aria-label="YouTube"
            >
              <Youtube className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={waLink("Hi, I need your services")}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full transition hover:scale-110"
              aria-label="WhatsApp"
              style={{ backgroundColor: "var(--whatsapp)" }}
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/60 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2025 Vayu's Networks. All Rights Reserved.</p>
          <p>
            Designed with <span className="text-red-400">♥</span> for Kurnool
          </p>
        </div>
      </div>
    </footer>
  );
}
