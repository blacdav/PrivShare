import { RequestHandler } from "express";
import { SiweMessage } from 'siwe';
import NonceModel from "../../models/nonce.model";
import UserModel from "../../models/user.model";
import { signJwt } from "../../middlewares/auth.middleware";

export const Siwe: RequestHandler = async (req, res) => {
  try {
    const { message, signature } = req.body;
    if (!message || !signature) return res.status(400).json({ error: 'missing message or signature' });

    const siweMsg = new SiweMessage(message);
    // const fields = await siweMsg.validate(signature);
    const fields = await siweMsg.verify(signature);

    // verify nonce exists
    const n = fields.nonce;
    const found = await NonceModel.findOne({ nonce: n });
    if (!found) return res.status(400).json({ error: 'invalid or expired nonce' });
    // delete used nonce
    await NonceModel.deleteOne({ nonce: n });

    const wallet = fields.address.toLowerCase();
    // ensure user exists
    await UserModel.updateOne({ wallet }, { $setOnInsert: { wallet } }, { upsert: true });

    const token = signJwt({ address: wallet });
    res.json({ ok: true, token, address: wallet });
  } catch (e) {
    console.error('siwe error', e);
    res.status(400).json({ error: e });
  }
};