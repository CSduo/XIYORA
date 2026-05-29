import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, subscriptionsTable, insertSubscriptionSchema } from "@workspace/db";
import { requireAdmin } from "../lib/adminAuth";

const router: IRouter = Router();

router.post("/subscriptions", async (req, res): Promise<void> => {
  const parsed = insertSubscriptionSchema.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid subscription body");
    res.status(400).json({ success: false, error: parsed.error.message });
    return;
  }
  const [row] = await db
    .insert(subscriptionsTable)
    .values(parsed.data)
    .returning({ id: subscriptionsTable.id });
  res.status(201).json({ success: true, id: row.id });
});

router.get("/subscriptions", requireAdmin, async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(subscriptionsTable)
    .orderBy(desc(subscriptionsTable.createdAt));
  res.json(rows);
});

export default router;
