import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { RequestHandler } from 'express';
import { AppConfig } from '../config';
dotenv.config();

// Extend Express Request interface to include 'auth'
declare module 'express-serve-static-core' {
  interface Request {
    auth?: any;
  }
}

export function signJwt<T extends object>(payload: T) {
  const secret: jwt.Secret = AppConfig.jwt_secret;

  // const options: jwt.SignOptions = {
  //   expiresIn: (AppConfig.jwt_expires || '1Hr') as string | number,
  // };

  return jwt.sign(payload, secret);
}

export const AuthRequired: RequestHandler = (req, res, next) => {
  const hdr = req.headers.authorization || '';
  const parts = hdr.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'missing token' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, AppConfig.jwt_secret);
    req.auth = decoded; // e.g., { address }

    return next();
  } catch(err) {
    return res.status(401).json({ error: 'invalid token', message: err });
  }
}