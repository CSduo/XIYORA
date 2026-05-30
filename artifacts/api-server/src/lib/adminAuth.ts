import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

function getJwtSecret(): string {
  return process.env.ADMIN_SECRET || "xiyora-admin-dev-secret-change-in-production";
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const expected = process.env.ADMIN_SECRET;
  const provided = req.header("x-admin-secret");
  if (expected && provided && provided === expected) {
    next();
    return;
  }
  const authHeader = req.header("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      jwt.verify(token, getJwtSecret());
      next();
      return;
    } catch {
      res.status(403).json({ error: "Invalid or expired token" });
      return;
    }
  }
  res.status(403).json({ error: "Forbidden" });
}

export function createAdminToken(): string {
  return jwt.sign({ role: "admin" }, getJwtSecret(), { expiresIn: "24h" });
}

export function verifyAdminToken(token: string): boolean {
  try {
    jwt.verify(token, getJwtSecret());
    return true;
  } catch {
    return false;
  }
}
