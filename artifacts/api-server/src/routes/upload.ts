import { Router, type IRouter, type Request } from "express";
import multer from "multer";
import { requireAdmin } from "../lib/adminAuth";
import { objectStorageClient } from "../lib/objectStorage";

const router: IRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    cb(null, allowed.includes(file.mimetype));
  },
});

const BUCKET_ID =
  process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID ||
  "replit-objstore-f5c6c0fb-05e1-4bf6-b0ca-ae6a268ccc69";

const getBucket = () => {
  return { bucket: objectStorageClient.bucket(BUCKET_ID), bucketId: BUCKET_ID };
};

function getBackendBaseUrl(req: Request): string {
  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  const host = (req.headers["x-forwarded-host"] as string) || (req.headers["host"] as string) || "localhost:8080";
  return `${proto}://${host}`;
}

router.post("/admin/upload", requireAdmin, upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: "No file provided. Allowed types: jpg, jpeg, png, webp." });
      return;
    }

    const storage = getBucket();

    const ALLOWED_CONTEXTS = ["products", "categories", "homepage", "site"] as const;
    const rawContext = (req.body?.context || "products") as string;
    const context = ALLOWED_CONTEXTS.includes(rawContext as any) ? rawContext : "products";
    const slug = (req.body?.slug || "misc").replace(/[^a-z0-9_-]/gi, "-");
    const ext = req.file.originalname.split(".").pop()?.toLowerCase() || "jpg";
    const timestamp = Date.now();
    const objectName = context === "homepage" || context === "site"
      ? `homepage/${timestamp}.${ext}`
      : `${context}/${slug}/${timestamp}.${ext}`;

    const gcsFile = storage.bucket.file(objectName);
    await gcsFile.save(req.file.buffer, {
      contentType: req.file.mimetype,
      metadata: { cacheControl: "public, max-age=31536000" },
    });

    const base = getBackendBaseUrl(req);
    const serveUrl = `${base}/api/uploads/${objectName}`;

    res.json({ success: true, url: serveUrl, objectName });
  } catch (err: any) {
    req.log?.error({ err }, "Upload failed");
    res.status(500).json({ success: false, error: "Upload failed: " + (err?.message || "unknown error") });
  }
});

router.get("/uploads/:bucket/:slug/:filename", async (req, res): Promise<void> => {
  const { bucket, slug, filename } = req.params;
  await serveGcsObject(res, `${bucket}/${slug}/${filename}`);
});

router.get("/uploads/:folder/:filename", async (req, res): Promise<void> => {
  const { folder, filename } = req.params;
  await serveGcsObject(res, `${folder}/${filename}`);
});

async function serveGcsObject(res: any, objectName: string): Promise<void> {
  try {
    const storage = getBucket();
    if (!storage) { res.status(503).send("Object storage not configured"); return; }

    const gcsFile = storage.bucket.file(objectName);
    const [exists] = await gcsFile.exists();
    if (!exists) { res.status(404).send("Image not found"); return; }

    const [metadata] = await gcsFile.getMetadata();
    res.setHeader("Content-Type", (metadata.contentType as string) || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=31536000");
    if (metadata.size) res.setHeader("Content-Length", String(metadata.size));

    gcsFile.createReadStream()
      .on("error", () => { if (!res.headersSent) res.status(500).send("Stream error"); })
      .pipe(res);
  } catch (err: any) {
    if (!res.headersSent) res.status(500).send("Failed to serve image: " + (err?.message || ""));
  }
}

export default router;
