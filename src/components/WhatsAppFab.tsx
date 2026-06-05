import { MessageCircle } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/916202442690?text=Hi%20Signhify%2C%20I%27d%20like%20to%20discuss%20a%20build.";

export function WhatsAppFab() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Signhify on WhatsApp"
      className="group fixed bottom-5 right-5 z-[70] inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_rgba(16,185,129,0.6)] hover:bg-emerald-400 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60"
    >
      <span className="relative grid place-items-center">
        <span className="absolute inset-0 rounded-full bg-emerald-300/60 animate-ping opacity-60" />
        <MessageCircle size={18} className="relative" />
      </span>
      <span className="hidden sm:inline">WhatsApp us</span>
    </a>
  );
}
