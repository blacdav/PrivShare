import { RequestHandler } from "express";
import UserModel from "../../models/user.model";

export const GetPubKey: RequestHandler = async (req, res) => {
  const wallet = (req.params.wallet || '').toLowerCase();
  
  const u = await UserModel.findOne({ wallet });

  if (!u || !u.encPubKey) return res.status(404).json({ error: 'pubkey not found' });
  
  return res.json({ pubkey: u.encPubKey });
};