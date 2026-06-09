import { Router, type IRouter } from "express";
import { createAdminToken, timingSafeCompare } from "../lib/adminAuth";
import { OAuth2Client } from "google-auth-library";

const router: IRouter = Router();

// Simple in-memory rate limiter for admin login endpoints
const LOGIN_ATTEMPTS = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5; // 5 attempts allowed

function rateLimitLogin(req: any, res: any, next: any) {
  const ip = String(req.headers["x-forwarded-for"] || req.ip || req.socket.remoteAddress || "unknown");
  const now = Date.now();
  const record = LOGIN_ATTEMPTS.get(ip);

  if (record) {
    if (now > record.resetAt) {
      LOGIN_ATTEMPTS.delete(ip);
    } else if (record.count >= MAX_ATTEMPTS) {
      const waitSec = Math.ceil((record.resetAt - now) / 1000);
      res.status(429).json({ error: `Too many login attempts. Please try again after ${waitSec} seconds.` });
      return;
    }
  }
  next();
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const record = LOGIN_ATTEMPTS.get(ip);
  if (record) {
    record.count += 1;
  } else {
    LOGIN_ATTEMPTS.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  }
}

function clearAttempts(ip: string) {
  LOGIN_ATTEMPTS.delete(ip);
}

router.post("/admin/login", rateLimitLogin, async (req, res): Promise<void> => {
  const ip = String(req.headers["x-forwarded-for"] || req.ip || req.socket.remoteAddress || "unknown");
  const { username, password } = req.body ?? {};
  const expectedUsername = process.env.ADMIN_USERNAME || "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    res.status(503).json({ error: "Admin credentials not configured. Set ADMIN_PASSWORD in environment." });
    return;
  }
  if (!username || !password || !timingSafeCompare(username, expectedUsername) || !timingSafeCompare(password, expectedPassword)) {
    recordFailedAttempt(ip);
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  clearAttempts(ip);
  const token = createAdminToken();
  res.json({ success: true, token });
});

router.post("/admin/google-login", rateLimitLogin, async (req, res): Promise<void> => {
  const ip = String(req.headers["x-forwarded-for"] || req.ip || req.socket.remoteAddress || "unknown");
  const { credential } = req.body ?? {};
  if (!credential) {
    res.status(400).json({ error: "Missing Google credential token" });
    return;
  }

  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const adminGoogleEmail = process.env.ADMIN_GOOGLE_EMAIL || "xiyatosaanvi@gmail.com";

  if (!googleClientId) {
    res.status(503).json({ error: "Google login client ID is not configured on the server. Please set GOOGLE_CLIENT_ID." });
    return;
  }

  try {
    const client = new OAuth2Client(googleClientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      recordFailedAttempt(ip);
      res.status(401).json({ error: "Invalid Google token payload" });
      return;
    }

    const { email, email_verified } = payload;
    if (!email_verified || !email) {
      recordFailedAttempt(ip);
      res.status(401).json({ error: "Google email is not verified or is missing" });
      return;
    }

    if (!timingSafeCompare(email.toLowerCase(), adminGoogleEmail.toLowerCase())) {
      recordFailedAttempt(ip);
      res.status(403).json({ error: "Unauthorized access: this Google account is not registered as an administrator" });
      return;
    }

    clearAttempts(ip);
    const token = createAdminToken();
    res.json({ success: true, token });
  } catch (err: any) {
    recordFailedAttempt(ip);
    res.status(401).json({ error: "Google login verification failed: " + (err.message || "Invalid credentials") });
  }
});

export default router;

