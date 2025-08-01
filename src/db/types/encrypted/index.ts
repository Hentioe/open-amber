import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import config from "../../../config";

export { default as text } from "./text";

export function encrypt(plainText: string): Buffer {
  const key = Buffer.from(config.ENCRYPTION_KEY, "base64");
  const iv = randomBytes(12); // 12 字节 IV
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  let ciphertext = cipher.update(plainText, "utf8");
  ciphertext = Buffer.concat([ciphertext, cipher.final()]);
  const tag = cipher.getAuthTag(); // 16 字节 Tag
  // 拼接：IV (12 字节) + Tag (16 字节) + 密文
  return Buffer.concat([iv, tag, ciphertext]);
}

export function decrypt(packed: Buffer): string {
  const iv = packed.subarray(0, 12); // 前 12 字节为 IV
  const tag = packed.subarray(12, 28); // 接下来 16 字节为 Tag
  const ciphertext = packed.subarray(28); // 剩余为密文
  const key = Buffer.from(config.ENCRYPTION_KEY, "base64");
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(ciphertext, undefined, "utf8"); // 输入二进制，输出 UTF-8
  decrypted += decipher.final("utf8"); // 输出 UTF-8
  return decrypted;
}
