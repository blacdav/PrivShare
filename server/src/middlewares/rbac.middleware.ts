import { Request, Response, NextFunction } from "express";

export const RequireRole = (roles: string[]) => {
  return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    return next();
  };
}
