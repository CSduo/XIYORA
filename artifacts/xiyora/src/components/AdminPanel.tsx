
const RESOLUTIONS = [
  { w: 1920, h: 1080, label: "1920x1080 (PC / Laptop - Full HD)", type: "desktop" },
  { w: 1366, h: 768, label: "1366x768 (PC / Laptop - HD)", type: "desktop" },
  { w: 1536, h: 864, label: "1536x864 (Windows Laptop)", type: "desktop" },
  { w: 1440, h: 900, label: "1440x900 (Macbook Air/Pro 13)", type: "desktop" },
  { w: 1280, h: 720, label: "1280x720 (Laptop Standard)", type: "desktop" },
  { w: 1600, h: 900, label: "1600x900 (Desktop Medium)", type: "desktop" },
  { w: 1280, h: 800, label: "1280x800 (Small Laptop / WXGA)", type: "desktop" },
  { w: 1024, h: 768, label: "1024x768 (iPad / Legacy PC)", type: "desktop" },
  { w: 2560, h: 1440, label: "2560x1440 (PC - QHD)", type: "desktop" },
  { w: 3840, h: 2160, label: "3840x2160 (PC - 4K UHD)", type: "desktop" },
  { w: 360, h: 800, label: "360x800 (Android - Galaxy S20+)", type: "mobile" },
  { w: 390, h: 844, label: "390x844 (iOS - iPhone 13/14)", type: "mobile" },
  { w: 412, h: 915, label: "412x915 (Android - Google Pixel)", type: "mobile" },
  { w: 393, h: 852, label: "393x852 (iOS - iPhone 14/15 Pro)", type: "mobile" },
  { w: 428, h: 926, label: "428x926 (iOS - iPhone Pro Max)", type: "mobile" },
  { w: 375, h: 812, label: "375x812 (iOS - iPhone X/XS/11 Pro)", type: "mobile" },
  { w: 414, h: 896, label: "414x896 (iOS - iPhone XR/11)", type: "mobile" },
  { w: 360, h: 640, label: "360x640 (Android - Older/Budget)", type: "mobile" },
  { w: 412, h: 892, label: "412x892 (Android - Samsung S21)", type: "mobile" },
  { w: 360, h: 780, label: "360x780 (Android - Samsung S22)", type: "mobile" },
  { w: 360, h: 760, label: "360x760 (Android - Samsung S10)", type: "mobile" },
  { w: 412, h: 846, label: "412x846 (Android - Galaxy Note)", type: "mobile" },
  { w: 384, h: 854, label: "384x854 (Android - Budget)", type: "mobile" },
  { w: 320, h: 568, label: "320x568 (iOS - iPhone SE / Small)", type: "mobile" },
  { w: 768, h: 1024, label: "768x1024 (Tablet - iPad Portrait)", type: "mobile" }
];
import { useState, useEffect, useCallback, useRef } from "react";

const API = (import.meta.env.VITE_API_BASE as string) || "/api";
const TOKEN_KEY = "xiyora_admin_token";

const GOLD = "#C8A97E";
const DARK = "#1E1E1C";
const BG = "#F6F3EB";
const BEIGE = "#E5DFCD";
const RED = "#9E3B2E";

function apiFetch(path: string, opts: RequestInit = {}, token?: string | null): Promise<Response> {
  const headers: Record<string, string> = { "Content-Type": "application/json", ...(opts.headers as Record<string,string> ?? {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(`${API}${path}`, { ...opts, headers });
}

type Product = {
  id: number; slug: string; name: string; category: string;
  latexType?: string; latexContent?: string; tag?: string; badge?: string;
  headline?: string; shortDesc?: string; description?: string;
  highlights?: string[]; specs?: Record<string,string>; sizes?: string[];
  useCases?: string[]; heroImage?: string; gallery?: string[];
  priceINR?: string; priceUSD?: string; priceNote?: string; deliveryNote?: string;
  variants?: any[]; visible: boolean; sortOrder: number;
};

type SiteContent = {
  wa: string; email: string; ig: string; address: string; gstNote: string;
  heroImage: string;
  heroTitle: string; heroSubtitle: string; heroBody: string;
  promiseImage: string; supplierHeroImage: string;
  catImg_Mattresses: string; catImg_Pillows: string; catImg_Toppers: string;
  catImg_Cushions: string; catImg_LatexMaterial: string;
};

const CATEGORIES = ["Pillows", "Mattresses", "Toppers", "Cushions", "Latex Material"];
const EMPTY_PRODUCT: Partial<Product> = {
  slug: "", name: "", category: "Pillows", latexType: "", latexContent: "",
  tag: "", badge: "", headline: "", shortDesc: "", description: "",
  highlights: [], specs: {}, sizes: [], useCases: [],
  heroImage: "", gallery: [], priceINR: "", priceUSD: "", priceNote: "",
  deliveryNote: "", variants: [], visible: true, sortOrder: 0,
};

function Spinner({ size = 18 }: { size?: number }) {
  return (
    <span style={{ display:"inline-block", width:size, height:size, border:`2px solid rgba(200,169,126,.3)`, borderTopColor:GOLD, borderRadius:"50%", animation:"spin .7s linear infinite" }}/>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label style={{ fontSize:11, letterSpacing:"1.5px", textTransform:"uppercase", color:"#888", display:"block", marginBottom:5, fontWeight:500 }}>{children}</label>;
}

function Input({ value, onChange, placeholder, type = "text", style = {} }: { value?: string; onChange: (v: string) => void; placeholder?: string; type?: string; style?: React.CSSProperties }) {
  return <input type={type} value={value ?? ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width:"100%", background:"#fff", border:`1px solid ${BEIGE}`, padding:"9px 12px", fontSize:13, borderRadius:3, fontFamily:"'Inter',sans-serif", color:DARK, marginBottom:12, outline:"none", ...style }} onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = BEIGE} />;
}

function Textarea({ value, onChange, placeholder, rows = 3, style = {} }: { value?: string; onChange: (v: string) => void; placeholder?: string; rows?: number; style?: React.CSSProperties }) {
  return <textarea value={value ?? ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ width:"100%", background:"#fff", border:`1px solid ${BEIGE}`, padding:"9px 12px", fontSize:13, borderRadius:3, fontFamily:"'Inter',sans-serif", color:DARK, marginBottom:12, resize:"vertical", outline:"none", ...style }} onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = BEIGE} />;
}

function Select({ value, onChange, options, style = {} }: { value?: string; onChange: (v: string) => void; options: any[]; style?: React.CSSProperties }) {
  return <select value={value ?? ""} onChange={e => onChange(e.target.value)} style={{ width:"100%", background:"#fff", border:`1px solid ${BEIGE}`, padding:"9px 12px", fontSize:13, borderRadius:3, fontFamily:"'Inter',sans-serif", color:DARK, marginBottom:12, outline:"none", ...style }} onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = BEIGE}>
    {options.map((o: any) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
  </select>;
}

function Btn({ children, onClick, variant = "primary", disabled = false, style = {} }: any) {
  const base: React.CSSProperties = { border:"none", padding:"9px 20px", fontSize:12, fontFamily:"'Inter',sans-serif", letterSpacing:"1.5px", textTransform:"uppercase", cursor:disabled?"not-allowed":"pointer", borderRadius:2, transition:"all .2s", fontWeight:500, display:"flex", alignItems:"center", gap:6, opacity:disabled?.6:1 };
  const styles: Record<string, React.CSSProperties> = {
    primary: { background:GOLD, color:"#fff" },
    secondary: { background:"transparent", border:`1px solid ${GOLD}`, color:GOLD },
    danger: { background:"transparent", border:`1px solid ${RED}`, color:RED },
    ghost: { background:"transparent", color:"#888", padding:"6px 12px" },
  };
  return <button style={{ ...base, ...styles[variant], ...style }} onClick={onClick} disabled={disabled}>{children}</button>;
}

function ImageUploader({ token, slug, context, label, value, onChange }: { token:string; slug:string; context:string; label:string; value:string; onChange:(url:string)=>void }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true); setErr("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("context", context);
    fd.append("slug", slug || "misc");
    try {
      const res = await fetch(`${API}/admin/upload`, { method:"POST", headers:{ Authorization:`Bearer ${token}` }, body:fd });
      const data = await res.json();
      if (data.success) { onChange(data.url); }
      else setErr(data.error || "Upload failed");
    } catch { setErr("Upload failed"); }
    setUploading(false);
  };

  return (
    <div style={{ marginBottom:12 }}>
      <Label>{label}</Label>
      <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
        {value && <img src={value} alt="" style={{ width:80, height:60, objectFit:"cover", borderRadius:3, border:`1px solid ${BEIGE}` }} onError={e => { (e.target as HTMLImageElement).style.display="none"; }} />}
        <Btn variant="secondary" onClick={() => inputRef.current?.click()} disabled={uploading} style={{ fontSize:11, padding:"7px 14px" }}>
          {uploading ? <Spinner size={14}/> : "Upload Image"}
        </Btn>
        {value && <input type="text" value={value} onChange={e => onChange(e.target.value)} style={{ flex:1, minWidth:140, background:"#fff", border:`1px solid ${BEIGE}`, padding:"7px 10px", fontSize:11, borderRadius:3, fontFamily:"'Inter',sans-serif", color:"#666", outline:"none" }} placeholder="Image URL" />}
        {!value && <input type="text" placeholder="or paste URL…" onChange={e => onChange(e.target.value)} style={{ flex:1, minWidth:140, background:"#fff", border:`1px solid ${BEIGE}`, padding:"7px 10px", fontSize:11, borderRadius:3, fontFamily:"'Inter',sans-serif", color:"#666", outline:"none" }} />}
      </div>
      {err && <p style={{ color:RED, fontSize:11, marginTop:4 }}>{err}</p>}
      <input ref={inputRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => { const f = e.target.files?.[0]; if(f) handleFile(f); e.target.value = ""; }} />
    </div>
  );
}

type FileUploadState = { name: string; status: "uploading" | "done" | "error"; url?: string; error?: string };

function GalleryUploader({ token, slug, context, value, onChange }: { token:string; slug:string; context:string; value:string[]; onChange:(urls:string[])=>void }) {
  const [uploads, setUploads] = useState<FileUploadState[]>([]);
  const [dragOver, setDragOver] = useState<number|null>(null);
  const dragSrc = useRef<number|null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploading = uploads.some(u => u.status === "uploading");

  const uploadFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("context", context);
    fd.append("slug", slug || "misc");
    const res = await fetch(`${API}/admin/upload`, { method:"POST", headers:{ Authorization:`Bearer ${token}` }, body:fd });
    const data = await res.json();
    if (data.success && data.url) return data.url as string;
    throw new Error(data.error || "Upload failed");
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArr = Array.from(files);
    if (!fileArr.length) return;

    const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const MAX_SIZE = 10 * 1024 * 1024;

    const newStates: FileUploadState[] = fileArr.map(f => {
      if (!ALLOWED.includes(f.type)) return { name: f.name, status: "error" as const, error: "Not an allowed type (jpg/png/webp)" };
      if (f.size > MAX_SIZE) return { name: f.name, status: "error" as const, error: "File exceeds 10 MB limit" };
      return { name: f.name, status: "uploading" as const };
    });
    setUploads(newStates);

    const validFiles = fileArr.filter((_, i) => newStates[i].status === "uploading");
    const results = await Promise.allSettled(validFiles.map(f => uploadFile(f)));

    let validIdx = 0;
    const finalStates = newStates.map(s => {
      if (s.status !== "uploading") return s;
      const result = results[validIdx++];
      if (result.status === "fulfilled") return { ...s, status: "done" as const, url: result.value };
      return { ...s, status: "error" as const, error: (result.reason as Error)?.message || "Failed" };
    });
    setUploads(finalStates);

    const newUrls = finalStates.filter(s => s.status === "done" && s.url).map(s => s.url!);
    if (newUrls.length) onChange([...(value||[]), ...newUrls]);

    // Clear progress after 4 seconds
    setTimeout(() => setUploads([]), 4000);
  };

  const removeAt = (i: number) => onChange((value||[]).filter((_, idx) => idx !== i));
  const moveImage = (i: number, dir: -1|1) => {
    const arr = [...(value||[])];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    onChange(arr);
  };

  const onDragStart = (i: number) => { dragSrc.current = i; };
  const onDragEnter = (i: number) => { if (dragSrc.current !== null && dragSrc.current !== i) setDragOver(i); };
  const onDragEnd = () => { setDragOver(null); dragSrc.current = null; };
  const onDrop = (i: number) => {
    if (dragSrc.current === null || dragSrc.current === i) { onDragEnd(); return; }
    const arr = [...(value||[])];
    const [item] = arr.splice(dragSrc.current, 1);
    arr.splice(i, 0, item);
    onChange(arr);
    onDragEnd();
  };

  const doneCount = uploads.filter(u => u.status === "done").length;
  const errorCount = uploads.filter(u => u.status === "error").length;
  const uploadingCount = uploads.filter(u => u.status === "uploading").length;

  return (
    <div style={{ marginBottom:12 }}>
      <Label>Gallery Images <span style={{ fontSize:10, color:"#aaa", fontWeight:400 }}>(drag to reorder · select multiple)</span></Label>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:8 }}>
        {(value||[]).map((url,i) => (
          <div
            key={url+i}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragEnter={() => onDragEnter(i)}
            onDragOver={e => e.preventDefault()}
            onDrop={() => onDrop(i)}
            onDragEnd={onDragEnd}
            style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, cursor:"grab", opacity: dragOver===i ? 0.5 : 1, outline: dragOver===i ? `2px dashed ${GOLD}` : "none", borderRadius:3 }}
          >
            <img src={url} alt="" style={{ width:70, height:52, objectFit:"cover", borderRadius:3, border:`1px solid ${BEIGE}`, pointerEvents:"none" }} onError={e => { (e.target as HTMLImageElement).style.display="none"; }} />
            <div style={{ display:"flex", gap:2 }}>
              <button onClick={() => moveImage(i, -1)} disabled={i===0} title="Move left" style={{ background:"none", border:`1px solid ${BEIGE}`, borderRadius:2, cursor:"pointer", color:i===0?"#ddd":GOLD, fontSize:10, padding:"0 4px", lineHeight:"16px" }}>◀</button>
              <button onClick={() => moveImage(i, 1)} disabled={i===(value||[]).length-1} title="Move right" style={{ background:"none", border:`1px solid ${BEIGE}`, borderRadius:2, cursor:"pointer", color:i===(value||[]).length-1?"#ddd":GOLD, fontSize:10, padding:"0 4px", lineHeight:"16px" }}>▶</button>
              <button onClick={() => removeAt(i)} title="Remove" style={{ background:RED, color:"#fff", border:"none", borderRadius:2, width:18, height:18, fontSize:10, cursor:"pointer", lineHeight:"16px" }}>✕</button>
            </div>
          </div>
        ))}
        <Btn variant="secondary" onClick={() => inputRef.current?.click()} disabled={uploading} style={{ fontSize:11, padding:"7px 14px", alignSelf:"center" }}>
          {uploading ? <><Spinner size={14}/> Uploading {uploadingCount}…</> : "+ Add Images"}
        </Btn>
      </div>

      {/* Upload progress */}
      {uploads.length > 0 && (
        <div style={{ background:"#f9f7f3", border:`1px solid ${BEIGE}`, borderRadius:3, padding:"10px 12px", marginBottom:8, fontSize:11 }}>
          {uploadingCount > 0 && <p style={{ color:"#666", marginBottom:4 }}>Uploading {uploadingCount} of {uploads.length} images…</p>}
          {(doneCount > 0 || errorCount > 0) && uploadingCount === 0 && (
            <p style={{ color: errorCount > 0 ? RED : "#2a7a4e", marginBottom:4, fontWeight:500 }}>
              {doneCount > 0 && `✓ ${doneCount} uploaded`}{doneCount > 0 && errorCount > 0 && " · "}{errorCount > 0 && `${errorCount} failed`}
            </p>
          )}
          {uploads.map((u, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2, color: u.status==="error" ? RED : u.status==="done" ? "#2a7a4e" : "#888" }}>
              <span>{u.status==="uploading" ? "⏳" : u.status==="done" ? "✓" : "✕"}</span>
              <span style={{ flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{u.name}</span>
              {u.error && <span style={{ color:RED }}>{u.error}</span>}
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        multiple
        style={{ display:"none" }}
        onChange={e => { const files = e.target.files; if(files?.length) handleFiles(files); e.target.value = ""; }}
      />
    </div>
  );
}

const FALLBACK_IMG = "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80";
const sessionFluctuation = 1.012; // simulated rate

const FX_RATES: Record<string, { rate: number; symbol: string; locale: string }> = {
  USD: { rate: 1 / 83.5, symbol: "$", locale: "en-US" },
  INR: { rate: 1.0, symbol: "₹", locale: "en-IN" },
};

function fmtMoney(cur: string, inrAmount: number): string {
  const f = FX_RATES[cur] || FX_RATES.INR;
  let rate = f.rate;
  if (cur !== "INR") {
    rate = rate * sessionFluctuation;
  }
  const v = Math.round(inrAmount * rate);
  return `${f.symbol}${v.toLocaleString(f.locale)}`;
}

function priceIn(cur: string, inrStr?: string): string {
  if (!inrStr) return "";
  const nums = (String(inrStr).replace(/,/g, "").match(/\d+(?:\.\d+)?/g) || []).map(Number);
  if (!nums.length) return inrStr;
  if (cur === "INR") return inrStr;
  const star = /\*\s*$/.test(inrStr) ? "*" : "";
  const fromPrefix = /^\s*from/i.test(inrStr) ? "From " : "";
  const parts = nums.map(n => fmtMoney(cur, n));
  return fromPrefix + parts.join(" – ") + star;
}

function getFakeDiscountInfo(id: string | number, inrStr?: string, cur: string = "INR") {
  if (!inrStr) return null;
  const lower = String(inrStr).toLowerCase();
  if (lower.includes("contact") || lower.includes("quote") || lower.includes("request") || lower.includes("select")) {
    return null;
  }
  let hash = 0;
  const strId = String(id || "default");
  for (let i = 0; i < strId.length; i++) {
    hash = strId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const discountPct = 12 + Math.abs(hash % 13); // 12% to 24%
  const nums = (String(inrStr).replace(/,/g, "").match(/\d+(?:\.\d+)?/g) || []).map(Number);
  if (!nums.length) return null;
  const star = /\*\s*$/.test(inrStr) ? "*" : "";
  const fromPrefix = /^\s*from/i.test(inrStr) ? "From " : "";
  const origNums = nums.map(n => Math.round((n * (1 + discountPct / 100)) / 100) * 100);
  const origInrStr = fromPrefix + origNums.map(n => `₹${n.toLocaleString("en-IN")}`).join(" – ") + star;
  const originalPriceStr = priceIn(cur, origInrStr);
  const discountedPriceStr = priceIn(cur, inrStr);
  let savedAmtStr: string | null = null;
  if (nums.length === 1) {
    savedAmtStr = priceIn(cur, `₹${origNums[0] - nums[0]}`);
  }
  return { discountPct, originalPriceStr, discountedPriceStr, savedAmtStr };
}

function PCardMock({ p, cur }: { p: Partial<Product>; cur: string }) {
  const [imgErr, setImgErr] = useState(false);
  const heroImg = p.heroImage || p.gallery?.[0] || "";
  const basePrice = cur === "USD" ? p.priceUSD : p.priceINR;
  const discInfo = getFakeDiscountInfo(p.id || "mock", basePrice || "", cur);
  const displayPrice = basePrice || (cur === "USD" ? "$0*" : "₹0*");

  return (
    <div style={{ background: "#fff", border: `1px solid ${BEIGE}`, borderRadius: 4, overflow: "hidden", color: DARK, boxShadow: "0 4px 20px rgba(0,0,0,.15)" }}>
      <div style={{ position: "relative", overflow: "hidden", height: 180, background: "#f6f3eb" }}>
        {heroImg && !imgErr ? (
          <img src={heroImg} alt={p.name} style={{ width: "100%", height: "100%", objectFit: p.category === "Latex Material" ? "contain" : "cover" }} onError={() => setImgErr(true)} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontSize: 11 }}>
            No image uploaded
          </div>
        )}
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", flexDirection: "column", gap: 6, zIndex: 5 }}>
          {p.tag && <span style={{ background: GOLD, color: "#fff", padding: "3px 8px", borderRadius: 2, fontSize: 9, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>{p.tag}</span>}
          {discInfo && <span style={{ background: RED, color: "#fff", padding: "3px 8px", borderRadius: 2, fontSize: 9, fontWeight: 700 }}>{discInfo.discountPct}% OFF</span>}
        </div>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 9, letterSpacing: "1.5px", textTransform: "uppercase", color: GOLD, marginBottom: 4, fontWeight: 500 }}>
          {p.latexType || "Pure"} · {p.category}
        </div>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 500, color: DARK, marginBottom: 6, lineHeight: 1.2, height: 38, overflow: "hidden" }}>
          {p.name || "Product Name"}
        </h3>
        <p style={{ fontSize: 11, color: "#aaa", marginBottom: 12, lineHeight: 1.45, height: 32, overflow: "hidden" }}>
          {p.shortDesc || "Short description will appear here when written."}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: `1px solid ${BEIGE}` }}>
          <div>
            {discInfo ? (
              <div>
                <span style={{ textDecoration: "line-through", fontSize: 10, color: "#999", marginRight: 4 }}>{discInfo.originalPriceStr}</span>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 600, color: GOLD }}>{discInfo.discountedPriceStr}</span>
              </div>
            ) : (
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 600, color: DARK }}>
                {displayPrice}
              </div>
            )}
            <div style={{ fontSize: 8, color: "#ccc", marginTop: 2 }}>Indicative · FOB Port</div>
          </div>
          <button style={{ background: GOLD, border: "none", color: "#fff", padding: "6px 12px", fontSize: 9, letterSpacing: ".5px", textTransform: "uppercase", borderRadius: 2, cursor: "pointer" }}>Inquire</button>
        </div>
      </div>
    </div>
  );
}

function ProductDetailMock({ p, cur }: { p: Partial<Product>; cur: string }) {
  const [activeImg, setActiveImg] = useState(0);
  const [selVar, setSelVar] = useState(-1);
  const [volume, setVolume] = useState(5);
  
  const heroImg = p.heroImage || "";
  const gallery = Array.isArray(p.gallery) ? p.gallery : [];
  const images = heroImg ? [heroImg, ...gallery] : gallery;
  const currentImg = images[activeImg] || "";

  const hasVariants = Array.isArray(p.variants) && p.variants.length > 0;
  const activeVar = hasVariants && selVar >= 0 ? p.variants?.[selVar] : null;

  const displayPrice = activeVar
    ? (cur === "USD" ? activeVar.priceUSD : activeVar.priceINR)
    : hasVariants
      ? "Select size below"
      : (cur === "USD" ? p.priceUSD : p.priceINR);

  const discInfo = getFakeDiscountInfo(activeVar?.sku || p.id || "mock", displayPrice || "", cur);

  // Simple freight logic
  const isPillow = String(p.category).toLowerCase().includes("pillow");
  const mult = isPillow ? 0.85 : 1.25;
  const baseRate = 90; // Shanghai rate
  const inlandRate = 40; // Nhava Sheva inland
  const oceanFreight = volume * baseRate * mult;
  const customs = 250;
  const inland = volume * inlandRate;
  const portHandling = 120;
  const materialValueUSD = hasVariants && activeVar 
    ? (parseFloat(String(activeVar.priceUSD).replace(/[^0-9.]/g, "")) || 300) 
    : (parseFloat(String(p.priceUSD).replace(/[^0-9.]/g, "")) || 3000);
  const igst = materialValueUSD * 0.18;
  const totalLandedUSD = materialValueUSD + oceanFreight + customs + inland + portHandling + igst;

  const formatLanded = (valUsd: number) => {
    if (cur === "INR") {
      return `₹${Math.round(valUsd * 83.5).toLocaleString("en-IN")}`;
    }
    return `$${Math.round(valUsd).toLocaleString("en-US")}`;
  };

  useEffect(() => {
    if (activeImg >= images.length) setActiveImg(0);
  }, [images, activeImg]);

  return (
    <div style={{ background: "#fff", border: `1px solid ${BEIGE}`, borderRadius: 6, padding: "20px", color: DARK, boxShadow: "0 4px 25px rgba(0,0,0,.08)", textAlign: "left" }}>
      <div style={{ fontSize: 10, color: "#888", marginBottom: 12, display: "flex", gap: 4 }}>
        <span>B2B Portal</span> <span>/</span> <span>{p.category}</span> <span>/</span> <span style={{ color: GOLD }}>{p.name || "Product Name"}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 20 }}>
        {/* Images */}
        <div>
          <div style={{ borderRadius: 4, overflow: "hidden", background: "#1E1E1C", height: 180, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
            {currentImg ? (
              <img src={currentImg} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            ) : (
              <span style={{ color: "#666", fontSize: 11 }}>No media uploaded</span>
            )}
          </div>
          {images.length > 1 && (
            <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 4 }}>
              {images.map((img, i) => (
                <button key={img + i} onClick={() => setActiveImg(i)} style={{ width: 34, height: 34, padding: 0, border: `1px solid ${activeImg === i ? GOLD : BEIGE}`, background: "none", cursor: "pointer", flexShrink: 0 }}>
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div style={{ display: "flex", gap: 4, marginBottom: 6, flexWrap: "wrap" }}>
            {p.tag && <span style={{ background: GOLD, color: "#fff", padding: "2px 5px", fontSize: 8, fontWeight: 600, borderRadius: 2 }}>{p.tag}</span>}
            {p.latexType && <span style={{ border: `1px solid ${GOLD}`, color: GOLD, padding: "1px 4px", fontSize: 8, fontWeight: 600, borderRadius: 2 }}>{p.latexType} Latex</span>}
          </div>

          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: DARK, margin: "0 0 4px", fontWeight: 500, lineHeight: 1.2 }}>{p.name || "Listing Name"}</h2>
          <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", color: GOLD, fontSize: 12, margin: "0 0 10px" }}>{p.headline || "Tagline/Headline"}</p>
          <p style={{ fontSize: 11, color: "#666", lineHeight: 1.5, margin: "0 0 12px", maxHeight: 60, overflowY: "auto" }}>{p.shortDesc || "Listing summary text."}</p>

          {p.latexContent && (
            <div style={{ background: "#fbf9f4", padding: "5px 8px", borderRadius: 3, fontSize: 10, color: DARK, borderLeft: `2.5px solid ${GOLD}`, marginBottom: 10 }}>
              Latex Content: <strong>{p.latexContent}</strong>
            </div>
          )}

          <div style={{ padding: 10, border: `1px solid ${BEIGE}`, background: "#FAF8F4", borderRadius: 4, marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
              {discInfo ? (
                <>
                  <span style={{ textDecoration: "line-through", color: "#999", fontSize: 11 }}>{discInfo.originalPriceStr}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: GOLD, fontFamily: "'Playfair Display',serif" }}>{discInfo.discountedPriceStr}</span>
                  <span style={{ background: "rgba(158,59,46,.12)", color: RED, fontSize: 8, fontWeight: 700, padding: "1px 4px", borderRadius: 2 }}>{discInfo.discountPct}% OFF</span>
                </>
              ) : (
                <span style={{ fontSize: 16, fontWeight: 700, color: DARK, fontFamily: "'Playfair Display',serif" }}>{displayPrice}</span>
              )}
            </div>
            {p.priceNote && <div style={{ fontSize: 8, color: GOLD, fontStyle: "italic", marginTop: 2 }}>{p.priceNote}</div>}
          </div>
        </div>
      </div>

      {/* Variants */}
      {hasVariants && (
        <div style={{ marginTop: 12 }}>
          <h4 style={{ fontSize: 9, letterSpacing: "1px", textTransform: "uppercase", color: "#888", margin: "0 0 6px" }}>Select Size (Interactive)</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {(p.variants || []).map((v: any, i: number) => {
              const vPrice = cur === "USD" ? v.priceUSD : v.priceINR;
              const vDisc = getFakeDiscountInfo(v.sku || "v", vPrice || "", cur);
              return (
                <button key={i} onClick={() => setSelVar(i === selVar ? -1 : i)} style={{ textAlign: "left", padding: "6px 10px", borderRadius: 3, border: `1px solid ${selVar === i ? GOLD : BEIGE}`, background: selVar === i ? "#FCFAF2" : "transparent", cursor: "pointer", fontSize: 11, display: "flex", justifyContent: "space-between", alignItems: "center", color: selVar === i ? DARK : "#555" }}>
                  <span>{v.label}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {vDisc ? (
                      <>
                        <span style={{ textDecoration: "line-through", fontSize: 10, color: "#999" }}>{vDisc.originalPriceStr}</span>
                        <span style={{ fontWeight: 600, color: GOLD }}>{vDisc.discountedPriceStr}</span>
                      </>
                    ) : (
                      <span style={{ fontWeight: 600 }}>{vPrice}</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Specs & Highlights */}
      <div style={{ marginTop: 14, borderTop: `1px solid ${BEIGE}`, paddingTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <h4 style={{ fontSize: 9, letterSpacing: "1px", textTransform: "uppercase", color: "#888", margin: "0 0 6px" }}>Specifications</h4>
          {p.specs && Object.keys(p.specs).length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5 }}>
              <tbody>
                {Object.entries(p.specs).map(([k, v]) => (
                  <tr key={k} style={{ borderBottom: `1px solid #FAF8F4` }}>
                    <td style={{ padding: "4px 0", color: "#888", fontWeight: 500 }}>{k}</td>
                    <td style={{ padding: "4px 0", color: DARK }}>{String(v)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <span style={{ fontSize: 10, color: "#aaa" }}>No specs</span>
          )}
        </div>
        <div>
          <h4 style={{ fontSize: 9, letterSpacing: "1px", textTransform: "uppercase", color: "#888", margin: "0 0 6px" }}>Highlights</h4>
          {p.highlights && p.highlights.length > 0 ? (
            p.highlights.map((h, i) => (
              <div key={i} style={{ display: "flex", gap: 5, fontSize: 10.5, color: "#555", marginBottom: 3 }}>
                <span style={{ color: GOLD }}>◈</span>
                <span>{h}</span>
              </div>
            ))
          ) : (
            <span style={{ fontSize: 10, color: "#aaa" }}>No highlights</span>
          )}
        </div>
      </div>

      {/* Freight calculator preview */}
      <div style={{ marginTop: 18, background: "#1E1E1C", border: `1px solid rgba(200,169,126,.2)`, borderRadius: 4, padding: 12, color: "#F2EDE4" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 8, letterSpacing: "1.5px", textTransform: "uppercase", color: GOLD }}>Landed Shipping Simulator</span>
          <span style={{ fontSize: 9, color: "#aaa" }}>Shanghai ➔ Nhava Sheva</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, marginBottom: 8 }}>
          <span>Volume: <strong>{volume} CBM</strong></span>
          <input type="range" min="1" max="40" value={volume} onChange={e => setVolume(parseInt(e.target.value) || 1)} style={{ width: "60%", accentColor: GOLD, height: 4 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #332d29", paddingTop: 8 }}>
          <div>
            <div style={{ fontSize: 8, color: "#8a8378" }}>EST. DDP LANDED COST</div>
            <div style={{ color: GOLD, fontSize: 13, fontWeight: 600 }}>{formatLanded(totalLandedUSD)}</div>
          </div>
          <span style={{ fontSize: 8, border: `1px solid ${GOLD}`, color: GOLD, padding: "1px 4px", borderRadius: 2 }}>Calculator Preview</span>
        </div>
      </div>
    </div>
  );
}

function ProductEditor({ product, token, onSave, onClose }: { product: Partial<Product>|null; token:string; onSave:(p:Product)=>void; onClose:()=>void }) {
  const [form, setForm] = useState<Partial<Product>>(product ? { ...product } : { ...EMPTY_PRODUCT });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [previewTab, setPreviewTab] = useState<"detail" | "card">("detail");
  const [previewCur, setPreviewCur] = useState<"USD" | "INR">("USD");

  const isNew = !product?.id;
  const set = (key: keyof Product) => (val: any) => setForm(f => ({ ...f, [key]: val }));

  const arrToText = (a?: string[]) => (a||[]).join("\n");
  const textToArr = (s: string) => s.split("\n").map(x=>x.trim()).filter(Boolean);

  const save = async () => {
    setSaving(true); setErr(""); setVariantsErr("");
    if (!form.slug || !form.name || !form.category) { setErr("Slug, Name and Category are required."); setSaving(false); return; }
    if (!form.priceINR && !form.priceUSD) { setErr("At least one price (INR or USD) is required."); setSaving(false); return; }
    const parsedVariants = textToVariants(variantsText);
    if (parsedVariants === null) { setVariantsErr("Variants JSON is invalid — fix the JSON syntax before saving."); setSaving(false); return; }
    if (!Array.isArray(parsedVariants)) { setVariantsErr("Variants must be a JSON array [ … ]."); setSaving(false); return; }
    try {
      const url = isNew ? "/admin/products" : `/admin/products/${form.slug}`;
      const method = isNew ? "POST" : "PUT";
      const payload = { ...form, variants: parsedVariants };
      const res = await apiFetch(url, { method, body: JSON.stringify(payload) }, token);
      let data: any = {};
      try { data = await res.json(); } catch {}
      if (res.ok && data.success) {
        onSave(data.product);
      } else {
        setErr(`HTTP ${res.status}: ${data.error || "Save failed — check backend logs."}`);
      }
    } catch { setErr("Network error — backend unreachable."); }
    setSaving(false);
  };

  const specsToText = (s?: Record<string,string>) => Object.entries(s||{}).map(([k,v]) => `${k}: ${v}`).join("\n");
  const textToSpecs = (t: string) => {
    const r: Record<string,string> = {};
    for (const line of t.split("\n")) { const i = line.indexOf(":"); if (i>0) r[line.slice(0,i).trim()] = line.slice(i+1).trim(); }
    return r;
  };
  const variantsToText = (v?: any[]) => JSON.stringify(v||[], null, 2);
  const textToVariants = (t: string) => { try { return JSON.parse(t); } catch { return null; } };
  const [variantsErr, setVariantsErr] = useState("");

  const [specsText, setSpecsText] = useState(specsToText(form.specs));
  const [variantsText, setVariantsText] = useState(variantsToText(form.variants));

  // Live parsed variants for real-time preview
  let liveVariants: any[] = [];
  try {
    liveVariants = JSON.parse(variantsText);
  } catch {
    liveVariants = form.variants || [];
  }
  const previewForm = { ...form, variants: liveVariants };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,.6)", overflowY: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: BG, borderRadius: 8, width: "95vw", maxWidth: 1350, height: "90vh", display: "flex", flexDirection: "column", position: "relative", boxShadow: "0 10px 40px rgba(0,0,0,.35)", border: `1px solid ${GOLD}` }}>
        <style>{`
          @media (min-width: 1025px) {
            .editor-split {
              flex-direction: row !important;
            }
          }
          @media (max-width: 1024px) {
            .editor-split {
              flex-direction: column !important;
              overflow-y: auto !important;
            }
            .editor-split > div {
              overflow-y: visible !important;
              height: auto !important;
              flex: none !important;
              border-right: none !important;
              border-bottom: 1px solid ${BEIGE};
              padding: 16px !important;
            }
          }
        `}</style>

        {/* Header */}
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${BEIGE}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", borderRadius: "8px 8px 0 0" }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: "3px", textTransform: "uppercase", color: GOLD, margin: 0 }}>Sourcing Gateway Admin</p>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: DARK, margin: 0 }}>{isNew ? "New B2B Product Listing" : `Edit B2B Product: ${form.name}`}</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#888" }}>✕</button>
        </div>

        {/* Content Split */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }} className="editor-split">
          
          {/* Left: Scrollable Edit Form */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px", borderRight: `1px solid ${BEIGE}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <div>
                <Label>Slug (URL ID) *</Label>
                <Input value={form.slug} onChange={(v: string) => set("slug")(v.toLowerCase().replace(/\s+/g, "-"))} placeholder="e.g. talalay-bread-pillow" />
              </div>
              <div>
                <Label>Name *</Label>
                <Input value={form.name} onChange={set("name")} />
              </div>
              <div>
                <Label>Category *</Label>
                <Select value={form.category} onChange={set("category")} options={CATEGORIES} />
              </div>
              <div>
                <Label>Latex Type</Label>
                <Input value={form.latexType} onChange={set("latexType")} placeholder="Talalay / Dunlop / Hybrid" />
              </div>
              <div>
                <Label>Latex Content</Label>
                <Input value={form.latexContent} onChange={set("latexContent")} placeholder="93% natural latex" />
              </div>
              <div>
                <Label>Tag (badge top)</Label>
                <Input value={form.tag} onChange={set("tag")} placeholder="Most Popular" />
              </div>
              <div>
                <Label>Badge</Label>
                <Input value={form.badge} onChange={set("badge")} placeholder="2nd-Generation Talalay" />
              </div>
              <div>
                <Label>Price INR</Label>
                <Input value={form.priceINR} onChange={set("priceINR")} placeholder="₹3,200 – ₹4,600*" />
              </div>
              <div>
                <Label>Price USD</Label>
                <Input value={form.priceUSD} onChange={set("priceUSD")} placeholder="$39 – $56*" />
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input type="number" value={String(form.sortOrder ?? 0)} onChange={(v: string) => set("sortOrder")(parseInt(v)||0)} />
              </div>
            </div>

            <Label>Headline</Label>
            <Input value={form.headline} onChange={set("headline")} />
            <Label>Short Description</Label>
            <Textarea value={form.shortDesc} onChange={set("shortDesc")} rows={2} />
            <Label>Full Description</Label>
            <Textarea value={form.description} onChange={set("description")} rows={3} />
            <Label>Price Note</Label>
            <Input value={form.priceNote} onChange={set("priceNote")} />
            <Label>Delivery Note</Label>
            <Input value={form.deliveryNote} onChange={set("deliveryNote")} />

            <Label>Highlights (one per line)</Label>
            <Textarea value={arrToText(form.highlights)} onChange={(v: string) => set("highlights")(textToArr(v))} rows={3} placeholder="Open-cell Talalay structure&#10;Naturally springy latex" />

            <Label>Specs (one per line, format "Key: Value")</Label>
            <Textarea value={specsText} onChange={(v: string) => { setSpecsText(v); set("specs")(textToSpecs(v)); }} rows={4} placeholder="Process: Talalay&#10;Latex Content: 93%" />

            <Label>Sizes (one per line)</Label>
            <Textarea value={arrToText(form.sizes)} onChange={(v: string) => set("sizes")(textToArr(v))} rows={2} />

            <Label>Use Cases (one per line)</Label>
            <Textarea value={arrToText(form.useCases)} onChange={(v: string) => set("useCases")(textToArr(v))} rows={2} />

            <ImageUploader token={token} slug={form.slug||"misc"} context="products" label="Hero Image" value={form.heroImage||""} onChange={set("heroImage")} />
            <GalleryUploader token={token} slug={form.slug||"misc"} context="products" value={form.gallery||[]} onChange={set("gallery")} />

            <Label>Variants (JSON array)</Label>
            <Textarea value={variantsText} onChange={(v: string) => { setVariantsText(v); setVariantsErr(""); }} rows={6} style={{ fontFamily: "monospace", fontSize: 12, borderColor: variantsErr ? RED : undefined }} />
            {variantsErr && <p style={{ color: RED, fontSize: 12, marginTop: -8, marginBottom: 12 }}>{variantsErr}</p>}

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: DARK }}>
                <input type="checkbox" checked={form.visible ?? true} onChange={e => set("visible")(e.target.checked)} style={{ accentColor: GOLD, width: 16, height: 16 }} />
                Visible to customers
              </label>
            </div>
          </div>

          {/* Right: Scrollable Visual Preview Panel */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px", background: "#FAF8F4", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${BEIGE}`, paddingBottom: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 11, letterSpacing: "2.5px", textTransform: "uppercase", color: GOLD, fontWeight: 600 }}>Visual Live Preview</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setPreviewTab("detail")} style={{ background: previewTab === "detail" ? GOLD : "transparent", color: previewTab === "detail" ? "#fff" : "#888", border: `1px solid ${previewTab === "detail" ? GOLD : BEIGE}`, padding: "5px 12px", fontSize: 11, borderRadius: 3, cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 500 }}>Detail Page</button>
                <button onClick={() => setPreviewTab("card")} style={{ background: previewTab === "card" ? GOLD : "transparent", color: previewTab === "card" ? "#fff" : "#888", border: `1px solid ${previewTab === "card" ? GOLD : BEIGE}`, padding: "5px 12px", fontSize: 11, borderRadius: 3, cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 500 }}>Product Card</button>
              </div>
            </div>

            {/* Currency toggle for preview */}
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 10, color: "#888", letterSpacing: "1px", textTransform: "uppercase" }}>Preview Currency:</span>
              <div style={{ display: "flex", background: "#fff", border: `1px solid ${BEIGE}`, borderRadius: 3, overflow: "hidden" }}>
                <button onClick={() => setPreviewCur("USD")} style={{ border: "none", padding: "4px 10px", fontSize: 10, background: previewCur === "USD" ? GOLD : "transparent", color: previewCur === "USD" ? "#fff" : "#888", cursor: "pointer", fontWeight: 600 }}>USD</button>
                <button onClick={() => setPreviewCur("INR")} style={{ border: "none", padding: "4px 10px", fontSize: 10, background: previewCur === "INR" ? GOLD : "transparent", color: previewCur === "INR" ? "#fff" : "#888", cursor: "pointer", fontWeight: 600 }}>INR</button>
              </div>
            </div>

            {/* Render Preview Content */}
            <div style={{ flex: 1 }}>
              {previewTab === "card" ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "40px 0", background: "#1E1E1C", borderRadius: 6, border: "1px solid #332d29" }}>
                  <div style={{ width: 280 }}>
                    <PCardMock p={previewForm} cur={previewCur} />
                  </div>
                </div>
              ) : (
                <ProductDetailMock p={previewForm} cur={previewCur} />
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${BEIGE}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", borderRadius: "0 0 8px 8px" }}>
          <div>
            {err && <span style={{ color: RED, fontSize: 13, fontWeight: 500 }}>{err}</span>}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
            <Btn onClick={save} disabled={saving}>{saving ? <Spinner size={14}/> : "Save Listing"}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsPanel({ token }: { token: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");
  const [editing, setEditing] = useState<Partial<Product>|null|"new">(null);
  const [deleting, setDeleting] = useState<string|null>(null);
  const [msg, setMsg] = useState("");
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setLoadErr("");
    try {
      const res = await apiFetch("/admin/products", {}, token);
      if (!res.ok) { setLoadErr(`Products failed to load. Server returned HTTP ${res.status}. Check backend/database.`); setLoading(false); return; }
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setLoadErr("Products failed to load. Network error — check that the backend is running.");
    }
    setLoading(false);
  }, [token]);

  const seedProducts = async () => {
    if (!confirm("This will insert any missing products into the database. Existing products are NOT changed — your admin edits are preserved. Proceed?")) return;
    setSeeding(true);
    try {
      const res = await apiFetch("/admin/seed", { method:"POST" }, token);
      const data = await res.json();
      if (data.success) { setMsg(`Seeded: ${data.products.inserted} inserted, ${data.products.skipped ?? data.products.updated} already existed (unchanged).`); await load(); }
      else setMsg("Seed failed: " + (data.error || "unknown error"));
    } catch { setMsg("Seed failed: network error"); }
    setSeeding(false);
    setTimeout(() => setMsg(""), 5000);
  };

  useEffect(() => { load(); }, [load]);

  const toggleVisible = async (p: Product) => {
    await apiFetch(`/admin/products/${p.slug}`, { method:"PUT", body:JSON.stringify({ visible:!p.visible }) }, token);
    setProducts(ps => ps.map(x => x.slug===p.slug ? { ...x, visible:!x.visible } : x));
  };

  const deleteProduct = async (slug: string) => {
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return;
    setDeleting(slug);
    await apiFetch(`/admin/products/${slug}`, { method:"DELETE" }, token);
    setProducts(ps => ps.filter(x => x.slug !== slug));
    setDeleting(null);
  };

  const moveSort = async (slug: string, dir: -1|1) => {
    const idx = products.findIndex(p => p.slug===slug);
    if (idx < 0) return;
    const j = idx + dir;
    if (j < 0 || j >= products.length) return;
    const arr = [...products];
    const aOrder = arr[idx].sortOrder;
    const bOrder = arr[j].sortOrder;
    arr[idx] = { ...arr[idx], sortOrder: bOrder };
    arr[j]   = { ...arr[j],   sortOrder: aOrder };
    setProducts([...arr].sort((a,b) => a.sortOrder - b.sortOrder));
    await apiFetch("/admin/products/reorder", { method:"POST", body:JSON.stringify([
      { slug: arr[idx].slug, sortOrder: arr[idx].sortOrder },
      { slug: arr[j].slug,   sortOrder: arr[j].sortOrder },
    ]) }, token);
  };

  const onSave = (p: Product) => {
    setProducts(ps => {
      const exists = ps.find(x => x.slug===p.slug);
      return exists ? ps.map(x => x.slug===p.slug ? p : x) : [...ps, p];
    });
    setEditing(null);
    setMsg("Saved ✓");
    setTimeout(() => setMsg(""), 3000);
  };

  const CATS = ["All", ...CATEGORIES];
  const [catFilter, setCatFilter] = useState("All");
  const visible = catFilter==="All" ? products : products.filter(p=>p.category===catFilter);

  return (
    <div>
      {(editing !== null) && (
        <ProductEditor product={editing==="new"?null:editing as Product} token={token} onSave={onSave} onClose={() => setEditing(null)} />
      )}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:12 }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:DARK }}>Products</h2>
        <div style={{ display:"flex", gap:8 }}>
          <Btn variant="secondary" onClick={seedProducts} disabled={seeding} style={{ fontSize:11 }}>{seeding ? <Spinner size={12}/> : "Seed Products"}</Btn>
          <Btn onClick={() => setEditing("new")}>+ New Product</Btn>
        </div>
      </div>
      {msg && <p style={{ color: msg.startsWith("Seed failed") ? RED : "green", fontSize:13, marginBottom:12 }}>{msg}</p>}
      {loadErr && (
        <div style={{ background:"#fff3f3", border:`1px solid ${RED}`, borderRadius:4, padding:"14px 18px", marginBottom:16 }}>
          <p style={{ color:RED, fontSize:13, margin:0 }}>{loadErr}</p>
          <button onClick={load} style={{ marginTop:8, color:GOLD, background:"none", border:"none", cursor:"pointer", fontSize:12, padding:0, fontFamily:"'Inter',sans-serif" }}>Retry</button>
        </div>
      )}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setCatFilter(c)} style={{ background:catFilter===c?GOLD:"transparent", color:catFilter===c?"#fff":"#888", border:`1px solid ${catFilter===c?GOLD:BEIGE}`, padding:"5px 14px", fontSize:12, borderRadius:20, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>{c}</button>
        ))}
      </div>
      {loading ? <div style={{ textAlign:"center", padding:40 }}><Spinner/></div> : loadErr ? null : products.length === 0 ? (
        <div style={{ textAlign:"center", padding:40, background:"#FAF8F4", borderRadius:6 }}>
          <p style={{ color:"#888", fontSize:14, marginBottom:16 }}>No products found in database.</p>
          <Btn onClick={seedProducts} disabled={seeding}>{seeding ? <Spinner size={14}/> : "Seed All 37 Products Now"}</Btn>
        </div>
      ) : (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12.5 }}>
            <thead>
              <tr style={{ borderBottom:`2px solid ${BEIGE}` }}>
                {["Order","","Name","Category","Tag","Price INR","Visible","Actions"].map(h => (
                  <th key={h} style={{ padding:"10px 10px", textAlign:"left", color:"#888", fontWeight:500, fontSize:10.5, letterSpacing:"1px", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((p, i) => (
                <tr key={p.slug} style={{ borderBottom:`1px solid ${BEIGE}`, background:i%2===0?"transparent":"#FAF8F4" }}>
                  <td style={{ padding:"10px 10px", color:"#aaa", width:60 }}>
                    <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                      <button onClick={() => moveSort(p.slug, -1)} disabled={i===0} style={{ background:"none", border:"none", cursor:"pointer", color:i===0?"#ddd":GOLD, fontSize:12, padding:0 }}>▲</button>
                      <button onClick={() => moveSort(p.slug, 1)} disabled={i===visible.length-1} style={{ background:"none", border:"none", cursor:"pointer", color:i===visible.length-1?"#ddd":GOLD, fontSize:12, padding:0 }}>▼</button>
                    </div>
                  </td>
                  <td style={{ padding:"10px 8px" }}>
                    {p.heroImage && <img src={p.heroImage} alt="" style={{ width:44, height:36, objectFit:"cover", borderRadius:3 }} onError={e => { (e.target as HTMLImageElement).style.display="none"; }} />}
                  </td>
                  <td style={{ padding:"10px 10px", color:DARK, fontWeight:500 }}>
                    <div>{p.name}</div>
                    <div style={{ fontSize:11, color:"#aaa" }}>{p.slug}</div>
                  </td>
                  <td style={{ padding:"10px 10px", color:"#666" }}>{p.category}</td>
                  <td style={{ padding:"10px 10px" }}>
                    {p.tag && <span style={{ background:GOLD, color:"#fff", padding:"2px 8px", borderRadius:20, fontSize:10, letterSpacing:"1px", textTransform:"uppercase" }}>{p.tag}</span>}
                  </td>
                  <td style={{ padding:"10px 10px", color:"#666", whiteSpace:"nowrap" }}>{p.priceINR||"—"}</td>
                  <td style={{ padding:"10px 10px" }}>
                    <button onClick={() => toggleVisible(p)} style={{ background:p.visible?"#e8f5e9":"#fce4ec", color:p.visible?"#388e3c":"#c62828", border:"none", borderRadius:20, padding:"3px 10px", fontSize:11, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontWeight:500 }}>
                      {p.visible ? "Visible" : "Hidden"}
                    </button>
                  </td>
                  <td style={{ padding:"10px 10px" }}>
                    <div style={{ display:"flex", gap:6 }}>
                      <Btn variant="ghost" onClick={() => setEditing(p)} style={{ fontSize:11, padding:"4px 10px" }}>Edit</Btn>
                      <Btn variant="danger" onClick={() => deleteProduct(p.slug)} disabled={deleting===p.slug} style={{ fontSize:11, padding:"4px 10px" }}>
                        {deleting===p.slug ? <Spinner size={12}/> : "Delete"}
                      </Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AccordionItem({ title, active, onClick, children }: { title: string; active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <div style={{ borderBottom: "1px solid " + BEIGE, marginBottom: 8, borderRadius: 3, overflow: "hidden" }}>
      <button
        onClick={onClick}
        type="button"
        style={{
          width: "100%",
          padding: "12px 16px",
          background: active ? GOLD : "#FAF8F4",
          color: active ? "#fff" : DARK,
          border: "none",
          textAlign: "left",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <span>{title}</span>
        <span>{active ? "▲" : "▼"}</span>
      </button>
      {active && (
        <div style={{ padding: "16px 16px 8px 16px", background: "#fff" }}>
          {children}
        </div>
      )}
    </div>
  );
}

function StringListEditor({ value, onChange, label, placeholder = "Add item..." }: { value: string; onChange: (v: string) => void; label: string; placeholder?: string }) {
  let list = [];
  try { list = JSON.parse(value || "[]"); } catch {}
  if (!Array.isArray(list)) list = [];

  const update = (newList: any[]) => {
    onChange(JSON.stringify(newList));
  };

  return (
    <div style={{ marginBottom: 16, border: "1px solid " + BEIGE, padding: 12, borderRadius: 4 }}>
      <Label>{label}</Label>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
        {list.map((item: any, idx: number) => (
          <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="text"
              value={item}
              onChange={e => {
                const next = [...list];
                next[idx] = e.target.value;
                update(next);
              }}
              placeholder={placeholder}
              style={{ flex: 1, padding: "6px 10px", fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }}
            />
            <button type="button" onClick={() => {
              if (idx === 0) return;
              const next = [...list];
              [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
              update(next);
            }} disabled={idx === 0} style={{ border: "none", background: "none", cursor: "pointer", color: idx === 0 ? "#ddd" : GOLD }}>▲</button>
            <button type="button" onClick={() => {
              if (idx === list.length - 1) return;
              const next = [...list];
              [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
              update(next);
            }} disabled={idx === list.length - 1} style={{ border: "none", background: "none", cursor: "pointer", color: idx === list.length - 1 ? "#ddd" : GOLD }}>▼</button>
            <button type="button" onClick={() => update(list.filter((_: any, i: number) => i !== idx))} style={{ border: "none", background: "none", cursor: "pointer", color: RED }}>✕</button>
          </div>
        ))}
        <button type="button" onClick={() => update([...list, ""])} style={{ border: "1px dashed " + GOLD, color: GOLD, background: "none", padding: "6px", borderRadius: 3, cursor: "pointer", fontSize: 12, display: "flex", justifyContent: "center", alignItems: "center", gap: 4 }}>
          + Add Item
        </button>
      </div>
    </div>
  );
}

function PairListEditor({ value, onChange, label, keyPlaceholder = "Title", valPlaceholder = "Description", hasIcon = false }: { value: string; onChange: (v: string) => void; label: string; keyPlaceholder?: string; valPlaceholder?: string; hasIcon?: boolean }) {
  let list = [];
  try { list = JSON.parse(value || "[]"); } catch {}
  if (!Array.isArray(list)) list = [];

  const update = (newList: any[]) => {
    onChange(JSON.stringify(newList));
  };

  const handleAdd = () => {
    if (hasIcon) {
      update([...list, ["", "", ""]]);
    } else {
      update([...list, ["", ""]]);
    }
  };

  return (
    <div style={{ marginBottom: 16, border: "1px solid " + BEIGE, padding: 12, borderRadius: 4 }}>
      <Label>{label}</Label>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
        {list.map((item: any, idx: number) => (
          <div key={idx} style={{ borderBottom: idx < list.length - 1 ? "1px dashed " + BEIGE : "none", paddingBottom: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#888", fontWeight: 600 }}>#{idx + 1}</span>
              <div style={{ flex: 1, display: "flex", gap: 8, flexDirection: "column" }}>
                {hasIcon ? (
                  <>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        type="text"
                        value={item[0] || ""}
                        onChange={e => {
                          const next = [...list];
                          next[idx] = [e.target.value, item[1], item[2]];
                          update(next);
                        }}
                        placeholder="Icon (e.g. ✓)"
                        style={{ width: "80px", padding: "6px 10px", fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }}
                      />
                      <input
                        type="text"
                        value={item[1] || ""}
                        onChange={e => {
                          const next = [...list];
                          next[idx] = [item[0], e.target.value, item[2]];
                          update(next);
                        }}
                        placeholder="Title"
                        style={{ flex: 1, padding: "6px 10px", fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }}
                      />
                    </div>
                    <textarea
                      value={item[2] || ""}
                      onChange={e => {
                        const next = [...list];
                        next[idx] = [item[0], item[1], e.target.value];
                        update(next);
                      }}
                      placeholder="Description"
                      rows={2}
                      style={{ padding: "6px 10px", fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3, width: "100%", fontFamily: "sans-serif" }}
                    />
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      value={item[0] || ""}
                      onChange={e => {
                        const next = [...list];
                        next[idx] = [e.target.value, item[1]];
                        update(next);
                      }}
                      placeholder={keyPlaceholder}
                      style={{ padding: "6px 10px", fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }}
                    />
                    <textarea
                      value={item[1] || ""}
                      onChange={e => {
                        const next = [...list];
                        next[idx] = [item[0], e.target.value];
                        update(next);
                      }}
                      placeholder={valPlaceholder}
                      rows={2}
                      style={{ padding: "6px 10px", fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3, width: "100%", fontFamily: "sans-serif" }}
                    />
                  </>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <button type="button" onClick={() => {
                  if (idx === 0) return;
                  const next = [...list];
                  [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
                  update(next);
                }} disabled={idx === 0} style={{ border: "none", background: "none", cursor: "pointer", color: idx === 0 ? "#ddd" : GOLD, fontSize: 11 }}>▲</button>
                <button type="button" onClick={() => {
                  if (idx === list.length - 1) return;
                  const next = [...list];
                  [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                  update(next);
                }} disabled={idx === list.length - 1} style={{ border: "none", background: "none", cursor: "pointer", color: idx === list.length - 1 ? "#ddd" : GOLD, fontSize: 11 }}>▼</button>
                <button type="button" onClick={() => update(list.filter((_: any, i: number) => i !== idx))} style={{ border: "none", background: "none", cursor: "pointer", color: RED, fontSize: 11 }}>✕</button>
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={handleAdd} style={{ border: "1px dashed " + GOLD, color: GOLD, background: "none", padding: "6px", borderRadius: 3, cursor: "pointer", fontSize: 12, display: "flex", justifyContent: "center", alignItems: "center", gap: 4 }}>
          + Add Item
        </button>
      </div>
    </div>
  );
}

function SiteContentPanel({
  token,
  BIZ,
  HomeView,
  AboutView,
  SupplierView,
  ReviewsView,
  SimplePage,
  B2BInquiryForm,
  forceRefresh,
  products,
  currency,
}: any) {
  const [draft, setDraft] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [activeAccordion, setActiveAccordion] = useState("header");
  const [previewTab, setPreviewTab] = useState("home");
  const [selectedRes, setSelectedRes] = useState(RESOLUTIONS[0]);
  const [containerWidth, setContainerWidth] = useState(500);
  const [containerHeight, setContainerHeight] = useState(600);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width || 500);
        setContainerHeight(entry.contentRect.height || 600);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const scale = Math.min((containerWidth - 32) / selectedRes.w, 1);

  const backupRef = useRef<any>(null);

  useEffect(() => {
    apiFetch("/admin/site-content", {}, token)
      .then(r => r.json())
      .then(data => {
        const loaded = { ...BIZ, ...data };
        setDraft(loaded);
        Object.assign(BIZ, loaded);
        backupRef.current = { ...loaded };
        setLoading(false);
        forceRefresh();
      })
      .catch(() => {
        setDraft({ ...BIZ });
        backupRef.current = { ...BIZ };
        setLoading(false);
      });

    return () => {
      if (backupRef.current) {
        Object.assign(BIZ, backupRef.current);
        forceRefresh();
      }
    };
  }, [token]);

  const setKey = (key: string, value: any) => {
    const stringVal = typeof value === "string" ? value : JSON.stringify(value);
    setDraft((prev: any) => {
      const next = { ...prev, [key]: stringVal };
      BIZ[key] = stringVal;
      return next;
    });
    forceRefresh();
  };

  const handleCancel = () => {
    if (backupRef.current) {
      Object.assign(BIZ, backupRef.current);
      setDraft({ ...backupRef.current });
      setMsg("Reverted changes ✓");
      setTimeout(() => setMsg(""), 3000);
      forceRefresh();
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setErr("");
    try {
      const res = await apiFetch("/admin/site-content", {
        method: "PUT",
        body: JSON.stringify(draft)
      }, token);
      const data = await res.json();
      if (data.success) {
        backupRef.current = { ...draft };
        setMsg("Saved successfully ✓");
        setTimeout(() => setMsg(""), 3000);
      } else {
        setErr(data.error || "Save failed");
      }
    } catch {
      setErr("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 40 }}><Spinner /></div>;

  return (
    <div style={{ display: "flex", gap: 24, height: "calc(100vh - 120px)", minHeight: 600 }}>
      {/* LEFT: Accordion Editor Pane */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff", border: "1px solid " + BEIGE, borderRadius: 4, overflow: "hidden" }}>
        {/* Editor Top Bar */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid " + BEIGE, display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FAF8F4" }}>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: DARK, margin: 0 }}>Sourcing CMS Editor</h3>
            <span style={{ fontSize: 11, color: "#999" }}>Mutates preview state in real-time</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="secondary" onClick={handleCancel} style={{ fontSize: 11, padding: "6px 12px" }}>Cancel</Btn>
            <Btn onClick={handleSave} disabled={saving} style={{ fontSize: 11, padding: "6px 12px" }}>
              {saving ? <Spinner size={12} /> : "Save Changes"}
            </Btn>
          </div>
        </div>

        {/* Scrollable Accordions */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {err && <div style={{ color: RED, background: "#fff3f3", border: "1px solid " + RED, padding: 10, borderRadius: 3, marginBottom: 16, fontSize: 13 }}>{err}</div>}
          {msg && <div style={{ color: "green", background: "#f0fdf4", border: "1px solid green", padding: 10, borderRadius: 3, marginBottom: 16, fontSize: 13 }}>{msg}</div>}

          {/* 1. Header & Marquees */}
          <AccordionItem
            title="1. Header & Marquees"
            active={activeAccordion === "header"}
            onClick={() => setActiveAccordion("header")}
          >
            <Label>WhatsApp Sourcing Hot-Line</Label>
            <Input value={draft.wa} onChange={(v) => setKey("wa", v)} placeholder="e.g. 917028311226" />
            
            <Label>Contact Email Address</Label>
            <Input value={draft.email} onChange={(v) => setKey("email", v)} placeholder="e.g. info@xiyora.com" />
            
            <Label>Instagram Handle/URL</Label>
            <Input value={draft.ig} onChange={(v) => setKey("ig", v)} placeholder="e.g. https://instagram.com/xiyora.zi" />
            
            <Label>Business Address (Ulhasnagar, Thane)</Label>
            <Textarea value={draft.address} onChange={(v) => setKey("address", v)} rows={2} />
            
            <Label>GST Compliance Note</Label>
            <Textarea value={draft.gstNote} onChange={(v) => setKey("gstNote", v)} rows={2} />
            
            <Label>Navbar brand tagline</Label>
            <Input value={draft.navBrandTagline} onChange={(v) => setKey("navBrandTagline", v)} />

            <StringListEditor value={draft.marqueeItemsTop} onChange={(v) => setKey("marqueeItemsTop", v)} label="Top Marquee Items Ticker" />
            <StringListEditor value={draft.marqueeItemsBottom} onChange={(v) => setKey("marqueeItemsBottom", v)} label="Bottom Marquee Items Ticker" />
          </AccordionItem>

          {/* 2. Hero & Promise */}
          <AccordionItem
            title="2. Homepage Hero & Promise"
            active={activeAccordion === "hero"}
            onClick={() => setActiveAccordion("hero")}
          >
            <Label>Hero Main Heading (first line)</Label>
            <Input value={draft.heroTitle} onChange={(v) => setKey("heroTitle", v)} />
            
            <Label>Hero Sub-heading (gold italicized)</Label>
            <Input value={draft.heroSubtitle} onChange={(v) => setKey("heroSubtitle", v)} />
            
            <Label>Hero Body Text</Label>
            <Textarea value={draft.heroBody} onChange={(v) => setKey("heroBody", v)} rows={3} />
            
            <ImageUploader token={token} slug="home-hero" context="site" label="Hero Background Image" value={draft.heroImage} onChange={(v) => setKey("heroImage", v)} />
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <Label>Hero Seal Character</Label>
                <Input value={draft.heroSealChar} onChange={(v) => setKey("heroSealChar", v)} style={{ width: 80 }} />
              </div>
              <div>
                <Label>Hero Partner Line</Label>
                <Input value={draft.heroPartnerLine} onChange={(v) => setKey("heroPartnerLine", v)} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <Label>CTA Primary Text</Label>
                <Input value={draft.heroCTAPrimary} onChange={(v) => setKey("heroCTAPrimary", v)} />
              </div>
              <div>
                <Label>CTA Secondary Text</Label>
                <Input value={draft.heroCTASecondary} onChange={(v) => setKey("heroCTASecondary", v)} />
              </div>
            </div>

            {(() => {
              let list = [];
              try { list = JSON.parse(draft.heroFeatures || "[]"); } catch {}
              return (
                <div style={{ marginBottom: 16, border: "1px solid " + BEIGE, padding: 12, borderRadius: 4 }}>
                  <Label>Hero Sourcing Trust Features</Label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                    {list.map((item: any, idx: number) => (
                      <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input type="text" value={item.name || ""} onChange={e => {
                          const next = [...list];
                          next[idx] = { ...item, name: e.target.value };
                          setKey("heroFeatures", next);
                        }} placeholder="Icon" style={{ width: 80, padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                        <input type="text" value={item.label || ""} onChange={e => {
                          const next = [...list];
                          next[idx] = { ...item, label: e.target.value };
                          setKey("heroFeatures", next);
                        }} placeholder="Feature Label" style={{ flex: 1, padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                        <button type="button" onClick={() => {
                          const next = list.filter((_: any, i: number) => i !== idx);
                          setKey("heroFeatures", next);
                        }} style={{ border: "none", background: "none", cursor: "pointer", color: RED }}>✕</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setKey("heroFeatures", [...list, { name: "", label: "" }])} style={{ border: "1px dashed " + GOLD, color: GOLD, background: "none", padding: "6px", borderRadius: 3, cursor: "pointer", fontSize: 12 }}>+ Add Feature</button>
                  </div>
                </div>
              );
            })()}

            <Label>Promise Heading (White title)</Label>
            <Input value={draft.promiseHeading} onChange={(v) => setKey("promiseHeading", v)} />
            
            <Label>Promise Body Description</Label>
            <Textarea value={draft.promiseBody} onChange={(v) => setKey("promiseBody", v)} rows={2} />

            <Label>Starting Price (Why Choose Section)</Label>
            <Input value={draft.startingPrice} onChange={(v) => setKey("startingPrice", v)} style={{ width: 120 }} />

            <ImageUploader token={token} slug="home-promise" context="site" label="Why Choose Promise Image" value={draft.promiseImage} onChange={(v) => setKey("promiseImage", v)} />
            <StringListEditor value={draft.trustTickerItems} onChange={(v) => setKey("trustTickerItems", v)} label="Trust Ticker Items" />
          </AccordionItem>

          {/* 3. About Page */}
          <AccordionItem
            title="3. About Page CMS"
            active={activeAccordion === "about"}
            onClick={() => setActiveAccordion("about")}
          >
            <Label>About Page Hero Label</Label>
            <Input value={draft.aboutHeroLabel} onChange={(v) => setKey("aboutHeroLabel", v)} />
            
            <Label>About Page Hero Main Heading</Label>
            <Input value={draft.aboutHeroHeading} onChange={(v) => setKey("aboutHeroHeading", v)} />
            
            <Label>About Page Hero Description</Label>
            <Textarea value={draft.aboutHeroBody} onChange={(v) => setKey("aboutHeroBody", v)} rows={3} />

            <StringListEditor value={draft.aboutTrustBar} onChange={(v) => setKey("aboutTrustBar", v)} label="About Page Trust Ticker" />

            <Label>Statement Section Sub-label</Label>
            <Input value={draft.aboutStatementLabel} onChange={(v) => setKey("aboutStatementLabel", v)} />

            <Label>Statement Section Heading</Label>
            <Input value={draft.aboutStatementHeading} onChange={(v) => setKey("aboutStatementHeading", v)} />

            <StringListEditor value={draft.aboutStatementBody} onChange={(v) => setKey("aboutStatementBody", v)} label="Statement Main Paragraphs" placeholder="Statement paragraph..." />

            <Label>Natural Latex Section Label</Label>
            <Input value={draft.aboutNaturalLabel} onChange={(v) => setKey("aboutNaturalLabel", v)} />

            <Label>Natural Latex Section Heading</Label>
            <Input value={draft.aboutNaturalHeading} onChange={(v) => setKey("aboutNaturalHeading", v)} />

            <StringListEditor value={draft.aboutNaturalBody} onChange={(v) => setKey("aboutNaturalBody", v)} label="Natural Latex Story Paragraphs" />

            <Label>Partnership Section Label</Label>
            <Input value={draft.aboutPartnerLabel} onChange={(v) => setKey("aboutPartnerLabel", v)} />

            <Label>Partnership Section Heading</Label>
            <Input value={draft.aboutPartnerHeading} onChange={(v) => setKey("aboutPartnerHeading", v)} />

            <Label>Partnership Section Subtitle</Label>
            <Input value={draft.aboutPartnerSub} onChange={(v) => setKey("aboutPartnerSub", v)} />

            <Label>Partnership Section Description</Label>
            <Textarea value={draft.aboutPartnerBody} onChange={(v) => setKey("aboutPartnerBody", v)} rows={3} />

            {(() => {
              let list = [];
              try { list = JSON.parse(draft.aboutPartnerStats || "[]"); } catch {}
              return (
                <div style={{ marginBottom: 16, border: "1px solid " + BEIGE, padding: 12, borderRadius: 4 }}>
                  <Label>About Partner Statistics</Label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                    {list.map((item: any, idx: number) => (
                      <div key={idx} style={{ borderBottom: idx < list.length - 1 ? "1px dashed " + BEIGE : "none", paddingBottom: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <input type="text" value={item.num || ""} onChange={e => {
                            const next = [...list];
                            next[idx] = { ...item, num: e.target.value };
                            setKey("aboutPartnerStats", next);
                          }} placeholder="Number (e.g. LGA+)" style={{ width: 100, padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                          <input type="text" value={item.label || ""} onChange={e => {
                            const next = [...list];
                            next[idx] = { ...item, label: e.target.value };
                            setKey("aboutPartnerStats", next);
                          }} placeholder="Label (e.g. Quality)" style={{ flex: 1, padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                        </div>
                        <textarea value={item.desc || ""} onChange={e => {
                          const next = [...list];
                          next[idx] = { ...item, desc: e.target.value };
                          setKey("aboutPartnerStats", next);
                        }} placeholder="Stat Description" rows={2} style={{ width: "100%", padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3, fontFamily: "sans-serif" }} />
                        <button type="button" onClick={() => {
                          const next = list.filter((_: any, i: number) => i !== idx);
                          setKey("aboutPartnerStats", next);
                        }} style={{ border: "none", background: "none", cursor: "pointer", color: RED, alignSelf: "flex-end" }}>✕ Remove Stat</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setKey("aboutPartnerStats", [...list, { num: "", label: "", desc: "" }])} style={{ border: "1px dashed " + GOLD, color: GOLD, background: "none", padding: "6px", borderRadius: 3, cursor: "pointer", fontSize: 12 }}>+ Add Stat</button>
                  </div>
                </div>
              );
            })()}

            {(() => {
              let list = [];
              try { list = JSON.parse(draft.aboutCommitmentPillars || "[]"); } catch {}
              return (
                <div style={{ marginBottom: 16, border: "1px solid " + BEIGE, padding: 12, borderRadius: 4 }}>
                  <Label>About Commitment Pillars</Label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                    {list.map((item: any, idx: number) => (
                      <div key={idx} style={{ borderBottom: idx < list.length - 1 ? "1px dashed " + BEIGE : "none", paddingBottom: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <input type="text" value={item.icon || ""} onChange={e => {
                            const next = [...list];
                            next[idx] = { ...item, icon: e.target.value };
                            setKey("aboutCommitmentPillars", next);
                          }} placeholder="Icon" style={{ width: 60, padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                          <input type="text" value={item.title || ""} onChange={e => {
                            const next = [...list];
                            next[idx] = { ...item, title: e.target.value };
                            setKey("aboutCommitmentPillars", next);
                          }} placeholder="Title" style={{ flex: 1, padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                        </div>
                        <textarea value={item.body || ""} onChange={e => {
                          const next = [...list];
                          next[idx] = { ...item, body: e.target.value };
                          setKey("aboutCommitmentPillars", next);
                        }} placeholder="Pillar Description" rows={2} style={{ width: "100%", padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3, fontFamily: "sans-serif" }} />
                        <button type="button" onClick={() => {
                          const next = list.filter((_: any, i: number) => i !== idx);
                          setKey("aboutCommitmentPillars", next);
                        }} style={{ border: "none", background: "none", cursor: "pointer", color: RED, alignSelf: "flex-end" }}>✕ Remove Pillar</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setKey("aboutCommitmentPillars", [...list, { icon: "", title: "", body: "" }])} style={{ border: "1px dashed " + GOLD, color: GOLD, background: "none", padding: "6px", borderRadius: 3, cursor: "pointer", fontSize: 12 }}>+ Add Pillar</button>
                  </div>
                </div>
              );
            })()}

            <Label>About CTA Heading</Label>
            <Input value={draft.aboutCTAHeading} onChange={(v) => setKey("aboutCTAHeading", v)} />

            <Label>About CTA Description</Label>
            <Textarea value={draft.aboutCTABody} onChange={(v) => setKey("aboutCTABody", v)} rows={2} />
          </AccordionItem>

          {/* 4. Supplier Page & B2B Inquiry */}
          <AccordionItem
            title="4. Supplier B2B Page & Inquiry Form"
            active={activeAccordion === "supplier"}
            onClick={() => setActiveAccordion("supplier")}
          >
            <ImageUploader token={token} slug="supplier-hero" context="site" label="Supplier Page Hero Image" value={draft.supplierHeroImage} onChange={(v) => setKey("supplierHeroImage", v)} />
            
            <Label>B2B Inquiry Form Description</Label>
            <Textarea value={draft.b2bFormNote} onChange={(v) => setKey("b2bFormNote", v)} rows={2} />

            <StringListEditor value={draft.b2bTradeCategories} onChange={(v) => setKey("b2bTradeCategories", v)} label="B2B Trade Business Types" />
            <StringListEditor value={draft.b2bProducts} onChange={(v) => setKey("b2bProducts", v)} label="B2B Products Offered" />
            <StringListEditor value={draft.b2bQuantities} onChange={(v) => setKey("b2bQuantities", v)} label="B2B Quantity Range Tiers" />
            <StringListEditor value={draft.b2bSources} onChange={(v) => setKey("b2bSources", v)} label="B2B Referral Sources list" />
            <StringListEditor value={draft.b2bContactMethods} onChange={(v) => setKey("b2bContactMethods", v)} label="B2B Contact Methods list" />

            <Label>B2B Sourcing Default Country</Label>
            <Input value={draft.b2bDefaultCountry} onChange={(v) => setKey("b2bDefaultCountry", v)} />

            {(() => {
              let list = [];
              try { list = JSON.parse(draft.supplierFeatures || "[]"); } catch {}
              return (
                <div style={{ marginBottom: 16, border: "1px solid " + BEIGE, padding: 12, borderRadius: 4 }}>
                  <Label>Supplier Key Features Icons</Label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                    {list.map((item: any, idx: number) => (
                      <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input type="text" value={item.name || ""} onChange={e => {
                          const next = [...list];
                          next[idx] = { ...item, name: e.target.value };
                          setKey("supplierFeatures", next);
                        }} placeholder="Icon" style={{ width: 80, padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                        <input type="text" value={item.label || ""} onChange={e => {
                          const next = [...list];
                          next[idx] = { ...item, label: e.target.value };
                          setKey("supplierFeatures", next);
                        }} placeholder="Label" style={{ flex: 1, padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                        <button type="button" onClick={() => {
                          const next = list.filter((_: any, i: number) => i !== idx);
                          setKey("supplierFeatures", next);
                        }} style={{ border: "none", background: "none", cursor: "pointer", color: RED }}>✕</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setKey("supplierFeatures", [...list, { name: "", label: "" }])} style={{ border: "1px dashed " + GOLD, color: GOLD, background: "none", padding: "6px", borderRadius: 3, cursor: "pointer", fontSize: 12 }}>+ Add Feature</button>
                  </div>
                </div>
              );
            })()}

            {(() => {
              let list = [];
              try { list = JSON.parse(draft.supplierProcess || "[]"); } catch {}
              return (
                <div style={{ marginBottom: 16, border: "1px solid " + BEIGE, padding: 12, borderRadius: 4 }}>
                  <Label>Supplier Sourcing Process Steps</Label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                    {list.map((item: any, idx: number) => (
                      <div key={idx} style={{ borderBottom: idx < list.length - 1 ? "1px dashed " + BEIGE : "none", paddingBottom: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <input type="text" value={item.step || ""} onChange={e => {
                            const next = [...list];
                            next[idx] = { ...item, step: e.target.value };
                            setKey("supplierProcess", next);
                          }} placeholder="Step" style={{ width: 60, padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                          <input type="text" value={item.title || ""} onChange={e => {
                            const next = [...list];
                            next[idx] = { ...item, title: e.target.value };
                            setKey("supplierProcess", next);
                          }} placeholder="Step Title" style={{ flex: 1, padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                        </div>
                        <textarea value={item.body || ""} onChange={e => {
                          const next = [...list];
                          next[idx] = { ...item, body: e.target.value };
                          setKey("supplierProcess", next);
                        }} placeholder="Step Description" rows={2} style={{ width: "100%", padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3, fontFamily: "sans-serif" }} />
                        <button type="button" onClick={() => {
                          const next = list.filter((_: any, i: number) => i !== idx);
                          setKey("supplierProcess", next);
                        }} style={{ border: "none", background: "none", cursor: "pointer", color: RED, alignSelf: "flex-end" }}>✕ Remove Step</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setKey("supplierProcess", [...list, { step: "", title: "", body: "" }])} style={{ border: "1px dashed " + GOLD, color: GOLD, background: "none", padding: "6px", borderRadius: 3, cursor: "pointer", fontSize: 12 }}>+ Add Step</button>
                  </div>
                </div>
              );
            })()}

            <StringListEditor value={draft.supplierPricingTiers} onChange={(v) => setKey("supplierPricingTiers", v)} label="Supplier Landed Pricing MOQ Tiers" />

            {(() => {
              let list = [];
              try { list = JSON.parse(draft.supplierPricingRows || "[]"); } catch {}
              return (
                <div style={{ marginBottom: 16, border: "1px solid " + BEIGE, padding: 12, borderRadius: 4 }}>
                  <Label>Supplier MOQ Pricing Table Rows</Label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                    {list.map((item: any, idx: number) => (
                      <div key={idx} style={{ borderBottom: idx < list.length - 1 ? "1px dashed " + BEIGE : "none", paddingBottom: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                        <input type="text" value={item.label || ""} onChange={e => {
                          const next = [...list];
                          next[idx] = { ...item, label: e.target.value };
                          setKey("supplierPricingRows", next);
                        }} placeholder="Pricing Feature (e.g. Lead Time)" style={{ padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                          {(item.values || ["", "", "", ""]).map((val: any, vIdx: number) => (
                            <input key={vIdx} type="text" value={val} onChange={e => {
                              const nextRows = [...list];
                              const nextVals = [...(item.values || ["", "", "", ""])];
                              nextVals[vIdx] = e.target.value;
                              nextRows[idx] = { ...item, values: nextVals };
                              setKey("supplierPricingRows", nextRows);
                            }} placeholder={`Tier ${vIdx + 1} rate`} style={{ padding: 6, fontSize: 12, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                          ))}
                        </div>
                        <button type="button" onClick={() => {
                          const next = list.filter((_: any, i: number) => i !== idx);
                          setKey("supplierPricingRows", next);
                        }} style={{ border: "none", background: "none", cursor: "pointer", color: RED, alignSelf: "flex-end" }}>✕ Remove Row</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setKey("supplierPricingRows", [...list, { label: "", values: ["", "", "", ""] }])} style={{ border: "1px dashed " + GOLD, color: GOLD, background: "none", padding: "6px", borderRadius: 3, cursor: "pointer", fontSize: 12 }}>+ Add Row</button>
                  </div>
                </div>
              );
            })()}

            {(() => {
              let list = [];
              try { list = JSON.parse(draft.supplierDetailCards || "[]"); } catch {}
              return (
                <div style={{ marginBottom: 16, border: "1px solid " + BEIGE, padding: 12, borderRadius: 4 }}>
                  <Label>Supplier Sourcing Support Cards</Label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                    {list.map((item: any, idx: number) => (
                      <div key={idx} style={{ borderBottom: idx < list.length - 1 ? "1px dashed " + BEIGE : "none", paddingBottom: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                        <input type="text" value={item.title || ""} onChange={e => {
                          const next = [...list];
                          next[idx] = { ...item, title: e.target.value };
                          setKey("supplierDetailCards", next);
                        }} placeholder="Card Title" style={{ padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                        <textarea value={item.body || ""} onChange={e => {
                          const next = [...list];
                          next[idx] = { ...item, body: e.target.value };
                          setKey("supplierDetailCards", next);
                        }} placeholder="Card Body Description" rows={2} style={{ width: "100%", padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3, fontFamily: "sans-serif" }} />
                        <button type="button" onClick={() => {
                          const next = list.filter((_: any, i: number) => i !== idx);
                          setKey("supplierDetailCards", next);
                        }} style={{ border: "none", background: "none", cursor: "pointer", color: RED, alignSelf: "flex-end" }}>✕ Remove Card</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setKey("supplierDetailCards", [...list, { title: "", body: "" }])} style={{ border: "1px dashed " + GOLD, color: GOLD, background: "none", padding: "6px", borderRadius: 3, cursor: "pointer", fontSize: 12 }}>+ Add Card</button>
                  </div>
                </div>
              );
            })()}

            <Label>Supplier CTA Footer Heading</Label>
            <Input value={draft.supplierCTAHeading} onChange={(v) => setKey("supplierCTAHeading", v)} />

            <Label>Supplier CTA Footer Body</Label>
            <Textarea value={draft.supplierCTABody} onChange={(v) => setKey("supplierCTABody", v)} rows={2} />
          </AccordionItem>

          {/* 5. Reviews Manager */}
          <AccordionItem
            title="5. Reviews Database CMS"
            active={activeAccordion === "reviews"}
            onClick={() => setActiveAccordion("reviews")}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <Label>Total Review Count</Label>
                <Input value={draft.reviewsTotalCount} onChange={(v) => setKey("reviewsTotalCount", v)} />
              </div>
              <div>
                <Label>Average Rating (out of 5)</Label>
                <Input value={draft.reviewsAvgRating} onChange={(v) => setKey("reviewsAvgRating", v)} />
              </div>
            </div>

            <Label>Reviews Page Label Heading</Label>
            <Input value={draft.reviewsPageHeading} onChange={(v) => setKey("reviewsPageHeading", v)} />

            <Label>Reviews Page Sub-text Description</Label>
            <Textarea value={draft.reviewsPageBody} onChange={(v) => setKey("reviewsPageBody", v)} rows={3} />

            <StringListEditor value={draft.reviewsFormProducts} onChange={(v) => setKey("reviewsFormProducts", v)} label="Form Review Selectable Products" />

            {(() => {
              let list = [];
              try { list = JSON.parse(draft.reviewsDistribution || "[]"); } catch {}
              return (
                <div style={{ marginBottom: 16, border: "1px solid " + BEIGE, padding: 12, borderRadius: 4 }}>
                  <Label>Star Distribution Percentages</Label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                    {list.map((item: any, idx: number) => (
                      <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: "#888", width: 50 }}>{item.stars}★:</span>
                        <input type="number" value={item.pct} onChange={e => {
                          const next = [...list];
                          next[idx] = { ...item, pct: Number(e.target.value) || 0 };
                          setKey("reviewsDistribution", next);
                        }} placeholder="Percentage" style={{ flex: 1, padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                        <span>%</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {(() => {
              let list = [];
              try { list = JSON.parse(draft.reviewsList || "[]"); } catch {}
              return (
                <div style={{ marginBottom: 16, border: "1px solid " + BEIGE, padding: 12, borderRadius: 4 }}>
                  <Label>Reviews Sourcing Registry ({list.length} items)</Label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8, maxHeight: 360, overflowY: "auto", paddingRight: 4 }}>
                    {list.map((item: any, idx: number) => (
                      <div key={idx} style={{ borderBottom: "1px solid #eee", paddingBottom: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <input type="text" value={item.name || ""} onChange={e => {
                            const next = [...list];
                            next[idx] = { ...item, name: e.target.value };
                            setKey("reviewsList", next);
                          }} placeholder="Name" style={{ flex: 1, padding: 6, fontSize: 12, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                          <input type="text" value={item.city || ""} onChange={e => {
                            const next = [...list];
                            next[idx] = { ...item, city: e.target.value };
                            setKey("reviewsList", next);
                          }} placeholder="City" style={{ width: 120, padding: 6, fontSize: 12, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <input type="text" value={item.product || ""} onChange={e => {
                            const next = [...list];
                            next[idx] = { ...item, product: e.target.value };
                            setKey("reviewsList", next);
                          }} placeholder="Product detail purchased" style={{ flex: 1, padding: 6, fontSize: 12, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                          <select value={item.rating || 5} onChange={e => {
                            const next = [...list];
                            next[idx] = { ...item, rating: Number(e.target.value) };
                            setKey("reviewsList", next);
                          }} style={{ width: 80, padding: 6, fontSize: 12, border: "1px solid " + BEIGE, borderRadius: 3 }}>
                            <option value="5">5★</option>
                            <option value="4">4★</option>
                            <option value="3">3★</option>
                            <option value="2">2★</option>
                            <option value="1">1★</option>
                          </select>
                        </div>
                        <textarea value={item.text || ""} onChange={e => {
                          const next = [...list];
                          next[idx] = { ...item, text: e.target.value };
                          setKey("reviewsList", next);
                        }} placeholder="Review comment text..." rows={2} style={{ width: "100%", padding: 6, fontSize: 12, border: "1px solid " + BEIGE, borderRadius: 3, fontFamily: "sans-serif" }} />
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <label style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                            <input type="checkbox" checked={item.verified ?? true} onChange={e => {
                              const next = [...list];
                              next[idx] = { ...item, verified: e.target.checked };
                              setKey("reviewsList", next);
                            }} /> Verified Purchaser
                          </label>
                          <button type="button" onClick={() => {
                            const next = list.filter((_: any, i: number) => i !== idx);
                            setKey("reviewsList", next);
                          }} style={{ border: "none", background: "none", cursor: "pointer", color: RED, fontSize: 12 }}>✕ Delete Review</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => setKey("reviewsList", [{ name: "", city: "", product: "", category: "mattress", rating: 5, date: "Today", verified: true, text: "" }, ...list])} style={{ width: "100%", border: "1px dashed " + GOLD, color: GOLD, background: "none", padding: "8px", borderRadius: 3, cursor: "pointer", fontSize: 12, marginTop: 12 }}>
                    + Add New Review to Top
                  </button>
                </div>
              );
            })()}
          </AccordionItem>

          {/* 6. FAQ Manager */}
          <AccordionItem
            title="6. FAQ Manager CMS"
            active={activeAccordion === "faq"}
            onClick={() => setActiveAccordion("faq")}
          >
            <PairListEditor value={draft.faqItems} onChange={(v) => setKey("faqItems", v)} label="FAQ Items List (Question / Answer)" keyPlaceholder="Question" valPlaceholder="Answer" />
          </AccordionItem>

          {/* 7. Freight Calculator */}
          <AccordionItem
            title="7. Freight Sourcing Parameters"
            active={activeAccordion === "freight"}
            onClick={() => setActiveAccordion("freight")}
          >
            <Label>Calculator Block Header</Label>
            <Input value={draft.freightTitle} onChange={(v) => setKey("freightTitle", v)} />

            <Label>Calculator Subheading description</Label>
            <Input value={draft.freightSubtitle} onChange={(v) => setKey("freightSubtitle", v)} />

            <Label>Port Handling flat fee (USD)</Label>
            <Input value={draft.freightPortHandling} onChange={(v) => setKey("freightPortHandling", v)} style={{ width: 120 }} />

            <Label>IGST Customs Rate (decimal, e.g. 0.18 for 18%)</Label>
            <Input value={draft.freightIGSTRate} onChange={(v) => setKey("freightIGSTRate", v)} style={{ width: 120 }} />

            <Label>Calculator Footer Disclaimer Note</Label>
            <Textarea value={draft.freightDisclaimer} onChange={(v) => setKey("freightDisclaimer", v)} rows={2} />

            {(() => {
              let list = [];
              try { list = JSON.parse(draft.freightOrigins || "[]"); } catch {}
              return (
                <div style={{ marginBottom: 16, border: "1px solid " + BEIGE, padding: 12, borderRadius: 4 }}>
                  <Label>Origin Loading Ports (Sea Freight rates)</Label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                    {list.map((item: any, idx: number) => (
                      <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input type="text" value={item.name || ""} onChange={e => {
                          const next = [...list];
                          next[idx] = { ...item, name: e.target.value };
                          setKey("freightOrigins", next);
                        }} placeholder="Port Name (e.g. Shanghai Port)" style={{ flex: 1, padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                        <input type="number" value={item.rate || 0} onChange={e => {
                          const next = [...list];
                          next[idx] = { ...item, rate: Number(e.target.value) };
                          setKey("freightOrigins", next);
                        }} placeholder="Rate/CBM" style={{ width: 100, padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                        <button type="button" onClick={() => {
                          const next = list.filter((_: any, i: number) => i !== idx);
                          setKey("freightOrigins", next);
                        }} style={{ border: "none", background: "none", cursor: "pointer", color: RED }}>✕</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setKey("freightOrigins", [...list, { name: "", rate: 0 }])} style={{ border: "1px dashed " + GOLD, color: GOLD, background: "none", padding: "6px", borderRadius: 3, cursor: "pointer", fontSize: 12 }}>+ Add Origin Port</button>
                  </div>
                </div>
              );
            })()}

            {(() => {
              let list = [];
              try { list = JSON.parse(draft.freightDestinations || "[]"); } catch {}
              return (
                <div style={{ marginBottom: 16, border: "1px solid " + BEIGE, padding: 12, borderRadius: 4 }}>
                  <Label>Destination Discharge Ports (India Customs & Inland rates)</Label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                    {list.map((item: any, idx: number) => (
                      <div key={idx} style={{ borderBottom: idx < list.length - 1 ? "1px dashed " + BEIGE : "none", paddingBottom: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                        <input type="text" value={item.name || ""} onChange={e => {
                          const next = [...list];
                          next[idx] = { ...item, name: e.target.value };
                          setKey("freightDestinations", next);
                        }} placeholder="Destination Port Name" style={{ padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                        <div style={{ display: "flex", gap: 8 }}>
                          <input type="number" value={item.customs || 0} onChange={e => {
                            const next = [...list];
                            next[idx] = { ...item, customs: Number(e.target.value) };
                            setKey("freightDestinations", next);
                          }} placeholder="Customs Flat (USD)" style={{ flex: 1, padding: 6, fontSize: 12, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                          <input type="number" value={item.inland || 0} onChange={e => {
                            const next = [...list];
                            next[idx] = { ...item, inland: Number(e.target.value) };
                            setKey("freightDestinations", next);
                          }} placeholder="Inland/CBM (USD)" style={{ flex: 1, padding: 6, fontSize: 12, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                        </div>
                        <button type="button" onClick={() => {
                          const next = list.filter((_: any, i: number) => i !== idx);
                          setKey("freightDestinations", next);
                        }} style={{ border: "none", background: "none", cursor: "pointer", color: RED, alignSelf: "flex-end" }}>✕ Remove Port</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setKey("freightDestinations", [...list, { name: "", customs: 0, inland: 0 }])} style={{ border: "1px dashed " + GOLD, color: GOLD, background: "none", padding: "6px", borderRadius: 3, cursor: "pointer", fontSize: 12 }}>+ Add Discharge Port</button>
                  </div>
                </div>
              );
            })()}

            {(() => {
              let list = [];
              try { list = JSON.parse(draft.freightMaterials || "[]"); } catch {}
              return (
                <div style={{ marginBottom: 16, border: "1px solid " + BEIGE, padding: 12, borderRadius: 4 }}>
                  <Label>Freight Material Volume Multipliers</Label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                    {list.map((item: any, idx: number) => (
                      <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input type="text" value={item.name || ""} onChange={e => {
                          const next = [...list];
                          next[idx] = { ...item, name: e.target.value };
                          setKey("freightMaterials", next);
                        }} placeholder="Material Category" style={{ flex: 1, padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                        <input type="number" step="0.01" value={item.mult || 1.0} onChange={e => {
                          const next = [...list];
                          next[idx] = { ...item, mult: Number(e.target.value) };
                          setKey("freightMaterials", next);
                        }} placeholder="Multiplier" style={{ width: 100, padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                        <button type="button" onClick={() => {
                          const next = list.filter((_: any, i: number) => i !== idx);
                          setKey("freightMaterials", next);
                        }} style={{ border: "none", background: "none", cursor: "pointer", color: RED }}>✕</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setKey("freightMaterials", [...list, { name: "", mult: 1.0 }])} style={{ border: "1px dashed " + GOLD, color: GOLD, background: "none", padding: "6px", borderRadius: 3, cursor: "pointer", fontSize: 12 }}>+ Add Material Multiplier</button>
                  </div>
                </div>
              );
            })()}
          </AccordionItem>

          {/* 8. Homepage Category Images */}
          <AccordionItem
            title="8. Homepage Category Grid Images"
            active={activeAccordion === "categories"}
            onClick={() => setActiveAccordion("categories")}
          >
            <p style={{ fontSize:12, color:"#888", marginBottom:16, lineHeight:1.65 }}>
              These images appear in the "Shop By Category" section. Overwrites default images.
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:16 }}>
              {([
                ["catImg_Mattresses","Mattresses","mattresses"],
                ["catImg_Pillows","Pillows","pillows"],
                ["catImg_Toppers","Toppers","toppers"],
                ["catImg_Cushions","Cushions","cushions"],
                ["catImg_LatexMaterial","Latex Material","latex-material"],
              ] as const).map(([key,label,slug])=>(
                <div key={key} style={{ background:"#FAF8F4", borderRadius:4, padding:"14px 14px 10px", border:"1px solid " + BEIGE }}>
                  {draft[key] && (
                    <img src={draft[key]} alt={label} style={{ width:"100%", height:140, objectFit:"cover", borderRadius:3, marginBottom:10, display:"block" }} onError={(e)=>{ (e.target as HTMLImageElement).style.display="none"; }}/>
                  )}
                  <ImageUploader token={token} slug={slug} context="category" label={label} value={draft[key]} onChange={(v)=>setKey(key, v)}/>
                </div>
              ))}
            </div>
          </AccordionItem>

          {/* 9. Footer & Loader Settings */}
          <AccordionItem
            title="9. Navigation & Loader Settings"
            active={activeAccordion === "footer"}
            onClick={() => setActiveAccordion("footer")}
          >
            <Label>Loader Brand text</Label>
            <Input value={draft.loadingBrand} onChange={(v) => setKey("loadingBrand", v)} />

            <Label>Loader Tagline sub-text</Label>
            <Input value={draft.loadingTagline} onChange={(v) => setKey("loadingTagline", v)} />

            <StringListEditor value={draft.loadingStats} onChange={(v) => setKey("loadingStats", v)} label="Loader Stats Band" />
            <StringListEditor value={draft.trustTickerItems} onChange={(v) => setKey("trustTickerItems", v)} label="Footer Trust ticker" />

            {(() => {
              let list = [];
              try { list = JSON.parse(draft.certChips || "[]"); } catch {}
              return (
                <div style={{ marginBottom: 16, border: "1px solid " + BEIGE, padding: 12, borderRadius: 4 }}>
                  <Label>Footer Certification Chips</Label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                    {list.map((item: any, idx: number) => (
                      <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input type="text" value={item.icon || ""} onChange={e => {
                          const next = [...list];
                          next[idx] = { ...item, icon: e.target.value };
                          setKey("certChips", next);
                        }} placeholder="Icon" style={{ width: 60, padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                        <input type="text" value={item.label || ""} onChange={e => {
                          const next = [...list];
                          next[idx] = { ...item, label: e.target.value };
                          setKey("certChips", next);
                        }} placeholder="Label" style={{ flex: 1, padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                        <button type="button" onClick={() => {
                          const next = list.filter((_: any, i: number) => i !== idx);
                          setKey("certChips", next);
                        }} style={{ border: "none", background: "none", cursor: "pointer", color: RED }}>✕</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setKey("certChips", [...list, { icon: "", label: "" }])} style={{ border: "1px dashed " + GOLD, color: GOLD, background: "none", padding: "6px", borderRadius: 3, cursor: "pointer", fontSize: 12 }}>+ Add Certification Chip</button>
                  </div>
                </div>
              );
            })()}

            {(() => {
              let list = [];
              try { list = JSON.parse(draft.quickLinks || "[]"); } catch {}
              return (
                <div style={{ marginBottom: 16, border: "1px solid " + BEIGE, padding: 12, borderRadius: 4 }}>
                  <Label>Homepage Quick Links</Label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                    {list.map((item: any, idx: number) => (
                      <div key={idx} style={{ borderBottom: idx < list.length - 1 ? "1px dashed " + BEIGE : "none", paddingBottom: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <input type="text" value={item.ic || ""} onChange={e => {
                            const next = [...list];
                            next[idx] = { ...item, ic: e.target.value };
                            setKey("quickLinks", next);
                          }} placeholder="Icon (e.g. box)" style={{ width: 80, padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                          <input type="text" value={item.t || ""} onChange={e => {
                            const next = [...list];
                            next[idx] = { ...item, t: e.target.value };
                            setKey("quickLinks", next);
                          }} placeholder="Title" style={{ flex: 1, padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                        </div>
                        <input type="text" value={item.d || ""} onChange={e => {
                          const next = [...list];
                          next[idx] = { ...item, d: e.target.value };
                          setKey("quickLinks", next);
                        }} placeholder="Description tagline" style={{ padding: 6, fontSize: 13, border: "1px solid " + BEIGE, borderRadius: 3 }} />
                        <button type="button" onClick={() => {
                          const next = list.filter((_: any, i: number) => i !== idx);
                          setKey("quickLinks", next);
                        }} style={{ border: "none", background: "none", cursor: "pointer", color: RED, alignSelf: "flex-end" }}>✕ Remove Link</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setKey("quickLinks", [...list, { ic: "", t: "", d: "" }])} style={{ border: "1px dashed " + GOLD, color: GOLD, background: "none", padding: "6px", borderRadius: 3, cursor: "pointer", fontSize: 12 }}>+ Add Quick Link</button>
                  </div>
                </div>
              );
            })()}

            <PairListEditor value={draft.whyXiyoraCards} onChange={(v) => setKey("whyXiyoraCards", v)} label="Why choose XIYORA Cards" keyPlaceholder="Title" valPlaceholder="Description" hasIcon={true} />
            <PairListEditor value={draft.howItWorksSteps} onChange={(v) => setKey("howItWorksSteps", v)} label="Homepage Sourcing Process Steps" keyPlaceholder="Title" valPlaceholder="Description" hasIcon={true} />
          </AccordionItem>

          <AccordionItem
            title="10. Layout, Sizing & Accessibility Customizer"
            active={activeAccordion === "layout"}
            onClick={() => setActiveAccordion(activeAccordion === "layout" ? "" : "layout")}
          >
            <div style={{ padding: 12, background: "#fff", borderRadius: 4, border: "1px solid " + BEIGE }}>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: DARK, marginBottom: 16 }}>Typography & Sizing</h4>
              
              <Label>Homepage Hero Layout</Label>
              <Select
                value={draft.heroLayout || "split"}
                onChange={(v) => setKey("heroLayout", v)}
                options={[
                  { value: "split", label: "Split Layout (Text Left, Image Right)" },
                  { value: "reverse", label: "Reversed Split Layout (Image Left, Text Right)" },
                  { value: "centered", label: "Centered Content Layout (Stacked)" }
                ]}
              />

              <Label>About Page Story Layout</Label>
              <Select
                value={draft.aboutStoryLayout || "split"}
                onChange={(v) => setKey("aboutStoryLayout", v)}
                options={[
                  { value: "split", label: "Split Layout (Left Title, Right Paragraphs)" },
                  { value: "stacked", label: "Stacked Layout (Full Width)" }
                ]}
              />

              <Label>Homepage Hero Section Padding</Label>
              <Input
                value={draft.heroPadding || ""}
                onChange={(v) => setKey("heroPadding", v)}
                placeholder="e.g. clamp(22px,4vw,46px) 0 clamp(30px,4vw,54px)"
              />

              <Label>Global Section Padding</Label>
              <Input
                value={draft.sectionPadding || ""}
                onChange={(v) => setKey("sectionPadding", v)}
                placeholder="e.g. 80px 0 (or clamp(40px, 6vw, 80px) 0)"
              />

              <Label>Hero Title Font Size</Label>
              <Input
                value={draft.heroTitleSize || ""}
                onChange={(v) => setKey("heroTitleSize", v)}
                placeholder="e.g. clamp(2.1rem,3.6vw,3.5rem)"
              />

              <Label>Hero Body Font Size</Label>
              <Input
                value={draft.heroBodySize || ""}
                onChange={(v) => setKey("heroBodySize", v)}
                placeholder="e.g. 14.5px"
              />

              <Label>About Hero Title Font Size</Label>
              <Input
                value={draft.aboutHeroHeadingSize || ""}
                onChange={(v) => setKey("aboutHeroHeadingSize", v)}
                placeholder="e.g. clamp(2.4rem,5vw,4rem)"
              />

              <Label>About Hero Body Font Size</Label>
              <Input
                value={draft.aboutHeroBodySize || ""}
                onChange={(v) => setKey("aboutHeroBodySize", v)}
                placeholder="e.g. 15.5px"
              />

              <Label>General Section Heading Size (SH)</Label>
              <Input
                value={draft.generalSectionHeadingSize || ""}
                onChange={(v) => setKey("generalSectionHeadingSize", v)}
                placeholder="e.g. clamp(1.9rem,3.2vw,2.8rem)"
              />

              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: DARK, marginTop: 24, marginBottom: 16 }}>Section Visibility & Controls</h4>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
                {[
                  { key: "showTrustTicker", label: "Show Trust Ticker Strip" },
                  { key: "showB2BStats", label: "Show B2B Stats Band" },
                  { key: "showBuyerBestFit", label: "Show Find Your Best Fit Section" },
                  { key: "showLatexStory", label: "Show Latex Story Panel" },
                  { key: "showWhyXiyora", label: "Show Why Choose XIYORA Section" },
                  { key: "showProcessSteps", label: "Show Sourcing Process Steps" },
                  { key: "showDocuments", label: "Show Documents & Certifications Grid" }
                ].map(item => (
                  <label key={item.key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: DARK, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={draft[item.key] !== "false"}
                      onChange={(e) => setKey(item.key, e.target.checked ? "true" : "false")}
                      style={{ accentColor: GOLD }}
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>
          </AccordionItem>
        </div>
      </div>

      {/* RIGHT: Live Visual Preview Pane */}
      <div style={{ width: "50%", display: "flex", flexDirection: "column", background: "#FAF8F4", border: "1px solid " + BEIGE, borderRadius: 4, overflow: "hidden" }}>
        {/* Preview Top Bar / Page Tabs */}
        <div style={{ display: "flex", background: DARK, borderBottom: "1px solid " + BEIGE, overflowX: "auto", flexShrink: 0 }}>
          {([
            ["home", "Home"],
            ["about", "About"],
            ["supplier", "Supplier B2B"],
            ["reviews", "Reviews"],
            ["faq", "FAQ"],
            ["contact", "Contact"],
            ["shipping", "Shipping"]
          ]).map(([tabKey, tabLabel]) => (
            <button
              key={tabKey}
              onClick={() => setPreviewTab(tabKey)}
              type="button"
              style={{
                background: previewTab === tabKey ? GOLD : "transparent",
                color: previewTab === tabKey ? "#fff" : "#aaa",
                border: "none",
                padding: "14px 18px",
                fontSize: 12,
                fontFamily: "'Inter', sans-serif",
                cursor: "pointer",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "1px",
                whiteSpace: "nowrap",
                borderBottom: previewTab === tabKey ? "2px solid " + GOLD : "none"
              }}
            >
              {tabLabel}
            </button>
          ))}
        </div>

        {/* Resolution selector header */}
        <div style={{ padding: "10px 14px", background: "#252523", borderBottom: `1px solid ${BEIGE}`, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", flexShrink: 0 }}>
          <span style={{ fontSize: 10, color: GOLD, letterSpacing: "1.2px", textTransform: "uppercase", fontWeight: 600 }}>Simulated Device:</span>
          <select
            value={selectedRes.w + "x" + selectedRes.h}
            onChange={(e) => {
              const val = e.target.value;
              const res = RESOLUTIONS.find(r => (r.w + "x" + r.h) === val);
              if (res) setSelectedRes(res);
            }}
            style={{ background: "#333330", color: "#FAF6EE", border: `1px solid ${GOLD}`, padding: "4px 8px", fontSize: 11, borderRadius: 3, outline: "none", fontFamily: "'Inter', sans-serif" }}
          >
            {RESOLUTIONS.map(r => (
              <option key={r.w + "x" + r.h} value={r.w + "x" + r.h}>
                {r.label}
              </option>
            ))}
          </select>
          <span style={{ fontSize: 10, color: "#aaa" }}>
            Fit: {Math.round(scale * 100)}%
          </span>
        </div>

        {/* Render View inside scrollable wrapper */}
        <div ref={containerRef} style={{ flex: 1, overflowY: "auto", position: "relative", background: "#EAE6DB", padding: "16px 0" }}>
          {/* Centering container for the device frame */}
          <div style={{
            width: "100%",
            height: selectedRes.h * scale + 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            overflow: "hidden"
          }}>
            {/* The Device Frame */}
            <div style={{
              width: selectedRes.w,
              height: selectedRes.h,
              background: "#fff",
              transform: `scale(${scale})`,
              transformOrigin: "top center",
              position: "relative",
              overflowY: "auto",
              overflowX: "hidden",
              boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
              borderRadius: selectedRes.type === "mobile" ? "24px" : "4px",
              border: selectedRes.type === "mobile" ? "12px solid #1c1a17" : "6px solid #2d2d2a",
              flexShrink: 0
            }}>
          {previewTab === "home" && (
            <HomeView
              cur={currency}
              wl={[]}
              onWish={() => {}}
              onOpen={() => {}}
              onCatalog={() => {}}
              onCatFilter={() => {}}
              onSupplier={() => setPreviewTab("supplier")}
              onInquire={() => {}}
              setPage={(p: any) => {
                if (["about", "supplier", "reviews", "faq", "contact", "shipping"].includes(p)) {
                  setPreviewTab(p);
                }
              }}
            />
          )}
          {previewTab === "about" && (
            <AboutView
              setPage={(p: any) => {
                if (["home", "supplier", "contact"].includes(p)) {
                  setPreviewTab(p === "home" ? "home" : p);
                }
              }}
              onCatalog={() => {}}
            />
          )}
          {previewTab === "supplier" && (
            <SupplierView
              onCatalog={() => {}}
              onInquire={() => {}}
              setPage={(p: any) => {
                if (["home", "contact"].includes(p)) {
                  setPreviewTab(p === "home" ? "home" : p);
                }
              }}
              cur={currency}
            />
          )}
          {previewTab === "reviews" && (
            <ReviewsView
              cur={currency}
              setPage={(p: any) => {
                if (p === "home") setPreviewTab("home");
              }}
            />
          )}
          {previewTab === "faq" && (
            <SimplePage
              title="FAQ"
              content={(() => {
                let faqs = [];
                try { if (draft.faqItems) faqs = JSON.parse(draft.faqItems); } catch {}
                return faqs;
              })()}
              setPage={(p: any) => {
                if (p === "home") setPreviewTab("home");
              }}
            />
          )}
          {previewTab === "contact" && (
            <SimplePage
              title="Contact XIYORA"
              content={[
                ["WhatsApp (Fastest)", "+" + (draft.wa || "")],
                ["Email", draft.email || ""],
                ["Instagram", "@xiyora.zi — " + (draft.ig || "")],
                ["Address", draft.address || ""],
                ["Response Time", "We reply within 24–48 hours. WhatsApp is the fastest channel."]
              ]}
              setPage={(p: any) => {
                if (p === "home") setPreviewTab("home");
              }}
            />
          )}
          {previewTab === "shipping" && (
            <SimplePage
              title="Shipping & Delivery"
              content={[
                ["Origin", "Imported from Bingxi, China via sea freight."],
                ["Indian Ports", "Mumbai (Nhava Sheva), Mundra, Chennai, Kolkata, Cochin — based on buyer location."],
                ["Sea Freight", "~25–40 days from order confirmation, depending on product and quantity."],
                ["Inland Delivery", "3–10 days after port clearance depending on your zone."],
                ["Costs", "Shipping, customs, IGST, and inland delivery are included in your final quoted price."]
              ]}
              setPage={(p: any) => {
                if (p === "home") setPreviewTab("home");
              }}
            />
          )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadsPanel({ token }: { token: string }) {
  const [tab, setTab] = useState<"enquiries"|"subscriptions"|"quotes"|"checkouts">("enquiries");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const fetchTab = useCallback(async (t: string) => {
    setLoading(true); setErr("");
    const ep = t==="enquiries"?"/enquiries":t==="subscriptions"?"/subscriptions":t==="quotes"?"/quote-requests":"/checkout-intents";
    try {
      const res = await apiFetch(ep, {}, token);
      if (res.status===403) { setErr("Access denied."); setLoading(false); return; }
      const rows = await res.json();
      setData(Array.isArray(rows)?rows:[]);
    } catch { setErr("Network error"); }
    setLoading(false);
  }, [token]);

  useEffect(() => { fetchTab(tab); }, [tab, fetchTab]);

  const exportCSV = () => {
    if (!data.length) return;
    const cols = Object.keys(data[0]);
    const rows = [cols.join(","), ...data.map(r => cols.map(c => `"${String(r[c]??"")}"`).join(","))];
    const blob = new Blob([rows.join("\n")], { type:"text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `xiyora-${tab}.csv`; a.click();
  };

  const TABS = [["enquiries","Enquiries"],["subscriptions","Subscriptions"],["quotes","Quote Requests"],["checkouts","Checkouts"]] as const;
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:DARK }}>Leads</h2>
        <Btn variant="secondary" onClick={exportCSV} style={{ fontSize:11 }}>Export CSV</Btn>
      </div>
      <div style={{ display:"flex", gap:0, borderBottom:`1px solid ${BEIGE}`, marginBottom:20 }}>
        {TABS.map(([key,label]) => (
          <button key={key} onClick={() => setTab(key)} style={{ background:"none", border:"none", padding:"10px 18px", fontSize:13, fontFamily:"'Inter',sans-serif", cursor:"pointer", color:tab===key?GOLD:"#888", borderBottom:`2px solid ${tab===key?GOLD:"transparent"}`, transition:"all .2s" }}>{label}</button>
        ))}
      </div>
      {loading && <div style={{ textAlign:"center", padding:40 }}><Spinner/></div>}
      {err && <p style={{ color:RED, marginBottom:14 }}>{err}</p>}
      {!loading && !err && data.length===0 && <p style={{ textAlign:"center", padding:40, color:"#bbb" }}>No records yet.</p>}
      {!loading && data.length>0 && (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12.5 }}>
            <thead>
              <tr style={{ borderBottom:`2px solid ${BEIGE}` }}>
                {Object.keys(data[0]).map(k => <th key={k} style={{ padding:"10px 12px", textAlign:"left", color:"#888", fontWeight:500, whiteSpace:"nowrap", textTransform:"uppercase", fontSize:10.5, letterSpacing:"1px" }}>{k.replace(/_/g," ")}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.map((row,i) => (
                <tr key={i} style={{ borderBottom:`1px solid ${BEIGE}`, background:i%2===0?"transparent":"#FAF8F4" }}>
                  {Object.values(row).map((v,j) => <td key={j} style={{ padding:"10px 12px", color:DARK, maxWidth:220, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }} title={String(v??"")}>{String(v??"-")}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function humaniseLoginError(status: number, serverMsg?: string): string {
  if (status === 0) return "Backend not reachable — VITE_API_BASE is missing or the backend is not deployed.";
  if (status === 503) return "Backend is missing ADMIN_PASSWORD secret. Set it in Replit Secrets and redeploy.";
  if (status === 401) return "Invalid username or password.";
  if (status === 403) return "Access forbidden. Try logging out and back in.";
  if (status >= 500) return `Backend server error (HTTP ${status}). Check deployment logs.`;
  return serverMsg || "Login failed.";
}

function AdminDiagnostics() {
  const [health, setHealth] = useState<"checking"|"ok"|"error">("checking");
  const [dbOk, setDbOk] = useState<boolean|null>(null);
  const [hasSecret, setHasSecret] = useState<boolean|null>(null);
  const [hasPassword, setHasPassword] = useState<boolean|null>(null);
  const [rawError, setRawError] = useState<string>("");

  useEffect(() => {
    const base = API.replace(/\/api$/, "");
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);

    fetch(`${base}/api/health`, { signal: ctrl.signal })
      .then(async r => {
        clearTimeout(t);
        const ct = r.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          setHealth("error");
          setRawError(`Unexpected response type: ${ct}. The API may not be deployed or the URL is wrong.`);
          return;
        }
        if (!r.ok) {
          setHealth("error");
          setRawError(`HTTP ${r.status} from health endpoint.`);
          return;
        }
        const j = await r.json().catch(() => null);
        if (j?.status === "ok") {
          setHealth("ok");
          setDbOk(!!j.dbConnected);
          setHasSecret(j.hasAdminSecret ?? null);
          setHasPassword(j.hasAdminPassword ?? null);
        } else {
          setHealth("error");
          setRawError(j?.error || "Health check returned unexpected data.");
        }
      })
      .catch((err) => {
        clearTimeout(t);
        setHealth("error");
        setRawError(err?.name === "AbortError" ? "Request timed out after 8 seconds." : (err?.message || "Network error"));
      });
  }, []);

  const StatusDot = ({ ok }: { ok: boolean | null }) => {
    const color = ok === null ? "#aaa" : ok ? "#3a9b6e" : RED;
    return <span style={{ width:7, height:7, borderRadius:"50%", background:color, display:"inline-block", flexShrink:0 }}/>;
  };

  return (
    <div style={{ marginTop:18, background:"#f0ece0", borderRadius:3, padding:"10px 14px", textAlign:"left", fontSize:11, color:"#888", lineHeight:1.8 }}>
      <div style={{ fontWeight:600, color:DARK, marginBottom:4, letterSpacing:".5px", textTransform:"uppercase", fontSize:10 }}>Diagnostics</div>
      <div><span style={{ color:"#aaa" }}>API base:</span> <code style={{ fontSize:10, wordBreak:"break-all" }}>{API}</code></div>

      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        <StatusDot ok={health === "ok" ? true : health === "error" ? false : null} />
        <span>{health === "ok" ? "Backend reachable" : health === "error" ? "Backend unreachable" : "Checking…"}</span>
      </div>

      {health === "ok" && (
        <>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <StatusDot ok={dbOk} />
            <span style={{ color: dbOk ? "#3a9b6e" : RED, fontWeight: !dbOk ? 600 : 400 }}>
              {dbOk === null ? "DB status unknown" : dbOk ? "Database connected" : "Database NOT connected"}
            </span>
          </div>
          {dbOk === false && (
            <div style={{ color:RED, marginLeft:13, fontSize:10, lineHeight:1.6 }}>
              Set <code>DATABASE_URL</code> in Vercel → Settings → Environment Variables. Use a PostgreSQL provider like Neon (free tier) or Supabase.
            </div>
          )}

          {hasSecret !== null && (
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <StatusDot ok={hasSecret} />
              <span style={{ color: hasSecret ? "#3a9b6e" : RED, fontWeight: !hasSecret ? 600 : 400 }}>
                {hasSecret ? "ADMIN_SECRET configured" : "ADMIN_SECRET missing"}
              </span>
            </div>
          )}
          {hasSecret === false && (
            <div style={{ color:RED, marginLeft:13, fontSize:10, lineHeight:1.6 }}>
              Set <code>ADMIN_SECRET</code> in Vercel env vars. Use any long random string (e.g. from a password generator).
            </div>
          )}

          {hasPassword !== null && (
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <StatusDot ok={hasPassword} />
              <span style={{ color: hasPassword ? "#3a9b6e" : RED, fontWeight: !hasPassword ? 600 : 400 }}>
                {hasPassword ? "ADMIN_PASSWORD configured" : "ADMIN_PASSWORD missing"}
              </span>
            </div>
          )}
          {hasPassword === false && (
            <div style={{ color:RED, marginLeft:13, fontSize:10, lineHeight:1.6 }}>
              Set <code>ADMIN_PASSWORD</code> in Vercel env vars. This is the password you use to log in here.
            </div>
          )}
        </>
      )}

      {health === "error" && (
        <div style={{ color:RED, marginTop:4 }}>
          Backend API server is not responding. Ensure your Vercel backend deployment is running, and verify <code>VITE_API_BASE</code> is set correctly.
          {rawError && <div style={{ marginTop:4, fontSize:10, color:"#777" }}>Detail: {rawError}</div>}
        </div>
      )}
    </div>
  );
}

export default function AdminPanel({
  BIZ,
  HomeView,
  AboutView,
  SupplierView,
  ReviewsView,
  SimplePage,
  B2BInquiryForm,
  forceRefresh,
  products,
  currency,
}: any) {
  const [token, setToken] = useState<string|null>(() => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginErr, setLoginErr] = useState("");
  const [lastStatus, setLastStatus] = useState<number>(0);
  const [section, setSection] = useState<"products"|"site"|"leads">("products");

  const logout = () => {
    try { localStorage.removeItem(TOKEN_KEY); } catch {}
    setToken(null);
    setLoginErr("");
  };

  const login = async () => {
    if (!username || !password) { setLoginErr("Enter username and password."); return; }
    setLoginLoading(true); setLoginErr("");
    try {
      const res = await apiFetch("/admin/login", { method:"POST", body:JSON.stringify({ username, password }) });
      setLastStatus(res.status);
      let data: any = {};
      try { data = await res.json(); } catch {}
      if (res.ok && data.success && data.token) {
        try { localStorage.setItem(TOKEN_KEY, data.token); } catch {}
        setToken(data.token);
        return;
      }
      setLoginErr(humaniseLoginError(res.status, data.error));
    } catch {
      setLastStatus(0);
      setLoginErr("Backend not reachable — VITE_API_BASE is missing or the backend is not deployed.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleCredentialResponse = useCallback(async (response: any) => {
    setLoginLoading(true); setLoginErr("");
    try {
      const res = await apiFetch("/admin/google-login", { method:"POST", body:JSON.stringify({ credential: response.credential }) });
      setLastStatus(res.status);
      let data: any = {};
      try { data = await res.json(); } catch {}
      if (res.ok && data.success && data.token) {
        try { localStorage.setItem(TOKEN_KEY, data.token); } catch {}
        setToken(data.token);
        return;
      }
      setLoginErr(humaniseLoginError(res.status, data.error));
    } catch {
      setLastStatus(0);
      setLoginErr("Google Authentication failed to reach backend.");
    } finally {
      setLoginLoading(false);
    }
  }, []);

  const initializeGoogleSignIn = useCallback(() => {
    const google = (window as any).google;
    if (google) {
      const client_id = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string) || "878235252872-9l7h560kchc3eopvpe623q3461234.apps.googleusercontent.com";
      google.accounts.id.initialize({
        client_id,
        callback: handleGoogleCredentialResponse,
      });
      const btnParent = document.getElementById("google-signin-btn");
      if (btnParent) {
        google.accounts.id.renderButton(btnParent, {
          theme: "outline",
          size: "large",
          width: 324,
        });
      }
    }
  }, [handleGoogleCredentialResponse]);

  useEffect(() => {
    if (token) return;
    const scriptId = "google-gsi-client";
    if (document.getElementById(scriptId)) {
      initializeGoogleSignIn();
      return;
    }
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initializeGoogleSignIn();
    };
    document.body.appendChild(script);
  }, [token, initializeGoogleSignIn]);

  useEffect(() => {
    if (!token) return;
    apiFetch("/admin/products", {}, token).then(r => {
      if (r.status === 401 || r.status === 403) logout();
    }).catch(() => {});
  }, [token]);

  if (!token) {
    return (
      <div style={{ background:BG, minHeight:"60vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px 16px" }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <div style={{ background:BEIGE, borderRadius:4, padding:"40px 48px", maxWidth:420, width:"100%", textAlign:"center" }}>
          <p style={{ fontSize:11, letterSpacing:"4px", textTransform:"uppercase", color:GOLD, marginBottom:8 }}>Private</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:DARK, marginBottom:8 }}>Admin Panel</h2>
          <p style={{ fontSize:13, color:"#aaa", margin:"0 0 24px", lineHeight:1.7 }}>XIYORA internal management console.</p>
          <input type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" autoComplete="username" style={{ width:"100%", background:"#fff", border:`1px solid ${BEIGE}`, padding:"12px 14px", fontSize:14, borderRadius:3, fontFamily:"'Inter',sans-serif", marginBottom:10, outline:"none", boxSizing:"border-box" }} onKeyDown={e=>e.key==="Enter"&&login()} />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" autoComplete="current-password" style={{ width:"100%", background:"#fff", border:`1px solid ${BEIGE}`, padding:"12px 14px", fontSize:14, borderRadius:3, fontFamily:"'Inter',sans-serif", marginBottom:10, outline:"none", boxSizing:"border-box" }} onKeyDown={e=>e.key==="Enter"&&login()} />
          {loginErr && <p style={{ color:RED, fontSize:12, marginBottom:10, textAlign:"left", lineHeight:1.6 }}>{loginErr}</p>}
          {lastStatus > 0 && <p style={{ fontSize:10, color:"#bbb", marginBottom:8 }}>Last HTTP status: {lastStatus}</p>}
          <button onClick={login} disabled={loginLoading} style={{ width:"100%", background:GOLD, color:"#fff", border:"none", padding:"13px", fontSize:12, letterSpacing:"2px", textTransform:"uppercase", cursor:"pointer", borderRadius:2, fontFamily:"'Inter',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:12 }}>
            {loginLoading ? <Spinner/> : "Sign In"}
          </button>
          <div style={{ display:"flex", alignItems:"center", margin:"16px 0", gap:10 }}>
            <div style={{ flex:1, height:1, background:BEIGE }} />
            <span style={{ fontSize:11, color:"#bbb", textTransform:"uppercase", letterSpacing:"1px" }}>or</span>
            <div style={{ flex:1, height:1, background:BEIGE }} />
          </div>
          <div id="google-signin-btn" style={{ display:"flex", justifyContent:"center", marginBottom:20 }} />
          <AdminDiagnostics />
        </div>
      </div>
    );
  }


  const NAV = [
    { key:"products", label:"Products", icon:"📦" },
    { key:"site", label:"Site Content", icon:"🖼" },
    { key:"leads", label:"Leads", icon:"📋" },
  ] as const;

  return (
    <div style={{ background:BG, minHeight:"100vh" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @media(max-width:640px){
          .adm-layout{ flex-direction:column!important }
          .adm-sidebar{ width:100%!important; flex-direction:row!important; border-right:none!important; border-bottom:1px solid ${BEIGE}!important; padding:0!important; overflow-x:auto!important; flex-shrink:0!important }
          .adm-sidebar button{ border-left:none!important; border-bottom:3px solid transparent!important; padding:14px 16px!important; white-space:nowrap!important; flex-shrink:0 }
          .adm-sidebar button.active{ border-bottom-color:${GOLD}!important; background:#FAF8F4!important }
          .adm-main{ padding:20px 16px!important }
          .adm-topbar{ padding:0 16px!important; height:48px!important }
          .adm-topbar .brand-label{ display:none }
        }
      `}</style>
      {/* Top bar */}
      <div className="adm-topbar" style={{ background:DARK, padding:"0 28px", display:"flex", alignItems:"center", justifyContent:"space-between", height:56 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <span style={{ color:GOLD, fontFamily:"'Playfair Display',serif", fontSize:17, letterSpacing:"2px" }}>XIYORA</span>
          <span className="brand-label" style={{ color:"#555", fontSize:11, letterSpacing:"2px", textTransform:"uppercase" }}>Admin</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ color:"#555", fontSize:11 }}>Section: <strong style={{ color:GOLD }}>{NAV.find(n=>n.key===section)?.label}</strong></span>
          <button onClick={logout} style={{ background:"none", border:`1px solid #444`, color:"#aaa", padding:"7px 16px", fontSize:11, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer", borderRadius:2, fontFamily:"'Inter',sans-serif" }}>
            Sign Out
          </button>
        </div>
      </div>
      {/* Body */}
      <div className="adm-layout" style={{ display:"flex", minHeight:"calc(100vh - 56px)" }}>
        <aside className="adm-sidebar" style={{ width:210, background:"#fff", borderRight:`1px solid ${BEIGE}`, padding:"20px 0", flexShrink:0, display:"flex", flexDirection:"column" }}>
          {NAV.map(n => (
            <button key={n.key} onClick={() => setSection(n.key)} className={section===n.key?"active":""} style={{ width:"100%", background:section===n.key?"#FAF8F4":"none", border:"none", borderLeft:`3px solid ${section===n.key?GOLD:"transparent"}`, padding:"14px 20px", fontSize:13.5, fontFamily:"'Inter',sans-serif", cursor:"pointer", color:section===n.key?DARK:"#888", textAlign:"left", display:"flex", alignItems:"center", gap:12, transition:"all .15s", fontWeight:section===n.key?500:400 }}>
              <span style={{ fontSize:18 }}>{n.icon}</span>
              <div>
                <div>{n.label}</div>
                <div style={{ fontSize:10, color:section===n.key?"#aaa":"#bbb", marginTop:1 }}>
                  {n.key==="products"?"Manage listings":n.key==="site"?"Homepage & images":"Enquiries & leads"}
                </div>
              </div>
            </button>
          ))}
        </aside>
        <main className="adm-main" style={{ flex:1, padding:"28px 36px", overflowY:"auto" }}>
          {section==="products" && <ProductsPanel token={token} />}
          {section==="site" && (
            <SiteContentPanel
              token={token}
              BIZ={BIZ}
              HomeView={HomeView}
              AboutView={AboutView}
              SupplierView={SupplierView}
              ReviewsView={ReviewsView}
              SimplePage={SimplePage}
              B2BInquiryForm={B2BInquiryForm}
              forceRefresh={forceRefresh}
              products={products}
              currency={currency}
            />
          )}
          {section==="leads" && <LeadsPanel token={token} />}
        </main>
      </div>
    </div>
  );
}
