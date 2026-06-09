import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

const STATIC_ALLOWED_ORIGINS = [
  "https://xiyora-home.pages.dev",
  "https://xiyora--xiyora52.replit.app",
];

const extraOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
  : [];

const allowedOrigins = new Set([...STATIC_ALLOWED_ORIGINS, ...extraOrigins]);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      // Allow localhost and local IP development
      if (/^https?:\/\/localhost(:\d+)?$/.test(origin) || /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
        callback(null, true);
        return;
      }
      // Allow Vercel and Cloudflare Pages preview/production domains
      if (
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".pages.dev") ||
        /\.vercel\.app$/.test(origin) ||
        /\.pages\.dev$/.test(origin)
      ) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS: origin not allowed — ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// 404 handler — must come after all routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: "Not found" });
});

// Global error handler — must have 4 params so Express recognises it as an error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : "Internal server error";
  const status = (err as any)?.status ?? (err as any)?.statusCode ?? 500;
  logger.error({ err }, "Unhandled error");
  if (!res.headersSent) {
    res.status(status).json({ success: false, error: message });
  }
});

export default app;

