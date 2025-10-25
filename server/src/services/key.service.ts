import crypto from "crypto";

export class KeyService {
  // Generate RSA 4096 pair - in production you will use HSM or managed KMS
  static generateRsaKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" }
    });
    return { publicKey, privateKey };
  }

  // Example to generate ECDSA keypair (for wallets)
  static generateEcdsaP256() {
    return crypto.generateKeyPairSync("ec", {
      namedCurve: "secp256k1",
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" }
    });
  }
}