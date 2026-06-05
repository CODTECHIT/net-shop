import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Instagram, Youtube, Facebook, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 text-slate-900 pt-20 pb-10 border-t border-slate-200/60 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-200/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-200/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-5 mb-8 inline-flex group">
              <div className="relative">
                <div className="absolute -inset-2 bg-sky-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img
                  src="/logo.png"
                  alt="Vayu's Networks Logo"
                  className="h-14 w-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(14,165,233,0.15)]"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tighter leading-none text-slate-900 uppercase">
                  Vayu's Networks
                </span>
                <span className="text-[10px] text-sky-600 font-black tracking-[0.3em] uppercase mt-1">Kurnool · AP</span>
              </div>
            </Link>
            <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-sm font-medium">
              Your one-stop destination for all government and online services. We simplify complex
              processes, saving you time and effort right here in Kurnool.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-200/50 hover:bg-sky-500 hover:text-white transition-all flex items-center justify-center text-slate-600"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@vayusproductions"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-200/50 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center text-slate-600"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-200/50 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center text-slate-600"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="font-bold text-lg mb-6 text-slate-900">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { name: "Home", path: "/" },
                { name: "Services", path: "/services" },
                { name: "F Mart", path: "/products" },
                { name: "About Us", path: "/about" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-slate-600 hover:text-sky-600 transition-colors text-sm flex items-center gap-2 group font-medium"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-sky-600" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-lg mb-6 text-slate-900">Top Services</h3>
            <ul className="space-y-4">
              {["Aadhar Services", "PAN Card", "Passport Info", "Driving License"].map(
                (service) => (
                  <li key={service}>
                    <Link
                      to="/services"
                      className="text-slate-600 hover:text-sky-600 transition-colors text-sm flex items-center gap-2 group font-medium"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-sky-600" />
                      {service}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h3 className="font-bold text-lg mb-6 text-slate-900">Contact Us</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 rounded bg-sky-50 flex items-center justify-center shrink-0 border border-sky-100">
                  <MapPin className="w-4 h-4 text-sky-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800 mb-1">Visit Our Shop</span>
                  <span className="text-sm text-slate-600 font-medium leading-relaxed">
                    Shop 2, Balaji Nagar
                    <br />
                    Kurnool, Andhra Pradesh
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 rounded bg-sky-50 flex items-center justify-center shrink-0 border border-sky-100">
                  <Phone className="w-4 h-4 text-sky-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800 mb-1">Call or WhatsApp</span>
                  <a
                    href="tel:+919100080233"
                    className="text-sm text-slate-600 hover:text-sky-600 transition-colors font-medium"
                  >
                    +91 91000 80233
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 rounded bg-sky-50 flex items-center justify-center shrink-0 border border-sky-100">
                  <Mail className="w-4 h-4 text-sky-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800 mb-1">Email Us</span>
                  <a
                    href="mailto:vayusnetworks@gmail.com"
                    className="text-sm text-slate-600 hover:text-sky-600 transition-colors font-medium"
                  >
                    vayusnetworks@gmail.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} Vayu's Networks. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <p className="flex items-center gap-2">
              Developed by{" "}
              <a
                href="https://codtechitsolutions.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-sky-600 transition-colors"
              >
                CodTech IT Solutions
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
