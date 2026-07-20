const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../artifacts/xiyora/src/App.tsx');
const adminPath = path.join(__dirname, '../artifacts/xiyora/src/components/AdminPanel.tsx');

let appContent = fs.readFileSync(appPath, 'utf8');
let adminContent = fs.readFileSync(adminPath, 'utf8');

console.log("Original App.tsx length:", appContent.length);
console.log("Original AdminPanel.tsx length:", adminContent.length);

// 1. In App.tsx: Update SH component to use generalSectionHeadingSize
const targetSH = `const st:React.CSSProperties={fontFamily:"'Playfair Display',serif",fontSize:size||"clamp(1.9rem,3.2vw,2.8rem)",fontWeight:400,color:dark?"#F0EBE3":C.dark,lineHeight:1.12,textAlign:center?"center":"left"};`;
const replacementSH = `const st:React.CSSProperties={fontFamily:"'Playfair Display',serif",fontSize:size||BIZ.generalSectionHeadingSize||"clamp(1.9rem,3.2vw,2.8rem)",fontWeight:400,color:dark?"#F0EBE3":C.dark,lineHeight:1.12,textAlign:center?"center":"left"};`;

if (appContent.includes(targetSH)) {
  appContent = appContent.replace(targetSH, replacementSH);
  console.log("✓ Updated SH component to use BIZ.generalSectionHeadingSize");
} else {
  console.log("✗ Failed to locate SH component target");
}

// 2. In App.tsx: Make About page natural latex section support stacked layout
const targetAboutNatural = `      {/* SECTION 2 — What Natural Latex Actually Means */}
      <section className="sec" style={{background:C.beige}}>
        <div className="container">
          <div className="grid-2" style={{gap:"clamp(36px,6vw,80px)",alignItems:"center"}}>
            <Reveal>
              <div className="x-frame" style={{borderRadius:6,overflow:"hidden",height:480}}>
                <img src="/assets/lux/hero-bedroom.webp" alt="Natural latex rubber tree tapping" loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={(e:any)=>{e.currentTarget.src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80";}}/>
              </div>
            </Reveal>
            <Reveal>
              <SL>{BIZ.aboutNaturalLabel || "What Natural Latex Actually Means"}</SL>
              <SH><span dangerouslySetInnerHTML={{__html: BIZ.aboutNaturalHeading || "From Rubber Tree<br/>to Bedroom"}} /></SH>
              {(() => {
                let paragraphs = [
                  "Natural latex begins with a small wound — a scored incision in the bark of Hevea brasiliensis, the Para rubber tree. The tree responds by producing a milky sap. Collected in cups hung at the base of each cut, this sap is the raw material for the world's finest sleep surfaces.",
                  "Dunlop processing — the original method, invented in 1929 — froths the sap, pours it into a mould, and vulcanises it. The result is a dense, durable core that holds its shape for decades. Talalay processing adds a vacuum and flash-freezing step, creating a more open-cell, breathable, and lighter foam — the choice for pillows and comfort layers.",
                  "Both are entirely natural. Neither contains the petroleum-derived compounds found in polyurethane foam. Both are inherently anti-microbial, dust-mite resistant, and hypoallergenic. The material does not off-gas. It does not compress permanently. It simply works — for decades."
                ];
                try { if (BIZ.aboutNaturalBody) paragraphs = JSON.parse(BIZ.aboutNaturalBody); } catch {}
                return paragraphs.map((pText, idx) => (
                  <p key={idx} style={{fontSize:14.5,color:C.ink,lineHeight:1.9,marginBottom:idx === paragraphs.length - 1 ? 0 : 16}} dangerouslySetInnerHTML={{__html: pText}} />
                ));
              })()}
            </Reveal>
          </div>
        </div>
      </section>`;

const replacementAboutNatural = `      {/* SECTION 2 — What Natural Latex Actually Means */}
      <section className="sec" style={{background:C.beige}}>
        <div className="container">
          {(() => {
            const isStoryStacked = BIZ.aboutStoryLayout === "stacked";
            return (
              <div className={isStoryStacked ? "" : "grid-2"} style={isStoryStacked ? { display: "block" } : { gap: "clamp(36px,6vw,80px)", alignItems: "center" }}>
                <Reveal>
                  <div className="x-frame" style={{borderRadius:6,overflow: "hidden", height: isStoryStacked ? 350 : 480, marginBottom: isStoryStacked ? 24 : 0}}>
                    <img src="/assets/lux/hero-bedroom.webp" alt="Natural latex rubber tree tapping" loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={(e:any)=>{e.currentTarget.src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80";}}/>
                  </div>
                </Reveal>
                <Reveal>
                  <SL>{BIZ.aboutNaturalLabel || "What Natural Latex Actually Means"}</SL>
                  <SH><span dangerouslySetInnerHTML={{__html: BIZ.aboutNaturalHeading || "From Rubber Tree<br/>to Bedroom"}} /></SH>
                  {(() => {
                    let paragraphs = [
                      "Natural latex begins with a small wound — a scored incision in the bark of Hevea brasiliensis, the Para rubber tree. The tree responds by producing a milky sap. Collected in cups hung at the base of each cut, this sap is the raw material for the world's finest sleep surfaces.",
                      "Dunlop processing — the original method, invented in 1929 — froths the sap, pours it into a mould, and vulcanises it. The result is a dense, durable core that holds its shape for decades. Talalay processing adds a vacuum and flash-freezing step, creating a more open-cell, breathable, and lighter foam — the choice for pillows and comfort layers.",
                      "Both are entirely natural. Neither contains the petroleum-derived compounds found in polyurethane foam. Both are inherently anti-microbial, dust-mite resistant, and hypoallergenic. The material does not off-gas. It does not compress permanently. It simply works — for decades."
                    ];
                    try { if (BIZ.aboutNaturalBody) paragraphs = JSON.parse(BIZ.aboutNaturalBody); } catch {}
                    return paragraphs.map((pText, idx) => (
                      <p key={idx} style={{fontSize:14.5,color:C.ink,lineHeight:1.9,marginBottom:idx === paragraphs.length - 1 ? 0 : 16}} dangerouslySetInnerHTML={{__html: pText}} />
                    ));
                  })()}
                </Reveal>
              </div>
            );
          })()}
        </div>
      </section>`;

// Let's standardise carriage returns for comparison
const normalise = s => s.replace(/\r\n/g, '\n').trim();

if (normalise(appContent).includes(normalise(targetAboutNatural))) {
  // Replace using a normalised-tolerant regex or direct replacement of normalised text
  appContent = appContent.replace(new RegExp(targetAboutNatural.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')), replacementAboutNatural);
  console.log("✓ Updated About natural latex story to be dynamically stacked or split");
} else {
  console.log("✗ Failed to locate About page natural latex section");
}

// 3. In App.tsx: Make trust ticker, B2B stats band, Buyer best fit, Latex story, Why choose, Process, Documents dynamic
appContent = appContent.replace(
  `      {/* HERO — DARK ORNATE (reference-faithful black-lacquer + gold) */}
      <DarkHomeHero onCatalog={onCatalog} onSupplier={onSupplier}/>
      {/* TRUST TICKER BAR — brief spec */}
      <section style={`,
  `      {/* HERO — DARK ORNATE (reference-faithful black-lacquer + gold) */}
      <DarkHomeHero onCatalog={onCatalog} onSupplier={onSupplier}/>
      {/* TRUST TICKER BAR — brief spec */}
      {BIZ.showTrustTicker !== "false" && <section style={`
);

appContent = appContent.replace(
  `            <span key={i} style={{fontSize:10.5,letterSpacing:"1.2px",textTransform:"uppercase",color:i%2===0?"#E2D5BA":"#C9A876",padding:"3px 18px",borderRight:"1px solid rgba(200,169,126,.18)",whiteSpace:"nowrap"}}>{t}</span>
          ))}
        </div>
      </section>
      {/* QUICK-NAV BAND (dark, ornate) */}`,
  `            <span key={i} style={{fontSize:10.5,letterSpacing:"1.2px",textTransform:"uppercase",color:i%2===0?"#E2D5BA":"#C9A876",padding:"3px 18px",borderRight:"1px solid rgba(200,169,126,.18)",whiteSpace:"nowrap"}}>{t}</span>
          ))}
        </div>
      </section>}
      {/* QUICK-NAV BAND (dark, ornate) */}`
);

appContent = appContent.replace(
  `      {/* B2B STATS BAND */}
      <B2BStatsBand />`,
  `      {/* B2B STATS BAND */}
      {BIZ.showB2BStats !== "false" && <B2BStatsBand />}`
);

appContent = appContent.replace(
  `      {/* BUYER BEST-FIT SELECTOR */}
      <BuyerBestFit onCatFilter={onCatFilter} onCatalog={onCatalog} onSupplier={onSupplier} onInquire={onInquire}/>`,
  `      {/* BUYER BEST-FIT SELECTOR */}
      {BIZ.showBuyerBestFit !== "false" && <BuyerBestFit onCatFilter={onCatFilter} onCatalog={onCatalog} onSupplier={onSupplier} onInquire={onInquire}/>}`
);

appContent = appContent.replace(
  `      {/* LATEX STORY — dark cinematic */}
      <LatexStoryPanel onCatalog={onCatalog}/>`,
  `      {/* LATEX STORY — dark cinematic */}
      {BIZ.showLatexStory !== "false" && <LatexStoryPanel onCatalog={onCatalog}/>}`
);

// Why choose
appContent = appContent.replace(
  `      {/* WHY XIYORA */}
      <section className="sec paper ink-wash" style={{position:"relative"}}>`,
  `      {/* WHY XIYORA */}
      {BIZ.showWhyXiyora !== "false" && <section className="sec paper ink-wash" style={{position:"relative"}}>`
);
// We need to close it. Let's find the closing section of Why Choose
appContent = appContent.replace(
  `            </Reveal>
          </div>
        </div>
      </section>
      {/* PROCESS */}`,
  `            </Reveal>
          </div>
        </div>
      </section>}
      {/* PROCESS */}`
);

// Process light band
appContent = appContent.replace(
  `      {/* PROCESS */}
      <section className="sec" style={{background:C.beige}}>`,
  `      {/* PROCESS */}
      {BIZ.showProcessSteps !== "false" && <section className="sec" style={{background:C.beige}}>`
);
appContent = appContent.replace(
  `            ))}
          </div>
        </div>
      </section>
      {/* DOCUMENTS SECTION */}`,
  `            ))}
          </div>
        </div>
      </section>}
      {/* DOCUMENTS SECTION */}`
);

// Documents section
appContent = appContent.replace(
  `      {/* DOCUMENTS SECTION */}
      <section className="sec" style={{background:C.beige}}>`,
  `      {/* DOCUMENTS SECTION */}
      {BIZ.showDocuments !== "false" && <section className="sec" style={{background:C.beige}}>`
);
// We also want to update the documents grid class to grid-3
appContent = appContent.replace(
  `<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>`,
  `<div className="grid-3" style={{gap:18}}>`
);
// And close documents section
appContent = appContent.replace(
  `                <div style={{marginTop:"auto",paddingTop:12,borderTop:\`1px solid \${C.sand}\`,display:"flex",alignItems:"center",gap:7}}>
                  <span style={{fontSize:11,color:C.gold,fontWeight:600,letterSpacing:".5px",textTransform:"uppercase"}}>Request Original</span>
                  <span style={{fontSize:14,color:C.gold}}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>`,
  `                <div style={{marginTop:"auto",paddingTop:12,borderTop:\`1px solid \${C.sand}\`,display:"flex",alignItems:"center",gap:7}}>
                  <span style={{fontSize:11,color:C.gold,fontWeight:600,letterSpacing:".5px",textTransform:"uppercase"}}>Request Original</span>
                  <span style={{fontSize:14,color:C.gold}}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>}`
);

console.log("✓ Dynamic visibility wrapped for all homepage sections");

// 4. In luxe.css: make grids stack at 1024px instead of 900px, make B2B features stack at 480px
const cssPath = path.join(__dirname, '../artifacts/xiyora/src/styles/luxe.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');
cssContent = cssContent.replace(
  `@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}`,
  `@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 560px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}`
);

// Append grid stack overrides to the end of luxe.css
cssContent += `
/* ── RESPONSIVE OVERRIDES FOR TOP resolutions ── */
@media (max-width: 1024px) {
  .lux-hero-grid {
    grid-template-columns: 1fr !important;
  }
  .lux-hero-photo-r {
    order: -1 !important;
    min-height: 330px !important;
  }
  .biz-grid {
    grid-template-columns: 1fr !important;
    justify-items: center;
    text-align: center;
  }
  .biz-feats {
    justify-content: center;
  }
}
@media (max-width: 560px) {
  .biz-feats {
    grid-template-columns: 1fr !important;
  }
}
`;
fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log("✓ Updated luxe.css responsive grid overrides");


// 5. In AdminPanel.tsx: Add the resolutions list and viewport dynamic scaling
const resolutionsDef = `
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
`;

adminContent = resolutionsDef + adminContent;

// Add selectedRes hook state inside SiteContentPanel
const hookTarget = `  const [activeAccordion, setActiveAccordion] = useState("header");
  const [previewTab, setPreviewTab] = useState("home");`;

const hookReplacement = `  const [activeAccordion, setActiveAccordion] = useState("header");
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

  const scale = Math.min((containerWidth - 32) / selectedRes.w, 1);`;

adminContent = adminContent.replace(hookTarget, hookReplacement);
console.log("✓ Added ResizeObserver and resolution hooks to SiteContentPanel");

// Add layout customization settings Accordion item in AdminPanel.tsx
const lastAccordionItem = `            <PairListEditor value={draft.whyXiyoraCards} onChange={(v) => setKey("whyXiyoraCards", v)} label="Why choose XIYORA Cards" keyPlaceholder="Title" valPlaceholder="Description" hasIcon={true} />
            <PairListEditor value={draft.howItWorksSteps} onChange={(v) => setKey("howItWorksSteps", v)} label="Homepage Sourcing Process Steps" keyPlaceholder="Title" valPlaceholder="Description" hasIcon={true} />
          </AccordionItem>`;

const replacementAccordionItem = `            <PairListEditor value={draft.whyXiyoraCards} onChange={(v) => setKey("whyXiyoraCards", v)} label="Why choose XIYORA Cards" keyPlaceholder="Title" valPlaceholder="Description" hasIcon={true} />
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
          </AccordionItem>`;

adminContent = adminContent.replace(lastAccordionItem, replacementAccordionItem);
console.log("✓ Added accordion panel for Layout Sizing and Visibility Customizer");

// Update the live visual preview container to show resolution selector & scale
const previewPaneTarget = `      {/* RIGHT: Live Visual Preview Pane */}
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

        {/* Render View inside scrollable wrapper */}
        <div style={{ flex: 1, overflowY: "auto", position: "relative", background: "#fff" }}>`;

const previewPaneReplacement = `      {/* RIGHT: Live Visual Preview Pane */}
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
        <div style={{ padding: "10px 14px", background: "#252523", borderBottom: \`1px solid \${BEIGE}\`, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", flexShrink: 0 }}>
          <span style={{ fontSize: 10, color: GOLD, letterSpacing: "1.2px", textTransform: "uppercase", fontWeight: 600 }}>Simulated Device:</span>
          <select
            value={selectedRes.w + "x" + selectedRes.h}
            onChange={(e) => {
              const val = e.target.value;
              const res = RESOLUTIONS.find(r => (r.w + "x" + r.h) === val);
              if (res) setSelectedRes(res);
            }}
            style={{ background: "#333330", color: "#FAF6EE", border: \`1px solid \${GOLD}\`, padding: "4px 8px", fontSize: 11, borderRadius: 3, outline: "none", fontFamily: "'Inter', sans-serif" }}
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
              transform: \`scale(\${scale})\`,
              transformOrigin: "top center",
              position: "relative",
              overflowY: "auto",
              overflowX: "hidden",
              boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
              borderRadius: selectedRes.type === "mobile" ? "24px" : "4px",
              border: selectedRes.type === "mobile" ? "12px solid #1c1a17" : "6px solid #2d2d2a",
              flexShrink: 0
            }}>`;

adminContent = adminContent.replace(previewPaneTarget, previewPaneReplacement);

// Close the device frame before the end of the container div
const previewPaneEndTarget = `          {previewTab === "shipping" && (
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
      </div>`;

const previewPaneEndReplacement = `          {previewTab === "shipping" && (
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
      </div>`;

adminContent = adminContent.replace(previewPaneEndTarget, previewPaneEndReplacement);
console.log("✓ Wrapped preview elements inside scaled device frame wrapper");

fs.writeFileSync(appPath, appContent, 'utf8');
fs.writeFileSync(adminPath, adminContent, 'utf8');

console.log("Migration complete!");
