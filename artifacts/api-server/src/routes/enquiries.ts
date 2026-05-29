import { Router, type IRouter } from "express";
import { desc, inArray } from "drizzle-orm";
import { db, enquiriesTable, insertEnquirySchema } from "@workspace/db";
import { requireAdmin } from "../lib/adminAuth";

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
    .returning({ id: enquiriesTable.id });
  res.status(201).json({ success: true, id: row.id });
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
