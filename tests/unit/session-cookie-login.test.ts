import { describe, it } from "node:test";
import assert from "node:assert";
import { normalizeSessionTokenOrKey, validateApiKeyShape } from "../../src/lib/byok-client";
import { encryptAES256GCM, decryptAES256GCM } from "../../src/lib/secrets.server";

const MASTER_KEY = "test-master-secret-key-32-chars-length-ok!";

describe("ChatGPT Session Token & Cookie Login Robustness", () => {
  describe("Token & Cookie Normalization", () => {
    it("extracts session token from raw ChatGPT cookie header", () => {
      const rawHeader =
        "__Secure-next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..abc123xyz; _cfuvid=test123; cf_clearance=clear123";
      const normalized = normalizeSessionTokenOrKey("ChatGPT_Cookies", rawHeader);
      assert.strictEqual(
        normalized,
        "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..abc123xyz",
        "Should cleanly extract the session token value without trailing cookies or semicolons",
      );
    });

    it("extracts accessToken from JSON object or string", () => {
      const jsonStr = JSON.stringify({
        accessToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature",
      });
      const normalized = normalizeSessionTokenOrKey("ChatGPT_Cookies", jsonStr);
      assert.strictEqual(
        normalized,
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature",
      );
    });

    it("strips outer quotes from pasted tokens", () => {
      const quoted = '"eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..quotedtoken"';
      const normalized = normalizeSessionTokenOrKey("ChatGPT_Cookies", quoted);
      assert.strictEqual(normalized, "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..quotedtoken");
    });

    it("extracts __Secure-1PSID for Gemini web cookies", () => {
      const geminiCookie =
        "__Secure-1PSID=g.a000test_cookie_session_gemini_123456789; __Secure-1PSIDTS=987654321";
      const normalized = normalizeSessionTokenOrKey("Gemini_Cookies", geminiCookie);
      assert.strictEqual(normalized, "g.a000test_cookie_session_gemini_123456789");
    });

    it("strips 'Bearer ' prefix for OpenAI and custom tokens", () => {
      const bearer = "Bearer sk-proj-1234567890abcdefghijklmnopqrstuvwxyz";
      const normalized = normalizeSessionTokenOrKey("OpenAI", bearer);
      assert.strictEqual(normalized, "sk-proj-1234567890abcdefghijklmnopqrstuvwxyz");
    });
  });

  describe("Shape & Security Validation", () => {
    it("accepts long JWT tokens (2000+ chars)", () => {
      // Simulate real 2,000+ char JWT session token
      const longJwt =
        "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0.." +
        "a".repeat(1500) +
        ".signaturePart1234567890._-";
      assert.doesNotThrow(() => validateApiKeyShape("ChatGPT_Cookies", longJwt));
    });

    it("accepts standard API keys (OpenAI, Gemini, Groq, Cerebras)", () => {
      assert.doesNotThrow(() =>
        validateApiKeyShape("OpenAI", "sk-proj-abcdefghijklmnopqrstuvwxyz0123456789"),
      );
      assert.doesNotThrow(() =>
        validateApiKeyShape("Gemini", "AIzaSyD-EXAMPLE_googleaikey_9876543210"),
      );
      assert.doesNotThrow(() =>
        validateApiKeyShape("Groq", "gsk_1234567890abcdefghijklmnopqrstuvwxyz"),
      );
    });

    it("rejects tokens with non-printable control characters", () => {
      const invalid = "eyJhbGciOi\x00\x01invalid";
      assert.throws(() => validateApiKeyShape("ChatGPT_Cookies", invalid));
    });

    it("rejects internal ciphertext blobs to prevent double-encryption accidents", () => {
      const fakeCiphertext =
        "0123456789abcdef01234567:0123456789abcdef0123456789abcdef:0123456789abcdef";
      assert.throws(() => validateApiKeyShape("ChatGPT_Cookies", fakeCiphertext));
    });

    it("rejects too short or purely whitespace tokens", () => {
      assert.throws(() => validateApiKeyShape("ChatGPT_Cookies", "short"));
    });
  });

  describe("AES-256-GCM Encryption for Large Session Tokens", () => {
    it("successfully encrypts and decrypts a 3KB session token payload", () => {
      const realWorldPayload =
        "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0.." +
        "ABCDEF1234567890_-".repeat(150) +
        ".finalTag123456";

      const ciphertext = encryptAES256GCM(realWorldPayload, MASTER_KEY);
      assert.ok(
        !ciphertext.includes("eyJhbGci"),
        "Ciphertext must not expose plaintext JWT headers",
      );

      const decrypted = decryptAES256GCM(ciphertext, MASTER_KEY);
      assert.strictEqual(
        decrypted,
        realWorldPayload,
        "Decrypted value must match original large payload",
      );
    });
  });
});
