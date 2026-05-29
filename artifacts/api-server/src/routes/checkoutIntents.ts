import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import {
  db,
  checkoutIntentsTable,
  enquiriesTable,
  insertCheckoutIntentSchema,
} from "@workspace/db";
import { requireAdmin } from "../lib/adminAuth";

const router: IRouter = Router();

router.post("/checkout-intents", async (req, res): Promise<void> => {
  const parsed = insertCheckoutIntentSchema.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn(
      { errors: parsed.error.message },
      "Invalid checkout-intent body",
    );
    res.status(400).json({ success: false, error: parsed.error.message });
    return;
  }
  const [row] = await db
    .insert(checkoutIntentsTable)
    .values(parsed.data)
    .returning({ id: checkoutIntentsTable.id });
  res.status(201).json({ success: true, id: row.id });
});

router.get(
  "/checkout-intents",
  requireAdmin,
  async (_req, res): Promise<void> => {
    const rows = await db
      .select()
      .from(checkoutIntentsTable)
      .orderBy(desc(checkoutIntentsTable.createdAt));
    res.json(rows);
  },
);

/**
 * Public order/request status lookup by reference number.
 * Supported prefixes: EQ-#### and QR-#### (enquiries), CHK-#### (checkout intents).
 */
router.get("/order-status", async (req, res): Promise<void> => {
  const raw = req.query.ref;
  const ref = (Array.isArray(raw) ? raw[0] : raw)?.toString().trim().toUpperCase();
  if (!ref) {
    res.status(400).json({ error: "Reference number is required." });
    return;
  }
  const match = ref.match(/^(EQ|QR|CHK)-?(\d+)$/);
  if (!match) {
    res.status(404).json({
      error: "Invalid reference. Use EQ-XXXX, CHK-XXXX or QR-XXXX.",
    });
    return;
  }
  const prefix = match[1];
  const id = parseInt(match[2], 10);

  if (prefix === "CHK") {
    const [row] = await db
      .select()
      .from(checkoutIntentsTable)
      .where(eq(checkoutIntentsTable.id, id));
    if (!row) {
      res.status(404).json({ error: "Order not found." });
      return;
    }
    res.json({
      ref,
      status: row.status,
      productName: row.productName,
      createdAt: row.createdAt,
    });
    return;
  }

  const [row] = await db
    .select()
    .from(enquiriesTable)
    .where(eq(enquiriesTable.id, id));
  if (!row) {
    res.status(404).json({ error: "Request not found." });
    return;
  }
  res.json({
    ref,
    status: row.status,
    productName: row.productName,
    createdAt: row.createdAt,
  });
});

export default router;
