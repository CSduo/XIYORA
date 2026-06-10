import { Router, type IRouter } from "express";

const router: IRouter = Router();

const NOMINATIM = "https://nominatim.openstreetmap.org/reverse";

const STATE_MAP: Record<string, string> = {
  "maharashtra": "Maharashtra",
  "karnataka": "Karnataka",
  "tamil nadu": "Tamil Nadu",
  "uttar pradesh": "Uttar Pradesh",
  "west bengal": "West Bengal",
  "rajasthan": "Rajasthan",
  "madhya pradesh": "Madhya Pradesh",
  "gujarat": "Gujarat",
  "andhra pradesh": "Andhra Pradesh",
  "telangana": "Telangana",
  "kerala": "Kerala",
  "punjab": "Punjab",
  "haryana": "Haryana",
  "bihar": "Bihar",
  "odisha": "Odisha",
  "jharkhand": "Jharkhand",
  "chhattisgarh": "Chhattisgarh",
  "assam": "Assam",
  "himachal pradesh": "Himachal Pradesh",
  "uttarakhand": "Uttarakhand",
  "goa": "Goa",
  "tripura": "Tripura",
  "manipur": "Manipur",
  "meghalaya": "Meghalaya",
  "nagaland": "Nagaland",
  "arunachal pradesh": "Arunachal Pradesh",
  "mizoram": "Mizoram",
  "sikkim": "Sikkim",
  "delhi": "Delhi (NCT)",
  "national capital territory of delhi": "Delhi (NCT)",
  "chandigarh": "Chandigarh",
  "jammu and kashmir": "Jammu and Kashmir",
  "ladakh": "Ladakh",
  "puducherry": "Puducherry",
  "pondicherry": "Puducherry",
  "andaman and nicobar islands": "Andaman and Nicobar Islands",
  "lakshadweep": "Lakshadweep",
  "dadra and nagar haveli and daman and diu": "Dadra and Nagar Haveli and Daman and Diu",
  "dadra and nagar haveli": "Dadra and Nagar Haveli and Daman and Diu",
  "daman and diu": "Dadra and Nagar Haveli and Daman and Diu",
};

function normalizeState(raw: string): string {
  if (!raw) return "";
  const lower = raw.toLowerCase().trim();
  return STATE_MAP[lower] ?? raw;
}

router.get("/location/reverse", async (req, res): Promise<void> => {
  const lat = parseFloat((req.query.lat as string) ?? "");
  const lng = parseFloat((req.query.lng as string) ?? "");

  if (!isFinite(lat) || !isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    res.status(400).json({ success: false, error: "Invalid coordinates." });
    return;
  }

  try {
    const url = `${NOMINATIM}?format=jsonv2&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`;
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const r = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "XIYORA-Checkout/1.0 contact@xiyora.in" },
    });
    clearTimeout(t);

    if (!r.ok) throw new Error(`Nominatim ${r.status}`);
    const data = (await r.json()) as {
      address?: Record<string, string>;
    };

    const addr = data?.address ?? {};
    const rawState = addr["state"] ?? addr["state_district"] ?? "";
    const state = normalizeState(rawState);
    const city =
      addr["city"] ??
      addr["municipality"] ??
      addr["town"] ??
      addr["city_district"] ??
      addr["village"] ??
      addr["county"] ??
      addr["state_district"] ??
      addr["district"] ??
      "";
    const rawPin = (addr["postcode"] ?? "").trim();
    const validPostal = /^\d{5,6}$/.test(rawPin) || /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i.test(rawPin) || /^[A-Z0-9\s-]{3,10}$/i.test(rawPin);
    const pincode = validPostal ? rawPin : "";
    const area =
      addr["suburb"] ??
      addr["neighbourhood"] ??
      addr["quarter"] ??
      addr["road"] ??
      "";

    res.json({
      success: true,
      state,
      city,
      pincode,
      area,
    });
  } catch {
    res.status(502).json({
      success: false,
      error: "Could not detect location. Please enter your address manually.",
    });
  }
});

export default router;
