import { Router, type IRouter } from "express";
import { createAdminToken } from "../lib/adminAuth";
import { OAuth2Client } from "google-auth-library";

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const { username, password } = req.body ?? {};
  const expectedUsername = process.env.ADMIN_USERNAME || "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    res.status(503).json({ error: "Admin credentials not configured. Set ADMIN_PASSWORD in environment." });
    return;
  }
  if (username !== expectedUsername || password !== expectedPassword) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const token = createAdminToken();
  res.json({ success: true, token });
});

router.post("/admin/google-login", async (req, res): Promise<void> => {
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
      res.status(401).json({ error: "Invalid Google token payload" });
      return;
    }

    const { email, email_verified } = payload;
    if (!email_verified || !email) {
      res.status(401).json({ error: "Google email is not verified or is missing" });
      return;
    }

    if (email.toLowerCase() !== adminGoogleEmail.toLowerCase()) {
      res.status(403).json({ error: "Unauthorized access: this Google account is not registered as an administrator" });
      return;
    }

    const token = createAdminToken();
    res.json({ success: true, token });
  } catch (err: any) {
    res.status(401).json({ error: "Google login verification failed: " + (err.message || "Invalid credentials") });
  }
});

export default router;

