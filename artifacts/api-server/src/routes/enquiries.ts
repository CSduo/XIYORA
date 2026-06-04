import { Router, type IRouter } from "express";
import { desc, inArray } from "drizzle-orm";
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

router.get("/quote-requests", requireAdmin, async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(enquiriesTable)
    .where(inArray(enquiriesTable.inquiryType, ["quote", "proforma", "bulk"]))
    .orderBy(desc(enquiriesTable.createdAt));
  res.json(rows);
});

export default router;
