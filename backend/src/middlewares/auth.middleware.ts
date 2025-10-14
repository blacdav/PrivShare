import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { RequestHandler } from 'express';
dotenv.config();

// Extend Express Request interface to include 'auth'
declare module 'express-serve-static-core' {
  interface Request {
    auth?: any;
  }
}

const JWT_SECRET = (process.env.JWT_SECRET ?? 'jllnblnljnl') as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '1h') as string;

export function signJwt<T extends object>(payload: T) {
    return jwt.sign(
        payload as object,
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

export const AuthRequired: RequestHandler = (req, res, next) => {
  const hdr = req.headers.authorization || '';
  const parts = hdr.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'missing token' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.auth = decoded; // e.g., { address }

    return next();
  } catch(err) {
    return res.status(401).json({ error: 'invalid token', message: err });
  }
}