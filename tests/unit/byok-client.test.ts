import { describe, it, expect } from "bun:test";
import {
  byokEncrypt,
  byokDecrypt,
  byokGenerateKey,
  AES_GCM_CIPHERTEXT_RE,
} from "../../src/lib/byok-client";
import { decryptAES256GCM } from "../../src/lib/secrets.server";

describe("byok-client (browser-held key)", () => {
  it("roundtrips plaintext through client encrypt/decrypt", async () => {
    const key = await byokGenerateKey();
    const blob = await byokEncrypt("sk-test-12345", key);
    expect(await byokDecrypt(blob, key)).toBe("sk-test-12345");
  });

  it("produces server-compatible iv:tag:ct ciphertext", async () => {
    const key = await byokGenerateKey();
    const blob = await byokEncrypt("sk-test-12345", key);
    expect(AES_GCM_CIPHERTEXT_RE.test(blob)).toBe(true);
    // Server decrypts with the same key string (both sides SHA-256 the key).
    expect(decryptAES256GCM(blob, key)).toBe("sk-test-12345");
  });

  it("throws on the wrong key", async () => {
    const blob = await byokEncrypt("sk-test-12345", await byokGenerateKey());
    expect(byokDecrypt(blob, await byokGenerateKey())).rejects.toThrow();
  });
});
