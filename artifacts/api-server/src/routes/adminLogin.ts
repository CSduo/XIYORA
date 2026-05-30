import { Router, type IRouter } from "express";
import { createAdminToken } from "../lib/adminAuth";

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

export default router;
