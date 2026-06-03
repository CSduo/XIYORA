import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, siteContentTable } from "@workspace/db";
import { requireAdmin } from "../lib/adminAuth";

const router: IRouter = Router();

const DEFAULT_SITE_CONTENT: Record<string, string> = {
  wa: "917028311226",
  email: "xiyatosaanvi@gmail.com",
  ig: "https://www.instagram.com/xiyora.zi/",
  address: "Yogesh Nagar, Section 25, Near 12 No School, Ulhasnagar – 421004, Thane, Maharashtra, India",
  gstNote: "Formal tax documentation can be provided where applicable once GST registration is complete.",
  heroImage: "",
  heroTitle: "Premium Latex Comfort,",
  heroSubtitle: "Sourced for India.",
  heroBody: "Pure Talalay & Dunlop latex, crafted into pillows, mattresses and toppers — and brought to India with considered, document-backed sourcing.",
  promiseImage: "",
  supplierHeroImage: "",
};

const ALLOWED_KEYS = [
  "wa", "email", "ig", "address", "gstNote", "heroImage",
  "heroTitle", "heroSubtitle", "heroBody",
  "promiseImage", "supplierHeroImage",
  "catImg_Mattresses", "catImg_Pillows", "catImg_Toppers",
  "catImg_Cushions", "catImg_LatexMaterial",
];

async function getAllSiteContent(): Promise<Record<string, string>> {
  const rows = await db.select().from(siteContentTable);
  const result: Record<string, string> = { ...DEFAULT_SITE_CONTENT };
  for (const row of rows) {
    result[row.key] = row.value;
  }
  return result;
}

router.get("/site-content", async (_req, res): Promise<void> => {
  const content = await getAllSiteContent();
  res.json(content);
});

router.get("/admin/site-content", requireAdmin, async (_req, res): Promise<void> => {
  const content = await getAllSiteContent();
  res.json(content);
});

router.put("/admin/site-content", requireAdmin, async (req, res): Promise<void> => {
  const updates = req.body as Record<string, string>;
  if (!updates || typeof updates !== "object") {
    res.status(400).json({ success: false, error: "Invalid body" });
    return;
  }
  for (const key of ALLOWED_KEYS) {
    if (key in updates && typeof updates[key] === "string") {
      const existing = await db.select().from(siteContentTable).where(eq(siteContentTable.key, key));
      if (existing.length > 0) {
        await db.update(siteContentTable).set({ value: updates[key], updatedAt: new Date() }).where(eq(siteContentTable.key, key));
      } else {
        await db.insert(siteContentTable).values({ key, value: updates[key] });
      }
    }
  }
  const content = await getAllSiteContent();
  res.json({ success: true, content });
});

export default router;
