import { RequestHandler } from "express";
import FilesModel from "../../models/files.model";

export const Revoke: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const { recipient } = req.body;
    if (!recipient) return res.status(400).json({ error: 'missing recipient' });

    const file = await FilesModel.findOne({ fileId: id });
    if (!file) return res.status(404).json({ error: 'file not found' });
    if (file.owner.toLowerCase() !== req.auth.address.toLowerCase()) {
      return res.status(403).json({ error: 'only owner can revoke' });
    }

    file.wrapped.pull({ recipient: recipient.toLowerCase() });
    await file.save();
    return res.json({ ok: true });
  } catch (e) {
    console.error('revoke error', e);
    return res.status(500).json({ error: e });
  }
};