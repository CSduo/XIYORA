/**
 * Cloudinary Storage Provider
 *
 * Replaces the Replit Object Storage sidecar with Cloudinary, which works
 * on Vercel, Replit, and any other hosting provider.
 *
 * Required env vars:
 *   CLOUDINARY_CLOUD_NAME  — your Cloudinary cloud name
 *   CLOUDINARY_API_KEY     — Cloudinary API key
 *   CLOUDINARY_API_SECRET  — Cloudinary API secret
 *
 * Free tier: 25 GB storage + 25 GB bandwidth/month (plenty for a small site).
 * Sign up at https://cloudinary.com
 */

export interface UploadResult {
  /** Public CDN URL for the uploaded image */
  url: string;
  /** Cloudinary public_id (can be used to delete/transform) */
  publicId: string;
}

function getCloudinaryConfig() {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  return { cloud, apiKey, apiSecret };
}

export function isCloudinaryConfigured(): boolean {
  const { cloud, apiKey, apiSecret } = getCloudinaryConfig();
  return Boolean(cloud && apiKey && apiSecret);
}

/**
 * Upload a file buffer to Cloudinary.
 * Uses the REST upload API directly (no heavy SDK dependency).
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder: string;
    filename: string;
    mimetype: string;
  }
): Promise<UploadResult> {
  const { cloud, apiKey, apiSecret } = getCloudinaryConfig();

  if (!cloud || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = options.folder;
  // Strip extension from public_id — Cloudinary adds it automatically
  const publicId = `${folder}/${options.filename.replace(/\.[^.]+$/, "")}_${timestamp}`;

  // Build signed upload params
  const paramsToSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}`;
  const signature = await sha1Hex(`${paramsToSign}${apiSecret}`);

  // Build multipart form
  const formData = new FormData();
  formData.append("file", new Blob([buffer as any], { type: options.mimetype }), options.filename);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("folder", folder);
  formData.append("public_id", publicId);
  formData.append("signature", signature);

  const resp = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body: formData,
    signal: AbortSignal.timeout(30_000),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Cloudinary upload failed (${resp.status}): ${err}`);
  }

  const result = await resp.json() as { secure_url: string; public_id: string };
  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

/** SHA-1 hex digest using Web Crypto (available in Node 18+) */
async function sha1Hex(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-1", encoded);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
