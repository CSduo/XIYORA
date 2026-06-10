import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

const startedAt = Date.now();

async function testDbConnection(): Promise<boolean> {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) return false;
    // Actually run a query to verify the connection works
    await db.execute(sql`SELECT 1`);
    return true;
  } catch {
    return false;
  }
}

router.get("/health", async (_req, res) => {
  try {
    const dbConnected = await testDbConnection();
    res.json({
      status: "ok",
      uptime: Math.floor((Date.now() - startedAt) / 1000),
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV ?? "unknown",
      dbConnected,
      hasAdminSecret: !!process.env.ADMIN_SECRET,
      hasAdminPassword: !!process.env.ADMIN_PASSWORD,
    });
  } catch (err: any) {
    res.json({
      status: "ok",
      uptime: Math.floor((Date.now() - startedAt) / 1000),
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV ?? "unknown",
      dbConnected: false,
      error: err?.message || "Health check error",
    });
  }
});

router.get("/healthz", async (_req, res) => {
  const dbConnected = await testDbConnection().catch(() => false);
  res.json({
    status: "ok",
    uptime: Math.floor((Date.now() - startedAt) / 1000),
    timestamp: new Date().toISOString(),
    dbConnected,
  });
});

export default router;
