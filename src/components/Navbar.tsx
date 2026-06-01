import { useState, useEffect } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Home", to: "/" },
    { name: "Services", to: "/services" },
    { name: "Products", to: "/products" },
    { name: "About", to: "/about" },
    { name: "Contact", to: "/contact" },
  ];

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 py-2" 
          : "bg-[#020617] py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-5 group">
            <div className="relative">
              <div className="absolute -inset-2 bg-sky-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src="/logo.png"
                alt="Vayu's Networks Logo"
                className="h-16 w-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(14,165,233,0.3)]"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter leading-none text-white uppercase group-hover:text-sky-400 transition-colors">
                Vayu's Networks
              </span>
              <span className="text-[10px] text-sky-400 font-black tracking-[0.3em] uppercase mt-1">
                Kurnool · AP
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  className="relative text-slate-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest group"
                  activeProps={{ className: "text-white" }}
                >
                  {link.name}
                  {location.pathname === link.to && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-sky-500 rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>
            
            <a
              href="https://wa.me/919100080233?text=Hi,+I+need+your+services"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-6 py-3 overflow-hidden rounded-2xl bg-white text-[#020617] font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
            >
              <div className="absolute inset-0 bg-sky-500 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" />
                WhatsApp Us
              </span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white transition-all hover:bg-white/10"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#020617] border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 py-8 space-y-4">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-4 text-sm font-black text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl uppercase tracking-widest transition-all"
                  activeProps={{ className: "text-white bg-sky-500/10 text-sky-400" }}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="https://wa.me/919100080233?text=Hi,+I+need+your+services"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-white text-[#020617] px-4 py-5 rounded-2xl font-black text-xs uppercase tracking-widest"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
