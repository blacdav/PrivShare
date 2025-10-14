import { RequestHandler } from "express";
import UserModel from "../../models/user.model";

export const RegPubKey: RequestHandler = async (req, res) => {
  try {
    const wallet = req.auth.address;
    const { pubkey } = req.body;
    if (!pubkey) return res.status(400).json({ error: 'missing pubkey' });

    // update user's encPubKey
    await UserModel.updateOne({ wallet }, { $set: { encPubKey: pubkey, registeredAt: new Date() } }, { upsert: true });
    return res.json({ ok: true });
  } catch (e) {
    console.error('register pubkey error', e);
    return res.status(500).json({ error: e });
  }
};