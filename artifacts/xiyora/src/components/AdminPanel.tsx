import { useState, useEffect, useCallback, useRef } from "react";

const API = "/api";
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

type SiteContent = { wa: string; email: string; ig: string; address: string; gstNote: string; heroImage: string; };

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

function Input({ value, onChange, placeholder, type = "text", style = {} }: any) {
  return <input type={type} value={value ?? ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width:"100%", background:"#fff", border:`1px solid ${BEIGE}`, padding:"9px 12px", fontSize:13, borderRadius:3, fontFamily:"'Inter',sans-serif", color:DARK, marginBottom:12, outline:"none", ...style }} onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = BEIGE} />;
}

function Textarea({ value, onChange, placeholder, rows = 3, style = {} }: any) {
  return <textarea value={value ?? ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ width:"100%", background:"#fff", border:`1px solid ${BEIGE}`, padding:"9px 12px", fontSize:13, borderRadius:3, fontFamily:"'Inter',sans-serif", color:DARK, marginBottom:12, resize:"vertical", outline:"none", ...style }} onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = BEIGE} />;
}

function Select({ value, onChange, options, style = {} }: any) {
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

function GalleryUploader({ token, slug, context, value, onChange }: { token:string; slug:string; context:string; value:string[]; onChange:(urls:string[])=>void }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const [dragOver, setDragOver] = useState<number|null>(null);
  const dragSrc = useRef<number|null>(null);
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
      if (data.success) onChange([...(value||[]), data.url]);
      else setErr(data.error || "Upload failed");
    } catch { setErr("Upload failed"); }
    setUploading(false);
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

  return (
    <div style={{ marginBottom:12 }}>
      <Label>Gallery Images <span style={{ fontSize:10, color:"#aaa", fontWeight:400 }}>(drag to reorder)</span></Label>
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
          {uploading ? <Spinner size={14}/> : "+ Add Image"}
        </Btn>
      </div>
      {err && <p style={{ color:RED, fontSize:11 }}>{err}</p>}
      <input ref={inputRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => { const f = e.target.files?.[0]; if(f) handleFile(f); e.target.value = ""; }} />
    </div>
  );
}

function ProductEditor({ product, token, onSave, onClose }: { product: Partial<Product>|null; token:string; onSave:(p:Product)=>void; onClose:()=>void }) {
  const [form, setForm] = useState<Partial<Product>>(product ? { ...product } : { ...EMPTY_PRODUCT });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const isNew = !product?.id;
  const set = (key: keyof Product) => (val: any) => setForm(f => ({ ...f, [key]: val }));

  const arrToText = (a?: string[]) => (a||[]).join("\n");
  const textToArr = (s: string) => s.split("\n").map(x=>x.trim()).filter(Boolean);

  const save = async () => {
    setSaving(true); setErr("");
    if (!form.slug || !form.name || !form.category) { setErr("Slug, Name and Category are required."); setSaving(false); return; }
    if (!form.priceINR && !form.priceUSD) { setErr("At least one price (INR or USD) is required."); setSaving(false); return; }
    try {
      const url = isNew ? "/admin/products" : `/admin/products/${form.slug}`;
      const method = isNew ? "POST" : "PUT";
      const payload = { ...form };
      const res = await apiFetch(url, { method, body: JSON.stringify(payload) }, token);
      const data = await res.json();
      if (data.success) onSave(data.product);
      else setErr(data.error || "Save failed");
    } catch { setErr("Network error"); }
    setSaving(false);
  };

  const specsToText = (s?: Record<string,string>) => Object.entries(s||{}).map(([k,v]) => `${k}: ${v}`).join("\n");
  const textToSpecs = (t: string) => {
    const r: Record<string,string> = {};
    for (const line of t.split("\n")) { const i = line.indexOf(":"); if (i>0) r[line.slice(0,i).trim()] = line.slice(i+1).trim(); }
    return r;
  };
  const variantsToText = (v?: any[]) => JSON.stringify(v||[], null, 2);
  const textToVariants = (t: string) => { try { return JSON.parse(t); } catch { return []; } };

  const [specsText, setSpecsText] = useState(specsToText(form.specs));
  const [variantsText, setVariantsText] = useState(variantsToText(form.variants));

  return (
    <div style={{ position:"fixed", inset:0, zIndex:2000, background:"rgba(0,0,0,.5)", overflowY:"auto", display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"24px 16px" }}>
      <div style={{ background:BG, borderRadius:6, width:"100%", maxWidth:700, padding:"32px", position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", fontSize:20, cursor:"pointer", color:"#888" }}>✕</button>
        <p style={{ fontSize:11, letterSpacing:"3px", textTransform:"uppercase", color:GOLD, marginBottom:6 }}>Admin</p>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:DARK, marginBottom:24 }}>{isNew ? "New Product" : "Edit Product"}</h2>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" }}>
          <div>
            <Label>Slug (URL ID) *</Label>
            <Input value={form.slug} onChange={(v: string) => set("slug")(v.toLowerCase().replace(/\s+/g,"-"))} placeholder="e.g. talalay-bread-pillow" />
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
        <Textarea value={variantsText} onChange={(v: string) => { setVariantsText(v); set("variants")(textToVariants(v)); }} rows={6} style={{ fontFamily:"monospace", fontSize:12 }} />

        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
          <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:13, color:DARK }}>
            <input type="checkbox" checked={form.visible ?? true} onChange={e => set("visible")(e.target.checked)} style={{ accentColor:GOLD, width:16, height:16 }} />
            Visible to customers
          </label>
        </div>

        {err && <p style={{ color:RED, fontSize:13, marginBottom:12 }}>{err}</p>}
        <div style={{ display:"flex", gap:12 }}>
          <Btn onClick={save} disabled={saving}>{saving ? <Spinner size={14}/> : "Save Product"}</Btn>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        </div>
      </div>
    </div>
  );
}

function ProductsPanel({ token }: { token: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Product>|null|"new">(null);
  const [deleting, setDeleting] = useState<string|null>(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await apiFetch("/admin/products", {}, token);
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [token]);

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
        <Btn onClick={() => setEditing("new")}>+ New Product</Btn>
      </div>
      {msg && <p style={{ color:"green", fontSize:13, marginBottom:12 }}>{msg}</p>}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setCatFilter(c)} style={{ background:catFilter===c?GOLD:"transparent", color:catFilter===c?"#fff":"#888", border:`1px solid ${catFilter===c?GOLD:BEIGE}`, padding:"5px 14px", fontSize:12, borderRadius:20, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>{c}</button>
        ))}
      </div>
      {loading ? <div style={{ textAlign:"center", padding:40 }}><Spinner/></div> : (
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

function SiteContentPanel({ token }: { token: string }) {
  const [form, setForm] = useState<SiteContent>({ wa:"", email:"", ig:"", address:"", gstNote:"", heroImage:"" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    apiFetch("/admin/site-content", {}, token).then(r=>r.json()).then(data => {
      setForm(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token]);

  const set = (k: keyof SiteContent) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true); setErr("");
    try {
      const res = await apiFetch("/admin/site-content", { method:"PUT", body:JSON.stringify(form) }, token);
      const data = await res.json();
      if (data.success) { setMsg("Saved ✓"); setTimeout(() => setMsg(""), 3000); }
      else setErr(data.error || "Save failed");
    } catch { setErr("Network error"); }
    setSaving(false);
  };

  if (loading) return <div style={{ textAlign:"center", padding:40 }}><Spinner/></div>;
  return (
    <div style={{ maxWidth:600 }}>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:DARK, marginBottom:24 }}>Site Content</h2>
      <Label>WhatsApp Number (with country code, no +)</Label>
      <Input value={form.wa} onChange={set("wa")} placeholder="917028311226" />
      <Label>Email</Label>
      <Input value={form.email} onChange={set("email")} />
      <Label>Instagram URL</Label>
      <Input value={form.ig} onChange={set("ig")} />
      <Label>Address</Label>
      <Textarea value={form.address} onChange={set("address")} rows={2} />
      <Label>GST Note</Label>
      <Textarea value={form.gstNote} onChange={set("gstNote")} rows={2} />
      <ImageUploader token={token} slug="homepage" context="site" label="Homepage Hero Image" value={form.heroImage} onChange={set("heroImage")} />
      {msg && <p style={{ color:"green", fontSize:13, marginBottom:12 }}>{msg}</p>}
      {err && <p style={{ color:RED, fontSize:13, marginBottom:12 }}>{err}</p>}
      <Btn onClick={save} disabled={saving}>{saving ? <Spinner size={14}/> : "Save Changes"}</Btn>
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

export default function AdminPanel() {
  const [token, setToken] = useState<string|null>(() => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginErr, setLoginErr] = useState("");
  const [section, setSection] = useState<"products"|"site"|"leads">("products");

  const login = async () => {
    if (!username || !password) { setLoginErr("Enter username and password."); return; }
    setLoginLoading(true); setLoginErr("");
    try {
      const res = await apiFetch("/admin/login", { method:"POST", body:JSON.stringify({ username, password }) });
      const data = await res.json();
      if (data.success && data.token) {
        try { localStorage.setItem(TOKEN_KEY, data.token); } catch {}
        setToken(data.token);
      } else setLoginErr(data.error || "Login failed");
    } catch { setLoginErr("Network error"); }
    setLoginLoading(false);
  };

  const logout = () => {
    try { localStorage.removeItem(TOKEN_KEY); } catch {}
    setToken(null);
  };

  if (!token) {
    return (
      <div style={{ background:BG, minHeight:"60vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <div style={{ background:BEIGE, borderRadius:4, padding:"40px 48px", maxWidth:400, width:"100%", textAlign:"center" }}>
          <p style={{ fontSize:11, letterSpacing:"4px", textTransform:"uppercase", color:GOLD, marginBottom:8 }}>Private</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:DARK, marginBottom:8 }}>Admin Panel</h2>
          <p style={{ fontSize:13, color:"#aaa", margin:"0 0 24px", lineHeight:1.7 }}>XIYORA internal management console.</p>
          <input type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" autoComplete="username" style={{ width:"100%", background:"#fff", border:`1px solid ${BEIGE}`, padding:"12px 14px", fontSize:14, borderRadius:3, fontFamily:"'Inter',sans-serif", marginBottom:10, outline:"none" }} onKeyDown={e=>e.key==="Enter"&&login()} />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" autoComplete="current-password" style={{ width:"100%", background:"#fff", border:`1px solid ${BEIGE}`, padding:"12px 14px", fontSize:14, borderRadius:3, fontFamily:"'Inter',sans-serif", marginBottom:10, outline:"none" }} onKeyDown={e=>e.key==="Enter"&&login()} />
          {loginErr && <p style={{ color:RED, fontSize:12, marginBottom:10 }}>{loginErr}</p>}
          <button onClick={login} disabled={loginLoading} style={{ width:"100%", background:GOLD, color:"#fff", border:"none", padding:"13px", fontSize:12, letterSpacing:"2px", textTransform:"uppercase", cursor:"pointer", borderRadius:2, fontFamily:"'Inter',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            {loginLoading ? <Spinner/> : "Sign In"}
          </button>
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
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ background:DARK, padding:"0 40px", display:"flex", alignItems:"center", justifyContent:"space-between", height:56 }}>
        <div style={{ display:"flex", alignItems:"center", gap:24 }}>
          <span style={{ color:GOLD, fontFamily:"'Playfair Display',serif", fontSize:16, letterSpacing:"2px" }}>XIYORA</span>
          <span style={{ color:"#666", fontSize:11, letterSpacing:"2px", textTransform:"uppercase" }}>Admin</span>
        </div>
        <button onClick={logout} style={{ background:"none", border:`1px solid #444`, color:"#aaa", padding:"6px 16px", fontSize:11, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer", borderRadius:2, fontFamily:"'Inter',sans-serif", transition:"all .2s" }} onMouseEnter={e=>(e.target as HTMLElement).style.borderColor=GOLD} onMouseLeave={e=>(e.target as HTMLElement).style.borderColor="#444"}>
          Sign Out
        </button>
      </div>
      <div style={{ display:"flex", minHeight:"calc(100vh - 56px)" }}>
        <aside style={{ width:200, background:"#fff", borderRight:`1px solid ${BEIGE}`, padding:"24px 0", flexShrink:0 }}>
          {NAV.map(n => (
            <button key={n.key} onClick={() => setSection(n.key)} style={{ width:"100%", background:section===n.key?"#FAF8F4":"none", border:"none", borderLeft:`3px solid ${section===n.key?GOLD:"transparent"}`, padding:"12px 20px", fontSize:13, fontFamily:"'Inter',sans-serif", cursor:"pointer", color:section===n.key?DARK:"#888", textAlign:"left", display:"flex", alignItems:"center", gap:10, transition:"all .15s" }}>
              <span>{n.icon}</span>{n.label}
            </button>
          ))}
        </aside>
        <main style={{ flex:1, padding:"32px 40px", overflowY:"auto" }}>
          {section==="products" && <ProductsPanel token={token} />}
          {section==="site" && <SiteContentPanel token={token} />}
          {section==="leads" && <LeadsPanel token={token} />}
        </main>
      </div>
    </div>
  );
}
