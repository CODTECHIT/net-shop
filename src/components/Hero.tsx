import { motion, useInView } from "motion/react";
import { useRef } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  FileText,
  ScrollText,
  Car,
  Landmark,
  Home,
  Building2,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const serviceIcons = [
    {
      icon: <FileText className="w-6 h-6" />,
      label: "ID Cards",
      color: "bg-sky-500",
      id: "id-cards",
    },
    {
      icon: <ScrollText className="w-6 h-6" />,
      label: "Certificates",
      color: "bg-purple-500",
      id: "certificates",
    },
    {
      icon: <Home className="w-6 h-6" />,
      label: "Property",
      color: "bg-emerald-500",
      id: "property",
    },
    {
      icon: <Car className="w-6 h-6" />,
      label: "Transport",
      color: "bg-amber-500",
      id: "transport",
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      label: "Municipal",
      color: "bg-rose-500",
      id: "municipal",
    },
    {
      icon: <Landmark className="w-6 h-6" />,
      label: "Registration",
      color: "bg-indigo-500",
      id: "register",
    },
  ];

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex items-center overflow-hidden bg-[#0A0F1C]"
    >
      {/* Premium Background Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=60&w=1200"
          alt="Workspace Background"
          className="w-full h-full object-cover opacity-20"
          loading="eager"
          width="1200"
          height="800"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1C] via-[#0A0F1C]/90 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0F1C]"></div>
      </div>

      {/* Dynamic Animated Glows - Optimized for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        <div className="absolute -top-[10%] -right-[5%] w-[400px] h-[400px] rounded-full bg-sky-500/10 blur-[100px] hidden md:block" />
        <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] rounded-full bg-blue-600/5 blur-[80px] hidden md:block" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-10 sm:py-16 lg:py-24">
        <div
          className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16"
          ref={ref}
        >
          {/* Left Content - Typography & CTA */}
          <motion.div
            className="lg:w-[60%] text-left w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sky-400 text-xs sm:text-sm font-semibold mb-6 sm:mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(14,165,233,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              Premium Civic-Tech Hub
            </div>

            <h1 className="text-fluid-3xl sm:text-fluid-4xl xl:text-fluid-5xl font-extrabold text-white leading-[1.1] mb-3 sm:mb-6 tracking-tight">
              Simplify Your <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-sky-500">
                Civic Needs.
              </span>
            </h1>

            <p className="text-fluid-sm sm:text-fluid-base lg:text-fluid-lg text-slate-400 mb-5 sm:mb-6 max-w-lg font-medium leading-relaxed">
              Experience the future of government services. Speed, integrity, and local expertise
              seamlessly integrated into one premium digital destination.
            </p>

            <div className="mb-6 sm:mb-10 max-w-xl">
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-[#0C1A2E]/90 border border-white/10 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-blue-500/5 opacity-30 animate-pulse-slow"></div>
                <div className="relative flex items-start gap-3 sm:gap-4 p-4 sm:p-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-sky-500/20 flex items-center justify-center shrink-0 border border-sky-500/30">
                    <Home className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-xl lg:text-2xl font-extrabold text-white leading-tight mb-0.5 sm:mb-1">
                      Any Online Service at door steps.
                    </h3>
                    <p className="text-sky-400 font-semibold text-xs sm:text-sm lg:text-base leading-relaxed">
                      We collect info & deliver to your home
                    </p>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-sky-500 to-blue-500 w-full"></div>
              </div>
            </div>

            <div className="flex flex-row gap-2.5 sm:gap-5 mb-8 sm:mb-12">
              <motion.div
                className="flex-1 min-w-0"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/services"
                  className="group relative inline-flex w-full items-center justify-center px-5 sm:px-8 py-3 sm:py-4 bg-sky-500 text-white rounded-xl font-bold text-sm sm:text-lg transition-all duration-300 shadow-[0_0_30px_rgba(14,165,233,0.3)] hover:shadow-[0_0_50px_rgba(14,165,233,0.5)] overflow-hidden touch-target"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Explore Services
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </motion.div>

              <motion.div
                className="flex-1 min-w-0"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <a
                  href="https://wa.me/919100080233"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center px-5 sm:px-8 py-3 sm:py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-sm sm:text-lg transition-all duration-300 backdrop-blur-md touch-target"
                >
                  WhatsApp Us
                </a>
              </motion.div>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-8 text-xs sm:text-sm font-semibold text-slate-500">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500/80" />
                100% Secure
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500/80" />
                Fast Processing
              </div>
            </div>
          </motion.div>

          {/* Right Content - Premium Glass Illustration */}
          <motion.div
            className="lg:w-[40%] w-full relative mt-6 lg:mt-0"
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={isInView ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.9, x: 50 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative">
              <div className="absolute -inset-4 sm:-inset-6 lg:-inset-10 bg-sky-500/10 rounded-full blur-[40px] sm:blur-[60px] lg:blur-[100px] pointer-events-none"></div>

              <div className="relative group">
                <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-sky-500/50 to-blue-500/50 rounded-xl sm:rounded-2xl lg:rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <img
                  src="/11003.jpg"
                  alt="Civic Hub"
                  className="relative w-full h-auto rounded-xl sm:rounded-2xl lg:rounded-[2.5rem] shadow-xl sm:shadow-2xl border border-white/10 brightness-90 group-hover:brightness-100 transition duration-500"
                  width="800"
                  height="600"
                />

                <motion.div
                  className="absolute -bottom-3 -left-3 sm:-bottom-6 sm:-left-6 lg:-bottom-8 lg:-left-8 bg-[#0C1A2E]/90 backdrop-blur-2xl p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl border border-white/10 hidden sm:block"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-sky-500/20 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center border border-sky-500/30">
                      <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-sky-400" />
                    </div>
                    <div>
                      <div className="text-[8px] sm:text-[10px] lg:text-xs text-sky-400 font-bold uppercase tracking-widest mb-0.5">
                        Verified System
                      </div>
                      <div className="text-xs sm:text-base lg:text-lg font-extrabold text-white">
                        Bank-Grade Security
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Service Icons Grid - Bottom */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 lg:gap-5 mt-8 sm:mt-12 lg:mt-24"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {serviceIcons.map((item, index) => (
            <motion.div
              key={item.label}
              className="flex"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <Link
                to="/services"
                hash={item.id}
                className="group flex flex-col items-center gap-1.5 sm:gap-2 lg:gap-3 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg sm:rounded-xl lg:rounded-2xl transition-all duration-500 shadow-sm sm:shadow-md hover:-translate-y-0.5 sm:hover:-translate-y-1 lg:hover:-translate-y-2 touch-target w-full"
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${item.color} rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-md sm:shadow-lg group-hover:scale-110 transition-transform duration-500`}
                >
                  {item.icon}
                </div>
                <span className="text-[10px] sm:text-xs lg:text-sm text-slate-300 font-bold tracking-tight text-center">
                  {item.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
