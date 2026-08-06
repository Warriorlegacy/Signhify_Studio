export type Env = {
  siteUrl: string;
  openaiKey?: string;
  anthropicKey?: string;
  llmModel: string;
  resendKey?: string;
  fromEmail: string;
  fromName: string;
  physicalAddress: string;
  githubToken?: string;
  producthuntToken?: string;
  sandbox: boolean;
  scheduleIntervalSec: number;
};

export const env: Env = {
  siteUrl: process.env.HUNTER_SITE_URL ?? "http://localhost:3001",
  openaiKey: process.env.HUNTER_OPENAI_API_KEY || undefined,
  anthropicKey: process.env.HUNTER_ANTHROPIC_API_KEY || undefined,
  llmModel: process.env.HUNTER_LLM_MODEL ?? "gpt-4o-mini",
  resendKey: process.env.HUNTER_RESEND_API_KEY || undefined,
  fromEmail: process.env.HUNTER_FROM_EMAIL ?? "hunter@signhify.dev",
  fromName: process.env.HUNTER_FROM_NAME ?? "Piyush — Signhify Studio",
  physicalAddress: process.env.HUNTER_PHYSICAL_ADDRESS ?? "Signhify, Bihar, India",
  githubToken: process.env.HUNTER_GITHUB_TOKEN || undefined,
  producthuntToken: process.env.HUNTER_PRODUCTHUNT_TOKEN || undefined,
  sandbox: (process.env.HUNTER_SANDBOX ?? "true") !== "false",
  scheduleIntervalSec: Number(process.env.HUNTER_SCHEDULE_INTERVAL_SEC ?? 30),
};

export const llmKey = env.openaiKey ?? env.anthropicKey;
export const llmAvailable = () => Boolean(llmKey);
