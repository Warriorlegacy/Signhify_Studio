import { describe, it, expect } from "vitest";
import { encryptAES256GCM, decryptAES256GCM } from "@/lib/secrets.server";

const MASTER = "test-master-key-please-ignore-1234567890";

describe("BYOK key encryption at rest", () => {
  it("round-trips arbitrary API key strings", () => {
    const samples = [
      "sk-proj-abcdefghijklmnopqrstuvwxyz0123456789",
      "gsk_live_ABCDEF1234567890",
      "AIzaSyD-EXAMPLE_googleaikey_9876543210",
    ];
    for (const raw of samples) {
      const ct = encryptAES256GCM(raw, MASTER);
      expect(ct).not.toContain(raw);
      expect(ct).toMatch(/^[0-9a-f]{24}:[0-9a-f]{32}:[0-9a-f]+$/i);
      expect(decryptAES256GCM(ct, MASTER)).toBe(raw);
    }
  });

  it("produces different ciphertexts for the same plaintext (random IV)", () => {
    const raw = "sk-test-1234567890abcdef";
    const a = encryptAES256GCM(raw, MASTER);
    const b = encryptAES256GCM(raw, MASTER);
    expect(a).not.toEqual(b);
    expect(decryptAES256GCM(a, MASTER)).toBe(raw);
    expect(decryptAES256GCM(b, MASTER)).toBe(raw);
  });

  it("fails to decrypt with the wrong master key", () => {
    const ct = encryptAES256GCM("sk-test-1234567890abcdef", MASTER);
    expect(() => decryptAES256GCM(ct, "another-master-key-000000000000")).toThrow();
  });

  it("rejects tampered ciphertext (GCM auth tag)", () => {
    const ct = encryptAES256GCM("sk-test-1234567890abcdef", MASTER);
    const [iv, tag, body] = ct.split(":");
    const flipped = body.replace(/.$/, (c) => (c === "0" ? "1" : "0"));
    expect(() => decryptAES256GCM(`${iv}:${tag}:${flipped}`, MASTER)).toThrow();
  });
});
