// Hardcoded admin allowlist for the builder workspace.
// Only these emails can access /builder.
export const ADMIN_EMAILS = ["piyushrajsingh092@gmail.com", "rajpiyush092@gmail.com"];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase());
}
