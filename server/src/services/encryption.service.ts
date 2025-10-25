import crypto from "crypto";

export class EncryptionService {
  static generateAesKey(): Buffer {
    return crypto.randomBytes(32); // AES-256
  }

  static encryptWithAes(plain: Buffer, key: Buffer): { iv: string; cipherText: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    const encrypted = Buffer.concat([cipher.update(plain), cipher.final()]);
    const tag = cipher.getAuthTag();
    return {
      iv: iv.toString("hex"),
      cipherText: Buffer.concat([encrypted, tag]).toString("hex")
    };
  }

  static decryptWithAes(encryptedHex: string, key: Buffer, ivHex: string): Buffer {
    const encryptedBuf = Buffer.from(encryptedHex, "hex");
    // last 16 bytes are tag for GCM
    const tag = encryptedBuf.slice(encryptedBuf.length - 16);
    const ciphertext = encryptedBuf.slice(0, encryptedBuf.length - 16);
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(ivHex, "hex"));
    decipher.setAuthTag(tag);
    const out = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return out;
  }

  // wrap AES key with RSA public key PEM
  static wrapKeyWithPublicKey(aesKey: Buffer, publicKeyPem: string): string {
    const encrypted = crypto.publicEncrypt(publicKeyPem, aesKey);
    return encrypted.toString("base64");
  }

  static unwrapKeyWithPrivateKey(wrappedBase64: string, privateKeyPem: string): Buffer {
    const buf = Buffer.from(wrappedBase64, "base64");
    const decrypted = crypto.privateDecrypt(privateKeyPem, buf);
    return decrypted;
  }
}
