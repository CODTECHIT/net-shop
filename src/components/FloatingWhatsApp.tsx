import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/919100080233?text=Hi,+I+need+your+services"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 md:bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300"
      aria-label="Chat on WhatsApp"
    >
      <div className="absolute inset-0 rounded-full animate-wa-pulse"></div>
      <MessageCircle className="w-8 h-8 relative z-10 fill-current" />
    </a>
  );
}
