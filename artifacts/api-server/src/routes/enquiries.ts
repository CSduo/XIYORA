import { Router, type IRouter } from "express";
import { desc, inArray, eq, sql } from "drizzle-orm";
import { db, enquiriesTable, insertEnquirySchema } from "@workspace/db";
import { requireAdmin } from "../lib/adminAuth";
import { sendWhatsAppNotification } from "../lib/whatsappNotify";

const router: IRouter = Router();

router.post("/enquiries", async (req, res): Promise<void> => {
  const parsed = insertEnquirySchema.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid enquiry body");
    res.status(400).json({ success: false, error: parsed.error.message });
    return;
  }
  const [row] = await db
    .insert(enquiriesTable)
    .values(parsed.data)
    .returning();

  res.status(201).json({ success: true, id: row.id });

  // Non-blocking — enquiry is already saved, WA failure must not affect the response
  sendWhatsAppNotification(row, req.log).catch(() => {});
});

router.get("/enquiries", requireAdmin, async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(enquiriesTable)
    .orderBy(desc(enquiriesTable.createdAt));
  res.json(rows);
});

router.patch("/admin/enquiries/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ success: false, error: "Invalid id" }); return; }
  const { status, adminNotes } = req.body as { status?: string; adminNotes?: string };
  const update: Record<string, string> = {};
  if (status !== undefined) update.status = status;
  if (adminNotes !== undefined) update.adminNotes = adminNotes;
  if (!Object.keys(update).length) { res.status(400).json({ success: false, error: "No fields to update" }); return; }
  const [row] = await db.update(enquiriesTable).set(update).where(eq(enquiriesTable.id, id)).returning();
  if (!row) { res.status(404).json({ success: false, error: "Enquiry not found" }); return; }
  res.json({ success: true, enquiry: row });
});

router.get("/quote-requests", requireAdmin, async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(enquiriesTable)
    .where(inArray(enquiriesTable.inquiryType, ["quote", "proforma", "bulk"]))
    .orderBy(desc(enquiriesTable.createdAt));
  res.json(rows);
});

router.get("/admin/analytics", requireAdmin, async (_req, res): Promise<void> => {
  const all = await db.select().from(enquiriesTable).orderBy(desc(enquiriesTable.createdAt));
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonth = all.filter(e => new Date(e.createdAt) >= monthStart).length;

  const byType: Record<string, number> = {};
  const byProduct: Record<string, number> = {};
  const byStatus: Record<string, number> = {};

  for (const e of all) {
    const t = e.inquiryType || "general";
    byType[t] = (byType[t] || 0) + 1;
    if (e.productName) byProduct[e.productName] = (byProduct[e.productName] || 0) + 1;
    const s = e.status || "new";
    byStatus[s] = (byStatus[s] || 0) + 1;
  }

  const topProducts = Object.entries(byProduct)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }));

  // Last 30 days trend (daily counts)
  const trend: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    trend[key] = 0;
  }
  for (const e of all) {
    const key = new Date(e.createdAt).toISOString().slice(0, 10);
    if (key in trend) trend[key]++;
  }

  res.json({
    total: all.length,
    thisMonth,
    byType,
    byStatus,
    topProducts,
    trend: Object.entries(trend).map(([date, count]) => ({ date, count })),
  });
});

export default router;
