export interface AffiliateData {
  code: string;
  userId: string;
  commissionRate: number;
  totalEarnedCents: number;
  totalPaidCents: number;
  referrals: number;
  createdAt: string;
}

export function generateAffiliateCode(name: string): string {
  const clean = name
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 8);
  return `${clean}-${Math.floor(Math.random() * 100)}`;
}
