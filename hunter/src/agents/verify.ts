import { resolveMx } from "node:dns/promises";
import { connect } from "node:net";

export type Verdict = "verified" | "risky" | "failed" | "unknown";

const DISPOSABLE = new Set([
  "mailinator.com", "guerrillamail.com", "tempmail.com", "10minutemail.com",
  "yopmail.com", "throwawaymail.com", "sharklasers.com", "maildrop.cc",
  "temp-mail.org", "trashmail.com", "mohmal.com", "getnada.com", "fakeinbox.com",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function syntaxOk(email: string): boolean {
  if (!EMAIL_RE.test(email)) return false;
  const local = email.split("@")[0] ?? "";
  if (local.length > 64 || local.startsWith(".") || local.endsWith(".")) return false;
  return true;
}

async function smtpProbe(mxHost: string, email: string, timeoutMs = 6000): Promise<"accept" | "reject" | "timeout"> {
  return new Promise((resolve) => {
    const sock = connect({ host: mxHost, port: 25 }, () => {
      sock.write(`EHLO hunter.local\r\nMAIL FROM:<verify@hunter.local>\r\nRCPT TO:<${email}>\r\nQUIT\r\n`);
    });
    let sawRcpt = false;
    sock.setTimeout(timeoutMs);
    sock.on("data", (buf) => {
      const line = buf.toString();
      if (line.startsWith("250")) {
        if (sawRcpt) {
          sock.destroy();
          resolve("accept");
        } else if (line.includes("250")) {
          sawRcpt = true;
        }
      } else if (line.startsWith("550") || line.startsWith("551") || line.startsWith("553")) {
        sock.destroy();
        resolve("reject");
      }
    });
    sock.on("timeout", () => {
      sock.destroy();
      resolve("timeout");
    });
    sock.on("error", () => {
      sock.destroy();
      resolve("timeout");
    });
    sock.on("close", () => resolve(sawRcpt ? "accept" : "timeout"));
  });
}

export async function verifyEmail(email: string): Promise<Verdict> {
  if (!syntaxOk(email)) return "failed";
  const domain = email.split("@")[1] as string;
  if (DISPOSABLE.has(domain)) return "failed";
  let mx: string[] = [];
  try {
    const recs = await resolveMx(domain);
    mx = recs.sort((a, b) => a.priority - b.priority).map((r) => r.exchange);
  } catch {
    return "failed";
  }
  if (mx.length === 0) return "failed";
  const result = await smtpProbe(mx[0] as string, email);
  if (result === "accept") return "verified";
  if (result === "reject") return "failed";
  return "risky";
}
