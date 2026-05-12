import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}

// Middleware untuk endpoint yang butuh login
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Akses ditolak. Token tidak ada." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token tidak valid atau kedaluwarsa" });
  }
};

// Middleware optional: Jika ada token, simpan ke req.user. Jika tidak, biarkan lewat.
// Berguna untuk `/api/analyze` di mana user bisa login ATAU guest.
export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string };
      req.user = decoded;
    } catch (error) {
      // Abaikan jika token invalid untuk guest
    }
  }
  next();
};
