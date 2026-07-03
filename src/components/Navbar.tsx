import { useState, useEffect } from "react";
import { Menu, X, MessageCircle, User as UserIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import MobileBottomNav from "./MobileBottomNav";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: userData, refetch } = useQuery({
    queryKey: ["userMe"],
    queryFn: async () => {
      const res = await fetch("/api/users/me");
      if (!res.ok) throw new Error("Not logged in");
      return res.json();
    },
    retry: false,
  });

  const handleLogout = async () => {
    await fetch("/api/users/logout", { method: "POST" });
    refetch();
    navigate({ to: "/" });
  };

  const links = [
    { name: "Home", to: "/" },
    { name: "Services", to: "/services" },
    { name: "F Mart", to: "/products", isSpecial: true },
    { name: "About", to: "/about" },
    { name: "Contact", to: "/contact" },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-[#020617]/90 md:backdrop-blur-xl border-b border-white/5 py-2"
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
                  alt="Vayus Enterprises"
                  className="h-16 w-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tighter leading-none text-white uppercase group-hover:text-sky-400 transition-colors">
                  Vayus Enterprises
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
                    className={`relative hover:text-white transition-colors text-xs font-black uppercase tracking-widest group ${
                      link.isSpecial ? "text-sky-400 animate-pulse bg-sky-500/10 px-3 py-1.5 rounded-lg border border-sky-500/20" : "text-slate-400"
                    }`}
                    activeProps={{ className: link.isSpecial ? "text-sky-300 bg-sky-500/20" : "text-white" }}
                  >
                    {link.name}
                    {!link.isSpecial && location.pathname === link.to && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-sky-500 rounded-full"
                      />
                    )}
                  </Link>
                ))}

                {userData?.user ? (
                  <div className="flex items-center gap-4">
                    <Link
                      to="/dashboard"
                      className="text-slate-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4" /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-red-400 hover:text-red-300 transition-colors text-xs font-black uppercase tracking-widest"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="text-slate-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4" /> Login
                  </Link>
                )}
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

            {/* Mobile Contact Button - Visible instead of Menu button */}
            <div className="md:hidden flex items-center">
               <a
                href="https://wa.me/919100080233?text=Hi,+I+need+your+services"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="md:hidden fixed inset-0 bg-black/60 z-[90] backdrop-blur-sm"
              />
              
              {/* Drawer Content */}
              <motion.div
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="md:hidden fixed bottom-0 left-0 right-0 z-[95] bg-[#0A0F1C] border-t border-white/10 rounded-t-3xl overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.5)] max-h-[85vh] overflow-y-auto pb-24"
              >
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                </div>
                
                <div className="flex justify-between items-center px-6 py-4 border-b border-white/5">
                  <h3 className="text-white font-black uppercase tracking-widest text-sm">Menu</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="px-6 py-6 space-y-3">
                  {links.map((link) => (
                    <Link
                      key={link.name}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={`block px-5 py-4 text-sm font-black hover:text-white rounded-2xl uppercase tracking-widest transition-all ${
                        link.isSpecial ? "text-sky-400 bg-sky-500/10 border border-sky-500/20" : "text-slate-400 bg-white/5 hover:bg-white/10"
                      }`}
                      activeProps={{ className: link.isSpecial ? "text-sky-300 bg-sky-500/20" : "text-white bg-white/10" }}
                    >
                      {link.name}
                    </Link>
                  ))}

                  {userData?.user ? (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-5 py-4 text-sm font-black text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-2xl uppercase tracking-widest transition-all"
                      >
                        <UserIcon className="w-5 h-5" /> Dashboard
                      </Link>
                      <button
                        onClick={() => { handleLogout(); setIsOpen(false); }}
                        className="w-full text-left flex items-center gap-3 px-5 py-4 text-sm font-black text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 rounded-2xl uppercase tracking-widest transition-all"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-5 py-4 text-sm font-black text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-2xl uppercase tracking-widest transition-all"
                    >
                      <UserIcon className="w-5 h-5" /> Login
                    </Link>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
      
      {/* Include the MobileBottomNav globally for the whole app via Navbar */}
      <MobileBottomNav onMenuClick={() => setIsOpen(true)} />
    </>
  );
}
