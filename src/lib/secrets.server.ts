import crypto from "node:crypto";

function keyFrom(masterKey: string) {
  return crypto.createHash("sha256").update(masterKey).digest();
}
export function encryptAES256GCM(plaintext: string, masterKey: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", keyFrom(masterKey), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}
export function decryptAES256GCM(ciphertext: string, masterKey: string): string {
  const [ivHex, tagHex, encryptedHex] = ciphertext.split(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    keyFrom(masterKey),
    Buffer.from(ivHex, "hex"),
  );
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, "hex")),
    decipher.final(),
  ]).toString("utf8");
}
