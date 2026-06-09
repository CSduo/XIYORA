/**
 * Vercel Serverless Entry Point
 *
 * This file re-exports the Express app so Vercel's @vercel/node runtime
 * can wrap it as a serverless function. Do NOT call app.listen() here —
 * Vercel manages the HTTP server lifecycle.
 *
 * All routes mounted at /api in app.ts are served under /api/* by Vercel
 * via the rewrite rule in vercel.json.
 *
 * ⚠️  Image uploads (/api/admin/upload) use the Replit Object Storage sidecar
 *     (GCS proxy at 127.0.0.1:1106). This sidecar is NOT available on Vercel.
 *     Admin image uploads will return an error on Vercel. To enable uploads,
 *     replace objectStorageClient in lib/objectStorage.ts with a Cloudinary
 *     or S3-compatible provider and set the appropriate env vars.
 */
export { default } from "../artifacts/api-server/src/app";
