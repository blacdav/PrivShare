import { RequestHandler } from "express";
import FilesModel from "../../models/files.model";

export const Finalize: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const { wrapped } = req.body;
    if (!Array.isArray(wrapped)) return res.status(400).json({ error: 'wrapped must be array' });

    const file = await FilesModel.findOne({ fileId: id });
    if (!file) return res.status(404).json({ error: 'file not found' });
    if (file.owner.toLowerCase() !== req.auth.address.toLowerCase()) {
      return res.status(403).json({ error: 'only owner can finalize shares' });
    }

    // append wrapped entries (you may want to de-duplicate recipients in a real implementation)
    wrapped.forEach(w => {
      file.wrapped.push({
        recipient: w.recipient.toLowerCase(),
        wrappedBase64: w.wrappedBase64,
        expiresAt: w.expiresAt ? new Date(w.expiresAt) : null
      });
    });
    await file.save();
    return res.json({ ok: true });
  } catch (e) {
    console.error('finalize error', e);
    return res.status(500).json({ error: e });
  }
};