/** Single source of truth for the manual (UPI + WhatsApp) payment rail. */
export const UPI_ID = "6202442690@jio";
export const WHATSAPP_NUMBER = "916202442690";

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function upiIntentLink(amountInr: number, note: string): string {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: "Signhify",
    am: amountInr.toFixed(2),
    cu: "INR",
    tn: note.slice(0, 80),
  });
  return `upi://pay?${params.toString()}`;
}

/** Rough USD -> INR conversion used only to prefill the UPI amount. */
export const USD_TO_INR = 88;

/** One-time UPI fee a creator pays to take a pending listing live instantly. */
export const LISTING_FEE_INR = 99;
