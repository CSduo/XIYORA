import { Router, type IRouter } from "express";

const router: IRouter = Router();

const FX_ENDPOINT = "https://open.er-api.com/v6/latest/INR";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

const FALLBACK_RATES: Record<string, number> = {
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0094,
  AED: 0.044,
  SGD: 0.016,
  JPY: 1.78,
};

let cache: { rates: Record<string, number>; ts: number; source: "live" | "fallback" } | null = null;

async function refreshRates(): Promise<typeof cache> {
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) return cache;
  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(FX_ENDPOINT, { signal: ctrl.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { result?: string; rates?: Record<string, number> };
    if (data?.result !== "success" || !data?.rates) throw new Error("bad payload");
    const rates: Record<string, number> = {};
    for (const [k, v] of Object.entries(data.rates)) {
      if (typeof v === "number" && isFinite(v) && v > 0) rates[k] = v;
    }
    cache = { rates, ts: Date.now(), source: "live" };
    return cache;
  } catch {
    if (!cache) {
      cache = { rates: FALLBACK_RATES, ts: Date.now() - CACHE_TTL_MS + 60_000, source: "fallback" };
    }
    return cache;
  }
}

// Warm up on startup
refreshRates().catch(() => {});

router.get("/fx-rates", async (_req, res): Promise<void> => {
  const data = await refreshRates();
  if (!data) {
    res.status(503).json({ error: "FX rates unavailable" });
    return;
  }
  res.json({
    rates: data.rates,
    source: data.source,
    lastUpdated: new Date(data.ts).toISOString(),
  });
});

export default router;
