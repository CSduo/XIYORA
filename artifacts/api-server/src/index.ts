import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const server = app.listen(port, (err?: Error) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }
  logger.info({ port }, "Server listening");
});

// Graceful shutdown — Vercel / containers send SIGTERM before killing the process
function shutdown(signal: string) {
  logger.info({ signal }, "Received shutdown signal, closing server…");
  server.close(() => {
    logger.info("HTTP server closed. Exiting.");
    process.exit(0);
  });
  // Force-exit if close takes > 10s
  setTimeout(() => {
    logger.error("Graceful shutdown timed out. Force-exiting.");
    process.exit(1);
  }, 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

