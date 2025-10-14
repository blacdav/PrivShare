import { RequestHandler } from "express";
import { nanoid } from "nanoid";
import FilesModel from "../../models/files.model";

export const Files: RequestHandler = async (req, res) => {
  try {
    const owner = req.auth.address;
    const fileId = nanoid(12);
    const doc = new FilesModel({ fileId, owner, createdAt: new Date() });
    await doc.save();
    res.json({ fileId });
  } catch (e) {
    console.error('create file error', e);
    res.status(500).json({ error: e });
  }
};

export const File: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const wallet = req.auth.address.toLowerCase(); // require JWT for identity
    const file = await FilesModel.findOne({ fileId: id });
    if (!file) return res.status(404).json({ error: 'file not found' });

    const entry = (file.wrapped || []).find(w => w.recipient === wallet);
    return res.json({
      cid: file.cid,
      iv: file.iv,
      metadata: file.metadata,
      wrappedForMe: entry ? entry.wrappedBase64 : null
    });
  } catch (e) {
    console.error('get file error', e);
    return res.status(500).json({ error: e });
  }
};