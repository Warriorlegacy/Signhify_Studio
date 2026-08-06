import { describe, it } from "node:test";
import assert from "node:assert";
import { encryptAES256GCM, decryptAES256GCM } from "../../src/lib/secrets.server";

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
      assert.ok(!ct.includes(raw), "Ciphertext should not contain raw text");
      assert.ok(
        /^[0-9a-f]{24}:[0-9a-f]{32}:[0-9a-f]+$/i.test(ct),
        "Ciphertext should match GCM format hex pattern",
      );
      assert.strictEqual(
        decryptAES256GCM(ct, MASTER),
        raw,
        "Decrypted text should match raw input",
      );
    }
  });

  it("produces different ciphertexts for the same plaintext (random IV)", () => {
    const raw = "sk-test-1234567890abcdef";
    const a = encryptAES256GCM(raw, MASTER);
    const b = encryptAES256GCM(raw, MASTER);
    assert.notStrictEqual(
      a,
      b,
      "Two encryptions of same text should produce different ciphertexts",
    );
    assert.strictEqual(decryptAES256GCM(a, MASTER), raw);
    assert.strictEqual(decryptAES256GCM(b, MASTER), raw);
  });

  it("fails to decrypt with the wrong master key", () => {
    const ct = encryptAES256GCM("sk-test-1234567890abcdef", MASTER);
    assert.throws(() => decryptAES256GCM(ct, "another-master-key-000000000000"));
  });

  it("rejects tampered ciphertext (GCM auth tag)", () => {
    const ct = encryptAES256GCM("sk-test-1234567890abcdef", MASTER);
    const parts = ct.split(":");
    const iv = parts[0];
    const tag = parts[1];
    const body = parts[2];
    const flipped = body.replace(/.$/, (c) => (c === "0" ? "1" : "0"));
    assert.throws(() => decryptAES256GCM(`${iv}:${tag}:${flipped}`, MASTER));
  });
});
