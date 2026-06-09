/**
 * Upload route — dual-provider storage
 *
 * PRIMARY:  Cloudinary (works on Vercel + Replit + anywhere)
 *           Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 *
 * FALLBACK: Replit Object Storage sidecar (only works inside Replit containers)
 *           Used automatically when Cloudinary env vars are absent.
 *
 * Endpoints:
 *   POST /api/admin/upload        — upload a file (admin-protected)
 *   GET  /api/uploads/:path+      — serve a file from Replit storage (fallback only)
 */

import { Router, type IRouter, type Request } from "express";
import multer from "multer";
import { requireAdmin } from "../lib/adminAuth";
import { isCloudinaryConfigured, uploadToCloudinary } from "../lib/cloudinaryStorage";
import { objectStorageClient } from "../lib/objectStorage";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed (jpg, jpeg, png, webp, gif)"));
    }
  },
});

const REPLIT_BUCKET_ID =
  process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID ||
  "replit-objstore-f5c6c0fb-05e1-4bf6-b0ca-ae6a268ccc69";

const ALLOWED_CONTEXTS = ["products", "categories", "homepage", "site"] as const;
type UploadContext = typeof ALLOWED_CONTEXTS[number];

function resolveContext(raw: string | undefined): UploadContext {
  return ALLOWED_CONTEXTS.includes(raw as UploadContext) ? (raw as UploadContext) : "products";
}

function getBackendBaseUrl(req: Request): string {
  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  const host = (req.headers["x-forwarded-host"] as string) || (req.headers["host"] as string) || "localhost:8080";
  return `${proto}://${host}`;
}

// ── POST /api/admin/upload ──────────────────────────────────────────────────
router.post("/admin/upload", requireAdmin, upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: "No file provided. Allowed: jpg, jpeg, png, webp, gif." });
      return;
    }

    const context = resolveContext(req.body?.context);
    const slug = (req.body?.slug || "misc").replace(/[^a-z0-9_-]/gi, "-");
    const ext = req.file.originalname.split(".").pop()?.toLowerCase() || "jpg";
    const timestamp = Date.now();
    const filename = `${slug}-${timestamp}.${ext}`;

    // ── Cloudinary path (Vercel + Replit + any host) ────────────────────────
    if (isCloudinaryConfigured()) {
      const folder = context === "homepage" || context === "site"
        ? "xiyora/homepage"
        : `xiyora/${context}/${slug}`;

      const result = await uploadToCloudinary(req.file.buffer, {
        folder,
        filename,
        mimetype: req.file.mimetype,
      });

      logger.info({ publicId: result.publicId, url: result.url }, "Cloudinary upload success");
      res.json({ success: true, url: result.url, publicId: result.publicId, provider: "cloudinary" });
      return;
    }

    // ── Replit Object Storage fallback (Replit-only) ────────────────────────
    logger.warn("Cloudinary not configured — falling back to Replit Object Storage");

    const objectName = context === "homepage" || context === "site"
      ? `homepage/${timestamp}.${ext}`
      : `${context}/${slug}/${timestamp}.${ext}`;

    const bucket = objectStorageClient.bucket(REPLIT_BUCKET_ID);
    const gcsFile = bucket.file(objectName);
    await gcsFile.save(req.file.buffer, {
      contentType: req.file.mimetype,
      metadata: { cacheControl: "public, max-age=31536000" },
    });

    const base = getBackendBaseUrl(req);
    const serveUrl = `${base}/api/uploads/${objectName}`;

    res.json({ success: true, url: serveUrl, objectName, provider: "replit" });
  } catch (err: any) {
    logger.error({ err }, "Upload failed");
    res.status(500).json({ success: false, error: "Upload failed: " + (err?.message || "unknown error") });
  }
});

// ── GET /api/uploads/* — proxy from Replit Object Storage (fallback only) ──
// On Vercel with Cloudinary, images are served directly from Cloudinary CDN
// and this route is never hit. It is retained for backward compatibility with
// any URLs already stored in the database from a Replit deployment.

router.get("/uploads/:bucket/:slug/:filename", async (req, res): Promise<void> => {
  const { bucket, slug, filename } = req.params;
  await serveReplitObject(res, `${bucket}/${slug}/${filename}`);
});

router.get("/uploads/:folder/:filename", async (req, res): Promise<void> => {
  const { folder, filename } = req.params;
  await serveReplitObject(res, `${folder}/${filename}`);
});

async function serveReplitObject(res: any, objectName: string): Promise<void> {
  try {
    const bucket = objectStorageClient.bucket(REPLIT_BUCKET_ID);
    const gcsFile = bucket.file(objectName);
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
