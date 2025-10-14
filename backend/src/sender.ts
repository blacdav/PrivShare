import { RequestHandler } from "express";
import crypto from "node:crypto";

export const EncryptMessage: RequestHandler = (req, res) => {
  const { message, receiverPubKey } = req.body;

  // Create ECDH instance for sender
  const senderECDH = crypto.createECDH("secp256k1"); // Ethereum uses secp256k1
  senderECDH.generateKeys();

  // Import receiver's public key
  const receiverKeyBuffer = Buffer.from(receiverPubKey, "base64");

  // Derive shared secret
  const sharedSecret = senderECDH.computeSecret(receiverKeyBuffer);

  // Use shared secret to derive AES key
  const aesKey = crypto.createHash("sha256").update(sharedSecret).digest();
  const iv = crypto.randomBytes(16);

  // Encrypt message
  const cipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv);
  let encryptedMessage = cipher.update(message, "utf8", "base64");
  encryptedMessage += cipher.final("base64");

  return res.status(200).json({
    encryptedMessage,
    iv: iv.toString("base64"),
    senderPubKey: senderECDH.getPublicKey().toString("base64") // receiver needs this
  });
};