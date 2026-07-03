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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4 lg:py-5">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 lg:gap-4" onClick={() => setOpen(false)}>
          <div className="relative group flex-shrink-0">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-blue-600 rounded-xl sm:rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div
              className="relative grid h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 place-items-center rounded-xl sm:rounded-2xl font-display text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white shadow-2xl"
              style={{ background: "linear-gradient(135deg, var(--sky-deep), var(--navy))" }}
            >
              VN
            </div>
          </div>
          <span className="flex flex-col leading-tight overflow-hidden">
            <span className="font-display text-lg sm:text-xl lg:text-2xl font-black text-navy tracking-tight truncate max-w-[150px] sm:max-w-[200px] lg:max-w-none uppercase">Vayus Enterprises
            </span>
            <span className="text-[10px] sm:text-[11px] lg:text-[13px] uppercase tracking-[0.15em] sm:tracking-[0.2em] lg:tracking-[0.3em] font-black text-sky-600/90 mt-0.5">
              Kurnool · AP
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-lg px-4 py-2.5 text-[15px] font-bold text-foreground/90 transition-all hover:bg-secondary hover:text-navy hover:scale-105"
              activeProps={{ className: "text-sky-deep !text-sky-deep font-extrabold" }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={waLink("Hi, I need your services")}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-black text-white shadow-xl transition-all hover:scale-110 active:scale-95"
            style={{ backgroundColor: "var(--whatsapp)" }}
          >
            <MessageCircle className="h-5 w-5" /> WhatsApp Us
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
