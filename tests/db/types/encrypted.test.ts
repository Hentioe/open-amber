import { expect, test } from "bun:test";
import { decrypt, encrypt } from "../../../src/db/types/encrypted";

test("encrypt", () => {
  const packed = encrypt("OpenAmber");
  const packedBuffer = Buffer.from(packed, "base64");
  // 验证长度
  expect(packedBuffer.length).toEqual(37); // IV (12) + Tag (16) + 密文 ("OpenAmber")
});

test("decrypt", () => {
  const encrypted = encrypt("OpenAmber");

  expect(decrypt(encrypted)).toBe("OpenAmber");
});
