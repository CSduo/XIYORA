import type { Request, Response, NextFunction } from "express";

/**
 * Guards admin-only read routes. Requires the `x-admin-secret` request header
 * to match the ADMIN_SECRET environment variable. Returns 403 on any mismatch
 * (the frontend treats 403 as "incorrect / unconfigured admin secret").
 */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const expected = process.env.ADMIN_SECRET;
  const provided = req.header("x-admin-secret");
  if (!expected || !provided || provided !== expected) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  next();
}
