import { Router, type IRouter } from "express";
import multer from "multer";
import { requireAdmin } from "../lib/adminAuth";
import { objectStorageClient } from "../lib/objectStorage";

const router: IRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/admin/upload", requireAdmin, upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: "No file provided" });
      return;
    }
    const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
    if (!bucketId) {
      res.status(503).json({ success: false, error: "Object storage not configured" });
      return;
    }
    const ALLOWED_CONTEXTS = ["products", "categories", "homepage", "site"] as const;
    const rawContext = (req.body?.context || "products") as string;
    const context = ALLOWED_CONTEXTS.includes(rawContext as any) ? rawContext : "products";
    const slug = (req.body?.slug || "misc").replace(/[^a-z0-9_-]/gi, "-");
    const ext = req.file.originalname.split(".").pop()?.toLowerCase() || "png";
    const timestamp = Date.now();
    const objectName = context === "homepage" || context === "site"
      ? `homepage/${timestamp}.${ext}`
      : `${context}/${slug}/${timestamp}.${ext}`;

    const bucket = objectStorageClient.bucket(bucketId);
    const gcsFile = bucket.file(objectName);
    await gcsFile.save(req.file.buffer, {
      contentType: req.file.mimetype,
      metadata: { cacheControl: "public, max-age=31536000" },
    });
    await gcsFile.makePublic().catch(() => {});
    const publicUrl = `https://storage.googleapis.com/${bucketId}/${objectName}`;

    res.json({ success: true, url: publicUrl, objectName });
  } catch (err: any) {
    req.log?.error({ err }, "Upload failed");
    res.status(500).json({ success: false, error: "Upload failed. " + (err?.message || "") });
  }
});

export default router;
