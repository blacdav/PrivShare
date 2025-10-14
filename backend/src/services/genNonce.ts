export const GenNonce: RequestHandler = (req, res) => {
    const n = nanoid(12);
    const doc = new Nonce({ nonce: n });
    await doc.save();
    res.send(n);
});