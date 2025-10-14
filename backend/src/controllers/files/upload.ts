import { RequestHandler } from "express";
import { create as createIpfsClient } from 'ipfs-http-client';
import FilesModel from "../../models/files.model";

const ipfs = createIpfsClient({ url: IPFS_API });

export const Upload: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const { ciphertextBase64, iv, metadata } = req.body;
    if (!ciphertextBase64 || !iv) return res.status(400).json({ error: 'missing ciphertext or iv' });

    const file = await FilesModel.findOne({ fileId: id });
    if (!file) return res.status(404).json({ error: 'file not found' });
    if (file.owner.toLowerCase() !== req.auth.address.toLowerCase()) {
      return res.status(403).json({ error: 'only owner can upload content' });
    }

    // convert base64 -> Buffer
    const buffer = Buffer.from(ciphertextBase64, 'base64');
    const result = await ipfs.add(buffer);
    const cidStr = result.cid.toString();

    file.cid = cidStr;
    file.iv = iv;
    file.metadata = metadata || null;
    await file.save();

    return res.json({ cid: cidStr });
  } catch (e) {
    console.error('upload error', e);
    return res.status(500).json({ error: e.message });
  }
};