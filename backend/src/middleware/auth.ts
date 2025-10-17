import { type Request } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your-secret-key"; // In production, use environment variable

export interface AuthRequest extends Request {
  userId?: string;
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
}

export function authenticateToken(req: AuthRequest, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.userId = decoded.userId;
    next();
  });
}