import { RequestHandler } from "express";
import multer from "multer";
import crypto from "crypto";
// import FileModel from "../models/File";
import AuditLog from "../models/AuditLog";
import { IpfsService } from "../services/ipfs.service";
import { EncryptionService } from "../services/encryption.service";
import { BlockchainService } from "../services/blockchain.service";
import { logger } from "../utils/logger";
import User from "../../models/users.model";
import File from "../../models/files.model";

const upload = multer({ storage: multer.memoryStorage() });
const ipfs = new IpfsService();
const blockchain = new BlockchainService();

/**
 * Upload a file (client should encrypt before sending ideally)
 * Steps:
 *  - generate fileId = keccak256 of ipfsHash or random
 *  - encrypt file buffer on server (demo) with AES key
 *  - wrap AES key with owner's public key
 *  - upload file to IPFS
 *  - store metadata in MongoDB
 *  - register file on chain (call contract)
 */
// router.post("/upload", requireAuth, upload.single("file"), async (req: any, res) => {
export const Upload: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.user_id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const fileBuff: Buffer = req.file.buffer;
    // AES key (in real system, client does this)
    const aesKey = EncryptionService.generateAesKey();
    const enc = EncryptionService.encryptWithAes(fileBuff, aesKey);

    // upload encrypted bytes to IPFS
    const encryptedBuffer = Buffer.from(enc.cipherText, "hex");
    const cid = await ipfs.uploadBuffer(encryptedBuffer);

    // compute fileId as keccak256 of cid + owner
    const fileIdBuf = crypto.createHash("sha256").update(cid + userId).digest();
    const fileIdHex = "0x" + fileIdBuf.toString("hex").padStart(64, "0");

    // wrap AES key with user's public key
    const encryptedKey = user.publicKey ? EncryptionService.wrapKeyWithPublicKey(aesKey, user.publicKey) : null;

    // store metadata
    await File.create({
      fileId: fileIdHex,
      owner: user._id,
      ipfsHash: cid,
      encryptedKey,
      metadata: { originalName: req.file.originalname, size: req.file.size, iv: enc.iv }
    });

    // register on chain using server owner/deployer key (DEMO) - needs CONTRACT_ADDRESS set
    const signerKey = process.env.OWNER_PRIVATE_KEY || "";
    if (signerKey && process.env.CONTRACT_ADDRESS) {
      await blockchain.registerFileOnChain(signerKey, fileIdHex, cid);
    } else {
      logger.warn("Skipping on-chain registration because OWNER_PRIVATE_KEY or CONTRACT_ADDRESS not set");
    }

    await AuditLog.create({ action: "Upload", actor: userId, details: { fileId: fileIdHex, cid } });

    return res.json({ ok: true, fileId: fileIdHex, cid });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
};

/**
 * Grant access: owner calls -> on-chain grantAccess -> DB audit
 */
// router.post("/grant", requireAuth, async (req: any, res) => {
export const Grant: RequestHandler = async (req, res) => {
  const { fileId, granteeAddress } = req.body;
  const userId = req.user?.user_id;
  try {
    const file = await File.findOne({ fileId });
    if (!file) return res.status(404).json({ error: "File not found" });
    // check file owner
    if (file.owner.toString() !== userId) return res.status(403).json({ error: "Not owner" });

    const signerKey = process.env.OWNER_PRIVATE_KEY || "";
    if (!signerKey) return res.status(500).json({ error: "Server signer not configured" });

    await blockchain.grantAccessOnChain(signerKey, fileId, granteeAddress);
    await AuditLog.create({ action: "GrantAccess", actor: userId, details: { fileId, granteeAddress } });

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
};

/**
 * Revoke access
 */
// router.post("/revoke", requireAuth, async (req: any, res) => {
export const Revoke: RequestHandler = async (req, res) => {
  const { fileId, granteeAddress } = req.body;
  const userId = req.user?.user_id;
  try {
    const file = await File.findOne({ fileId });
    if (!file) return res.status(404).json({ error: "File not found" });
    if (file.owner.toString() !== userId) return res.status(403).json({ error: "Not owner" });

    const signerKey = process.env.OWNER_PRIVATE_KEY || "";
    if (!signerKey) return res.status(500).json({ error: "Server signer not configured" });

    await blockchain.revokeAccessOnChain(signerKey, fileId, granteeAddress);
    await AuditLog.create({ action: "RevokeAccess", actor: userId, details: { fileId, granteeAddress } });

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
};

/**
 * Download file (server retrieves IPFS encrypted file and returns encrypted bytes + metadata)
 * Decryption should be performed by the client after unwrapping AES key with their private key.
 */
// router.get("/download/:fileId", requireAuth, async (req: any, res) => {
export const Download: RequestHandler = async (req, res) => {
  try {
    const file = await File.findOne({ fileId: req.params.fileId });
    if (!file) return res.status(404).json({ error: "File not found" });

    // permission check: ideally call contract hasAccess or lookup DB (for MVP we trust DB/chain sync)
    const buffer = await ipfs.catToBuffer(file.ipfsHash);

    // return the encrypted blob (as hex) + metadata (iv)
    return res.json({ encryptedHex: buffer.toString("hex"), metadata: file.metadata, ipfsHash: file.ipfsHash });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
};