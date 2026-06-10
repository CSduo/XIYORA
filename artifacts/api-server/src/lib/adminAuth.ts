import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";

function getJwtSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("ADMIN_SECRET environment variable is not set.");
  return secret;
}

export function timingSafeCompare(a: string, b: string): boolean {
  const aHash = crypto.createHash("sha256").update(a).digest();
  const bHash = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(aHash, bHash);
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // --- x-admin-secret header auth (legacy AdminView) ---
  const expected = process.env.ADMIN_SECRET;
  const provided = req.header("x-admin-secret");
  if (expected && provided && timingSafeCompare(provided, expected)) {
    next();
    return;
  }

  // --- Bearer token (JWT) auth (AdminPanel) ---
  const authHeader = req.header("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);

    // Check ADMIN_SECRET is configured before attempting JWT verify
    if (!process.env.ADMIN_SECRET) {
      res.status(503).json({
        error: "ADMIN_SECRET is not configured. Set it in your Vercel environment variables and redeploy.",
      });
      return;
    }

    try {
      jwt.verify(token, getJwtSecret());
      next();
      return;
    } catch {
      res.status(403).json({ error: "Invalid or expired token. Please log in again." });
      return;
    }
  }

  // No valid auth provided
  if (!expected) {
    res.status(503).json({
      error: "ADMIN_SECRET is not configured on the server. Set it in Vercel environment variables and redeploy.",
    });
    return;
  }

  res.status(403).json({ error: "Forbidden — provide valid credentials." });
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
