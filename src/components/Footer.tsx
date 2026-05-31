import { Link } from '@tanstack/react-router';
import { MapPin, Phone, Mail, Instagram, Youtube, Facebook, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#060F1C] text-white pt-20 pb-10 border-t border-white/10 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-900/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
           {/* Brand Column */}
           <div className="lg:col-span-4">
             <Link to="/" className="flex items-center gap-3 mb-6 inline-flex">
               <img src="/logo.png" alt="Vayu's Networks Logo" className="h-12 w-auto object-contain" />
               <div className="flex flex-col">
                 <span className="font-bold text-xl tracking-tight leading-tight">Vayu's Networks</span>
                 <span className="text-xs text-sky-400 font-medium tracking-wide">Kurnool · AP</span>
               </div>
             </Link>
            <p className="text-sky-100/60 text-sm leading-relaxed mb-8 max-w-sm">
              Your one-stop destination for all government and online services. We simplify complex processes, saving you time and effort right here in Kurnool.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sky-100/70 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://youtube.com/@vayusproductions" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sky-100/70 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sky-100/70 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="font-semibold text-lg mb-6 text-white">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'Services', path: '/services' },
                { name: 'Products', path: '/products' },
                { name: 'About Us', path: '/about' },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sky-100/60 hover:text-sky-400 transition-colors text-sm flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-sky-400" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-lg mb-6 text-white">Top Services</h3>
            <ul className="space-y-4">
              {[
                'Aadhar Services',
                'PAN Card',
                'Passport Info',
                'Driving License',
              ].map((service) => (
                <li key={service}>
                  <Link to="/services" className="text-sky-100/60 hover:text-sky-400 transition-colors text-sm flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-sky-400" />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h3 className="font-semibold text-lg mb-6 text-white">Contact Us</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 rounded bg-sky-500/10 flex items-center justify-center shrink-0 border border-sky-500/20">
                  <MapPin className="w-4 h-4 text-sky-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white mb-1">Visit Our Shop</span>
                  <span className="text-sm text-sky-100/60 leading-relaxed">Shop 2, Balaji Nagar<br/>Kurnool, Andhra Pradesh</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 rounded bg-sky-500/10 flex items-center justify-center shrink-0 border border-sky-500/20">
                  <Phone className="w-4 h-4 text-sky-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white mb-1">Call or WhatsApp</span>
                  <a href="tel:+919100080233" className="text-sm text-sky-100/60 hover:text-sky-400 transition-colors">+91 91000 80233</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 rounded bg-sky-500/10 flex items-center justify-center shrink-0 border border-sky-500/20">
                  <Mail className="w-4 h-4 text-sky-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white mb-1">Email Us</span>
                  <a href="mailto:vayusnetworks@gmail.com" className="text-sm text-sky-100/60 hover:text-sky-400 transition-colors">vayusnetworks@gmail.com</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-sky-100/50">
          <p>© {new Date().getFullYear()} Vayu's Networks. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <p className="flex items-center">
              Made with <span className="text-red-500 mx-1.5 animate-pulse">❤️</span> for Kurnool
            </p>
            <p className="flex items-center gap-2">
              Developed by{" "}
              <a href="https://codtechitsolutions.com/" target="_blank" rel="noopener noreferrer" className="text-sky-100/60 hover:text-sky-400 transition-colors">
                CodTech IT Solutions
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
