import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { waLink } from "@/lib/services-data";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all ${scrolled ? "glass-nav shadow-[0_8px_30px_-20px_rgba(15,23,42,0.25)]" : "bg-transparent"
        }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span
            className="grid h-10 w-10 place-items-center rounded-lg font-display text-lg font-extrabold tracking-tight text-white shadow-md"
            style={{ background: "linear-gradient(135deg, var(--sky-deep), var(--navy))" }}
          >
            VN
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg font-bold text-navy">Vayu's Networks</span>
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Kurnool · AP
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-md px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:bg-secondary hover:text-navy"
              activeProps={{ className: "text-sky-deep" }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={waLink("Hi, I need your services")}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-white shadow-sm transition-transform hover:scale-105"
            style={{ backgroundColor: "var(--whatsapp)" }}
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp Us
          </a>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-md text-navy md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={`overflow-hidden md:hidden ${open ? "max-h-96" : "max-h-0"} transition-[max-height] duration-300`}
      >
        <nav className="mx-4 mb-4 flex flex-col gap-1 rounded-2xl glass-card p-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-semibold text-foreground/85 hover:bg-secondary"
              activeProps={{ className: "text-sky-deep" }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={waLink("Hi, I need your services")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-white"
            style={{ backgroundColor: "var(--whatsapp)" }}
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp Us
          </a>
        </nav>
      </div>
    </header>
  );
}
