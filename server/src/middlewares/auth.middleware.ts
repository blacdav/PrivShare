import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export interface AuthPayload extends jwt.JwtPayload {
  user_id?: string;
  email?: string;
  role?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}


export const CheckAuthUser: RequestHandler = (req, res, next) => {
    // const { token } = req.params; // this part is not needed as we are using the token to verify the user
    
    try {
        // read and understand the difference between let and const, as one is
        // a global scope

        const token = req.headers.cookie?.split("=")[1];

        if (!token) {
          return res.status(401).json({ message: "Unauthorized Request" })
        }

        const decoded = jwt.verify(token , jwtConfig.access);

        if (!decoded || typeof decoded !== "object") {
          return res.status(401).json({ message: "Unauthorized" })
        }
        req.user = decoded as AuthPayload;

        return next();
    } catch (err) {
        console.error(`Server Error: ${err}`);
        return res.status(500).json(`Server Error: ${err}`)
    }
}