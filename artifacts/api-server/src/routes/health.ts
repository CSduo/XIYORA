import { Router, type IRouter } from "express";

const router: IRouter = Router();

const startedAt = Date.now();

function healthPayload() {
  return {
    status: "ok",
    uptime: Math.floor((Date.now() - startedAt) / 1000),
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV ?? "unknown",
    dbConnected: !!process.env.DATABASE_URL,
  };
}

router.get("/health", (_req, res) => {
  res.json(healthPayload());
});

router.get("/healthz", (_req, res) => {
  res.json(healthPayload());
});

export default router;
