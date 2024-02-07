import { describe, expect, it } from "vitest";
import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto';
import { Config } from "sst/node/config";

const hashSecret = (secret: string) => {
  // Create a SHA-256 hash of the UUID string
  const hash = createHash('sha256');
  hash.update(secret);
  return hash.digest(); // This will give you a 32-byte (256-bit) key
}

// Encrypt function using Node.js crypto module
const encrypt = (data: string, key: Buffer, iv: Buffer): string => {
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  let encryptedData = cipher.update(data, 'utf8', 'base64');
  encryptedData += cipher.final('base64');
  return encryptedData;
}

// Encrypt function using Node.js crypto module
const decrypt = (data: string, key: Buffer, iv: Buffer): string => {
  const cipher = createDecipheriv('aes-256-cbc', key, iv);
  let decryptedData = cipher.update(data, 'base64', 'utf8');
  decryptedData += cipher.final('utf8');
  return decryptedData;
}

describe('AES Encrypt/Decrypt Tests', () => {

  it("encrypt and decrypt", async () => {
      const data = {
        id: 1,
        value: "Some Cool Text"
      };
      const iv = randomBytes(16); // 128 bits IV
      const key = hashSecret(Config.SECRET_KEY);

      const serialized = JSON.stringify(data);
      const encrypted = encrypt(serialized, key, iv);
      const decrypted = decrypt(encrypted, key, iv);
      const deserialized = JSON.parse(decrypted);

      console.log('RAW', data);
      console.log('ENCRYPTED', encrypted);
      console.log('RAW DECRYPTED', decrypted);
      console.log('DECRYPTED', deserialized);

      expect(decrypted).toBe(serialized);
      expect(deserialized.id).toBe(data.id);
      expect(deserialized.value).toBe(data.value);
  });
});
