// Client-side AES-256-GCM for zero-knowledge BYOK.
// The browser encrypts each API key with a random per-provider client key that
// lives only in sessionStorage. The server stores ciphertext only; the client
// key rides per-request over TLS (via withByokKeys middleware) and is never
// persisted server-side. Blob format matches secrets.server.ts: iv:tag:ct hex.

export const AES_GCM_CIPHERTEXT_RE = /^[0-9a-f]{24}:[0-9a-f]{32}:[0-9a-f]+$/i;

const BYOK_SESSION_KEY = "signhify_byok_client_keys";

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function importKey(clientKeyHex: string, usage: "encrypt" | "decrypt") {
  // Hash like secrets.server.ts (SHA-256 of the key string) so the server
  // decrypt path needs zero changes for client-encrypted blobs.
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(clientKeyHex));
  return crypto.subtle.importKey("raw", digest, { name: "AES-GCM" }, false, [usage]);
}

export async function byokGenerateKey(): Promise<string> {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
}

export async function byokEncrypt(plaintext: string, clientKeyHex: string): Promise<string> {
  const key = await importKey(clientKeyHex, "encrypt");
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(plaintext)),
  );
  return `${bytesToHex(iv)}:${bytesToHex(cipher.slice(-16))}:${bytesToHex(cipher.slice(0, -16))}`;
}

export async function byokDecrypt(blob: string, clientKeyHex: string): Promise<string> {
  const [ivHex, tagHex, ctHex] = blob.split(":");
  const key = await importKey(clientKeyHex, "decrypt");
  const data = new Uint8Array([...hexToBytes(ctHex), ...hexToBytes(tagHex)]);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: hexToBytes(ivHex) }, key, data);
  return new TextDecoder().decode(plain);
}

/**
 * Normalizes raw session tokens, cookie headers, and API keys.
 * Handles:
 * - __Secure-next-auth.session-token=eyJ...; other=... -> extracts session-token
 * - __Secure-1PSID=...; other=... -> extracts 1PSID
 * - JSON { "accessToken": "eyJ..." } -> extracts accessToken
 * - Bearer tokens -> strips "Bearer " prefix
 * - Quoted strings -> strips surrounding quotes
 */
export function normalizeSessionTokenOrKey(provider: string, input: string): string {
  let cleaned = input.trim();
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  if (provider === "ChatGPT_Cookies") {
    const match = cleaned.match(/__Secure-next-auth\.session-token=([^;\s]+)/i);
    if (match && match[1]) {
      cleaned = match[1].trim();
    } else if (cleaned.includes("accessToken")) {
      try {
        const parsed = JSON.parse(cleaned);
        if (parsed.accessToken) cleaned = String(parsed.accessToken).trim();
        else if (parsed.token) cleaned = String(parsed.token).trim();
      } catch {
        const jsonMatch = cleaned.match(/"accessToken"\s*:\s*"([^"]+)"/i);
        if (jsonMatch && jsonMatch[1]) cleaned = jsonMatch[1].trim();
      }
    } else if (cleaned.startsWith("Bearer ")) {
      cleaned = cleaned.slice(7).trim();
    }
  } else if (provider === "Gemini_Cookies") {
    const match = cleaned.match(/__Secure-1PSID=([^;\s]+)/i);
    if (match && match[1]) {
      cleaned = match[1].trim();
    }
  } else if (provider === "OpenAI") {
    if (cleaned.startsWith("Bearer ")) {
      cleaned = cleaned.slice(7).trim();
    }
  }
  return cleaned;
}

/**
 * Validates token / key shape for BYOK:
 *  - no unprintable control characters or NULs
 *  - not shaped like our internal AES-GCM ciphertext
 *  - length between 8 and 8192 characters (supports long JWTs and cookie payloads)
 *  - contains letters and digits/symbols
 */
export function validateApiKeyShape(provider: string, apiKey: string): void {
  // eslint-disable-next-line no-control-regex -- control chars must be rejected, not matched
  if (/[\u0000-\u0008\u000E-\u001F\u007F]/.test(apiKey)) {
    throw new Error("Token or API key contains invalid control characters.");
  }
  if (AES_GCM_CIPHERTEXT_RE.test(apiKey)) {
    throw new Error("This value looks like an encrypted blob, not a raw token or API key.");
  }
  if (apiKey.length < 8) {
    throw new Error("Token or API key is too short (minimum 8 characters).");
  }
  if (apiKey.length > 8192) {
    throw new Error("Token exceeds maximum supported size (8,192 characters).");
  }
  const hasLetter = /[A-Za-z]/.test(apiKey);
  const hasOther = /[0-9._\-+=~:;%]/.test(apiKey);
  if (!hasLetter || !hasOther) {
    throw new Error("Value does not look like a valid token or API key.");
  }
}

// ---- session-scoped storage of the per-provider client keys ----

export function readByokSessionKeys(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(BYOK_SESSION_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function setByokSessionKey(provider: string, clientKeyHex: string): void {
  if (typeof window === "undefined") return;
  const all = readByokSessionKeys();
  all[provider] = clientKeyHex;
  sessionStorage.setItem(BYOK_SESSION_KEY, JSON.stringify(all));
}

export function clearByokSessionKey(provider: string): void {
  if (typeof window === "undefined") return;
  const all = readByokSessionKeys();
  delete all[provider];
  sessionStorage.setItem(BYOK_SESSION_KEY, JSON.stringify(all));
}
