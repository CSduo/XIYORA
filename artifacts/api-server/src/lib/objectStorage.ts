/**
 * Object Storage — Lazy, safe wrapper for @google-cloud/storage
 *
 * This module is ONLY needed when running on Replit (as a fallback when
 * Cloudinary is not configured). On Vercel, @google-cloud/storage is
 * externalized from the esbuild bundle and will fail to import — so we
 * lazy-load it and return a null client when it's unavailable.
 */

let _storageInstance: any = null;
let _initAttempted = false;
let _initError: string | null = null;

function getStorageClient(): any {
  if (_initAttempted) return _storageInstance;
  _initAttempted = true;

  try {
    // Dynamic import — won't crash the module if @google-cloud/storage
    // is not installed (e.g. on Vercel where it's externalized)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Storage } = require("@google-cloud/storage");
    _storageInstance = new Storage();
  } catch (err: any) {
    _initError = err?.message || "Failed to load @google-cloud/storage";
    _storageInstance = null;
  }

  return _storageInstance;
}

/**
 * Proxy that lazily initializes the storage client on first use.
 * If @google-cloud/storage is unavailable, operations will throw
 * a clear error instead of crashing the process at import time.
 */
export const objectStorageClient = new Proxy({} as any, {
  get(_target, prop) {
    const client = getStorageClient();
    if (!client) {
      // Return a function that throws a descriptive error
      if (prop === "bucket") {
        return () => {
          throw new Error(
            "Replit Object Storage is not available in this environment. " +
            "Configure Cloudinary (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) " +
            "for image uploads on Vercel. " +
            (_initError ? `(${_initError})` : "")
          );
        };
      }
      return undefined;
    }
    return client[prop];
  },
});

export function isObjectStorageAvailable(): boolean {
  return !!getStorageClient();
}
