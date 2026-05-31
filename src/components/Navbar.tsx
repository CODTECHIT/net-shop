import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Home', to: '/' },
    { name: 'Services', to: '/services' },
    { name: 'Products', to: '/products' },
    { name: 'About', to: '/about' },
    { name: 'Contact', to: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#0C1A2E] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Vayu's Networks Logo" className="h-12 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight leading-tight">Vayu's Networks</span>
              <span className="text-xs text-sky-300 font-medium tracking-wide">Kurnool · AP</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className="text-gray-300 hover:text-white hover:text-sky-400 transition-colors text-sm font-medium"
                activeProps={{ className: 'text-white text-sky-400' }}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://wa.me/919100080233?text=Hi,+I+need+your+services"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20b858] text-white px-5 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              WhatsApp Us
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0C1A2E] border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
                activeProps={{ className: 'text-white bg-gray-800' }}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://wa.me/919100080233?text=Hi,+I+need+your+services"
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 text-center bg-[#25D366] text-white px-3 py-2 rounded-md font-medium"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
