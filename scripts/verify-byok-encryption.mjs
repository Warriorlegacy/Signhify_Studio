#!/usr/bin/env node
/**
 * Verify every row in public.user_ai_keys is stored as AES-256-GCM ciphertext
 * and decrypts successfully with SECRETS_MASTER_KEY. Exits non-zero if any
 * row is missing, malformed, or looks like plaintext.
 *
 * Requires env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SECRETS_MASTER_KEY.
 *
 * Usage:  node scripts/verify-byok-encryption.mjs
 */
import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const masterKey = process.env.SECRETS_MASTER_KEY;

if (!url || !serviceKey || !masterKey) {
  console.error(
    "Missing env. Need SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SECRETS_MASTER_KEY.",
  );
  process.exit(2);
}

function keyFrom(mk) {
  return crypto.createHash("sha256").update(mk).digest();
}
function decrypt(ct) {
  const [ivHex, tagHex, encHex] = ct.split(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    keyFrom(masterKey),
    Buffer.from(ivHex, "hex"),
  );
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  return Buffer.concat([
    decipher.update(Buffer.from(encHex, "hex")),
    decipher.final(),
  ]).toString("utf8");
}

const CIPHERTEXT_SHAPE = /^[0-9a-f]{24}:[0-9a-f]{32}:[0-9a-f]+$/i;

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data, error } = await supabase
  .from("user_ai_keys")
  .select("user_id, provider, api_key_encrypted, updated_at");

if (error) {
  console.error("Query failed:", error.message);
  process.exit(1);
}

let malformed = 0;
let undecryptable = 0;
let plaintextLike = 0;
let ok = 0;

for (const row of data ?? []) {
  const label = `${row.user_id.slice(0, 8)}…/${row.provider}`;
  const value = row.api_key_encrypted ?? "";
  if (!CIPHERTEXT_SHAPE.test(value)) {
    console.error(`✗ ${label}: not AES-GCM shape (possible plaintext)`);
    plaintextLike += 1;
    malformed += 1;
    continue;
  }
  try {
    const pt = decrypt(value);
    if (!pt || pt.length < 4) {
      console.error(`✗ ${label}: decrypted to empty/short value`);
      undecryptable += 1;
      continue;
    }
    ok += 1;
  } catch (e) {
    console.error(`✗ ${label}: decrypt failed (${(e && e.message) || e})`);
    undecryptable += 1;
  }
}

console.log(
  `\nSummary: ok=${ok}  malformed=${malformed}  undecryptable=${undecryptable}  plaintextLike=${plaintextLike}  total=${(data ?? []).length}`,
);

if (malformed || undecryptable) process.exit(1);
process.exit(0);
