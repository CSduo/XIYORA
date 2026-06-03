import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, productsTable, insertProductSchema } from "@workspace/db";
import { requireAdmin } from "../lib/adminAuth";

const router: IRouter = Router();

router.get("/products", async (_req, res): Promise<void> => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  const rows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.visible, true))
    .orderBy(asc(productsTable.sortOrder), asc(productsTable.id));
  res.json(rows);
});

router.get("/admin/products", requireAdmin, async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(productsTable)
    .orderBy(asc(productsTable.sortOrder), asc(productsTable.id));
  res.json(rows);
});

router.post("/admin/products", requireAdmin, async (req, res): Promise<void> => {
  const parsed = insertProductSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.message });
    return;
  }
  const [row] = await db
    .insert(productsTable)
    .values({ ...parsed.data, updatedAt: new Date() })
    .returning();
  res.status(201).json({ success: true, product: row });
});

router.put("/admin/products/:slugOrId", requireAdmin, async (req, res): Promise<void> => {
  const { slugOrId } = req.params;
  const updateSchema = insertProductSchema.partial();
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.message });
    return;
  }
  const isId = /^\d+$/.test(slugOrId);
  const condition = isId ? eq(productsTable.id, parseInt(slugOrId)) : eq(productsTable.slug, slugOrId);
  const [row] = await db
    .update(productsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(condition)
    .returning();
  if (!row) {
    res.status(404).json({ success: false, error: "Product not found" });
    return;
  }
  res.json({ success: true, product: row });
});

router.delete("/admin/products/:slugOrId", requireAdmin, async (req, res): Promise<void> => {
  const { slugOrId } = req.params;
  const isId = /^\d+$/.test(slugOrId);
  const condition = isId ? eq(productsTable.id, parseInt(slugOrId)) : eq(productsTable.slug, slugOrId);
  await db.delete(productsTable).where(condition);
  res.json({ success: true });
});

router.post("/admin/products/reorder", requireAdmin, async (req, res): Promise<void> => {
  const body = req.body;
  if (!Array.isArray(body)) {
    res.status(400).json({ success: false, error: "Expected array" });
    return;
  }
  await Promise.all(
    body.map(({ slug, sortOrder }: { slug: string; sortOrder: number }) =>
      db.update(productsTable).set({ sortOrder, updatedAt: new Date() }).where(eq(productsTable.slug, slug))
    )
  );
  res.json({ success: true });
});

export default router;
