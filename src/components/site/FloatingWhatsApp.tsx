import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/services-data";

export function FloatingWhatsApp({ message = "Hi, I need your services" }: { message?: string }) {
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full text-white animate-wa-pulse transition-transform hover:scale-110"
      style={{ backgroundColor: "var(--whatsapp)" }}
    >
      <MessageCircle className="h-7 w-7" fill="white" strokeWidth={0} />
      <svg viewBox="0 0 24 24" className="absolute h-7 w-7" fill="var(--whatsapp)" aria-hidden>
        <path d="M20.52 3.48A11.78 11.78 0 0 0 12.02 0C5.4 0 .04 5.36.04 11.98c0 2.11.55 4.17 1.6 5.98L0 24l6.2-1.62a11.94 11.94 0 0 0 5.82 1.48h.01c6.62 0 11.98-5.36 11.98-11.98 0-3.2-1.25-6.2-3.49-8.4ZM12.03 21.3h-.01a9.3 9.3 0 0 1-4.74-1.3l-.34-.2-3.68.96.98-3.58-.22-.37a9.27 9.27 0 0 1-1.42-4.84c0-5.13 4.18-9.31 9.32-9.31 2.49 0 4.83.97 6.59 2.73a9.27 9.27 0 0 1 2.73 6.6c0 5.13-4.18 9.31-9.31 9.31Zm5.38-6.97c-.29-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.66.15s-.76.96-.93 1.16c-.17.2-.34.22-.63.07-.29-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.03-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.6-.9-2.18-.24-.58-.48-.5-.66-.51l-.56-.01c-.2 0-.51.07-.78.37s-1.02 1-1.02 2.44 1.05 2.83 1.2 3.02c.15.2 2.07 3.16 5.01 4.43.7.3 1.25.48 1.68.62.7.22 1.34.19 1.85.12.56-.08 1.74-.71 1.98-1.4.24-.69.24-1.27.17-1.4-.07-.12-.27-.2-.56-.34Z"/>
      </svg>
    </a>
  );
}
