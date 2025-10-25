import { RequestHandler } from "express";
import { nanoid } from "nanoid";
import nonceModel from "../models/nonce.model";

export const GenNonce: RequestHandler = async (req, res) => {
    const n = nanoid(12);

    const doc = await nonceModel.create({ nonce: n });

    await doc.save();

    return res.send(n);
}