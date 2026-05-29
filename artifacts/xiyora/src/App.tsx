import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

/* ─── BUSINESS INFO ─────────────────────────────────────── */
const BIZ = {
  wa: "917028311226",
  email: "xiyatosaanvi@gmail.com",
  ig: "https://www.instagram.com/xiyora.zi/",
  address: "Yogesh Nagar, Section 25, Near 12 No School, Ulhasnagar – 421004, Thane, Maharashtra, India",
  gstNote: "Formal tax documentation can be provided where applicable once GST registration is complete.",
};

const API_BASE = "/api";
async function apiPost(endpoint: string, data: Record<string, string | undefined>) {
  const url = `${API_BASE}${endpoint}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    clearTimeout(timer);
    let json: any = null;
    try {
      json = await res.json();
    } catch {
      json = null;
    }
    if (!res.ok) {
      console.warn("[XIYORA] API error", { url, status: res.status, body: json });
      return (
        json ?? {
          success: false,
          error: `Server unavailable (${res.status}). Please use WhatsApp or try again.`,
        }
      );
    }
    return json ?? { success: true };
  } catch (err) {
    clearTimeout(timer);
    console.warn("[XIYORA] API request failed", { url, error: String(err) });
    return {
      success: false,
      error: "Could not reach the server. Please use WhatsApp or try again.",
    };
  }
}

/* ─── PRODUCTS ───────────────────────────────────────────── */
const PRODUCTS = [
  {
    id:"talalay-bread-pillow",name:"Talalay Bread Pillow",
    category:"Pillows",latexType:"Talalay",latexContent:"93% natural latex",
    tag:"Most Popular",badge:"2nd-Generation Talalay",
    headline:"Classic Talalay Comfort, Made for Everyday Luxury",
    shortDesc:"A refined bread-shaped Talalay latex pillow — familiar silhouette, premium breathable comfort.",
    description:"The Talalay Bread Pillow is the most universal product in the collection. It keeps the classic pillow shape customers already trust, while upgrading the comfort story with breathable Talalay latex, steady rebound, and a refined sleep surface.",
    highlights:["Open-cell Talalay structure for cooler, more breathable feel","Naturally springy latex — holds shape without fluffing","Traditional rectangular design with broad retail appeal","Multiple sizes for different sleep preferences"],
    specs:{"Process":"Talalay","Latex Content":"93% natural latex","Sizes":"60×40×14 cm | 70×40×14 cm | 85×40×15 cm","Weight":"1.0 – 1.6 kg by size","Custom Sizes":"Available on request","Certificates":"Available on request"},
    sizes:["60×40×14 cm (1.0 kg)","70×40×14 cm (1.25 kg)","85×40×15 cm (1.6 kg)"],
    useCases:["Premium hotel pillow collections","Home bedroom upgrades","B2B retail & wholesale"],
    gallery:["/assets/products/talalay-bread-pillow/talalay-bread-pillow-1.jpg","/assets/products/talalay-bread-pillow/talalay-bread-pillow-2.jpg","/assets/products/talalay-bread-pillow/talalay-bread-pillow-3.jpg","/assets/products/talalay-bread-pillow/talalay-bread-pillow-4.jpg","/assets/products/talalay-bread-pillow/talalay-bread-pillow-5.jpg","/assets/products/talalay-bread-pillow/talalay-bread-pillow-6.jpg","/assets/products/talalay-bread-pillow/talalay-bread-pillow-7.jpg"],
    priceINR:"₹3,200 – ₹4,600*",priceUSD:"$39 – $56*",
    priceNote:"* Indicative landed price. Final confirmed after city, quantity & live freight.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight from China: ~25–35 days.",
    variants:[
      {label:"Standard — 60×40×14 cm (1.0 kg)",sku:"BXT1001-1",priceINR:"₹3,200",priceUSD:"$39"},
      {label:"Queen   — 70×40×14 cm (1.25 kg)",sku:"BXT1001-2",priceINR:"₹3,900",priceUSD:"$47"},
      {label:"King     — 85×40×15 cm (1.6 kg)",sku:"BXT1001-3",priceINR:"₹4,600",priceUSD:"$56"},
    ],
  },
  {
    id:"talalay-contour-pillow",name:"Talalay Contour Pillow",
    category:"Pillows",latexType:"Talalay",latexContent:"93% natural latex",
    tag:"Ergonomic",badge:"2nd-Generation Talalay",
    headline:"Ergonomic Neck Support with Premium Talalay Feel",
    shortDesc:"Wave-shaped Talalay latex pillow designed to support the natural curve of head and neck.",
    description:"The premium ergonomic option in the range. Its sculpted wave shape provides better neck positioning and comfortable head cradling. Designed for side and back sleepers who want structure without sacrificing comfort.",
    highlights:["Dual-height contour profile for flexible comfort","Breathable Talalay latex for fresher sleep surface","Smooth, resilient rebound after pressure","Supports natural head and neck positioning"],
    specs:{"Process":"Talalay","Latex Content":"93% natural latex","Sizes":"60×40×8/10 cm | 60×40×10/12 cm","Custom Sizes":"Available on request"},
    sizes:["60×40×8/10 cm (0.9 kg)","60×40×10/12 cm (1.0 kg)"],
    useCases:["Side and back sleepers","Ergonomic bedding collections","Hotel premium bedding"],
    gallery:["/assets/products/talalay-contour-pillow/talalay-contour-pillow-1.jpg","/assets/products/talalay-contour-pillow/talalay-contour-pillow-2.jpg","/assets/products/talalay-contour-pillow/talalay-contour-pillow-3.jpg","/assets/products/talalay-contour-pillow/talalay-contour-pillow-4.jpg","/assets/products/talalay-contour-pillow/talalay-contour-pillow-5.jpg","/assets/products/talalay-contour-pillow/talalay-contour-pillow-6.jpg","/assets/products/talalay-contour-pillow/talalay-contour-pillow-7.jpg"],
    priceINR:"₹3,200 – ₹3,600*",priceUSD:"$39 – $44*",
    priceNote:"* Indicative landed price. Final confirmed after city, quantity & live freight.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"Low Profile — 60×40×8/10 cm (0.9 kg)",sku:"BXT2002-1",priceINR:"₹3,200",priceUSD:"$39"},
      {label:"Mid Profile — 60×40×10/12 cm (1.0 kg)",sku:"BXT2002-2",priceINR:"₹3,600",priceUSD:"$44"},
    ],
  },
  {
    id:"talalay-junior-pillow",name:"Talalay Junior Pillow",
    category:"Pillows",latexType:"Talalay",latexContent:"93% natural latex",
    tag:"Junior",badge:"2nd-Generation Talalay",
    headline:"Gentle Talalay Support for Growing Sleepers",
    shortDesc:"A smaller-format Talalay latex pillow for children and junior bedding collections.",
    description:"The Talalay Junior Pillow gives the collection a family-friendly premium product. Focus on gentle comfort, breathability, and appropriate sizing for children.",
    highlights:["Lower height options suitable for younger users","Soft and breathable Talalay latex comfort","Compact sizes for children's beds and travel","Premium look for family-oriented collections"],
    specs:{"Process":"Talalay","Latex Content":"93% natural latex","Sizes":"40×25×3/5 cm | 50×30×3/5 cm | 55×35×5/7 cm"},
    sizes:["40×25×3/5 cm (0.25 kg)","50×30×3/5 cm (0.35 kg)","55×35×5/7 cm (0.45 kg)"],
    useCases:["Kids' bedding sections","Premium family sleep collections","Retailers needing a junior pillow option"],
    gallery:["/assets/products/talalay-junior-pillow/talalay-junior-pillow-1.jpg","/assets/products/talalay-junior-pillow/talalay-junior-pillow-2.jpg","/assets/products/talalay-junior-pillow/talalay-junior-pillow-3.jpg","/assets/products/talalay-junior-pillow/talalay-junior-pillow-4.jpg","/assets/products/talalay-junior-pillow/talalay-junior-pillow-5.jpg","/assets/products/talalay-junior-pillow/talalay-junior-pillow-6.jpg"],
    priceINR:"₹2,000 – ₹2,600*",priceUSD:"$24 – $32*",
    priceNote:"* Indicative landed price. Final confirmed after city, quantity & live freight.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"Small — 40×25×3/5 cm (0.25 kg)",sku:"BXT2001-1",priceINR:"₹2,000",priceUSD:"$24"},
      {label:"Medium — 50×30×3/5 cm (0.35 kg)",sku:"BXT2001-2",priceINR:"₹2,300",priceUSD:"$28"},
      {label:"Large — 55×35×5/7 cm (0.45 kg)",sku:"BXT2001-3",priceINR:"₹2,600",priceUSD:"$32"},
    ],
  },
  {
    id:"bumpy-massage-pillow",name:"Bumpy Massage Pillow",
    category:"Pillows",latexType:"Dunlop",latexContent:"80%/90% natural latex",
    tag:"Tactile Comfort",badge:"B2B Competitive",
    headline:"Bumpy-Textured Latex Pillow for Relaxed Support",
    shortDesc:"A bumpy massage-feel latex pillow with a contour profile and breathable construction.",
    description:"A tactile comfort pillow with a distinctive raised granule-style texture. Creates a soothing, textured feel that stands out on any product page.",
    highlights:["Raised granule-style texture for soothing feel","Contour profile for head and neck support","Breathable latex design","Memorable tactile product story"],
    specs:{"Process":"Dunlop","Latex Content":"80%/90% options","Sizes":"60×40×8/10 cm | 60×40×10/12 cm"},
    sizes:["60×40×8/10 cm","60×40×10/12 cm"],
    useCases:["Texture-loving buyers","Ergonomic pillow pages","Premium specialty pillow range"],
    gallery:["/assets/products/bumpy-massage-pillow/bumpy-massage-pillow-1.jpg"],
    priceINR:"₹1,600 – ₹2,800*",priceUSD:"$19 – $34*",
    priceNote:"* Indicative range. Final price confirmed after city, quantity & shipping.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"60×40×8/10 cm — 80% Natural Latex",sku:"BXD-BMP-1",priceINR:"₹1,600",priceUSD:"$19"},
      {label:"60×40×8/10 cm — 90% Natural Latex",sku:"BXD-BMP-2",priceINR:"₹2,200",priceUSD:"$27"},
      {label:"60×40×10/12 cm — 80% Natural Latex",sku:"BXD-BMP-3",priceINR:"₹2,200",priceUSD:"$27"},
      {label:"60×40×10/12 cm — 90% Natural Latex",sku:"BXD-BMP-4",priceINR:"₹2,800",priceUSD:"$34"},
    ],
  },
  {
    id:"dunlop-bone-pillow",name:"Dunlop Bone Pillow",
    category:"Pillows",latexType:"Dunlop",latexContent:"80%/90% natural latex",
    tag:"Compact",badge:"B2B Competitive",
    headline:"Bone-Shaped Latex Support Pillow",
    shortDesc:"A compact bone-shaped Dunlop latex pillow for travel, neck support, and decorative comfort use.",
    description:"Perfect for sofa, car, travel, and gifting bundles. The unique shape creates a memorable product story.",
    highlights:["Compact supportive bone shape","Useful for neck, waist, or decorative support","Easy add-on product for bundles","Memorable shape for buyers"],
    specs:{"Process":"Dunlop","Latex Content":"80%/90% options","Size":"36×24×10 cm"},
    sizes:["36×24×10 cm"],
    useCases:["Travel support","Sofa accessories","Compact comfort products"],
    gallery:["/assets/products/dunlop-bone-pillow/dunlop-bone-pillow-1.jpg"],
    priceINR:"₹1,200 – ₹2,000*",priceUSD:"$14 – $24*",
    priceNote:"* Indicative range.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"36×24×10 cm — 80% Natural Latex",sku:"BXD-DNB-1",priceINR:"₹1,200",priceUSD:"$14"},
      {label:"36×24×10 cm — 90% Natural Latex",sku:"BXD-DNB-2",priceINR:"₹2,000",priceUSD:"$24"},
    ],
  },
  {
    id:"dunlop-bread-pillow",name:"Dunlop Bread Pillow",
    category:"Pillows",latexType:"Dunlop",latexContent:"80%/90% natural latex",
    tag:"Value Luxury",badge:"B2B Competitive",
    headline:"Classic Dunlop Latex Pillow for Everyday Comfort",
    shortDesc:"Familiar bread-shaped Dunlop latex pillow — traditional shape, supportive feel, accessible luxury.",
    description:"The value-premium pillow in the range. Available in 80% or 90% latex content with multiple height options.",
    highlights:["Traditional rectangular design with broad retail appeal","Dunlop latex support — firmer and more grounded feel","Multiple height options","Available in 80% or 90% latex content"],
    specs:{"Process":"Dunlop","Latex Content":"80%/90% options","Sizes":"60×40×5 cm | 60×40×10 cm | 70×40×10 cm | 70×40×13 cm"},
    sizes:["60×40×5 cm","60×40×10 cm","70×40×10 cm","70×40×13 cm"],
    useCases:["Hotel guest rooms","Value-premium home bedding","Retail pillow collections"],
    gallery:["/assets/products/dunlop-bread-pillow/dunlop-bread-pillow-1.jpg"],
    priceINR:"₹1,900 – ₹3,500*",priceUSD:"$23 – $43*",
    priceNote:"* Indicative landed price. Final confirmed after city, quantity & live freight.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"60×40×5 cm — 90% latex",sku:"BXD1001-1",priceINR:"₹1,900",priceUSD:"$23"},
      {label:"60×40×10 cm — 80% latex",sku:"BXD1001-2",priceINR:"₹2,300",priceUSD:"$28"},
      {label:"60×40×10 cm — 90% latex",sku:"BXD1001-3",priceINR:"₹2,700",priceUSD:"$33"},
      {label:"70×40×10 cm — 80% latex",sku:"BXD1001-4",priceINR:"₹2,500",priceUSD:"$30"},
      {label:"70×40×10 cm — 90% latex",sku:"BXD1001-5",priceINR:"₹2,900",priceUSD:"$35"},
      {label:"70×40×13 cm — 80% latex",sku:"BXD1001-6",priceINR:"₹3,100",priceUSD:"$38"},
      {label:"70×40×13 cm — 90% latex",sku:"BXD1001-7",priceINR:"₹3,500",priceUSD:"$43"},
    ],
  },
  {
    id:"dunlop-butterfly-pillow",name:"Dunlop Butterfly Pillow",
    category:"Pillows",latexType:"Dunlop",latexContent:"80%/90% natural latex",
    tag:"Ergonomic Shape",badge:"B2B Competitive",
    headline:"Butterfly-Shaped Latex Support Pillow",
    shortDesc:"A shaped Dunlop latex pillow with zoned support for the head, neck, and shoulders.",
    description:"A specialty ergonomic product with butterfly-inspired support zones.",
    highlights:["Butterfly-inspired support zones","Designed for head, neck, and shoulder comfort","Distinctive premium shape"],
    specs:{"Process":"Dunlop","Latex Content":"80%/90% options","Size":"60×33×7/11 cm"},
    sizes:["60×33×7/11 cm"],
    useCases:["Ergonomic pillow buyers","Customers who want shaped support"],
    gallery:["/assets/products/dunlop-butterfly-pillow/dunlop-butterfly-pillow-1.jpg"],
    priceINR:"₹1,400 – ₹2,400*",priceUSD:"$17 – $29*",
    priceNote:"* Indicative range.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"60×33×7/11 cm — 80% Natural Latex",sku:"BXD-DBF-1",priceINR:"₹1,400",priceUSD:"$17"},
      {label:"60×33×7/11 cm — 90% Natural Latex",sku:"BXD-DBF-2",priceINR:"₹2,400",priceUSD:"$29"},
    ],
  },
  {
    id:"dunlop-cloud-pillow",name:"Dunlop Cloud Pillow",
    category:"Pillows",latexType:"Dunlop",latexContent:"80%/90% natural latex",
    tag:"Textured",badge:"B2B Competitive",
    headline:"Cloud-Textured Dunlop Latex Pillow",
    shortDesc:"A textured latex pillow with a soft, cloud-like surface feel and supportive Dunlop latex core.",
    description:"The surface texture gives it a strong visual identity. Use when you want the product range to feel differentiated.",
    highlights:["Textured surface for a distinctive comfort feel","Supportive latex structure","Premium alternative to ordinary flat pillows"],
    specs:{"Process":"Dunlop","Latex Content":"80%/90% options","Size":"60×38×8 cm"},
    sizes:["60×38×8 cm"],
    useCases:["Massage feel seekers","Back/side comfort buyers","Unique product pages"],
    gallery:["/assets/products/dunlop-cloud-pillow/dunlop-cloud-pillow-1.jpg"],
    priceINR:"₹1,400 – ₹2,400*",priceUSD:"$17 – $29*",
    priceNote:"* Indicative range.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"60×38×8 cm — 80% Natural Latex",sku:"BXD-DCP-1",priceINR:"₹1,400",priceUSD:"$17"},
      {label:"60×38×8 cm — 90% Natural Latex",sku:"BXD-DCP-2",priceINR:"₹2,400",priceUSD:"$29"},
    ],
  },
  {
    id:"dunlop-contour-pillow",name:"Dunlop Contour Pillow",
    category:"Pillows",latexType:"Dunlop",latexContent:"80%/90% natural latex",
    tag:"Neck Support",badge:"B2B Competitive",
    headline:"Dunlop Contour Pillow for Balanced Neck Comfort",
    shortDesc:"Sculpted Dunlop latex pillow designed to follow the natural curve of head and neck.",
    description:"The standard ergonomic Dunlop pillow for side and back sleepers who prefer a more structured, supportive feel.",
    highlights:["Balanced dual-height contour profile","Supportive Dunlop latex response","Perforated latex design for better airflow"],
    specs:{"Process":"Dunlop","Latex Content":"80%/90% options","Sizes":"60×40×8/10 cm | 60×40×10/12 cm"},
    sizes:["60×40×8/10 cm","60×40×10/12 cm"],
    useCases:["Side and back sleepers","Ergonomic bedding retail","Hotel collections"],
    gallery:["/assets/products/dunlop-contour-pillow/dunlop-contour-pillow-1.jpg"],
    priceINR:"₹1,900 – ₹2,800*",priceUSD:"$23 – $34*",
    priceNote:"* Indicative landed price. Final confirmed after city, quantity & live freight.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"60×40×8/10 cm — 80% latex",sku:"BXD2001-1",priceINR:"₹1,900",priceUSD:"$23"},
      {label:"60×40×8/10 cm — 90% latex",sku:"BXD2001-2",priceINR:"₹2,200",priceUSD:"$27"},
      {label:"60×40×10/12 cm — 80% latex",sku:"BXD2001-3",priceINR:"₹2,200",priceUSD:"$27"},
      {label:"60×40×10/12 cm — 90% latex",sku:"BXD2001-4",priceINR:"₹2,800",priceUSD:"$34"},
    ],
  },
  {
    id:"dunlop-contour-pillow-high",name:"Dunlop Contour Pillow High",
    category:"Pillows",latexType:"Dunlop",latexContent:"80%/90% natural latex",
    tag:"High Profile",badge:"B2B Competitive",
    headline:"High-Profile Dunlop Contour Pillow for Extra Support",
    shortDesc:"A taller contour Dunlop latex pillow for elevated head and neck positioning.",
    description:"The high-profile variant of the contour pillow. Best for shoulder sleepers, broader frames, or customers who prefer an elevated sleep position.",
    highlights:["Higher loft profile for elevated support","Ergonomic contour shape","Firm Dunlop latex response"],
    specs:{"Process":"Dunlop","Latex Content":"80%/90% options","Size":"60×40×10/14 cm"},
    sizes:["60×40×10/14 cm"],
    useCases:["Shoulder-width sleepers","Firmer support seekers"],
    gallery:["/assets/products/dunlop-contour-pillow-high/dunlop-contour-pillow-high-1.jpg"],
    priceINR:"₹1,600 – ₹2,800*",priceUSD:"$19 – $34*",
    priceNote:"* Indicative range.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"60×40×10/14 cm — 80% Natural Latex",sku:"BXD-DCH-1",priceINR:"₹1,600",priceUSD:"$19"},
      {label:"60×40×10/14 cm — 90% Natural Latex",sku:"BXD-DCH-2",priceINR:"₹2,800",priceUSD:"$34"},
    ],
  },
  {
    id:"dunlop-contour-pillow-junior",name:"Dunlop Contour Pillow Junior",
    category:"Pillows",latexType:"Dunlop",latexContent:"80%/90% natural latex",
    tag:"Junior",badge:"B2B Competitive",
    headline:"Junior Contour Pillow for Growing Sleepers",
    shortDesc:"A smaller contour Dunlop latex pillow for children and young adults.",
    description:"Designed specifically for children and young adults. The contour shape with lower loft provides appropriate support in a compact format.",
    highlights:["Appropriate loft for children","Ergonomic contour support","Breathable Dunlop latex","Compact junior sizing"],
    specs:{"Process":"Dunlop","Latex Content":"80%/90% options","Size":"50×30×6/8 cm"},
    sizes:["50×30×6/8 cm"],
    useCases:["Kids' bedding","Junior sleep collections"],
    gallery:["/assets/products/dunlop-contour-pillow-junior/dunlop-contour-pillow-junior-1.jpg"],
    priceINR:"₹1,200 – ₹2,000*",priceUSD:"$14 – $24*",
    priceNote:"* Indicative range.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"50×30×6/8 cm — 80% Natural Latex",sku:"BXD-DCJ-1",priceINR:"₹1,200",priceUSD:"$14"},
      {label:"50×30×6/8 cm — 90% Natural Latex",sku:"BXD-DCJ-2",priceINR:"₹2,000",priceUSD:"$24"},
    ],
  },
  {
    id:"dunlop-couples-pillow",name:"Dunlop Couples Pillow",
    category:"Pillows",latexType:"Dunlop",latexContent:"80%/90% natural latex",
    tag:"Couples",badge:"B2B Competitive",
    headline:"Wide-Format Dunlop Pillow for Couples",
    shortDesc:"An extra-wide Dunlop latex pillow designed for shared sleep and couple comfort.",
    description:"The extra-wide format makes it a conversation-starting gifting and lifestyle product.",
    highlights:["Extra-wide format for shared use","Comfortable latex support for two","Unique gifting product angle"],
    specs:{"Process":"Dunlop","Latex Content":"80%/90% options","Size":"120×40×10 cm or custom"},
    sizes:["120×40×10 cm","Custom width available"],
    useCases:["Couples gifting","Lifestyle bedding collections"],
    gallery:["/assets/products/dunlop-couples-pillow/dunlop-couples-pillow-1.jpg"],
    priceINR:"₹3,200 – ₹5,200*",priceUSD:"$38 – $62*",
    priceNote:"* Indicative range.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"120×40×10 cm — 80% Natural Latex",sku:"BXD-DCO-1",priceINR:"₹3,200",priceUSD:"$38"},
      {label:"120×40×10 cm — 90% Natural Latex",sku:"BXD-DCO-2",priceINR:"₹5,200",priceUSD:"$63"},
    ],
  },
  {
    id:"dunlop-cylinder-pillow",name:"Dunlop Cylinder Pillow",
    category:"Pillows",latexType:"Dunlop",latexContent:"80%/90% natural latex",
    tag:"Bolster",badge:"B2B Competitive",
    headline:"Cylindrical Dunlop Latex Bolster Pillow",
    shortDesc:"A classic bolster-style cylindrical Dunlop latex pillow for back support and decorative use.",
    description:"The cylinder format serves multiple purposes — back support while seated, leg elevation while sleeping, and decorative bolster use.",
    highlights:["Classic bolster cylinder shape","Multiple use cases","Easy to style and photograph"],
    specs:{"Process":"Dunlop","Latex Content":"80%/90% options","Size":"60×15 cm diameter or custom"},
    sizes:["60×15 cm diameter","Custom available"],
    useCases:["Back support","Leg elevation","Decorative bedroom styling"],
    gallery:["/assets/products/dunlop-cylinder-pillow/dunlop-cylinder-pillow-1.jpg"],
    priceINR:"₹1,400 – ₹2,400*",priceUSD:"$17 – $29*",
    priceNote:"* Indicative range.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"60×15 cm diameter — 80% Natural Latex",sku:"BXD-DCY-1",priceINR:"₹1,400",priceUSD:"$17"},
      {label:"60×15 cm diameter — 90% Natural Latex",sku:"BXD-DCY-2",priceINR:"₹2,400",priceUSD:"$29"},
    ],
  },
  {
    id:"dunlop-seahorse-pillow",name:"Dunlop Seahorse Pillow",
    category:"Pillows",latexType:"Dunlop",latexContent:"80%/90% natural latex",
    tag:"Specialty Shape",badge:"B2B Competitive",
    headline:"Seahorse-Shaped Latex Comfort Pillow",
    shortDesc:"A uniquely shaped Dunlop latex pillow inspired by the seahorse form.",
    description:"A distinctive design statement piece. The seahorse shape creates a memorable, gift-worthy product.",
    highlights:["Unique seahorse-inspired silhouette","Premium latex comfort in a distinctive form","Great for gifting and curated collections"],
    specs:{"Process":"Dunlop","Latex Content":"80%/90% options","Size":"Custom seahorse form"},
    sizes:["Standard seahorse form"],
    useCases:["Premium gifting","Specialty collections"],
    gallery:["/assets/products/dunlop-seahorse-pillow/dunlop-seahorse-pillow-1.jpg"],
    priceINR:"₹1,800 – ₹3,000*",priceUSD:"$22 – $36*",
    priceNote:"* Indicative range.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"Standard Seahorse Form — 80% Natural Latex",sku:"BXD-DSH-1",priceINR:"₹1,800",priceUSD:"$22"},
      {label:"Standard Seahorse Form — 90% Natural Latex",sku:"BXD-DSH-2",priceINR:"₹3,000",priceUSD:"$36"},
    ],
  },
  {
    id:"dunlop-stomach-pillow",name:"Dunlop Stomach Pillow",
    category:"Pillows",latexType:"Dunlop",latexContent:"80%/90% natural latex",
    tag:"Stomach Sleepers",badge:"B2B Competitive",
    headline:"Low-Profile Dunlop Pillow for Stomach Sleepers",
    shortDesc:"A thin, flat Dunlop latex pillow for stomach sleepers who need minimal loft.",
    description:"A niche but important product for stomach sleepers. The low profile prevents neck strain while still providing breathable latex comfort.",
    highlights:["Very low profile prevents neck strain","Designed for stomach sleepers","Breathable Dunlop latex"],
    specs:{"Process":"Dunlop","Latex Content":"80%/90% options","Sizes":"60×40×3 cm | 60×40×5 cm"},
    sizes:["60×40×3 cm","60×40×5 cm"],
    useCases:["Stomach sleepers","Flat pillow seekers"],
    gallery:["/assets/products/dunlop-stomach-pillow/dunlop-stomach-pillow-1.jpg"],
    priceINR:"₹1,200 – ₹2,000*",priceUSD:"$14 – $24*",
    priceNote:"* Indicative range.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"60×40×3 cm — 80% Natural Latex",sku:"BXD-DST-1",priceINR:"₹1,200",priceUSD:"$14"},
      {label:"60×40×3 cm — 90% Natural Latex",sku:"BXD-DST-2",priceINR:"₹1,600",priceUSD:"$19"},
      {label:"60×40×5 cm — 80% Natural Latex",sku:"BXD-DST-3",priceINR:"₹1,600",priceUSD:"$19"},
      {label:"60×40×5 cm — 90% Natural Latex",sku:"BXD-DST-4",priceINR:"₹2,000",priceUSD:"$24"},
    ],
  },
  {
    id:"dunlop-throw-pillow",name:"Dunlop Throw Pillow",
    category:"Pillows",latexType:"Dunlop",latexContent:"80%/90% natural latex",
    tag:"Décor",badge:"B2B Competitive",
    headline:"Premium Latex Throw Pillow for Home Styling",
    shortDesc:"A decorative Dunlop latex throw pillow combining home décor aesthetics with real latex comfort.",
    description:"The intersection of home décor and functional latex comfort.",
    highlights:["Decorative shape meets functional comfort","Pairs with any bedroom styling","Accessible entry into the latex collection"],
    specs:{"Process":"Dunlop","Latex Content":"80%/90% options","Sizes":"Various decorative formats"},
    sizes:["Standard throw format","Custom available"],
    useCases:["Home décor collections","Interior design retail"],
    gallery:["/assets/products/dunlop-throw-pillow/dunlop-throw-pillow-1.jpg"],
    priceINR:"₹1,000 – ₹1,800*",priceUSD:"$12 – $22*",
    priceNote:"* Indicative range.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"Standard Throw Format — 80% Natural Latex",sku:"BXD-DTH-1",priceINR:"₹1,000",priceUSD:"$12"},
      {label:"Standard Throw Format — 90% Natural Latex",sku:"BXD-DTH-2",priceINR:"₹1,800",priceUSD:"$22"},
    ],
  },
  {
    id:"dunlop-u-pillow",name:"Dunlop U-Pillow",
    category:"Pillows",latexType:"Dunlop",latexContent:"80%/90% natural latex",
    tag:"Travel & Neck",badge:"B2B Competitive",
    headline:"U-Shaped Dunlop Latex Neck Support Pillow",
    shortDesc:"A classic U-shaped travel and neck support Dunlop latex pillow for desk, car, and flight use.",
    description:"The most recognizable travel pillow shape, upgraded with real latex comfort.",
    highlights:["Classic U-shape for 360° neck support","Premium latex feel vs foam alternatives","Works for travel, desk rest, and recovery"],
    specs:{"Process":"Dunlop","Latex Content":"80%/90% options","Size":"Standard U-form, custom available"},
    sizes:["Standard U-form"],
    useCases:["Travel accessories","Office and desk rest"],
    gallery:["/assets/products/dunlop-u-pillow/dunlop-u-pillow-1.jpg"],
    priceINR:"₹1,200 – ₹2,200*",priceUSD:"$14 – $26*",
    priceNote:"* Indicative range.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"Standard U-Form — 80% Natural Latex",sku:"BXD-DUP-1",priceINR:"₹1,200",priceUSD:"$14"},
      {label:"Standard U-Form — 90% Natural Latex",sku:"BXD-DUP-2",priceINR:"₹2,200",priceUSD:"$26"},
    ],
  },
  {
    id:"peanut-massage-pillow",name:"Peanut Massage Pillow",
    category:"Pillows",latexType:"Dunlop",latexContent:"80%/90% natural latex",
    tag:"Massage Feel",badge:"B2B Competitive",
    headline:"Peanut-Shaped Latex Massage Comfort Pillow",
    shortDesc:"A peanut-shaped Dunlop latex pillow with bumpy texture for soothing massage-like support.",
    description:"A distinctive ergonomic shape meets tactile texture.",
    highlights:["Peanut shape with bumpy texture","Soothing tactile surface feel","Distinctive in any product lineup"],
    specs:{"Process":"Dunlop","Latex Content":"80%/90% options","Size":"Peanut ergonomic form"},
    sizes:["Standard peanut form"],
    useCases:["Relaxation seekers","Massage pillow buyers"],
    gallery:["/assets/products/peanut-massage-pillow/peanut-massage-pillow-1.jpg"],
    priceINR:"₹1,400 – ₹2,400*",priceUSD:"$17 – $29*",
    priceNote:"* Indicative range.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"Standard Peanut Form — 80% Natural Latex",sku:"BXD-PMP-1",priceINR:"₹1,400",priceUSD:"$17"},
      {label:"Standard Peanut Form — 90% Natural Latex",sku:"BXD-PMP-2",priceINR:"₹2,400",priceUSD:"$29"},
    ],
  },
  {
    id:"spiky-massage-pillow",name:"Spiky Massage Pillow",
    category:"Pillows",latexType:"Dunlop",latexContent:"80%/90% natural latex",
    tag:"Deep Texture",badge:"B2B Competitive",
    headline:"Spiky Textured Latex Pillow for Acupressure-Style Comfort",
    shortDesc:"A spiky-textured Dunlop latex pillow for intense tactile stimulation.",
    description:"A bold tactile product. The spiky texture creates an acupressure-inspired feel.",
    highlights:["Prominent spiky texture for tactile stimulation","Wellness and recovery positioning","Natural latex construction"],
    specs:{"Process":"Dunlop","Latex Content":"80%/90% options","Sizes":"60×40×8/10 cm"},
    sizes:["60×40×8/10 cm"],
    useCases:["Wellness and recovery seekers","Specialty massage pillow range"],
    gallery:["/assets/products/spiky-massage-pillow/spiky-massage-pillow-1.jpg"],
    priceINR:"₹1,400 – ₹2,400*",priceUSD:"$17 – $29*",
    priceNote:"* Indicative range.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"60×40×8/10 cm — 80% Natural Latex",sku:"BXD-SPK-1",priceINR:"₹1,400",priceUSD:"$17"},
      {label:"60×40×8/10 cm — 90% Natural Latex",sku:"BXD-SPK-2",priceINR:"₹2,400",priceUSD:"$29"},
    ],
  },
  {
    id:"talalay-latex-mattress",name:"Talalay Latex Mattress",
    category:"Mattresses",latexType:"Talalay",latexContent:"Confirm with supplier",
    tag:"Flagship",badge:"Premium Talalay",
    headline:"Premium Talalay Latex Mattress — Customizable & Breathable",
    shortDesc:"Customizable Talalay latex mattress built for breathability, pressure distribution, and refined sleep.",
    description:"The flagship mattress category. Available in custom sizes, densities, and construction configurations. Suitable for luxury home buyers, premium hotels, interior designers, and bedding brands.",
    highlights:["Customizable size, density, and construction","Open-cell latex structure for airflow","Designed for pressure distribution across body zones","Private-label and branding customization available"],
    specs:{"Process":"Talalay","Density Options":"D60 / D70 / D80","Sizes":"150×200 cm | 180×200 cm | Custom","Height":"10 cm standard | Custom available","Private Label":"Available on request"},
    sizes:["150×200×10 cm","180×200×10 cm","Custom — contact for quote"],
    useCases:["Luxury home bedrooms","Premium hotels & resorts","Interior design projects","Private-label mattress brands"],
    gallery:["/assets/products/talalay-latex-mattress/talalay-latex-mattress-1.jpg","/assets/products/talalay-latex-mattress/talalay-latex-mattress-2.jpg"],
    priceINR:"₹52,000 – ₹83,000*",priceUSD:"$632 – $1,010*",
    priceNote:"* Indicative landed price. Final confirmed after city, quantity, density & specs.",
    deliveryNote:"Estimated 4–10 days inland after port clearance. Sea freight: ~30–40 days for custom/bulk.",
    variants:[
      {label:"150×200×10 cm — D60 (Soft)",sku:"TXMAT-1",priceINR:"₹52,000",priceUSD:"$632"},
      {label:"150×200×10 cm — D70 (Medium)",sku:"TXMAT-2",priceINR:"₹60,000",priceUSD:"$730"},
      {label:"150×200×10 cm — D80 (Firm)",sku:"TXMAT-3",priceINR:"₹68,000",priceUSD:"$827"},
      {label:"180×200×10 cm — D60 (Soft)",sku:"TXMAT-4",priceINR:"₹63,000",priceUSD:"$766"},
      {label:"180×200×10 cm — D70 (Medium)",sku:"TXMAT-5",priceINR:"₹73,000",priceUSD:"$888"},
      {label:"180×200×10 cm — D80 (Firm)",sku:"TXMAT-6",priceINR:"₹83,000",priceUSD:"$1,010"},
    ],
  },
  {
    id:"dunlop-bay-window-mattress",name:"Dunlop Bay Window Mattress",
    category:"Mattresses",latexType:"Dunlop",latexContent:"80%/90% natural latex",
    tag:"Custom Shape",badge:"B2B Favourite",
    headline:"Custom-Cut Dunlop Mattress for Bay Windows & Unique Spaces",
    shortDesc:"A custom-shaped Dunlop latex mattress designed for bay windows, reading nooks, and non-standard spaces.",
    description:"A unique B2B product for interior designers and custom furniture makers.",
    highlights:["Custom-cut for bay window and alcove seating","Firm Dunlop latex for seated and resting use","High-value B2B interior design product"],
    specs:{"Process":"Dunlop","Latex Content":"80%/90% options","Format":"Custom to specification"},
    sizes:["Custom to specification"],
    useCases:["Bay window seating","Reading nooks","Custom interior furniture"],
    gallery:["/assets/products/dunlop-bay-window-mattress/dunlop-bay-window-mattress-1.jpg"],
    priceINR:"From ₹12,000*",priceUSD:"From $145*",
    priceNote:"* Indicative starting range.",
    deliveryNote:"Estimated 4–10 days inland after port clearance. Sea freight: ~30–40 days.",
  },
  {
    id:"dunlop-standard-mattress",name:"Dunlop Standard Mattress",
    category:"Mattresses",latexType:"Dunlop",latexContent:"80%/90% natural latex",
    tag:"B2B Favourite",badge:"B2B Competitive",
    headline:"Custom Dunlop Latex Mattress Core",
    shortDesc:"Dunlop latex mattress with customizable dimensions and thickness for homes, hotels, and brands.",
    description:"The core Dunlop mattress product. Suitable for B2B buyers, hotel projects, and private-label mattress development.",
    highlights:["Multiple height options: 5 / 7.5 / 10 / 15 cm","Custom size for standard Indian bed dimensions","Supportive Dunlop latex feel"],
    specs:{"Process":"Dunlop","Latex Content":"80%/90% options","Height Options":"5 / 7.5 / 10 / 15 cm","Common Sizes":"90×200 | 120×200 | 150×200 | 180×200 cm"},
    sizes:["90×200 cm","120×200 cm","150×200 cm","180×200 cm","Custom"],
    useCases:["B2B mattress buyers","Hotel and interior projects"],
    gallery:["/assets/products/dunlop-standard-mattress/dunlop-standard-mattress-1.jpg"],
    priceINR:"₹18,000 – ₹52,000*",priceUSD:"$219 – $633*",
    priceNote:"* Indicative landed price. Final confirmed after city, quantity & specs.",
    deliveryNote:"Estimated 4–10 days inland after port clearance. Sea freight: ~30–40 days.",
    variants:[
      {label:"120×200×5 cm — 80% D70",sku:"DXMAT-1",priceINR:"₹18,000",priceUSD:"$219"},
      {label:"150×200×5 cm — 80% D70",sku:"DXMAT-2",priceINR:"₹22,500",priceUSD:"$274"},
      {label:"180×200×5 cm — 80% D70",sku:"DXMAT-3",priceINR:"₹27,000",priceUSD:"$329"},
      {label:"120×200×7.5 cm — 80% D70",sku:"DXMAT-4",priceINR:"₹27,000",priceUSD:"$329"},
      {label:"150×200×7.5 cm — 80% D70",sku:"DXMAT-5",priceINR:"₹33,000",priceUSD:"$402"},
      {label:"180×200×7.5 cm — 80% D70",sku:"DXMAT-6",priceINR:"₹39,500",priceUSD:"$481"},
      {label:"120×200×10 cm — 80% D70",sku:"DXMAT-7",priceINR:"₹35,000",priceUSD:"$426"},
      {label:"150×200×10 cm — 80% D70",sku:"DXMAT-8",priceINR:"₹43,500",priceUSD:"$529"},
      {label:"180×200×10 cm — 80% D70",sku:"DXMAT-9",priceINR:"₹52,000",priceUSD:"$633"},
    ],
  },
  {
    id:"latex-topper",name:"Latex Topper",
    category:"Toppers",latexType:"Talalay",latexContent:"Confirm with supplier",
    tag:"Easy Upgrade",badge:"Premium Value",
    headline:"Instant Mattress Upgrade with Natural Latex Comfort",
    shortDesc:"Latex topper that adds breathable cushioning and premium feel to any existing mattress.",
    description:"A practical, high-value product. An instant upgrade: more cushioning, better airflow, premium latex feel.",
    highlights:["Adds softer, more responsive comfort layer","Breathable latex construction for improved airflow","Works on existing bed frames and mattresses"],
    specs:{"Material":"Natural latex","Thickness":"1 / 2 / 3 / 4 / 5 cm","Sizes":"150×200 cm | 180×200 cm | Custom","Density":"D60 / D70 / D80 available"},
    sizes:["150×200 cm","180×200 cm","Custom size — contact for quote"],
    useCases:["Customers upgrading existing mattresses","Hotel bed upgrades"],
    gallery:["/assets/products/latex-topper/latex-topper-1.jpg","/assets/products/latex-topper/latex-topper-2.jpg","/assets/products/latex-topper/latex-topper-3.jpg"],
    priceINR:"₹17,500 – ₹43,000*",priceUSD:"$213 – $523*",
    priceNote:"* Indicative landed price. Final confirmed after city, quantity, thickness & density.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"150×200 cm × 1 cm — D60",sku:"TXTP-1",priceINR:"₹17,500",priceUSD:"$213"},
      {label:"150×200 cm × 2 cm — D60",sku:"TXTP-2",priceINR:"₹18,000",priceUSD:"$219"},
      {label:"150×200 cm × 3 cm — D60",sku:"TXTP-3",priceINR:"₹21,500",priceUSD:"$261"},
      {label:"150×200 cm × 4 cm — D70",sku:"TXTP-4",priceINR:"₹35,000",priceUSD:"$426"},
      {label:"150×200 cm × 5 cm — D70",sku:"TXTP-5",priceINR:"₹35,500",priceUSD:"$432"},
      {label:"180×200 cm × 1 cm — D60",sku:"TXTP-6",priceINR:"₹19,000",priceUSD:"$231"},
      {label:"180×200 cm × 2 cm — D60",sku:"TXTP-7",priceINR:"₹21,000",priceUSD:"$255"},
      {label:"180×200 cm × 3 cm — D60",sku:"TXTP-8",priceINR:"₹26,000",priceUSD:"$316"},
      {label:"180×200 cm × 4 cm — D70",sku:"TXTP-9",priceINR:"₹42,500",priceUSD:"$517"},
      {label:"180×200 cm × 5 cm — D70",sku:"TXTP-10",priceINR:"₹43,000",priceUSD:"$523"},
    ],
  },
  {
    id:"shredded-talalay-latex",name:"Shredded Talalay Latex",
    category:"Latex Material",latexType:"Talalay",latexContent:"Talalay shredded fill",
    tag:"B2B Material",badge:"Custom Fill",
    headline:"Adjustable Talalay Latex Filling for Bespoke Products",
    shortDesc:"Loose shredded Talalay latex for customizable pillows, cushions, sofa inserts, and bedding.",
    description:"Best positioned as B2B customization material for manufacturers, furniture brands, and custom bedding developers. Sold per kilogram.",
    highlights:["Flexible fill volume for adjustable loft and firmness","Multiple applications: pillows, cushions, sofas","Cost-effective entry into custom latex comfort products"],
    specs:{"Type":"Shredded Talalay Latex","Unit":"Per kilogram","Applications":"Pillows, cushions, sofas, bedding, upholstery"},
    sizes:["Per kg — custom quantity"],
    useCases:["Pillow manufacturers","Custom furniture brands"],
    gallery:["/assets/products/shredded-talalay-latex/shredded-talalay-latex-1.jpg","/assets/products/shredded-talalay-latex/shredded-talalay-latex-2.jpg"],
    priceINR:"Contact for price*",priceUSD:"Contact for price*",
    priceNote:"* Price per kg depends on quantity, grade, and shipping terms.",
    deliveryNote:"Estimated 4–10 days inland after port clearance. Sea freight: ~30–40 days.",
  },
  {
    id:"hybrid-latex-with-bamboo",name:"Hybrid Latex with Bamboo",
    category:"Latex Material",latexType:"Hybrid",latexContent:"Latex + bamboo composite",
    tag:"Eco Hybrid",badge:"Sustainable",
    headline:"Natural Latex Combined with Bamboo for Eco-Friendly Comfort",
    shortDesc:"A hybrid latex-bamboo material combining latex comfort with bamboo's natural breathability.",
    description:"Premium hybrid material combining latex with bamboo for a breathable, sustainable comfort experience.",
    highlights:["Bamboo enhances breathability and moisture wicking","Premium latex comfort base","Eco-friendly sustainability story"],
    specs:{"Type":"Hybrid Latex + Bamboo","Applications":"Pillows, toppers, mattress layers"},
    sizes:["Per specification"],
    useCases:["Eco bedding brands","Sustainable retail collections"],
    gallery:["/assets/products/hybrid-latex-with-bamboo/hybrid-latex-with-bamboo-1.png"],
    priceINR:"Contact for price*",priceUSD:"Contact for price*",
    priceNote:"* Price confirmed after specifications and quantity.",
    deliveryNote:"Estimated 4–10 days inland after port clearance. Sea freight: ~30–40 days.",
  },
  {
    id:"hybrid-latex-with-gel",name:"Hybrid Latex with Gel",
    category:"Latex Material",latexType:"Hybrid",latexContent:"Latex + gel composite",
    tag:"Cool Comfort",badge:"Temperature Control",
    headline:"Latex + Gel Hybrid for Enhanced Temperature Regulation",
    shortDesc:"A latex-gel hybrid that combines latex support with gel's superior cooling properties.",
    description:"Combines the responsive support of latex with gel's superior cooling properties — a strong selling point in India's warm climate.",
    highlights:["Gel infusion for enhanced cooling","Responsive latex support base","Temperature regulation story"],
    specs:{"Type":"Hybrid Latex + Gel","Applications":"Pillows, mattress toppers, mattress layers"},
    sizes:["Per specification"],
    useCases:["Warm climate bedding","Hot sleepers"],
    gallery:["/assets/products/hybrid-latex-with-gel/hybrid-latex-with-gel-1.png"],
    priceINR:"Contact for price*",priceUSD:"Contact for price*",
    priceNote:"* Price confirmed after specifications and quantity.",
    deliveryNote:"Estimated 4–10 days inland after port clearance. Sea freight: ~30–40 days.",
  },
  {
    id:"hybrid-latex-with-graphene",name:"Hybrid Latex with Graphene",
    category:"Latex Material",latexType:"Hybrid",latexContent:"Latex + graphene composite",
    tag:"Premium Tech",badge:"Advanced Material",
    headline:"Graphene-Infused Latex for Advanced Comfort Technology",
    shortDesc:"A cutting-edge graphene-infused latex hybrid for premium thermal regulation.",
    description:"Graphene known for exceptional thermal conductivity and antibacterial properties. Creates a premium, differentiated product.",
    highlights:["Graphene for superior thermal conductivity","Natural antibacterial properties","Distinctive differentiation in crowded market"],
    specs:{"Type":"Hybrid Latex + Graphene","Applications":"Premium pillows, mattress layers"},
    sizes:["Per specification"],
    useCases:["Premium tech bedding","High-end retail collections"],
    gallery:["/assets/products/hybrid-latex-with-graphene/hybrid-latex-with-graphene-1.png"],
    priceINR:"Contact for price*",priceUSD:"Contact for price*",
    priceNote:"* Price confirmed after specifications and quantity.",
    deliveryNote:"Estimated 4–10 days inland after port clearance. Sea freight: ~30–40 days.",
  },
  {
    id:"hybrid-latex-with-lavender",name:"Hybrid Latex with Lavender",
    category:"Latex Material",latexType:"Hybrid",latexContent:"Latex + lavender composite",
    tag:"Aromatherapy",badge:"Wellness",
    headline:"Lavender-Infused Latex for a Calming Sleep Experience",
    shortDesc:"A latex hybrid infused with lavender for aromatherapy-enhanced sleep comfort.",
    description:"The lavender infusion creates a gentle aromatherapy effect that promotes relaxation and better sleep.",
    highlights:["Lavender aromatherapy for calming sleep","Natural latex comfort base","Great for gifting and personal wellness retail"],
    specs:{"Type":"Hybrid Latex + Lavender","Applications":"Pillows, toppers"},
    sizes:["Per specification"],
    useCases:["Wellness retail","Aromatherapy-focused buyers"],
    gallery:["/assets/products/hybrid-latex-with-lavender/hybrid-latex-with-lavender-1.png"],
    priceINR:"Contact for price*",priceUSD:"Contact for price*",
    priceNote:"* Price confirmed after specifications and quantity.",
    deliveryNote:"Estimated 4–10 days inland after port clearance. Sea freight: ~30–40 days.",
  },
  {
    id:"hybrid-latex-with-negative-oxygen-ion",name:"Hybrid Latex with Negative Oxygen Ion",
    category:"Latex Material",latexType:"Hybrid",latexContent:"Latex + negative ion composite",
    tag:"Air Purifying",badge:"Health & Wellness",
    headline:"Negative Oxygen Ion Latex for a Healthier Sleep Environment",
    shortDesc:"A latex hybrid infused with negative oxygen ions for air-purifying sleep.",
    description:"Negative oxygen ion technology marketed in premium sleep products for air-purifying and wellness properties.",
    highlights:["Negative ion technology for air purification","Premium wellness product story","Health-conscious buyer positioning"],
    specs:{"Type":"Hybrid Latex + Negative Oxygen Ion","Applications":"Pillows, mattress layers"},
    sizes:["Per specification"],
    useCases:["Health-conscious buyers","Wellness sleep collections"],
    gallery:["/assets/products/hybrid-latex-with-negative-oxygen-ion/hybrid-latex-with-negative-oxygen-ion-1.png"],
    priceINR:"Contact for price*",priceUSD:"Contact for price*",
    priceNote:"* Price confirmed after specifications and quantity.",
    deliveryNote:"Estimated 4–10 days inland after port clearance. Sea freight: ~30–40 days.",
  },
  {
    id:"hybrid-latex-with-traditional-chinese-medicine",name:"Hybrid Latex with Traditional Chinese Medicine",
    category:"Latex Material",latexType:"Hybrid",latexContent:"Latex + TCM herbal composite",
    tag:"Herbal Wellness",badge:"TCM Infused",
    headline:"TCM Herbal-Infused Latex for Holistic Sleep Wellness",
    shortDesc:"A luxury latex hybrid infused with traditional Chinese medicine herbs.",
    description:"Traditional Chinese Medicine herb infusion gives this latex a unique holistic wellness positioning.",
    highlights:["TCM herb infusion for holistic wellness","Premium natural sleep support story","Unique, differentiated product line"],
    specs:{"Type":"Hybrid Latex + TCM Herbs","Applications":"Pillows, toppers"},
    sizes:["Per specification"],
    useCases:["TCM-focused wellness brands","Holistic health retail"],
    gallery:["/assets/products/hybrid-latex-with-traditional-chinese-medicine/hybrid-latex-with-traditional-chinese-medicine-1.png"],
    priceINR:"Contact for price*",priceUSD:"Contact for price*",
    priceNote:"* Price confirmed after specifications and quantity.",
    deliveryNote:"Estimated 4–10 days inland after port clearance. Sea freight: ~30–40 days.",
  },
  {
    id:"dunlop-bottom-seat-cushion",name:"Dunlop Bottom Seat Cushion",
    category:"Cushions",latexType:"Dunlop",latexContent:"80%/90% natural latex",
    tag:"Ergonomic Seat",badge:"B2B Competitive",
    headline:"Ergonomic Dunlop Latex Bottom Cushion",
    shortDesc:"A shaped latex seat cushion for more supportive seated comfort in office, home, and travel use.",
    description:"Position as an ergonomic comfort cushion for extended sitting. Works for office chairs, car seats, dining chairs, and meditation seating.",
    highlights:["Shaped base for seated comfort","Supportive Dunlop latex","Office, car, and home use"],
    specs:{"Process":"Dunlop","Latex Content":"80%/90% options","Size":"40×40×5 cm or custom"},
    sizes:["40×40×5 cm","Custom available"],
    useCases:["Office seating upgrades","Car seat comfort","Meditation seating"],
    gallery:["/assets/products/dunlop-bottom-seat-cushion/dunlop-bottom-seat-cushion-1.jpg"],
    priceINR:"₹1,400 – ₹2,800*",priceUSD:"$17 – $34*",
    priceNote:"* Indicative range.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"40×40×5 cm — 80% Natural Latex",sku:"BXD-BSC-1",priceINR:"₹1,400",priceUSD:"$17"},
      {label:"40×40×5 cm — 90% Natural Latex",sku:"BXD-BSC-2",priceINR:"₹2,800",priceUSD:"$34"},
    ],
  },
  {
    id:"dunlop-bubble-seat-cushion",name:"Dunlop Bubble Seat Cushion",
    category:"Cushions",latexType:"Dunlop",latexContent:"80%/90% natural latex",
    tag:"Textured Seating",badge:"B2B Competitive",
    headline:"Bubble-Textured Dunlop Latex Seat Cushion",
    shortDesc:"A bubble-textured Dunlop latex seat cushion with a distinctive surface and supportive feel.",
    description:"The bubble texture creates a tactile cushion that stands out from ordinary flat cushions.",
    highlights:["Distinctive bubble texture surface","Massage-style seated feel","Supportive latex core"],
    specs:{"Process":"Dunlop","Latex Content":"80%/90% options","Size":"40×40×5 cm or custom"},
    sizes:["40×40×5 cm","Custom available"],
    useCases:["Textured comfort seekers","Office and home seating"],
    gallery:["/assets/products/dunlop-bubble-seat-cushion/dunlop-bubble-seat-cushion-1.jpg"],
    priceINR:"₹1,400 – ₹2,800*",priceUSD:"$17 – $34*",
    priceNote:"* Indicative range.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"40×40×5 cm — 80% Natural Latex",sku:"BXD-BBC-1",priceINR:"₹1,400",priceUSD:"$17"},
      {label:"40×40×5 cm — 90% Natural Latex",sku:"BXD-BBC-2",priceINR:"₹2,800",priceUSD:"$34"},
    ],
  },
  {
    id:"dunlop-butterfly-back-cushion",name:"Dunlop Butterfly Back Cushion",
    category:"Cushions",latexType:"Dunlop",latexContent:"80%/90% natural latex",
    tag:"Back Support",badge:"B2B Competitive",
    headline:"Butterfly-Shaped Latex Back Cushion for Lumbar Comfort",
    shortDesc:"A butterfly-shaped Dunlop latex back cushion that contours to the lumbar spine.",
    description:"The butterfly shape contours naturally to the lumbar area.",
    highlights:["Butterfly contour fits lumbar naturally","Supportive Dunlop latex","Office and car seat compatible"],
    specs:{"Process":"Dunlop","Latex Content":"80%/90% options","Size":"40×30 cm or custom"},
    sizes:["40×30 cm","Custom available"],
    useCases:["Lower back support","Office chair upgrade"],
    gallery:["/assets/products/dunlop-butterfly-back-cushion/dunlop-butterfly-back-cushion-1.jpg"],
    priceINR:"₹1,200 – ₹2,400*",priceUSD:"$14 – $29*",
    priceNote:"* Indicative range.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"40×30 cm — 80% Natural Latex",sku:"BXD-BFC-1",priceINR:"₹1,200",priceUSD:"$14"},
      {label:"40×30 cm — 90% Natural Latex",sku:"BXD-BFC-2",priceINR:"₹2,400",priceUSD:"$29"},
    ],
  },
  {
    id:"dunlop-chunk-seat-cushion",name:"Dunlop Chunk Seat Cushion",
    category:"Cushions",latexType:"Dunlop",latexContent:"80%/90% natural latex",
    tag:"Deep Comfort",badge:"B2B Competitive",
    headline:"Chunky Dunlop Latex Seat Cushion for Deep Comfort",
    shortDesc:"A thicker, more substantial Dunlop latex seat cushion for more depth in seating comfort.",
    description:"For buyers who need more cushion depth for extended sitting periods.",
    highlights:["Greater thickness for deep comfort","High-density Dunlop support","Works with most chair types"],
    specs:{"Process":"Dunlop","Latex Content":"80%/90% options","Size":"40×40×8 cm or custom"},
    sizes:["40×40×8 cm","Custom available"],
    useCases:["Extended sitting comfort","Office ergonomics"],
    gallery:["/assets/products/dunlop-chunk-seat-cushion/dunlop-chunk-seat-cushion-1.jpg"],
    priceINR:"₹1,600 – ₹3,000*",priceUSD:"$19 – $36*",
    priceNote:"* Indicative range.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"40×40×8 cm — 80% Natural Latex",sku:"BXD-CKC-1",priceINR:"₹1,600",priceUSD:"$19"},
      {label:"40×40×8 cm — 90% Natural Latex",sku:"BXD-CKC-2",priceINR:"₹3,000",priceUSD:"$36"},
    ],
  },
  {
    id:"dunlop-standard-back-cushion",name:"Dunlop Standard Back Cushion",
    category:"Cushions",latexType:"Dunlop",latexContent:"80%/90% natural latex",
    tag:"Lumbar",badge:"B2B Competitive",
    headline:"Latex Lumbar Back Cushion for Work and Home",
    shortDesc:"A supportive Dunlop latex back cushion for filling the gap between the lower back and chair.",
    description:"A practical product with clear utility — fill the lumbar gap in any chair.",
    highlights:["Standard lumbar support shape","Firm Dunlop latex fill","Universal chair compatibility"],
    specs:{"Process":"Dunlop","Latex Content":"80%/90% options","Size":"40×30×8 cm or custom"},
    sizes:["40×30×8 cm","Custom available"],
    useCases:["Office chair lumbar support","Car seat back support"],
    gallery:["/assets/products/dunlop-standard-back-cushion/dunlop-standard-back-cushion-1.jpg"],
    priceINR:"₹1,200 – ₹2,400*",priceUSD:"$14 – $29*",
    priceNote:"* Indicative range.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"40×30×8 cm — 80% Natural Latex",sku:"BXD-SBC-1",priceINR:"₹1,200",priceUSD:"$14"},
      {label:"40×30×8 cm — 90% Natural Latex",sku:"BXD-SBC-2",priceINR:"₹2,400",priceUSD:"$29"},
    ],
  },
  {
    id:"dunlop-standard-seat-cushion",name:"Dunlop Standard Seat Cushion",
    category:"Cushions",latexType:"Dunlop",latexContent:"80%/90% natural latex",
    tag:"Essential",badge:"B2B Competitive",
    headline:"Premium Latex Seat Cushion for Daily Comfort",
    shortDesc:"A simple square Dunlop latex seat cushion for chairs, sofas, office seating, and home use.",
    description:"Simple square format, clear comfort story. Works for office, dining, meditation, and sofa use.",
    highlights:["Simple square format","Universal seating compatibility","Supportive Dunlop latex","Easy retail story"],
    specs:{"Process":"Dunlop","Latex Content":"80%/90% options","Sizes":"40×40×5 cm | 45×45×5 cm | Custom"},
    sizes:["40×40×5 cm","45×45×5 cm","Custom available"],
    useCases:["Office seating","Dining chairs","Meditation cushions"],
    gallery:["/assets/products/dunlop-standard-seat-cushion/dunlop-standard-seat-cushion-1.jpg"],
    priceINR:"₹1,200 – ₹2,400*",priceUSD:"$14 – $29*",
    priceNote:"* Indicative range.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"40×40×5 cm — 80% Natural Latex",sku:"BXD-SSC-1",priceINR:"₹1,200",priceUSD:"$14"},
      {label:"40×40×5 cm — 90% Natural Latex",sku:"BXD-SSC-2",priceINR:"₹1,800",priceUSD:"$22"},
      {label:"45×45×5 cm — 80% Natural Latex",sku:"BXD-SSC-3",priceINR:"₹1,500",priceUSD:"$18"},
      {label:"45×45×5 cm — 90% Natural Latex",sku:"BXD-SSC-4",priceINR:"₹2,400",priceUSD:"$29"},
    ],
  },
  {
    id:"dunlop-triangle-back-cushion",name:"Dunlop Triangle Back Cushion",
    category:"Cushions",latexType:"Dunlop",latexContent:"80%/90% natural latex",
    tag:"Reading Wedge",badge:"B2B Competitive",
    headline:"Triangular Latex Wedge Cushion for Reading and Relaxation",
    shortDesc:"A triangular Dunlop latex wedge cushion for elevated reading, sleeping at an angle, and reflux support.",
    description:"The wedge format serves specific functional needs: reading in bed, acid reflux elevation, post-surgery positioning.",
    highlights:["Wedge angle for reading and elevation","Useful for acid reflux and recovery","Fills a specific comfort need"],
    specs:{"Process":"Dunlop","Latex Content":"80%/90% options","Size":"60×40×20 cm wedge or custom"},
    sizes:["60×40×20 cm wedge","Custom available"],
    useCases:["Reading in bed","Acid reflux elevation","Post-surgery positioning"],
    gallery:["/assets/products/dunlop-triangle-back-cushion/dunlop-triangle-back-cushion-1.jpg"],
    priceINR:"₹1,600 – ₹3,000*",priceUSD:"$19 – $36*",
    priceNote:"* Indicative range.",
    deliveryNote:"Estimated 3–10 days inland after port clearance. Sea freight: ~25–35 days.",
    variants:[
      {label:"60×40×20 cm Wedge — 80% Natural Latex",sku:"BXD-TBC-1",priceINR:"₹1,600",priceUSD:"$19"},
      {label:"60×40×20 cm Wedge — 90% Natural Latex",sku:"BXD-TBC-2",priceINR:"₹3,000",priceUSD:"$36"},
    ],
  },
];

const CATS = [
  {name:"All Products",filter:null},
  {name:"Mattresses",filter:"Mattresses"},
  {name:"Pillows",filter:"Pillows"},
  {name:"Toppers",filter:"Toppers"},
  {name:"Cushions",filter:"Cushions"},
  {name:"Latex Material",filter:"Latex Material"},
];

const PINCODE_ZONES: Record<string,{zone:string;port:string;days:string}> = {
  "400":{zone:"A",port:"Nhava Sheva, Mumbai",days:"3–6"},
  "421":{zone:"A",port:"Nhava Sheva, Mumbai",days:"3–6"},
  "380":{zone:"A",port:"Mundra Port",days:"3–6"},
  "600":{zone:"A",port:"Chennai Port",days:"3–6"},
  "700":{zone:"A",port:"Kolkata / Haldia",days:"3–6"},
  "682":{zone:"A",port:"Cochin Port",days:"3–6"},
  "110":{zone:"B",port:"ICD Tughlakabad / Nhava Sheva",days:"4–8"},
  "560":{zone:"B",port:"Chennai Port",days:"4–7"},
  "500":{zone:"B",port:"Visakhapatnam / Chennai",days:"4–7"},
  "226":{zone:"C",port:"Nearest Port + ICD",days:"6–10"},
};
const ZONE_INFO: Record<string,{label:string;col:string;bg:string}> = {
  A:{label:"Zone A — Near Port",col:"#1a9e6e",bg:"#edfaf5"},
  B:{label:"Zone B — Standard",col:"#C8A97E",bg:"#F5EEE4"},
  C:{label:"Zone C — Extended",col:"#888",bg:"#f5f5f5"},
};
const lookupPincode = (pin:string) => {
  const p = String(pin).trim();
  if(p.length!==6||!/^\d+$/.test(p))return null;
  return PINCODE_ZONES[p.slice(0,3)]||{zone:"B",port:"Nearest Available Port",days:"4–10"};
};

const C={white:"#F6F3EB",beige:"#E5DFCD",gold:"#C8A97E",dark:"#1E1E1C",sand:"#D4C5A1",lgold:"#EFE9DC",char:"#141210",ink:"#4A4B46",seal:"#9E3B2E",taupe:"#BFA295"};
const CD={white:"#0F0F0D",beige:"#1A1714",gold:"#C8A97E",dark:"#F2EDE4",sand:"#2C2825",lgold:"#1C1916",char:"#080706",ink:"#9AA09A",seal:"#C25B4A",taupe:"#9C8B7E"};
const DARK_CSS=`body{background:#0F0F0D!important;color:#F2EDE4!important}.nl{color:#E8E0D4!important}.nl:hover{color:#C8A97E!important}.nl::after{background:#C8A97E!important}.bg{background:#B89472!important;color:#0F0F0D!important}.bg:hover{background:#D4B896!important}.bo{color:#D4B896!important;border-color:#D4B896!important}.bo:hover{background:#C8A97E!important;color:#0F0F0D!important}.bd{color:#C8A97E!important;border-color:#3A3530!important}.pc{background:#1A1714!important;box-shadow:0 2px 16px rgba(0,0,0,.4)!important}.ib{color:#E8E0D4!important}.ib:hover{color:#C8A97E!important}.sl{color:#C8A97E!important}.fl{color:#9A9088!important}.fl:hover{color:#C8A97E!important}.inp{background:#1E1B18!important;border-color:#3A3530!important;color:#F2EDE4!important}input,select,textarea{background:#1E1B18!important;border-color:#3A3530!important;color:#F2EDE4!important}input::placeholder,textarea::placeholder{color:#665F58!important}.glass-modal{background:rgba(15,14,13,.97)!important;border-color:rgba(80,65,45,.5)!important}.sdrawer{background:#0A0908!important}.sdr-link{color:#B0A898!important}.sdr-link:hover{color:#C8A97E!important;background:rgba(200,169,126,.06)!important}.sdr-section{color:#444!important}.cert-chip{background:#1A1714!important;border-color:#2E2B27!important;color:#9A9088!important}.cert-chip:hover{border-color:#C8A97E!important;color:#C8A97E!important}::-webkit-scrollbar-track{background:#1A1714!important}::-webkit-scrollbar-thumb{background:#3A3530!important}.spec-key{color:#9A9088!important}.spec-val{color:#F2EDE4!important}.tag-pill{background:#6A5840!important}`;
const ThemeCtx=createContext(C);
const useC=()=>useContext(ThemeCtx);
const waMsg=(msg:string)=>`https://wa.me/${BIZ.wa}?text=${encodeURIComponent(msg)}`;
const parsePriceNum=(s:string):number=>{if(!s)return 0;const m=String(s).replace(/,/g,"").match(/[\d.]+/);return m?parseFloat(m[0]):0;};

/* ─── CURRENCY (base INR; rates indicative, not live FX) ──── */
const FX:Record<string,{symbol:string;rate:number;name:string;locale:string}>={
  INR:{symbol:"₹",rate:1,name:"Indian Rupee",locale:"en-IN"},
  USD:{symbol:"$",rate:1/83,name:"US Dollar",locale:"en-US"},
  AED:{symbol:"AED ",rate:1/22.6,name:"UAE Dirham",locale:"en-US"},
  EUR:{symbol:"€",rate:1/90,name:"Euro",locale:"en-US"},
  GBP:{symbol:"£",rate:1/105,name:"British Pound",locale:"en-GB"},
  SGD:{symbol:"S$",rate:1/61.5,name:"Singapore Dollar",locale:"en-US"},
  AUD:{symbol:"A$",rate:1/54.5,name:"Australian Dollar",locale:"en-US"},
};
const CURRENCIES=Object.keys(FX);
const CURRENCY_DISCLAIMER="Currency conversion is indicative only and refreshed periodically from a public reference source. Final proforma and payment are confirmed in INR unless otherwise agreed.";

/* ─── LIVE FX REFRESH ──────────────────────────────────────────
   Real INR-based rates are pulled from a free public reference API
   (no key) and refreshed hourly / on every page load. We never invent
   rates: if the fetch fails we keep the built-in indicative fallbacks. */
const FX_CACHE_KEY="xiyora_fx_v1";
const FX_TTL_MS=60*60*1000; // 1 hour
const FX_ENDPOINT="https://open.er-api.com/v6/latest/INR";
/** Apply an INR-based rate map ({USD:0.012,...}) onto FX. Only known, positive numeric rates are used. */
function applyLiveRates(rates:Record<string,number>):boolean{
  let applied=false;
  for(const cur of CURRENCIES){
    if(cur==="INR")continue;
    const r=rates?.[cur];
    if(typeof r==="number"&&isFinite(r)&&r>0){FX[cur].rate=r;applied=true;}
  }
  return applied;
}
/** Read cached rates if still fresh; returns the cached payload or null. */
function readFxCache():{ts:number;rates:Record<string,number>}|null{
  try{
    const raw=localStorage.getItem(FX_CACHE_KEY);
    if(!raw)return null;
    const p=JSON.parse(raw);
    if(p&&typeof p.ts==="number"&&p.rates)return p;
  }catch{}
  return null;
}
/** Fetch fresh INR-based rates and cache them. Returns true if FX was updated. */
async function fetchLiveRates():Promise<boolean>{
  const ctrl=new AbortController();
  const t=setTimeout(()=>ctrl.abort(),10000);
  try{
    const res=await fetch(FX_ENDPOINT,{signal:ctrl.signal});
    if(!res.ok)return false;
    const data=await res.json();
    if(data?.result!=="success"||!data?.rates)return false;
    const ok=applyLiveRates(data.rates);
    if(ok){try{localStorage.setItem(FX_CACHE_KEY,JSON.stringify({ts:Date.now(),rates:data.rates}));}catch{}}
    return ok;
  }catch{return false;}
  finally{clearTimeout(t);}
}
/** React hook: hydrate from cache, then refresh hourly + on load. Returns a version number that bumps on every successful update so the tree re-renders with new rates. */
function useLiveFx():number{
  const [version,setVersion]=useState(0);
  useEffect(()=>{
    let alive=true;
    const cached=readFxCache();
    if(cached&&applyLiveRates(cached.rates)){setVersion(v=>v+1);}
    const refresh=async()=>{
      const fresh=readFxCache();
      if(fresh&&Date.now()-fresh.ts<FX_TTL_MS)return; // still fresh, skip network
      const ok=await fetchLiveRates();
      if(ok&&alive)setVersion(v=>v+1);
    };
    refresh();
    const id=setInterval(refresh,FX_TTL_MS);
    return()=>{alive=false;clearInterval(id);};
  },[]);
  return version;
}
const fmtMoney=(cur:string,inrAmount:number):string=>{
  const f=FX[cur]||FX.INR;
  const v=Math.round(inrAmount*f.rate);
  return `${f.symbol}${v.toLocaleString(f.locale)}`;
};
/** Convert a curated INR price string (single, range with "–", optional "*" / "From") to target currency. */
const priceIn=(cur:string,inrStr?:string):string=>{
  if(!inrStr)return "";
  const nums=(String(inrStr).replace(/,/g,"").match(/\d+(?:\.\d+)?/g)||[]).map(Number);
  if(!nums.length)return inrStr; // non-numeric labels (e.g. "Select a variant", "Quote req.") pass through
  if(cur==="INR")return inrStr;  // keep hand-curated INR formatting
  const star=/\*\s*$/.test(inrStr)?"*":"";
  const fromPrefix=/^\s*from/i.test(inrStr)?"From ":"";
  const parts=nums.map(n=>fmtMoney(cur,n));
  return fromPrefix+parts.join(" – ")+star;
};

/* ─── DOMESTIC DELIVERY (indicative; confirmed in proforma) ─ */
type PkgType="small"|"medium"|"bulky";
const pkgTypeFor=(category?:string):PkgType=>{
  const c=String(category||"").toLowerCase();
  if(/mattress|bay\s*window|bay-window/.test(c))return "bulky";
  if(/topper/.test(c))return "medium";
  return "small"; // pillows, cushions, latex material, default
};
const UNITS_PER_PKG:Record<PkgType,number>={small:4,medium:2,bulky:1};
/** Indicative first-package domestic delivery fee (INR) by package type + zone. */
const DELIVERY_FEE:Record<PkgType,Record<string,number>>={
  small:{A:200,B:450,C:850},
  medium:{A:900,B:1600,C:3200},
  bulky:{A:2600,B:4500,C:7500},
};
/** Extra-package multiplier (first package full, additional discounted). */
const EXTRA_PKG_FACTOR:Record<PkgType,number>={small:0.5,medium:0.6,bulky:0.85};
type CartItem={cartKey:string;productId:string;productName:string;sku:string;variantLabel:string;priceINR:string;priceUSD:string;priceNumINR:number;quoteRequired:boolean;image:string;quantity:number;};
const EMPTY_FORM={name:"",company:"",email:"",phone:"",city:"",state:"",pincode:"",customerType:"Home Buyer",productName:"",selectedSize:"",quantity:"1",message:"",intent:"quote"};
/** All 28 Indian states + 8 union territories (alphabetical). Used for state-selection dropdowns. */
const INDIAN_STATES=["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi (NCT)","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"];
const FALLBACK_IMG="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23EFE8DE'/%3E%3Crect x='220' y='140' width='160' height='120' rx='8' fill='%23D9CBB8'/%3E%3Ccircle cx='300' cy='165' r='22' fill='%23C8A97E' opacity='.6'/%3E%3Ctext x='300' y='290' text-anchor='middle' font-family='serif' font-size='14' fill='%23C8A97E' letter-spacing='3'%3EXIYORA%3C/text%3E%3C/svg%3E";

/* ─── GLOBAL CSS ─────────────────────────────────────────── */
const CSS=`
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Inter',sans-serif;background:#F6F3EB;color:#1E1E1C;overflow-x:hidden;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
@keyframes fadeInUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
@keyframes heroScale{from{transform:scale(1.06)}to{transform:scale(1)}}
@keyframes glowPulse{0%,100%{box-shadow:0 0 20px rgba(200,169,126,.12)}50%{box-shadow:0 0 60px rgba(200,169,126,.32)}}
@keyframes sweepBtn{0%{left:-60%}100%{left:120%}}
@keyframes revealUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
.ht1{animation:fadeInUp .9s ease both}
.ht2{animation:fadeInUp .9s .14s ease both}
.ht3{animation:fadeInUp .9s .28s ease both}
.ht4{animation:fadeInUp .9s .42s ease both}
.ht5{animation:fadeInUp .9s .56s ease both}
.at{display:flex;animation:marquee 38s linear infinite}
.sl{font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#C8A97E;margin-bottom:14px;font-weight:500;display:block}
.nl{color:#2D2D2D;font-size:12.5px;font-weight:400;letter-spacing:1.2px;text-transform:uppercase;transition:color .3s;background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;padding:4px 0;position:relative;line-height:1}
.nl::after{content:'';position:absolute;bottom:-3px;left:0;width:0;height:1px;background:#C8A97E;transition:width .3s ease}
.nl:hover{color:#C8A97E}.nl:hover::after{width:100%}
.bg{background:#C8A97E;color:#fff;border:none;padding:13px 28px;font-family:'Inter',sans-serif;font-size:12px;font-weight:500;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all .3s;border-radius:2px;position:relative;overflow:hidden}
.bg::before{content:'';position:absolute;top:0;left:-60%;width:40%;height:100%;background:linear-gradient(to right,transparent,rgba(255,255,255,.18),transparent);transform:skewX(-20deg);transition:none}
.bg:hover::before{animation:sweepBtn .5s ease forwards}
.bg:hover{background:#B89472;transform:translateY(-2px);box-shadow:0 10px 28px rgba(200,169,126,.32)}
.bg:active{transform:translateY(0)}
.bo{background:transparent;color:#C8A97E;border:1px solid #C8A97E;padding:13px 28px;font-family:'Inter',sans-serif;font-size:12px;font-weight:400;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all .3s;border-radius:2px}
.bo:hover{background:#C8A97E;color:#fff;transform:translateY(-1px)}
.bd{background:transparent;border:1px solid #3a3a3a;color:#D9CBB8;padding:13px 28px;font-family:'Inter',sans-serif;font-size:12px;font-weight:400;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all .3s;border-radius:2px}
.bd:hover{border-color:#C8A97E;color:#C8A97E}
.ib{background:none;border:none;cursor:pointer;color:#2D2D2D;display:flex;align-items:center;justify-content:center;transition:color .3s,transform .2s;padding:6px}
.ib:hover{color:#C8A97E;transform:scale(1.1)}
.pc{background:#F8F6F2;border-radius:4px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.05);transition:all .4s cubic-bezier(.23,1,.32,1);cursor:pointer;position:relative}
.pc:hover{box-shadow:0 24px 60px rgba(0,0,0,.13);transform:translateY(-5px)}
.pc:hover .pi{transform:scale(1.07)}
.pi{transition:transform .65s cubic-bezier(.23,1,.32,1);width:100%;height:100%;object-fit:cover}
.cc{position:relative;border-radius:4px;overflow:hidden;cursor:pointer;transition:transform .4s cubic-bezier(.23,1,.32,1)}
.cc:hover{transform:translateY(-7px);box-shadow:0 20px 50px rgba(0,0,0,.18)}
.cc:hover .ci{transform:scale(1.08)}
.ci{width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.23,1,.32,1)}
/* ── TYPOGRAPHY CONTRAST IMPROVEMENTS ── */
.txt-muted{color:#6a6a6a!important}
.txt-dim{color:#888!important}
.txt-body{color:#555!important;font-weight:400!important}
.lbl-sm{font-size:11px;letter-spacing:1.8px;text-transform:uppercase;color:#888;margin-bottom:10px;font-weight:500}
.spec-key{font-size:12.5px;color:#666;width:38%;vertical-align:top;padding:7px 10px 7px 0}
.spec-val{font-size:13px;color:#2D2D2D;padding:7px 0}
.price-note{font-size:12px;color:#777;line-height:1.6}
.delivery-txt{font-size:13px;color:#666;line-height:1.65}
.card-desc{font-size:12.5px;color:#777;margin-bottom:14px;line-height:1.6}
.wb{position:fixed;bottom:28px;right:28px;z-index:998;background:#25D366;color:#fff;width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 26px rgba(37,211,102,.42);cursor:pointer;transition:all .3s}
.wb::before{content:'';position:absolute;inset:0;border-radius:50%;background:#25D366;z-index:-1;animation:wbPulse 2.4s cubic-bezier(.22,1,.36,1) infinite}
@keyframes wbPulse{0%{transform:scale(1);opacity:.55}70%{transform:scale(1.65);opacity:0}100%{transform:scale(1.65);opacity:0}}
.wb:hover{transform:scale(1.14);box-shadow:0 10px 38px rgba(37,211,102,.52)}
.fl{font-size:13px;color:#666;cursor:pointer;transition:color .25s;margin-bottom:11px;display:block;text-decoration:none;background:none;border:none;text-align:left;font-family:'Inter',sans-serif;padding:0}
.fl:hover{color:#C8A97E}
input:focus,select:focus,textarea:focus{outline:none;border-color:#C8A97E!important;box-shadow:0 0 0 3px rgba(200,169,126,.1)}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#F8F6F2}::-webkit-scrollbar-thumb{background:#D9CBB8;border-radius:2px}::-webkit-scrollbar-thumb:hover{background:#C8A97E}
.img-zoom-overlay{position:fixed;inset:0;z-index:1100;background:rgba(0,0,0,.93);display:flex;align-items:center;justify-content:center;cursor:zoom-out;backdrop-filter:blur(6px)}
.img-zoom-overlay img{max-width:90vw;max-height:88vh;object-fit:contain;border-radius:2px;animation:fadeInUp .25s ease}
.glass-modal{background:rgba(248,246,242,.97);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(217,203,184,.4);border-radius:6px;box-shadow:0 32px 80px rgba(0,0,0,.22)}
.google-btn{display:flex;align-items:center;gap:7px;background:#fff;border:1px solid #E0D5C9;border-radius:20px;padding:5px 13px;font-family:'Inter',sans-serif;font-size:11.5px;font-weight:500;color:#444;cursor:pointer;transition:all .25s;white-space:nowrap;letter-spacing:.3px}
.google-btn:hover{background:#F5EEE4;border-color:#C8A97E;color:#2D2D2D;box-shadow:0 4px 12px rgba(200,169,126,.16)}
.inp{width:100%;background:#fafaf8;border:1px solid #E8DFCF;padding:11px 13px;font-size:13px;border-radius:3px;font-family:'Inter',sans-serif;color:#2D2D2D;margin-bottom:10px;transition:border-color .2s,box-shadow .2s}
.tag-pill{background:#C8A97E;color:#fff;padding:3px 10px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;font-weight:500;border-radius:20px;display:inline-block;margin-right:4px;margin-bottom:4px}
.reveal{opacity:0;transform:translateY(30px);transition:opacity .7s ease,transform .7s ease}
.reveal.visible{opacity:1;transform:translateY(0)}
/* ── DESKTOP LAYOUT ── */
.container{max-width:1280px;margin:0 auto;padding:0 40px}
.sec{padding:88px 0}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.grid-5{display:grid;grid-template-columns:repeat(5,1fr);gap:16px}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start}
/* ── TABLET ── */
@media(max-width:1024px){
  .nc{display:none!important}
  .container{padding:0 28px}
  .grid-5{grid-template-columns:repeat(3,1fr)!important}
  .grid-4{grid-template-columns:repeat(2,1fr)!important}
  .grid-3{grid-template-columns:repeat(2,1fr)!important}
  .grid-2{gap:36px!important}
  .fc-grid{grid-template-columns:1fr 1fr!important}
}
/* ── MOBILE ── */
@media(max-width:768px){
  .container{padding:0 18px}
  .sec{padding:56px 0}
  .grid-3,.grid-4,.grid-5{grid-template-columns:1fr 1fr!important;gap:14px!important}
  .grid-2{grid-template-columns:1fr!important;gap:24px!important}
  .fc-grid{grid-template-columns:1fr!important}
  .hh{font-size:clamp(2.6rem,8vw,4rem)!important}
  .hero-h{height:75vh!important}
  .detail-img-h{height:300px!important}
}
@media(max-width:480px){
  .grid-3,.grid-4,.grid-5{grid-template-columns:1fr!important}
  .container{padding:0 14px}
}
/* ── NAV MOBILE HIDE ── */
@media(max-width:1024px){.nc-item{display:none!important}}
/* ── CHECKOUT GRID ── */
.checkout-grid{grid-template-columns:1fr 1fr!important}
@media(max-width:900px){.checkout-grid{grid-template-columns:1fr!important}}
/* ── PROOF LIBRARY ── */
.proof-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
@media(max-width:900px){.proof-grid{grid-template-columns:1fr 1fr!important}}
@media(max-width:560px){.proof-grid{grid-template-columns:1fr!important}}
/* ── DESKTOP HERO IMPROVEMENTS ── */
@media(min-width:1200px){
  .container{padding:0 60px}
  .hh{font-size:clamp(3.5rem,4.5vw,6rem)!important}
  .sec{padding:100px 0}
}
/* ── SIDEBAR DRAWER ── */
.sdrawer{position:fixed;top:0;left:0;height:100%;width:300px;max-width:85vw;background:#1C1C1C;z-index:500;box-shadow:12px 0 60px rgba(0,0,0,.45);overflow-y:auto;transform:translateX(-100%);transition:transform .32s cubic-bezier(.23,1,.32,1)}
.sdrawer.open{transform:translateX(0)}
.sdrawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:499;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}
.sdr-link{display:block;background:none;border:none;padding:11px 24px;font-family:'Inter',sans-serif;font-size:13px;letter-spacing:.6px;color:#C0B8AC;cursor:pointer;text-align:left;width:100%;transition:all .2s;border-left:2px solid transparent}
.sdr-link:hover{color:#C8A97E;background:rgba(200,169,126,.08);border-left-color:#C8A97E}
.sdr-section{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:#555;padding:14px 24px 4px;display:block}
/* ── CERT CHIPS ── */
.cert-chip{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border:1px solid ${C.sand};border-radius:20px;font-family:'Inter',sans-serif;font-size:10.5px;letter-spacing:.8px;color:#888;background:#fafaf8;cursor:pointer;transition:all .2s;white-space:nowrap}
.cert-chip:hover{border-color:#C8A97E;color:#C8A97E;background:#F5EDE0}
/* ── PROOF CTA MOBILE ── */
@media(max-width:680px){
  .proof-cta{flex-direction:column!important;align-items:stretch!important;padding:28px 22px!important}
  .proof-cta-btns{flex-direction:column!important;width:100%!important;flex-shrink:unset!important}
  .proof-cta-btns button{width:100%!important;box-sizing:border-box}
}
/* ── FOOTER MOBILE ── */
@media(max-width:768px){.fc-grid{grid-template-columns:1fr 1fr!important;gap:28px!important}}
@media(max-width:480px){.fc-grid{grid-template-columns:1fr!important}}
/* ── BOTTOM SAFE AREA (avoid WhatsApp FAB overlap) ── */
.safe-bottom{padding-bottom:90px}
/* ── MOBILE ORNAMENT ── */
@media(max-width:640px){.nav-ornament{display:none!important}}
/* ── V3 PREMIUM MOTION SYSTEM ── */
.xiyora-reveal{opacity:0;transform:translateY(22px);filter:blur(6px);transition:opacity .76s cubic-bezier(.22,1,.36,1),transform .76s cubic-bezier(.22,1,.36,1),filter .76s cubic-bezier(.22,1,.36,1)}
.xiyora-reveal.is-visible{opacity:1;transform:translateY(0);filter:blur(0)}
.xiyora-premium-card{transition:transform .42s cubic-bezier(.22,1,.36,1),box-shadow .42s cubic-bezier(.22,1,.36,1),border-color .42s cubic-bezier(.22,1,.36,1);will-change:transform}
.xiyora-premium-card:hover{transform:translateY(-7px) scale(1.012);box-shadow:0 22px 60px rgba(35,24,15,.14)}
.xiyora-gold-button{position:relative;overflow:hidden}
.xiyora-gold-button::after{content:'';position:absolute;inset:0;transform:translateX(-120%);background:linear-gradient(110deg,transparent,rgba(255,255,255,.28),transparent);transition:transform .68s cubic-bezier(.22,1,.36,1);pointer-events:none}
.xiyora-gold-button:hover::after{transform:translateX(120%)}
.xiyora-price-pulse{animation:xiyoraPricePulse .9s cubic-bezier(.22,1,.36,1)}
@keyframes xiyoraPricePulse{0%{box-shadow:0 0 0 rgba(201,170,120,0)}35%{box-shadow:0 0 0 7px rgba(201,170,120,.18)}100%{box-shadow:0 0 0 rgba(201,170,120,0)}}
.xiyora-whatsapp-popup{transform-origin:bottom right;animation:xiyoraPopupIn .42s cubic-bezier(.22,1,.36,1)}
@keyframes xiyoraPopupIn{from{opacity:0;transform:translateY(16px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
.xiyora-video-overlay{background:linear-gradient(90deg,rgba(20,17,14,.74),rgba(20,17,14,.34),rgba(20,17,14,.1)),linear-gradient(0deg,rgba(20,17,14,.5),transparent 44%)}
.bt-chip{display:inline-flex;align-items:center;gap:7px;padding:9px 16px;border-radius:30px;border:1px solid ${C.sand};background:#fafaf8;font-family:'Inter',sans-serif;font-size:12px;letter-spacing:.4px;color:#555;cursor:pointer;transition:all .25s;white-space:nowrap}
.bt-chip:hover{border-color:#C8A97E;color:#2D2D2D;box-shadow:0 6px 18px rgba(200,169,126,.16);transform:translateY(-2px)}
.bt-chip.active{background:#C8A97E;border-color:#C8A97E;color:#fff;box-shadow:0 8px 22px rgba(200,169,126,.3)}
/* ── ASIAN-LUXURY MOTIF SYSTEM (v4 redesign) ── */
.serif{font-family:'Playfair Display',serif}
.paper{background-color:#F6F3EB;background-image:radial-gradient(circle at 18% 24%,rgba(191,162,149,.06),transparent 42%),radial-gradient(circle at 82% 76%,rgba(212,197,161,.07),transparent 46%)}
.ink-wash{position:relative;isolation:isolate}
.ink-wash::before{content:'';position:absolute;inset:0;pointer-events:none;z-index:-1;background:radial-gradient(110% 70% at 100% 0%,rgba(74,75,70,.07),transparent 60%),radial-gradient(90% 60% at 0% 100%,rgba(159,59,46,.045),transparent 55%)}
.seal{display:inline-flex;align-items:center;justify-content:center;min-width:38px;height:38px;padding:0 7px;border:1.5px solid #9E3B2E;color:#9E3B2E;border-radius:6px;font-family:'Playfair Display',serif;font-size:15px;font-weight:600;line-height:1;opacity:.9;transition:transform .45s cubic-bezier(.22,1,.36,1),box-shadow .45s}
.seal:hover{transform:rotate(-4deg) scale(1.06);box-shadow:0 6px 18px rgba(159,59,46,.18)}
.x-divider{display:flex;align-items:center;justify-content:center;gap:15px;margin:0 auto;color:#C8A97E;font-size:13px}
.x-divider::before,.x-divider::after{content:'';height:1px;width:clamp(40px,8vw,80px)}
.x-divider::before{background:linear-gradient(to right,transparent,#C8A97E)}
.x-divider::after{background:linear-gradient(to left,transparent,#C8A97E)}
.x-link{position:relative;display:inline-flex;align-items:center;gap:9px;color:#1E1E1C;cursor:pointer;font-size:11.5px;letter-spacing:1.8px;text-transform:uppercase;background:none;border:none;font-family:'Inter',sans-serif;font-weight:500;padding:0;transition:color .3s;text-decoration:none}
.x-link::after{content:'';position:absolute;left:0;bottom:-6px;height:1px;width:0;background:#C8A97E;transition:width .45s cubic-bezier(.22,1,.36,1)}
.x-link:hover{color:#C8A97E}.x-link:hover::after{width:100%}
.x-link .ar{display:inline-block;transition:transform .45s cubic-bezier(.22,1,.36,1)}
.x-link:hover .ar{transform:translateX(7px)}
.x-frame{position:relative;overflow:hidden}
.x-frame img,.x-frame .x-frame-img{transition:transform .95s cubic-bezier(.22,1,.36,1)}
.x-frame:hover img,.x-frame:hover .x-frame-img{transform:scale(1.07)}
@keyframes drift{0%,100%{transform:translate(0,0)}50%{transform:translate(7px,-11px)}}
.x-drift{animation:drift 9s ease-in-out infinite}
@keyframes driftSlow{0%,100%{transform:translate(0,0) rotate(0)}50%{transform:translate(-9px,8px) rotate(2deg)}}
.x-drift-slow{animation:driftSlow 13s ease-in-out infinite}
.x-tag{writing-mode:vertical-rl;text-orientation:mixed;letter-spacing:5px;font-family:'Playfair Display',serif}
.brush-edge{-webkit-mask-image:linear-gradient(to right,#000 84%,transparent 100%);mask-image:linear-gradient(to right,#000 84%,transparent 100%)}
.x-stagger>*{opacity:0;transform:translateY(22px);transition:opacity .75s cubic-bezier(.22,1,.36,1),transform .75s cubic-bezier(.22,1,.36,1)}
.x-stagger.is-visible>*{opacity:1;transform:translateY(0)}
.x-stagger.is-visible>*:nth-child(2){transition-delay:.07s}
.x-stagger.is-visible>*:nth-child(3){transition-delay:.14s}
.x-stagger.is-visible>*:nth-child(4){transition-delay:.21s}
.x-stagger.is-visible>*:nth-child(5){transition-delay:.28s}
.x-stagger.is-visible>*:nth-child(6){transition-delay:.35s}
.cc-tag{position:absolute;top:0;right:18px;background:linear-gradient(#EFE9DC,#E5DFCD);color:#5a4a32;padding:14px 7px 11px;border-radius:0 0 4px 4px;box-shadow:0 6px 16px rgba(0,0,0,.18);font-size:14px;z-index:3}
.feat-ic{display:flex;flex-direction:column;align-items:center;gap:9px;text-align:center;transition:transform .4s cubic-bezier(.22,1,.36,1)}
.feat-ic:hover{transform:translateY(-4px)}
.feat-ic .ring{width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid ${C.sand};transition:border-color .4s,background .4s}
.feat-ic:hover .ring{border-color:#C8A97E;background:rgba(200,169,126,.08)}
/* ── LUX SPLIT HERO (mockup-faithful) ── */
.lux-hero{position:relative;overflow:hidden;background:#F6F3EB}
.lux-hero-photo{position:absolute;top:0;right:0;bottom:0;width:55%;overflow:hidden}
.lux-hero-photo img{width:100%;height:100%;object-fit:cover;object-position:center;animation:heroScale 2.2s cubic-bezier(.22,1,.36,1) both}
.lux-hero-photo::before{content:'';position:absolute;top:0;bottom:0;left:-1px;width:42%;z-index:2;background:linear-gradient(to right,#F6F3EB 3%,rgba(246,243,235,.55) 46%,rgba(246,243,235,0));pointer-events:none}
.lux-hero-photo::after{content:'';position:absolute;inset:0;z-index:2;background:linear-gradient(to top,rgba(20,18,16,.16),transparent 42%);pointer-events:none}
.lux-hero-inner{position:relative;z-index:4;min-height:82vh;display:flex;flex-direction:column;justify-content:center;max-width:560px;padding:74px 0}
.lux-bamboo{position:absolute;top:0;left:0;height:100%;width:130px;z-index:1;opacity:.5;pointer-events:none}
.feat-row{display:flex;gap:26px;flex-wrap:wrap}
.feat-item{display:flex;flex-direction:column;align-items:center;text-align:center;gap:9px;width:78px}
.feat-item .fring{width:44px;height:44px;border-radius:50%;border:1px solid ${C.sand};display:flex;align-items:center;justify-content:center;transition:all .4s cubic-bezier(.22,1,.36,1)}
.feat-item:hover .fring{border-color:#C8A97E;background:rgba(200,169,126,.08);transform:translateY(-3px)}
.feat-item .flabel{font-size:9.5px;letter-spacing:1.3px;text-transform:uppercase;color:${C.ink};line-height:1.45;font-weight:500}
.icon-strip{display:flex;justify-content:center;align-items:flex-start;gap:0;flex-wrap:wrap}
.icon-strip .ist{flex:1;min-width:120px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:11px;padding:10px 16px;position:relative}
.icon-strip .ist:not(:last-child)::after{content:'';position:absolute;right:0;top:18%;height:64%;width:1px;background:${C.sand}}
.icon-strip .ist .flabel{font-size:10px;letter-spacing:1.6px;text-transform:uppercase;color:#8a8378;font-weight:500;line-height:1.5}
@media(max-width:900px){
  .lux-hero-photo{position:relative;width:100%;height:300px}
  .lux-hero-photo::before{background:linear-gradient(to top,#F6F3EB 1%,rgba(246,243,235,0) 40%)}
  .lux-hero-inner{min-height:auto;padding:40px 0;max-width:none}
  .lux-bamboo{display:none}
}
@media(max-width:560px){.icon-strip .ist{min-width:33%}.icon-strip .ist:nth-child(3)::after{display:none}}
/* ── DARK LUX HOMEPAGE (reference-faithful black-lacquer + gold) ── */
.lux-noir{background:#0c0a08;background-image:radial-gradient(130% 82% at 50% -12%,rgba(48,35,20,.92),transparent 56%),radial-gradient(70% 55% at 100% 0%,rgba(64,46,24,.42),transparent 60%),radial-gradient(60% 50% at 0% 100%,rgba(60,42,22,.34),transparent 60%);color:#EFE6D6}
.ornate{position:relative;border:1px solid rgba(200,169,126,.42);box-shadow:inset 0 0 0 4px rgba(200,169,126,.07),inset 0 0 80px rgba(0,0,0,.5),0 26px 70px rgba(0,0,0,.5)}
.ornate::before{content:'';position:absolute;inset:9px;border:1px solid rgba(200,169,126,.2);border-radius:inherit;pointer-events:none;z-index:6}
.gold-italic{font-family:'Playfair Display',serif;font-style:italic;background:linear-gradient(180deg,#F2D78C 0%,#C99A55 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:#D9B485}
.gold-grad{background:linear-gradient(180deg,#F2D78C 0%,#C99A55 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:#D9B485}
.feat-circ{width:54px;height:54px;border-radius:50%;border:1px solid rgba(200,169,126,.5);display:flex;align-items:center;justify-content:center;transition:transform .4s,background .4s,border-color .4s;flex-shrink:0}
.feat-circ:hover{background:rgba(200,169,126,.12);border-color:#E6C89A;transform:translateY(-3px)}
.btn-gold-out{display:inline-flex;align-items:center;justify-content:center;gap:11px;background:linear-gradient(180deg,rgba(200,169,126,.16),rgba(200,169,126,.03));color:#EBD3A6;border:1px solid rgba(200,169,126,.55);padding:15px 32px;font-family:'Inter',sans-serif;font-size:11.5px;font-weight:500;letter-spacing:2.4px;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:all .35s;position:relative;overflow:hidden}
.btn-gold-out:hover{background:rgba(200,169,126,.22);border-color:#E6C89A;color:#FBEFD8;transform:translateY(-2px);box-shadow:0 12px 32px rgba(200,169,126,.22)}
.btn-ivory{display:inline-flex;align-items:center;justify-content:center;gap:11px;background:linear-gradient(180deg,#F4EBD9,#E2D2B6);color:#2a2118;border:1px solid #d8c298;padding:15px 32px;font-family:'Inter',sans-serif;font-size:11.5px;font-weight:600;letter-spacing:2.4px;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:all .35s}
.btn-ivory:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,0,0,.45);background:linear-gradient(180deg,#FBF4E6,#EADCC2)}
.deco-float{animation:driftSlow 14s ease-in-out infinite}
@keyframes petalFall{0%{transform:translateY(-12vh) rotate(0deg);opacity:0}9%{opacity:.85}90%{opacity:.65}100%{transform:translateY(118vh) rotate(480deg);opacity:0}}
@keyframes petalSway{0%,100%{transform:translateX(0)}50%{transform:translateX(26px)}}
.petal-layer{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.petal{position:absolute;top:0;will-change:transform;animation:petalFall linear infinite}
.petal i{display:block;width:100%;height:100%;background:radial-gradient(circle at 32% 28%,#f8d3d9,#ea9faa 62%,#d77f8f);border-radius:100% 0 100% 0;box-shadow:inset -1px -1px 2px rgba(150,60,80,.22);animation:petalSway ease-in-out infinite}
.lux-feat-row{display:flex;align-items:flex-start;gap:0}
.lux-feat-row .lf{flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;padding:0 6px;position:relative}
.lux-feat-row .lf:not(:last-child)::after{content:'';position:absolute;right:0;top:8px;height:42px;width:1px;background:rgba(200,169,126,.3)}
.lux-feat-row .lf .lfl{font-size:9.5px;letter-spacing:1.4px;text-transform:uppercase;color:#bdae97;line-height:1.5;font-weight:500}
.biz-feat{display:flex;align-items:center;gap:9px}
.biz-feat .bft{font-size:9.5px;letter-spacing:1.2px;text-transform:uppercase;color:#bdae97;line-height:1.4;font-weight:500}
.trust-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:26px}
.trust-item{display:flex;align-items:center;gap:14px;justify-content:center}
@media(max-width:900px){
  .lux-hero-grid{grid-template-columns:1fr!important}
  .lux-hero-photo-r{order:-1;min-height:330px!important}
  .biz-grid{grid-template-columns:1fr!important;justify-items:center;text-align:center}
  .biz-feats{justify-content:center}
  .trust-grid{grid-template-columns:1fr 1fr!important;gap:22px}
  .trust-item{justify-content:flex-start}
}
@media(max-width:560px){.lux-feat-row{flex-wrap:wrap;gap:18px 0}.lux-feat-row .lf{flex:0 0 50%}.lux-feat-row .lf::after{display:none}.trust-grid{grid-template-columns:1fr!important}.biz-feats{grid-template-columns:1fr 1fr!important}}
.lux-hero-copy{align-items:flex-start}.lux-brand-lock{align-self:flex-start}
@media(max-width:900px){.lux-hero-copy{align-items:center;text-align:center}.lux-brand-lock{align-self:center}.lux-hero-copy p{margin-left:auto!important;margin-right:auto!important}.lux-bingxi{justify-content:center}.lux-cta-row{justify-content:center}.lux-feat-row{margin-left:auto!important;margin-right:auto!important}}
.nav-cartouche{transition:background .3s}
@media(max-width:640px){.nav-brand-sub{display:none!important}.nav-cartouche{padding:3px 12px!important}.nav-brand-x{font-size:18px!important;letter-spacing:3px!important}.nav-mono{width:20px!important;height:20px!important}.nav-right{gap:1px!important}.nav-cur{padding:4px 5px!important;font-size:10px!important}}
@media(max-width:430px){.nav-theme{display:none!important}.nav-wish{display:none!important}}
@media(prefers-reduced-motion:reduce){.petal{display:none!important}.deco-float{animation:none!important}}
@media(prefers-reduced-motion:reduce){
  .lux-hero-photo img{animation:none!important}
  .xiyora-reveal,.xiyora-premium-card,.xiyora-gold-button,.xiyora-whatsapp-popup,.ht1,.ht2,.ht3,.ht4,.ht5,.x-drift,.x-drift-slow,.x-stagger>*,.x-frame img,.x-frame .x-frame-img{animation:none!important;transition:none!important;transform:none!important;filter:none!important;opacity:1!important}
  .wb::before{animation:none!important;opacity:0!important}
}
`;

/* ─── SMALL UI COMPONENTS ────────────────────────────────── */
const Tag=({c=C.gold,children}:{c?:string;children:React.ReactNode})=>(
  <span className="tag-pill" style={{background:c}}>{children}</span>
);
const SL=({children,dark}:{children:React.ReactNode;dark?:boolean})=>(
  <span className="sl" style={{color:dark?"#9B8B6E":"#C8A97E"}}>{children}</span>
);
const SH=({children,dark,center,size}:{children:React.ReactNode;dark?:boolean;center?:boolean;size?:string|number})=>{
  const C=useC();
  const st:React.CSSProperties={fontFamily:"'Playfair Display',serif",fontSize:size||"clamp(1.9rem,3.2vw,2.8rem)",fontWeight:400,color:dark?"#F0EBE3":C.dark,lineHeight:1.12,textAlign:center?"center":"left"};
  if(typeof children==="string")return <h2 style={st} dangerouslySetInnerHTML={{__html:children}}/>;
  return <h2 style={st}>{children}</h2>;
};

/* ─── SPINNER ────────────────────────────────────────────── */
const Spinner=()=>(
  <div style={{width:18,height:18,border:"2px solid rgba(255,255,255,.3)",borderTop:"2px solid #fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>
);

/* ─── BUYER BEST-FIT GUIDANCE (source: v3_customer_best_fit_product_rules) ── */
const BUYER_TYPES=[
  {key:"home_buyer",label:"Home Buyer",cta:"Explore Comfort Products",catFilter:"Pillows",message:"Best for personal comfort, mattress upgrades, and premium sleep products."},
  {key:"retailer",label:"Retailer",cta:"Request Catalogue",catFilter:null,message:"Best for resale-ready catalogue review and recurring quote requests."},
  {key:"hotel",label:"Hotel / Villa / Serviced Apartment",cta:"Request B2B Proforma",catFilter:"Mattresses",message:"Best for premium room comfort, bulk quantities, and document-backed sourcing."},
  {key:"interior_designer",label:"Interior Designer",cta:"Discuss Custom Project",catFilter:"Cushions",message:"Best for bay windows, seating, project sizes, and custom comfort applications."},
  {key:"trade_partner",label:"Trade / Distributor",cta:"Start Trade Enquiry",catFilter:null,message:"Best for supplier catalogue review, repeat orders, and scalable sourcing."},
];

/* ─── SCROLL REVEAL HOOK ─────────────────────────────────── */
function useReveal<T extends HTMLElement>(){
  const ref=useRef<T>(null);
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    if(typeof IntersectionObserver==="undefined"){el.classList.add("is-visible");return;}
    const io=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{if(e.isIntersecting){el.classList.add("is-visible");io.unobserve(el);}});
    },{threshold:.14,rootMargin:"0px 0px -8% 0px"});
    io.observe(el);
    return()=>io.disconnect();
  },[]);
  return ref;
}
const Reveal=({children,style,className}:{children:React.ReactNode;style?:React.CSSProperties;className?:string})=>{
  const ref=useReveal<HTMLDivElement>();
  return <div ref={ref} className={`xiyora-reveal ${className||""}`} style={style}>{children}</div>;
};
const Stagger=({children,style,className}:{children:React.ReactNode;style?:React.CSSProperties;className?:string})=>{
  const ref=useReveal<HTMLDivElement>();
  return <div ref={ref} className={`x-stagger ${className||""}`} style={style}>{children}</div>;
};

/* ─── DECORATIVE MOTIFS (inline SVG, Asian-luxury identity) ── */
/** Red seal stamp — accent near headings. `ch` is the glyph (Chinese char or monogram). */
const Seal=({ch="信",title,style}:{ch?:string;title?:string;style?:React.CSSProperties})=>(
  <span className="seal" title={title||"XIYORA seal"} style={style} aria-hidden>{ch}</span>
);
/** Champagne-gold cloud motif (祥云) — corner/background ornament. */
const GoldCloud=({size=120,opacity=.5,color="#C8A97E",className,style}:{size?:number;opacity?:number;color?:string;className?:string;style?:React.CSSProperties})=>(
  <svg className={className} style={style} width={size} height={size*0.5} viewBox="0 0 240 120" fill="none" aria-hidden>
    <g stroke={color} strokeWidth="2" opacity={opacity} fill="none" strokeLinecap="round">
      <path d="M20 86c0-14 10-24 24-24 2-18 16-30 34-30 14 0 26 8 31 21 14 1 25 12 25 26"/>
      <path d="M150 92c20 0 30-10 30-24 0-12-9-22-22-23-3-13-14-22-28-22"/>
      <path d="M44 86c8 0 14-6 14-14M196 92c14 0 22-8 22-20"/>
      <circle cx="92" cy="60" r="5"/><circle cx="170" cy="62" r="4"/>
    </g>
  </svg>
);
/** Sakura/plum branch sprig — soft editorial accent. */
const Sakura=({size=140,color="#BFA295",className,style}:{size?:number;color?:string;className?:string;style?:React.CSSProperties})=>(
  <svg className={className} style={style} width={size} height={size} viewBox="0 0 160 160" fill="none" aria-hidden>
    <path d="M10 150C50 120 70 90 78 50" stroke={color} strokeWidth="2.4" strokeLinecap="round"/>
    <path d="M78 50C84 36 96 28 112 26M60 86C70 80 82 82 90 92M40 116c8-8 20-9 30-3" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    {[[112,24],[90,94],[70,4],[36,118],[126,40]].map(([cx,cy],i)=>(
      <g key={i} opacity=".85">{[0,72,144,216,288].map(a=>(
        <ellipse key={a} cx={cx} cy={cy-7} rx="3.4" ry="6" fill={color} opacity=".55" transform={`rotate(${a} ${cx} ${cy})`}/>
      ))}<circle cx={cx} cy={cy} r="2" fill="#9E3B2E" opacity=".6"/></g>
    ))}
  </svg>
);
/** XIYORA monogram lockup with "Crafted Comfort" tagline. */
const Monogram=({color,size=1,tagline=true,center}:{color?:string;size?:number;tagline?:boolean;center?:boolean})=>{
  const c=color||"#C8A97E";
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:center?"center":"flex-start",gap:6*size}}>
      <svg width={40*size} height={40*size} viewBox="0 0 48 48" fill="none" aria-hidden>
        <circle cx="24" cy="24" r="22" stroke={c} strokeWidth="1.3"/>
        <path d="M16 16l16 16M32 16L16 32" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="24" cy="24" r="3.4" fill={c}/>
      </svg>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:30*size,letterSpacing:8*size,color:c,lineHeight:1,fontWeight:500}}>XIYORA</div>
      {tagline&&<div style={{fontFamily:"'Inter',sans-serif",fontSize:9.5*size,letterSpacing:4.5*size,textTransform:"uppercase",color:c,opacity:.8}}>Crafted Comfort</div>}
    </div>
  );
};

/* ─── HERO MEDIA (video-first with image fallback) ───────── */
function HeroMedia(){
  const [failed,setFailed]=useState(false);
  if(failed)return(
    <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1800&q=85" alt="Luxury latex bedroom"
      style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 40%",animation:"heroScale 1.8s ease forwards"}}
      onError={(e:any)=>{e.currentTarget.src="/assets/products/talalay-bread-pillow/talalay-bread-pillow-1.jpg";}}/>
  );
  return(
    <video src="/assets/videos/xiyora-showcase.mp4" autoPlay muted loop playsInline
      poster="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1800&q=85"
      style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 45%"}}
      onError={()=>setFailed(true)}/>
  );
}

/* ─── LUX THIN-LINE ICON SET (mockup feature icons) ───────── */
const LUX_ICONS:Record<string,React.ReactNode>={
  leaf:<><path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z"/><path d="M2 21c0-3 1.9-5.4 5.1-6"/></>,
  shield:<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></>,
  heart:<path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 000-7.8z"/>,
  globe:<><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20a15 15 0 010-20z"/></>,
  truck:<><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/></>,
  clock:<><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>,
  headset:<><path d="M4 14v-3a8 8 0 0116 0v3"/><path d="M4 14a2 2 0 002 2h1v-5H6a2 2 0 00-2 2zM20 14a2 2 0 00-2-2h-1v5h1a2 2 0 002-2zM18 17v1a3 3 0 01-3 3h-3"/></>,
  sliders:<><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></>,
  check:<><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></>,
  box:<><path d="M21 16V8l-9-5-9 5v8l9 5 9-5z"/><path d="M3.3 7L12 12l8.7-5M12 22V12"/></>,
  doc:<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/></>,
  drop:<path d="M12 2.7s7 7.6 7 12.3a7 7 0 01-14 0c0-4.7 7-12.3 7-12.3z"/>,
  wave:<><path d="M2 8c2.5-2 4.5-2 7 0s4.5 2 7 0M2 13c2.5-2 4.5-2 7 0s4.5 2 7 0M2 18c2.5-2 4.5-2 7 0s4.5 2 7 0"/></>,
  hourglass:<><path d="M6 2h12M6 22h12M6 2c0 5 6 6 6 10M18 2c0 5-6 6-6 10M6 22c0-5 6-6 6-10M18 22c0-5-6-6-6-10"/></>,
  handshake:<><path d="M11 17l2 2a1.4 1.4 0 002-2M13 19l2 2a1.4 1.4 0 002-2l1-1"/><path d="M2 12l3-3 5 5M22 12l-3-3-4 4"/><path d="M5 9V6l4-2 3 2 3-2 4 2v3"/></>,
  craft:<><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></>,
  bed:<><path d="M2 18v-7a2 2 0 012-2h16a2 2 0 012 2v7M2 14h20M2 18v2M22 18v2"/><path d="M6 9V7a1 1 0 011-1h3a1 1 0 011 1v2"/></>,
};
const LuxIcon=({name,size=22,color}:{name:string;size?:number;color?:string})=>(
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color||"#C8A97E"} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>{LUX_ICONS[name]||LUX_ICONS.leaf}</svg>
);
/* Thin-line feature icon (vertical) used in heroes + strips */
const FeatItem=({name,label}:{name:string;label:string})=>(
  <div className="feat-item"><div className="fring"><LuxIcon name={name} size={20}/></div><div className="flabel">{label}</div></div>
);
/* Bamboo silhouette (left hero ornament) */
const Bamboo=({className,style,color="#9aa08f"}:{className?:string;style?:React.CSSProperties;color?:string})=>(
  <svg className={className} style={style} viewBox="0 0 120 600" fill="none" preserveAspectRatio="xMinYMin slice" aria-hidden>
    <g stroke={color} strokeWidth="2.2" opacity=".7" fill="none">
      <path d="M30 600V20M30 120h0M30 220h0M30 320h0"/>
      <path d="M30 110q0 8 8 8M30 210q0 8 8 8M30 310q0 8 8 8M30 410q0 8 8 8"/>
      <path d="M55 600V70"/>
      <path d="M38 90q22-10 40-30M40 180q20-8 36-26M36 280q22-10 42-28M40 380q18-6 34-22" strokeWidth="1.5"/>
      <path d="M62 130q18-12 34-34M64 230q16-10 30-30M60 330q20-12 38-30" strokeWidth="1.3" opacity=".6"/>
    </g>
  </svg>
);

/* ─── LUX SPLIT HERO (reusable, mockup-faithful) ──────────── */
function LuxHero({title,subtitle,intro,partner,features,ctas,image,imageAlt,crumbs,seal,monoSize=1}:{
  title:React.ReactNode;subtitle?:string;intro?:string;partner?:string;
  features?:{name:string;label:string}[];ctas?:{label:string;onClick:()=>void;variant?:"primary"|"outline"|"dark"}[];
  image:string;imageAlt:string;crumbs?:string;seal?:string;monoSize?:number;
}){
  const C=useC();
  const [err,setErr]=useState(false);
  return(
    <section className="lux-hero paper">
      <Bamboo className="lux-bamboo x-drift-slow"/>
      <div className="lux-hero-photo x-frame">
        <img src={err?"/assets/lux/hero-bedroom.png":image} alt={imageAlt} onError={()=>setErr(true)}/>
        <GoldCloud className="x-drift" size={150} opacity={.3} style={{position:"absolute",top:"9%",right:"7%",zIndex:3,pointerEvents:"none"}}/>
      </div>
      <div className="container">
        <div className="lux-hero-inner">
          {crumbs&&<div className="ht1" style={{fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase",color:C.taupe,marginBottom:22}}>{crumbs}</div>}
          <div className="ht1" style={{marginBottom:20}}><Monogram color={C.gold} size={monoSize}/></div>
          <h1 className="ht2 serif" style={{fontSize:"clamp(2.3rem,4.4vw,3.7rem)",fontWeight:500,lineHeight:1.1,color:C.dark,margin:"4px 0 0"}}>{title}</h1>
          {subtitle&&<div className="ht2" style={{display:"flex",alignItems:"center",gap:12,margin:"16px 0 0"}}>
            <span style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1rem,1.5vw,1.25rem)",fontStyle:"italic",color:C.gold}}>{subtitle}</span>
            {seal&&<Seal ch={seal}/>}
          </div>}
          {intro&&<p className="ht3" style={{fontSize:14.5,color:C.ink,lineHeight:1.85,margin:"20px 0 0",maxWidth:430,fontWeight:400}}>{intro}</p>}
          {partner&&<p className="ht3" style={{fontSize:12,letterSpacing:"1px",color:C.taupe,margin:"14px 0 0",display:"flex",alignItems:"center",gap:10}}><span style={{width:24,height:1,background:C.gold,display:"inline-block"}}/>{partner}</p>}
          {features&&features.length>0&&<div className="feat-row ht4" style={{margin:"30px 0 0"}}>
            {features.map((f,i)=><FeatItem key={i} name={f.name} label={f.label}/>)}
          </div>}
          {ctas&&ctas.length>0&&<div className="ht5" style={{display:"flex",gap:13,flexWrap:"wrap",margin:"34px 0 0"}}>
            {ctas.map((c,i)=>(
              <button key={i} onClick={c.onClick}
                className={c.variant==="outline"?"bo xiyora-gold-button":c.variant==="dark"?"xiyora-gold-button":"bg xiyora-gold-button"}
                style={c.variant==="dark"?{background:C.char,color:"#F0EBE3",border:"none",padding:"14px 30px",fontSize:12,letterSpacing:"2px",textTransform:"uppercase",fontFamily:"'Inter',sans-serif",cursor:"pointer",borderRadius:2,fontWeight:500}:{padding:"14px 30px",fontSize:12,letterSpacing:"2px"}}>{c.label}</button>
            ))}
          </div>}
        </div>
      </div>
    </section>
  );
}
/* Reusable thin-line icon strip (recurring promise band) */
function IconStrip({items,bg}:{items:{name:string;label:string}[];bg?:string}){
  return(
    <section style={{background:bg||"#F3EFE5",borderTop:`1px solid #E5DFCD`,borderBottom:`1px solid #E5DFCD`,padding:"30px 0"}}>
      <div className="container"><Stagger className="icon-strip">
        {items.map((it,i)=>(
          <div key={i} className="ist"><LuxIcon name={it.name} size={26}/><div className="flabel">{it.label}</div></div>
        ))}
      </Stagger></div>
    </section>
  );
}

/* ─── DARK-LUXURY HOMEPAGE SYSTEM (black-lacquer + gold, reference-faithful) ── */
const DECO={
  sakuraCluster:"/assets/lux/deco/sakura-cluster.png",
  sakuraCorner:"/assets/lux/deco/sakura-corner.png",
  crane:"/assets/lux/deco/gold-crane.png",
  rabbit:"/assets/lux/deco/gold-rabbit.png",
  medallion:"/assets/lux/deco/crane-medallion.png",
  bamboo:"/assets/lux/deco/gold-bamboo.png",
};
/* Gold corner flourish for ornate frames */
const CornerFlourish=({style}:{style?:React.CSSProperties})=>(
  <svg width={58} height={58} viewBox="0 0 58 58" fill="none" aria-hidden style={style}>
    <path d="M4 4h20M4 4v20" stroke="#C8A97E" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M4 16c0-6.6 5.4-12 12-12" stroke="#C8A97E" strokeWidth=".9" opacity=".6"/>
    <path d="M10 10c14 0 24 10 24 24" stroke="#C8A97E" strokeWidth=".8" opacity=".4"/>
    <circle cx="8" cy="8" r="2.1" fill="#C8A97E"/>
    <path d="M16 6q9 2 11 11" stroke="#C8A97E" strokeWidth=".7" opacity=".4"/>
  </svg>
);
const CornerSet=()=>(<>
  <CornerFlourish style={{position:"absolute",top:4,left:4,zIndex:7}}/>
  <CornerFlourish style={{position:"absolute",top:4,right:4,transform:"scaleX(-1)",zIndex:7}}/>
  <CornerFlourish style={{position:"absolute",bottom:4,left:4,transform:"scaleY(-1)",zIndex:7}}/>
  <CornerFlourish style={{position:"absolute",bottom:4,right:4,transform:"scale(-1,-1)",zIndex:7}}/>
</>);
/* Falling sakura petals overlay (CSS-only, reduced-motion safe) */
function Petals({count=14,z=5}:{count?:number;z?:number}){
  const [petals]=useState(()=>Array.from({length:count}).map(()=>({
    left:Math.random()*100,size:7+Math.random()*9,dur:9+Math.random()*11,delay:Math.random()*14,sway:3+Math.random()*4,
  })));
  return(
    <div className="petal-layer" style={{zIndex:z}} aria-hidden>
      {petals.map((p,i)=>(
        <span key={i} className="petal" style={{left:`${p.left}%`,width:p.size,height:p.size*0.78,animationDuration:`${p.dur}s`,animationDelay:`-${p.delay}s`}}>
          <i style={{animationDuration:`${p.sway}s`,animationDelay:`-${p.delay}s`}}/>
        </span>
      ))}
    </div>
  );
}
/* Circle-X monogram mark (gold lockup) */
const MonoMark=({size=42,color="#C8A97E"}:{size?:number;color?:string})=>(
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
    <circle cx="24" cy="24" r="22" stroke={color} strokeWidth="1.2"/>
    <circle cx="24" cy="24" r="17.5" stroke={color} strokeWidth=".6" opacity=".45"/>
    <path d="M16 16l16 16M32 16L16 32" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
    <circle cx="24" cy="24" r="3.2" fill={color}/>
  </svg>
);
/* Floral rosette (apex of arched cartouche) */
const Rosette=({size=24}:{size?:number})=>(
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden style={{display:"block"}}>
    <g transform="translate(20 20)">
      {[0,45,90,135,180,225,270,315].map(a=>(<ellipse key={a} cx="0" cy="-11" rx="3.6" ry="8" fill="#C8A97E" opacity=".82" transform={`rotate(${a})`}/>))}
      <circle r="6.6" fill="none" stroke="#C8A97E" strokeWidth="1" opacity=".7"/>
      <circle r="3.4" fill="#9E3B2E"/>
    </g>
  </svg>
);
/* Ornate open arched cartouche framing the brand lockup (2D gold linework) */
const ArchedCartouche=({children,className}:{children:React.ReactNode;className?:string})=>(
  <div className={className} style={{position:"relative",display:"inline-flex",flexDirection:"column",alignItems:"center",padding:"32px 42px 14px",maxWidth:"100%"}}>
    <svg viewBox="0 0 320 150" fill="none" preserveAspectRatio="none" aria-hidden style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}>
      <path d="M16 150 V62 Q16 16 84 14 H236 Q304 16 304 62 V150" stroke="#C8A97E" strokeWidth="1.4"/>
      <path d="M24 150 V62 Q24 24 86 22 H234 Q296 24 296 62 V150" stroke="#C8A97E" strokeWidth=".7" opacity=".5"/>
      <path d="M16 150 q-13 -1 -14 -16 M304 150 q13 -1 14 -16" stroke="#C8A97E" strokeWidth="1"/>
    </svg>
    <div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",zIndex:3}}><Rosette size={24}/></div>
    <div style={{position:"relative",zIndex:2,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>{children}</div>
  </div>
);
const LUX_HERO_FEATURES=[
  {name:"leaf",label:"Natural Latex"},
  {name:"shield",label:"Premium Quality"},
  {name:"heart",label:"Crafted for Comfort"},
  {name:"globe",label:"Sourced Responsibly"},
];
/* ─── DARK ORNATE HOME HERO ───────────────────────────────── */
function DarkHomeHero({onCatalog,onSupplier}:{onCatalog:()=>void;onSupplier:()=>void}){
  const [err,setErr]=useState(false);
  const [rerr,setRerr]=useState(false);
  return(
    <section className="lux-noir" style={{position:"relative",overflow:"hidden",padding:"clamp(22px,4vw,46px) 0 clamp(30px,4vw,54px)"}}>
      <Petals count={16}/>
      {/* section-edge framing motifs — low z-index, kept away from text */}
      <img src={DECO.bamboo} alt="" aria-hidden className="x-drift-slow" style={{position:"absolute",bottom:-10,right:4,height:"min(62%,400px)",opacity:.2,pointerEvents:"none",zIndex:1}}/>
      <div className="container" style={{position:"relative",zIndex:4}}>
        <div className="ornate lux-hero-grid" style={{display:"grid",gridTemplateColumns:"1fr 1.04fr",borderRadius:8,overflow:"hidden",background:"linear-gradient(160deg,#16110b,#0c0a08)"}}>
          <CornerSet/>
          {/* LEFT — copy */}
          <div className="lux-hero-copy" style={{position:"relative",padding:"clamp(34px,4vw,60px) clamp(24px,4vw,54px)",display:"flex",flexDirection:"column",justifyContent:"center",overflow:"hidden"}}>
            {/* decorations BEHIND text (zIndex 1) for guaranteed readability */}
            <img src={DECO.sakuraCluster} alt="" aria-hidden className="deco-float" style={{position:"absolute",top:-10,left:-20,width:"clamp(88px,11vw,140px)",opacity:.5,pointerEvents:"none",zIndex:1}}/>
            <img src={DECO.crane} alt="" aria-hidden className="x-drift" style={{position:"absolute",top:14,right:6,width:"clamp(50px,6vw,84px)",opacity:.32,pointerEvents:"none",zIndex:1,transform:"scaleX(-1)"}}/>
            <img src={DECO.rabbit} alt="" aria-hidden className="x-drift-slow" style={{position:"absolute",bottom:-4,left:8,width:"clamp(50px,5.5vw,82px)",opacity:.28,pointerEvents:"none",zIndex:1}}/>
            <Reveal>
              <ArchedCartouche className="lux-brand-lock">
                <MonoMark size={38}/>
                <div className="serif" style={{fontSize:23,letterSpacing:8,color:"#E8D6B4",lineHeight:1,fontWeight:600}}>XIYORA</div>
                <div style={{fontFamily:"'Inter',sans-serif",fontSize:8.5,letterSpacing:4,textTransform:"uppercase",color:"#A9956F"}}>Crafted Comfort</div>
                <Seal ch="印" style={{marginTop:2}}/>
              </ArchedCartouche>
              <h1 className="serif" style={{fontSize:"clamp(2.1rem,3.6vw,3.5rem)",fontWeight:500,lineHeight:1.12,color:"#F4ECDC",margin:"18px 0 0",position:"relative",zIndex:3}}>
                Premium Latex Comfort,<br/><span className="gold-italic">Sourced for India.</span>
              </h1>
              <p style={{fontSize:14.5,lineHeight:1.85,color:"#C7BBA4",margin:"20px 0 0",maxWidth:460,position:"relative",zIndex:3}}>
                Pure Talalay &amp; Dunlop latex, crafted into pillows, mattresses and toppers — and brought to India with considered, document-backed sourcing.
              </p>
              <p className="lux-bingxi" style={{fontSize:12,letterSpacing:"1px",color:"#C9A876",margin:"16px 0 0",display:"flex",alignItems:"center",gap:10,position:"relative",zIndex:3}}>
                <span style={{width:26,height:1,background:"#C8A97E",display:"inline-block"}}/>Official Bingxi Partner for India
              </p>
              <div className="lux-feat-row" style={{margin:"30px 0 0",maxWidth:470,position:"relative",zIndex:3}}>
                {LUX_HERO_FEATURES.map((f,i)=>(
                  <div key={i} className="lf"><div className="feat-circ"><LuxIcon name={f.name} size={22} color="#D9B485"/></div><div className="lfl">{f.label}</div></div>
                ))}
              </div>
              <div className="lux-cta-row" style={{display:"flex",gap:14,flexWrap:"wrap",margin:"34px 0 0",position:"relative",zIndex:3}}>
                <button className="btn-gold-out xiyora-gold-button" onClick={onCatalog}>Explore Products <span style={{color:"#C8A97E"}}>✦</span></button>
                <button className="btn-ivory" onClick={onSupplier}>For Businesses <span style={{color:"#9E3B2E"}}>✦</span></button>
              </div>
            </Reveal>
          </div>
          {/* RIGHT — photo */}
          <div className="x-frame lux-hero-photo-r" style={{position:"relative",minHeight:540,overflow:"hidden"}}>
            <img src={err?"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=85":"/assets/lux/hero-bedroom.png"} alt="XIYORA natural latex bedroom" onError={()=>setErr(true)} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}}/>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,rgba(12,10,8,.55),rgba(12,10,8,.08) 36%,transparent 60%)",pointerEvents:"none"}}/>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(0deg,rgba(12,10,8,.42),transparent 34%)",pointerEvents:"none"}}/>
            <img src={DECO.sakuraCluster} alt="" aria-hidden className="x-drift" style={{position:"absolute",top:-14,right:-10,width:"clamp(110px,13vw,180px)",opacity:.95,pointerEvents:"none",zIndex:3}}/>
            {!rerr&&<img src={DECO.rabbit} alt="" aria-hidden onError={()=>setRerr(true)} style={{position:"absolute",bottom:10,right:14,width:"clamp(48px,5vw,74px)",opacity:.92,pointerEvents:"none",zIndex:3,filter:"drop-shadow(0 6px 14px rgba(0,0,0,.5))"}}/>}
          </div>
        </div>
      </div>
    </section>
  );
}
/* ─── DARK BUSINESS BAND ──────────────────────────────────── */
const BIZ_FEATURES=[
  {name:"doc",label:"Trade Pricing"},
  {name:"box",label:"Bulk Order Support"},
  {name:"handshake",label:"Dedicated Relationship"},
  {name:"truck",label:"Pan India Delivery"},
];
function DarkBusinessBand({onSupplier}:{onSupplier:()=>void}){
  return(
    <section className="lux-noir" style={{position:"relative",overflow:"hidden",padding:"clamp(30px,4vw,52px) 0"}}>
      <Petals count={10}/>
      <img src={DECO.bamboo} alt="" aria-hidden className="x-drift-slow" style={{position:"absolute",top:0,right:18,height:"100%",opacity:.4,pointerEvents:"none",zIndex:1}}/>
      <img src={DECO.rabbit} alt="" aria-hidden className="x-drift-slow" style={{position:"absolute",bottom:8,left:24,width:"clamp(60px,6vw,96px)",opacity:.45,pointerEvents:"none",zIndex:1}}/>
      <div className="container" style={{position:"relative",zIndex:4}}>
        <div className="ornate biz-grid" style={{borderRadius:8,padding:"clamp(28px,4vw,54px)",display:"grid",gridTemplateColumns:"auto 1fr",gap:"clamp(26px,4vw,58px)",alignItems:"center",background:"linear-gradient(160deg,#16110b,#0c0a08)"}}>
          <CornerSet/>
          <div className="biz-medallion"><img src={DECO.medallion} alt="" aria-hidden className="x-drift-slow" style={{width:"clamp(150px,18vw,220px)",height:"auto",filter:"drop-shadow(0 14px 34px rgba(0,0,0,.5))"}}/></div>
          <div>
            <Reveal>
              <div style={{fontSize:11,letterSpacing:"3px",textTransform:"uppercase",color:"#C9A876",marginBottom:14,fontWeight:500}}>For Businesses &amp; Partners</div>
              <h2 className="serif" style={{fontSize:"clamp(1.8rem,3.2vw,2.9rem)",fontWeight:500,lineHeight:1.14,color:"#F4ECDC",margin:0}}>
                Crafted for Hotels.<br/><span className="gold-italic">Chosen by the Finest.</span>
              </h2>
              <p style={{fontSize:14,lineHeight:1.8,color:"#C3B7A1",margin:"18px 0 0",maxWidth:540}}>
                Partner with XIYORA for premium natural latex solutions tailored to hospitality, wellness and retail — backed by clear documentation and dedicated support.
              </p>
              <div className="biz-feats" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px 28px",margin:"26px 0 0",maxWidth:540}}>
                {BIZ_FEATURES.map((f,i)=>(
                  <div key={i} className="biz-feat"><div className="feat-circ" style={{width:42,height:42}}><LuxIcon name={f.name} size={18} color="#D9B485"/></div><div className="bft">{f.label}</div></div>
                ))}
              </div>
              <button className="btn-gold-out xiyora-gold-button" style={{marginTop:30}} onClick={onSupplier}>Partner With XIYORA <span style={{color:"#C8A97E"}}>✦</span></button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
/* ─── FOOTER TRUST STRIP ──────────────────────────────────── */
const TRUST_ITEMS=[
  {ic:"truck",t:"Pan India Delivery",d:"Safe & reliable shipping"},
  {ic:"shield",t:"Authentic Products",d:"Official Bingxi partner"},
  {ic:"check",t:"Premium Quality",d:"Natural Talalay & Dunlop"},
  {ic:"headset",t:"Expert Support",d:"Here to help you choose"},
];
function FooterTrustStrip(){
  return(
    <section className="lux-noir" style={{borderTop:"1px solid rgba(200,169,126,.2)",borderBottom:"1px solid rgba(200,169,126,.2)",padding:"clamp(26px,3vw,38px) 0",position:"relative",overflow:"hidden"}}>
      <div className="x-divider" style={{color:"#C8A97E",marginBottom:20}}>✦</div>
      <div className="container">
        <Stagger className="trust-grid">
          {TRUST_ITEMS.map((it,i)=>(
            <div key={i} className="trust-item">
              <div className="feat-circ"><LuxIcon name={it.ic} size={22} color="#D9B485"/></div>
              <div>
                <div style={{fontSize:12.5,letterSpacing:"1.4px",textTransform:"uppercase",color:"#EBDCC0",fontWeight:600}}>{it.t}</div>
                <div style={{fontSize:12,color:"#9F9279",marginTop:3}}>{it.d}</div>
              </div>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ─── INTERACTIVE WHATSAPP POPUP (source: v3_whatsapp_popup_logic) ── */
function WhatsAppPopup({page,context}:{page:string;context:any}){
  const C=useC();
  const [visible,setVisible]=useState(false);
  const msg=(()=>{
    if(page==="checkout")return ["Hello XIYORA, I want to confirm my estimate.",context?.product?`Product: ${context.product}`:"",context?.city?`City: ${context.city}`:"",context?.total?`Estimated total: ${context.total}`:"","Please confirm availability and proforma."].filter(Boolean).join("\n");
    if(page==="product")return ["Hello XIYORA, I am interested in this product.",context?.product?`Product: ${context.product}`:"","Please share details and proforma."].filter(Boolean).join("\n");
    return "Hello XIYORA, I want help choosing premium latex products. Please share catalogue and guidance.";
  })();
  const shownRef=useRef(false);
  useEffect(()=>{
    // Show at most once per page load ("web restart"). Once shown or dismissed it
    // will not re-trigger until the page is reloaded — no sessionStorage persistence.
    let timer:ReturnType<typeof setTimeout>;
    const onScroll=()=>{
      const ratio=window.scrollY/Math.max(document.body.scrollHeight-window.innerHeight,1);
      if(ratio>0.38)show();
    };
    const cleanup=()=>{clearTimeout(timer);window.removeEventListener("scroll",onScroll);};
    const show=()=>{if(shownRef.current)return;shownRef.current=true;setVisible(true);cleanup();};
    timer=setTimeout(show,9000);
    window.addEventListener("scroll",onScroll,{passive:true});
    return cleanup;
  },[]);
  const dismiss=()=>setVisible(false);
  if(!visible)return null;
  return(
    <div className="xiyora-whatsapp-popup" role="dialog" aria-label="XIYORA WhatsApp help"
      style={{position:"fixed",right:24,bottom:148,zIndex:997,width:"min(330px,calc(100vw - 36px))",background:C.white,border:`1px solid ${C.sand}`,borderRadius:14,boxShadow:"0 24px 70px rgba(0,0,0,.22)",padding:"20px 20px 18px",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:"linear-gradient(90deg,#C8A97E,#25D366)"}}/>
      <button aria-label="Close" onClick={dismiss} style={{position:"absolute",top:10,right:12,background:"none",border:"none",fontSize:20,lineHeight:1,color:"#aaa",cursor:"pointer",padding:4}}>×</button>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
        <div style={{width:38,height:38,borderRadius:"50%",background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width={20} height={20} fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.143.564 4.148 1.549 5.878L0 24l6.29-1.525A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
        </div>
        <strong style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:600,color:C.dark}}>Need help choosing?</strong>
      </div>
      <p style={{fontSize:12.5,color:"#888",lineHeight:1.6,marginBottom:14}}>Share your size, city, and product interest — we'll help with a proforma.</p>
      <a href={waMsg(msg)} target="_blank" rel="noreferrer"
        style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"#25D366",color:"#fff",padding:"11px",borderRadius:8,fontSize:12.5,fontWeight:500,letterSpacing:".6px",textDecoration:"none",fontFamily:"'Inter',sans-serif"}}
        onClick={dismiss}>
        WhatsApp XIYORA
      </a>
    </div>
  );
}

/* ─── INQUIRY MODAL ──────────────────────────────────────── */
function InquiryModal({show,onClose,product,intent:initIntent,currency}:any){
  const C=useC();
  const [f,setF]=useState({...EMPTY_FORM});
  const [ok,setOk]=useState(false);
  const [loading,setLoading]=useState(false);
  const [apiErr,setApiErr]=useState("");
  const [zoneInfo,setZoneInfo]=useState<any>(null);
  const [savedId,setSavedId]=useState<number|null>(null);

  useEffect(()=>{
    if(show){setF({...EMPTY_FORM,productName:product?.name||"",intent:initIntent||"quote"});setOk(false);setApiErr("");setZoneInfo(null);setSavedId(null);}
  },[show,product,initIntent]);

  const set=(k:string,v:string)=>setF((p:any)=>({...p,[k]:v}));
  const checkPin=()=>{const z=lookupPincode(f.pincode);if(!z){alert("Enter a valid 6-digit Indian pincode");return;}setZoneInfo(z);};

  const submit=async()=>{
    if(!f.name.trim()||!f.phone.trim()){alert("Please enter your name and phone number.");return;}
    setLoading(true);setApiErr("");
    const payload={
      name:f.name,phone:f.phone,email:f.email||undefined,company:f.company||undefined,
      city:f.city||undefined,state:f.state||undefined,pincode:f.pincode||undefined,
      customerType:f.customerType||undefined,
      productName:f.productName||undefined,
      productSlug:product?.id||undefined,
      selectedSize:f.selectedSize||undefined,
      quantity:f.quantity||undefined,
      message:f.message||undefined,
      inquiryType:f.intent||undefined,
      intentLabel:f.intent==="quote"?"Price Quote":f.intent==="proforma"?"Proforma Invoice":f.intent==="bulk"?"Bulk Order":"General Enquiry",
      estimatedPort:zoneInfo?zoneInfo.port:undefined,
      estimatedPriceRange:priceIn(currency,product?.priceINR),
      currency,
    };
    const res=await apiPost("/enquiries",payload as any);
    setLoading(false);
    if(res?.success){setSavedId(res.id);setOk(true);}
    else setApiErr(res?.error||"Could not save. Please use WhatsApp instead.");
  };

  const toWA=()=>{
    const msg=`Hi XIYORA,\n\nProduct: ${f.productName||"General Inquiry"}\nIntent: ${f.intent}\nName: ${f.name}\nPhone: ${f.phone}${f.company?"\nCompany: "+f.company:""}${f.city?"\nCity: "+f.city:""}${f.pincode?"\nPincode: "+f.pincode:""}${f.quantity?"\nQuantity: "+f.quantity:""}${f.selectedSize?"\nSize: "+f.selectedSize:""}${f.message?"\nMessage: "+f.message:""}`;
    window.open(waMsg(msg),"_blank");
  };

  if(!show)return null;
  const inp:React.CSSProperties={width:"100%",background:"#fafaf8",border:`1px solid ${C.sand}`,padding:"11px 13px",fontSize:13,borderRadius:3,fontFamily:"'Inter',sans-serif",color:C.dark,marginBottom:10,transition:"border-color .2s"};
  const lbl:React.CSSProperties={fontSize:11.5,color:"#888",marginBottom:5,display:"block",letterSpacing:".3px"};

  return(
    <div style={{position:"fixed",inset:0,zIndex:900,background:"rgba(28,28,28,.6)",display:"flex",alignItems:"center",justifyContent:"center",padding:"16px",backdropFilter:"blur(12px)"}} onClick={onClose}>
      <div className="glass-modal" style={{padding:"32px 36px",maxWidth:560,width:"100%",maxHeight:"92vh",overflowY:"auto",animation:"fadeInUp .3s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
          <div>
            <SL>{f.intent==="quote"?"Price Quote":f.intent==="proforma"?"Proforma Invoice":f.intent==="bulk"?"Bulk Order":"Enquiry"}</SL>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:500,color:C.dark,marginTop:4}}>{f.productName||"XIYORA Products"}</h3>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#bbb",fontSize:22,lineHeight:1,marginLeft:16}}>✕</button>
        </div>

        {ok?(
          <div style={{textAlign:"center",padding:"28px 0"}}>
            <div style={{width:64,height:64,background:"linear-gradient(135deg,#C8A97E,#B89472)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",fontSize:28}}>✓</div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:C.dark,marginBottom:10}}>Enquiry Saved</h3>
            <p style={{fontSize:13.5,color:"#888",lineHeight:1.72,marginBottom:6}}>Thank you, <strong style={{color:C.dark}}>{f.name}</strong>. We'll reply within 24–48 hours.</p>
            {savedId&&<p style={{fontSize:12,color:"#bbb",marginBottom:20}}>Reference: EQ-{String(savedId).padStart(4,"0")}</p>}
            <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
              <button onClick={toWA} style={{background:"#25D366",color:"#fff",border:"none",padding:"12px 20px",borderRadius:2,fontFamily:"'Inter',sans-serif",fontSize:12,letterSpacing:"1.2px",textTransform:"uppercase",cursor:"pointer",display:"flex",alignItems:"center",gap:7}}>
                <svg width={14} height={14} fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.143.564 4.148 1.549 5.878L0 24l6.29-1.525A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.36-.214-3.733.905.948-3.64-.234-.373A9.818 9.818 0 1112 21.818z"/></svg>
                WhatsApp Us
              </button>
              <button className="bo" onClick={onClose} style={{padding:"12px 20px",fontSize:12}}>Close</button>
            </div>
          </div>
        ):(
          <>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
              {[["quote","Get Quote"],["proforma","Proforma Invoice"],["bulk","Bulk Order"],["general","General"]].map(([k,v])=>(
                <button key={k} onClick={()=>set("intent",k)} style={{background:f.intent===k?C.gold:"#EFE8DE",color:f.intent===k?"#fff":"#888",border:"none",padding:"5px 13px",borderRadius:20,fontSize:11,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .2s"}}>{v}</button>
              ))}
            </div>
            {product&&<div style={{background:C.lgold,padding:"10px 14px",borderRadius:3,marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:13,color:"#888"}}>Product: <strong style={{color:C.dark}}>{product.name}</strong></span>
              <span style={{fontSize:12,color:C.gold,fontFamily:"'Playfair Display',serif",fontWeight:600}}>{priceIn(currency,product.priceINR)}</span>
            </div>}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
              {([["Your Name *","name","text","Full name"],["Phone / WhatsApp *","phone","tel","+91 XXXXX"]] as const).map(([l,k,t,ph])=>(
                <div key={k}><label style={lbl}>{l}</label><input style={inp} type={t} value={(f as any)[k]} onChange={e=>set(k,e.target.value)} placeholder={ph}/></div>
              ))}
              {([["Email","email","email","your@email.com"],["Company / Brand","company","text","Optional"]] as const).map(([l,k,t,ph])=>(
                <div key={k}><label style={lbl}>{l}</label><input style={inp} type={t} value={(f as any)[k]} onChange={e=>set(k,e.target.value)} placeholder={ph}/></div>
              ))}
            </div>
            <div style={{background:C.beige,borderRadius:3,padding:"14px",marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:500,color:C.dark,marginBottom:10,letterSpacing:".3px",display:"flex",alignItems:"center",gap:6}}>
                <svg width={13} height={13} fill="none" stroke={C.gold} strokeWidth={1.8} viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Your Location
              </div>
              <button onClick={()=>{
                if(!navigator.geolocation){alert("Geolocation not supported by your browser.");return;}
                navigator.geolocation.getCurrentPosition(pos=>{
                  const coords=`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
                  localStorage.setItem("xiyora_geo",JSON.stringify({lat:pos.coords.latitude,lng:pos.coords.longitude,ts:Date.now()}));
                  alert(`Location detected (${coords}). Please confirm your city and pincode below for an accurate delivery estimate.`);
                },()=>alert("Location access denied. Please enter your city and pincode manually."));
              }} style={{background:"#fff",border:`1px solid ${C.sand}`,color:C.dark,padding:"8px 14px",borderRadius:3,fontSize:11.5,cursor:"pointer",fontFamily:"'Inter',sans-serif",marginBottom:10,display:"flex",alignItems:"center",gap:7,transition:"border-color .2s"}}
                onMouseEnter={(e:any)=>e.currentTarget.style.borderColor=C.gold}
                onMouseLeave={(e:any)=>e.currentTarget.style.borderColor=C.sand}>
                <svg width={13} height={13} fill="none" stroke={C.gold} strokeWidth={1.8} viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Use my current location
              </button>
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <input style={{...inp,marginBottom:0,flex:1}} value={f.pincode} onChange={e=>set("pincode",e.target.value)} placeholder="6-digit pincode" maxLength={6}/>
                <button onClick={checkPin} style={{background:C.dark,color:"#fff",border:"none",padding:"10px 16px",borderRadius:2,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",whiteSpace:"nowrap",transition:"background .2s"}}
                  onMouseEnter={(e:any)=>e.currentTarget.style.background="#444"}
                  onMouseLeave={(e:any)=>e.currentTarget.style.background=C.dark}>Check Zone</button>
              </div>
              {zoneInfo&&(
                <div style={{background:ZONE_INFO[zoneInfo.zone]?.bg||"#f5f5f5",border:`1px solid ${ZONE_INFO[zoneInfo.zone]?.col||"#ccc"}`,borderRadius:3,padding:"10px 14px"}}>
                  <div style={{fontSize:12.5,fontWeight:500,color:ZONE_INFO[zoneInfo.zone]?.col}}>{ZONE_INFO[zoneInfo.zone]?.label}</div>
                  <div style={{fontSize:12,color:"#888",marginTop:3}}>Nearest Port: {zoneInfo.port} · Inland delivery: {zoneInfo.days} days</div>
                </div>
              )}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 10px",marginTop:10}}>
                <div><label style={lbl}>City</label><input style={inp} value={f.city} onChange={e=>set("city",e.target.value)} placeholder="Mumbai"/></div>
                <div><label style={lbl}>State</label><select style={inp} value={f.state} onChange={e=>set("state",e.target.value)}><option value="">Select state / UT…</option>{INDIAN_STATES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
              <div><label style={lbl}>Customer Type</label>
                <select style={inp} value={f.customerType} onChange={e=>set("customerType",e.target.value)}>
                  {["Home Buyer","Hotel / Resort","Interior Designer","Retailer","Manufacturer","Other"].map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Quantity</label>
                <input style={inp} value={f.quantity} onChange={e=>set("quantity",e.target.value)} placeholder="e.g. 2 pieces"/>
              </div>
            </div>
            {product?.sizes?.length>0&&<div><label style={lbl}>Size / Variant</label>
              <select style={inp} value={f.selectedSize} onChange={e=>set("selectedSize",e.target.value)}>
                <option value="">Select size</option>
                {product.sizes.map((s:string)=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>}
            <div><label style={lbl}>Message (optional)</label>
              <textarea style={{...inp,resize:"vertical",minHeight:70}} value={f.message} onChange={e=>set("message",e.target.value)} placeholder="Any specific requirements or questions..."/>
            </div>
            {apiErr&&(
              <div style={{background:"#fff7ed",border:"1px solid #f0d9b8",borderRadius:3,padding:"12px 14px",marginBottom:12}}>
                <div style={{fontSize:12.5,color:"#9a6a2a",lineHeight:1.6,marginBottom:9}}>{apiErr} Your details are still here — send them directly and we'll respond.</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <button onClick={submit} disabled={loading} style={{background:C.dark,color:"#fff",border:"none",padding:"8px 14px",borderRadius:2,fontSize:11,letterSpacing:".8px",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>Try Again</button>
                  <button onClick={toWA} style={{background:"#25D366",color:"#fff",border:"none",padding:"8px 14px",borderRadius:2,fontSize:11,letterSpacing:".8px",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>WhatsApp</button>
                  <a href={`mailto:${BIZ.email}?subject=${encodeURIComponent(`XIYORA ${f.intent==="proforma"?"Proforma":"Quote"} — ${f.productName||"Enquiry"}`)}&body=${encodeURIComponent(`Product: ${f.productName||"General Inquiry"}\nIntent: ${f.intent}\nName: ${f.name}\nPhone: ${f.phone}${f.company?"\nCompany: "+f.company:""}${f.city?"\nCity: "+f.city:""}${f.pincode?"\nPincode: "+f.pincode:""}${f.quantity?"\nQuantity: "+f.quantity:""}${f.selectedSize?"\nSize: "+f.selectedSize:""}${f.message?"\nMessage: "+f.message:""}`)}`} style={{background:C.beige,color:C.dark,padding:"8px 14px",borderRadius:2,fontSize:11,letterSpacing:".8px",textTransform:"uppercase",textDecoration:"none",fontFamily:"'Inter',sans-serif",display:"inline-flex",alignItems:"center"}}>Email</a>
                </div>
              </div>
            )}
            <p style={{fontSize:11.5,color:"#bbb",marginBottom:14,lineHeight:1.65}}>No payment is collected through this form. Final landed price confirmed in writing before any payment.</p>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <button onClick={submit} className="bg" style={{flex:1,minWidth:120,padding:"12px 14px",fontSize:12}} disabled={loading}>
                {loading?<Spinner/>:"Send Enquiry"}
              </button>
              <button onClick={toWA} style={{background:"#25D366",color:"#fff",border:"none",flex:1,minWidth:120,padding:"12px 14px",fontFamily:"'Inter',sans-serif",fontSize:12,letterSpacing:"1px",textTransform:"uppercase",cursor:"pointer",borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                <svg width={14} height={14} fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.143.564 4.148 1.549 5.878L0 24l6.29-1.525A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.36-.214-3.733.905.948-3.64-.234-.373A9.818 9.818 0 1112 21.818z"/></svg>
                WhatsApp
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── SUBSCRIBE MODAL ────────────────────────────────────── */
function SubscribeModal({show,onClose}:{show:boolean;onClose:()=>void}){
  const C=useC();
  const [f,setF]=useState({email:"",name:"",whatsapp:"",city:"",customerType:"Home Buyer",interestCategory:"Pillows",subscriptionType:"Home Buyer Updates"});
  const [ok,setOk]=useState(false);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");

  useEffect(()=>{if(!show){setOk(false);setErr("");}},[show]);
  const set=(k:string,v:string)=>setF((p:any)=>({...p,[k]:v}));

  const submit=async()=>{
    if(!f.email.trim()){alert("Email is required.");return;}
    setLoading(true);setErr("");
    const res=await apiPost("/subscriptions",{email:f.email,name:f.name||undefined,whatsapp:f.whatsapp||undefined,city:f.city||undefined,customerType:f.customerType,interestCategory:f.interestCategory,subscriptionType:f.subscriptionType});
    setLoading(false);
    if(res?.success)setOk(true);
    else setErr(res?.error||"Something went wrong. Please try again.");
  };

  if(!show)return null;
  const inp:React.CSSProperties={width:"100%",background:"#1e1e1e",border:"1px solid #2a2a2a",color:"#F0EBE3",padding:"11px 14px",fontSize:13,borderRadius:3,fontFamily:"'Inter',sans-serif",marginBottom:10};
  const lbl:React.CSSProperties={fontSize:11.5,color:"#666",marginBottom:5,display:"block"};
  return(
    <div style={{position:"fixed",inset:0,zIndex:900,background:"rgba(0,0,0,.72)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(10px)"}} onClick={onClose}>
      <div style={{background:"#141414",borderRadius:6,padding:"32px 36px",maxWidth:480,width:"100%",boxShadow:"0 32px 80px rgba(0,0,0,.5)",border:"1px solid #2a2a2a",animation:"fadeInUp .3s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
          <div>
            <SL dark>Stay in Touch</SL>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:400,color:"#F0EBE3",marginTop:4}}>Join XIYORA</h3>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#555",fontSize:22,lineHeight:1}}>✕</button>
        </div>
        {ok?(
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:48,marginBottom:14}}>✓</div>
            <p style={{fontSize:16,color:"#F0EBE3",fontFamily:"'Playfair Display',serif",marginBottom:8}}>You're on the list!</p>
            <p style={{fontSize:13,color:"#666",lineHeight:1.7}}>We'll reach out with product launches, B2B updates, and exclusive offers.</p>
          </div>
        ):(
          <>
            <label style={lbl}>Email *</label><input style={inp} type="email" value={f.email} onChange={e=>set("email",e.target.value)} placeholder="your@email.com"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div><label style={lbl}>Your Name</label><input style={inp} value={f.name} onChange={e=>set("name",e.target.value)} placeholder="Full name"/></div>
              <div><label style={lbl}>WhatsApp</label><input style={inp} value={f.whatsapp} onChange={e=>set("whatsapp",e.target.value)} placeholder="+91 XXXXX"/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div><label style={lbl}>City</label><input style={inp} value={f.city} onChange={e=>set("city",e.target.value)} placeholder="Mumbai"/></div>
              <div><label style={lbl}>I am a</label>
                <select style={inp} value={f.customerType} onChange={e=>set("customerType",e.target.value)}>
                  {["Home Buyer","Hotel / Resort","Interior Designer","Retailer","Manufacturer"].map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <label style={lbl}>Subscription Type</label>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
              {["Home Buyer Updates","Retailer — B2B Access","Hotel & Interior Partner","Trade Partner"].map(t=>(
                <button key={t} onClick={()=>set("subscriptionType",t)} style={{background:f.subscriptionType===t?C.gold:"#1e1e1e",color:f.subscriptionType===t?"#fff":"#666",border:`1px solid ${f.subscriptionType===t?C.gold:"#2a2a2a"}`,padding:"6px 12px",borderRadius:20,fontSize:11.5,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .2s"}}>{t}</button>
              ))}
            </div>
            {err&&<div style={{color:"#f87171",fontSize:12,marginBottom:10}}>{err}</div>}
            <button className="bg" onClick={submit} style={{width:"100%",padding:13}} disabled={loading}>
              {loading?<Spinner/>:"Join XIYORA"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── IMAGE ZOOM ─────────────────────────────────────────── */
function ImageZoom({src,alt,onClose}:{src:string;alt:string;onClose:()=>void}){
  useEffect(()=>{
    const fn=(e:KeyboardEvent)=>{if(e.key==="Escape")onClose();};
    document.addEventListener("keydown",fn);
    return()=>document.removeEventListener("keydown",fn);
  },[onClose]);
  return(
    <div className="img-zoom-overlay" onClick={onClose}>
      <img src={src} alt={alt} onClick={e=>e.stopPropagation()}/>
      <button onClick={onClose} style={{position:"absolute",top:24,right:28,background:"none",border:"none",color:"#fff",fontSize:28,cursor:"pointer",opacity:.6}}>✕</button>
    </div>
  );
}

/* ─── SEARCH OVERLAY ─────────────────────────────────────── */
function SearchOverlay({show,onClose,onPickProduct,onCatalog}:any){
  const C=useC();
  const [q,setQ]=useState("");
  const ref=useRef<HTMLInputElement>(null);
  useEffect(()=>{if(show)ref.current?.focus();if(!show)setQ("");},[show]);
  if(!show)return null;
  const hits=q.length>1?PRODUCTS.filter(p=>[p.name,p.category,p.latexType,p.shortDesc].join(" ").toLowerCase().includes(q.toLowerCase())):[];
  return(
    <div style={{position:"fixed",inset:0,zIndex:800,background:"rgba(28,28,28,.68)",backdropFilter:"blur(14px)",display:"flex",flexDirection:"column",alignItems:"center",padding:"70px 20px 20px"}} onClick={onClose}>
      <div style={{width:"100%",maxWidth:620,background:"rgba(248,246,242,.98)",backdropFilter:"blur(20px)",borderRadius:5,overflow:"hidden",boxShadow:"0 40px 100px rgba(0,0,0,.28)",border:`1px solid ${C.sand}`,animation:"fadeInUp .22s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",padding:"15px 20px",borderBottom:`1px solid ${C.sand}`,gap:12}}>
          <svg width={17} height={17} fill="none" stroke={C.gold} strokeWidth={1.6} viewBox="0 0 24 24"><circle cx={11} cy={11} r={8}/><path d="M21 21l-4.35-4.35"/></svg>
          <input ref={ref} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search mattresses, pillows, toppers, cushions…" style={{flex:1,background:"none",border:"none",fontSize:15,color:C.dark,fontFamily:"'Inter',sans-serif",outline:"none"}}/>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#bbb",fontSize:20}}>✕</button>
        </div>
        {hits.length>0&&<div style={{maxHeight:400,overflowY:"auto"}}>
          {hits.map(p=>(
            <div key={p.id} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 20px",cursor:"pointer",borderBottom:`1px solid ${C.beige}`,transition:"background .18s"}}
              onClick={()=>{onPickProduct(p);onClose();}}
              onMouseEnter={(e:any)=>e.currentTarget.style.background=C.beige}
              onMouseLeave={(e:any)=>e.currentTarget.style.background="transparent"}>
              <img src={p.gallery[0]} alt={p.name} style={{width:50,height:50,objectFit:"cover",borderRadius:3,flexShrink:0}} onError={(e:any)=>{e.target.src=FALLBACK_IMG;}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:500,color:C.dark,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
                <div style={{fontSize:12,color:C.gold}}>{p.latexType} · {p.category}</div>
              </div>
              <div style={{fontSize:13,color:"#aaa",flexShrink:0}}>{p.priceINR}</div>
            </div>
          ))}
        </div>}
        {q.length>1&&!hits.length&&(
          <div style={{padding:"28px 20px",textAlign:"center"}}>
            <p style={{fontSize:14,color:"#aaa",marginBottom:14}}>No results for "<strong>{q}</strong>"</p>
            <button className="bg" onClick={()=>{onCatalog();onClose();}} style={{padding:"10px 22px",fontSize:12}}>Browse All Products</button>
          </div>
        )}
        {!q&&<div style={{padding:"14px 20px"}}>
          <p style={{fontSize:11,color:"#bbb",marginBottom:10,letterSpacing:"1px",textTransform:"uppercase"}}>Quick Browse</p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {["Mattresses","Pillows","Toppers","Cushions","Talalay","Dunlop"].map(t=>(
              <button key={t} onClick={()=>setQ(t)} style={{background:C.beige,border:"none",padding:"7px 14px",borderRadius:20,fontSize:12.5,color:C.dark,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>{t}</button>
            ))}
          </div>
        </div>}
      </div>
    </div>
  );
}

/* ─── PRODUCT CARD ───────────────────────────────────────── */
function PCard({p,cur,wl,onWish,onOpen,onInquire}:any){
  const C=useC();
  const [imgErr,setImgErr]=useState(false);
  return(
    <div className="pc" onClick={()=>onOpen(p)}>
      <div style={{position:"relative",overflow:"hidden",height:240}}>
        <img src={imgErr?FALLBACK_IMG:p.gallery[0]} alt={p.name} className="pi" onError={()=>setImgErr(true)} style={{width:"100%",height:"100%"}}/>
        <div style={{position:"absolute",top:10,left:10}}>
          <Tag>{p.tag}</Tag>
        </div>
        <button style={{position:"absolute",top:10,right:10,background:"rgba(248,246,242,.92)",border:"none",width:34,height:34,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all .2s"}}
          onClick={e=>{e.stopPropagation();onWish(p.id);}}>
          <svg width={15} height={15} fill={wl.includes(p.id)?C.gold:"none"} stroke={wl.includes(p.id)?C.gold:"#999"} strokeWidth={1.5} viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>
      <div style={{padding:"16px 18px"}}>
        <div style={{fontSize:10,letterSpacing:"1.8px",textTransform:"uppercase",color:C.gold,marginBottom:5,fontWeight:500}}>{p.latexType} · {p.category}</div>
        <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:500,color:C.dark,marginBottom:6,lineHeight:1.2}}>{p.name}</h3>
        <p style={{fontSize:12.5,color:"#aaa",marginBottom:14,lineHeight:1.55,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{p.shortDesc}</p>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:12,borderTop:`1px solid ${C.sand}`}}>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:600,color:C.dark}}>{priceIn(cur,p.priceINR)}</div>
            <div style={{fontSize:10,color:"#ccc",marginTop:2}}>Indicative · Quote after city</div>
          </div>
          <button className="bg" style={{padding:"9px 14px",fontSize:11,letterSpacing:"1px"}} onClick={e=>{e.stopPropagation();onInquire(p,"quote");}}>Get Quote</button>
        </div>
      </div>
    </div>
  );
}

/* ─── PRODUCT DETAIL ─────────────────────────────────────── */
const WA_ICON=<svg width={13} height={13} fill="white" viewBox="0 0 24 24" style={{display:"inline",verticalAlign:"middle",marginRight:5}}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.143.564 4.148 1.549 5.878L0 24l6.29-1.525A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.36-.214-3.733.905.948-3.64-.234-.373A9.818 9.818 0 1112 21.818z"/></svg>;

function ProductDetail({p,cur,wl,onWish,onBack,onInquire,onAddToCart,onGoCheckout,onCatFilter}:any){
  const C=useC();
  const [img,setImg]=useState(0);
  const [zoom,setZoom]=useState(false);
  const [imgErrors,setImgErrors]=useState<Record<number,boolean>>({});
  const [selVar,setSelVar]=useState<number>(-1);
  const [qty,setQty]=useState(1);
  const [addedMsg,setAddedMsg]=useState(false);

  useEffect(()=>{setImg(0);setImgErrors({});setSelVar(-1);setQty(1);setAddedMsg(false);window.scrollTo(0,0);},[p]);

  const wished=wl.includes(p.id);
  const hasVariants=p.variants&&p.variants.length>0;
  const activeVar=hasVariants&&selVar>=0?p.variants[selVar]:null;
  const variantRequired=hasVariants&&selVar<0;
  const isContactPrice=!hasVariants&&(String(p.priceINR||"").toLowerCase().includes("contact")||String(p.priceINR||"").startsWith("From"));
  const isQuoteRequired=(activeVar?.quoteRequired===true)||isContactPrice;
  const canBuy=!variantRequired&&!isQuoteRequired;

  const displayPriceINR=activeVar?activeVar.priceINR:hasVariants?"Select a variant to see price":p.priceINR;
  const displayPriceUSD=activeVar?activeVar.priceUSD:hasVariants?"Select a variant to see price":p.priceUSD;
  const currentSrc=imgErrors[img]?FALLBACK_IMG:p.gallery[img];

  const buildCartItem=():CartItem=>({
    cartKey:`${p.id}__${activeVar?.sku||"base"}__${Date.now()}`,
    productId:p.id,productName:p.name,
    sku:activeVar?.sku||p.id,
    variantLabel:activeVar?.label||p.name,
    priceINR:activeVar?.priceINR||p.priceINR,
    priceUSD:activeVar?.priceUSD||p.priceUSD,
    priceNumINR:parsePriceNum(activeVar?.priceINR||p.priceINR),
    quoteRequired:false,
    image:p.gallery[img]||p.gallery[0],
    quantity:qty,
  });

  const handleAddToCart=()=>{
    if(!canBuy)return;
    onAddToCart(buildCartItem());
    setAddedMsg(true);
    setTimeout(()=>setAddedMsg(false),2200);
  };
  const handleBuyNow=()=>{
    if(!canBuy)return;
    onAddToCart(buildCartItem());
    onGoCheckout();
  };

  return(
    <div style={{background:C.white,minHeight:"100vh"}}>
      {zoom&&<ImageZoom src={currentSrc} alt={p.name} onClose={()=>setZoom(false)}/>}
      {/* Breadcrumb */}
      <div style={{borderBottom:`1px solid ${C.sand}`,padding:"12px 0"}}>
        <div className="container" style={{display:"flex",gap:8,alignItems:"center",fontSize:13}}>
          <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:"#888",fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",gap:6,transition:"color .2s"}}
            onMouseEnter={(e:any)=>e.currentTarget.style.color=C.gold}
            onMouseLeave={(e:any)=>e.currentTarget.style.color="#888"}>
            <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> Back
          </button>
          <span style={{color:"#ddd"}}>·</span><button onClick={()=>onCatFilter&&onCatFilter(p.category)} style={{background:"none",border:"none",cursor:"pointer",color:C.gold,fontFamily:"'Inter',sans-serif",fontSize:13,padding:0,transition:"opacity .2s"}} onMouseEnter={(e:any)=>e.currentTarget.style.opacity=".7"} onMouseLeave={(e:any)=>e.currentTarget.style.opacity="1"}>{p.category}</button>
          <span style={{color:"#ddd"}}>·</span><span style={{color:C.dark,fontWeight:500}}>{p.name}</span>
        </div>
      </div>
      <div className="container" style={{padding:"48px 40px"}}>
        <div className="grid-2" style={{gap:56}}>
          {/* Images */}
          <div>
            <div style={{borderRadius:5,overflow:"hidden",background:C.beige,marginBottom:12,height:440,position:"relative",cursor:"zoom-in"}} onClick={()=>setZoom(true)} className="detail-img-h">
              <img src={currentSrc} alt={p.name} style={{width:"100%",height:"100%",objectFit:"contain",transition:"opacity .3s",background:C.beige}} onError={()=>setImgErrors(e=>({...e,[img]:true}))}/>
              <div style={{position:"absolute",bottom:12,right:12,background:"rgba(248,246,242,.85)",padding:"5px 10px",borderRadius:2,fontSize:11,color:"#888",display:"flex",alignItems:"center",gap:5}}>
                <svg width={11} height={11} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><circle cx={11} cy={11} r={8}/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>
                Tap to zoom
              </div>
              {p.gallery.length>1&&<>
                <button onClick={e=>{e.stopPropagation();setImg(i=>(i-1+p.gallery.length)%p.gallery.length);}} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",background:"rgba(248,246,242,.88)",border:"none",width:36,height:36,borderRadius:"50%",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,.12)"}}>‹</button>
                <button onClick={e=>{e.stopPropagation();setImg(i=>(i+1)%p.gallery.length);}} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"rgba(248,246,242,.88)",border:"none",width:36,height:36,borderRadius:"50%",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,.12)"}}>›</button>
              </>}
            </div>
            {p.gallery.length>1&&<div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {p.gallery.map((im:string,i:number)=>(
                <div key={i} onClick={()=>setImg(i)} style={{width:70,height:70,borderRadius:3,overflow:"hidden",cursor:"pointer",border:`2px solid ${img===i?C.gold:"transparent"}`,transition:"border-color .2s",flexShrink:0,background:C.beige}}>
                  <img src={imgErrors[i]?FALLBACK_IMG:im} alt={`${p.name} view ${i+1}`} style={{width:"100%",height:"100%",objectFit:"contain"}} onError={()=>setImgErrors(e=>({...e,[i]:true}))}/>
                </div>
              ))}
            </div>}
          </div>
          {/* Info */}
          <div>
            <div style={{marginBottom:14}}>
              <Tag>{p.tag}</Tag>
              <Tag c={p.latexType==="Talalay"?"#9B8B6E":p.latexType==="Hybrid"?"#7B8F7E":"#5a7a7a"}>{p.latexType} Latex</Tag>
              <Tag c="#999">{p.category}</Tag>
            </div>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.8rem,2.8vw,2.6rem)",fontWeight:400,color:C.dark,lineHeight:1.1,marginBottom:8}}>{p.name}</h1>
            <p style={{fontSize:16,color:C.gold,fontFamily:"'Playfair Display',serif",fontStyle:"italic",marginBottom:20,lineHeight:1.4}}>{p.headline}</p>
            <p style={{fontSize:14.5,color:"#666",lineHeight:1.82,marginBottom:24,fontWeight:300}}>{p.description}</p>
            {p.latexContent&&<div style={{padding:"8px 14px",background:C.lgold,borderRadius:3,marginBottom:20,display:"flex",gap:8,alignItems:"center"}}>
              <span style={{color:"#777",fontSize:13}}>Latex Content:</span>
              <strong style={{fontSize:13,color:C.dark}}>{p.latexContent}</strong>
            </div>}
            {/* Highlights */}
            <div style={{marginBottom:22}}>
              <p style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"#888",marginBottom:10,fontWeight:500}}>Highlights</p>
              {p.highlights.map((h:string,i:number)=>(
                <div key={i} style={{display:"flex",gap:10,marginBottom:9,alignItems:"flex-start"}}>
                  <span style={{color:C.gold,flexShrink:0,marginTop:2}}>◈</span>
                  <span style={{fontSize:13.5,color:"#555",lineHeight:1.65}}>{h}</span>
                </div>
              ))}
            </div>
            {/* Specs */}
            <div style={{marginBottom:22}}>
              <p style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"#888",marginBottom:10,fontWeight:500}}>Specifications</p>
              <table style={{width:"100%",borderCollapse:"collapse"}}><tbody>
                {Object.entries(p.specs).map(([k,v])=>(
                  <tr key={k} style={{borderBottom:`1px solid ${C.beige}`}}>
                    <td className="spec-key">{k}</td>
                    <td className="spec-val">{String(v)}</td>
                  </tr>
                ))}
              </tbody></table>
            </div>
            {/* Variant Selector */}
            {hasVariants&&(
              <div style={{marginBottom:18}}>
                <p style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"#888",marginBottom:10,fontWeight:500}}>Select Size / Specification</p>
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {(p.variants as any[]).map((v:any,i:number)=>(
                    <button key={i} onClick={()=>setSelVar(i===selVar?-1:i)} style={{textAlign:"left",padding:"10px 14px",borderRadius:3,border:`2px solid ${selVar===i?C.gold:C.sand}`,background:selVar===i?C.lgold:"transparent",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:13,color:selVar===i?C.dark:"#555",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all .18s"}}>
                      <span>{v.label}</span>
                      <span style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,color:selVar===i?C.gold:"#888",flexShrink:0,marginLeft:12}}>{v.quoteRequired?"Quote req.":priceIn(cur,v.priceINR)}</span>
                    </button>
                  ))}
                </div>
                {variantRequired&&<p style={{fontSize:12,color:"#c08840",marginTop:8,display:"flex",alignItems:"center",gap:5}}>⚠ Select a size / specification above to proceed</p>}
              </div>
            )}
            {/* Price */}
            <div style={{background:C.lgold,padding:"16px 18px",borderRadius:3,borderLeft:`3px solid ${C.gold}`,marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5,flexWrap:"wrap",gap:8}}>
                <span style={{fontSize:12,color:"#777"}}>
                  {isQuoteRequired?"Final quote required":activeVar?"Selected price (indicative)":hasVariants?"Select variant for price":"Indicative price range"}
                </span>
                <span style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:600,color:isQuoteRequired?"#aaa":C.gold}}>
                  {isQuoteRequired?"—":priceIn(cur,displayPriceINR)}
                </span>
              </div>
              {activeVar&&!isQuoteRequired&&<div style={{fontSize:11.5,color:"#777",marginBottom:4}}>SKU: {activeVar.sku}</div>}
              {isQuoteRequired&&<p style={{fontSize:12,color:"#c08840",lineHeight:1.55}}>This configuration requires a custom quote. Use Get Quote or WhatsApp below.</p>}
              {!isQuoteRequired&&<p style={{fontSize:11.5,color:"#777",lineHeight:1.5}}>{p.priceNote}</p>}
            </div>
            {/* Qty stepper */}
            {canBuy&&(
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                <span style={{fontSize:11.5,color:"#888",letterSpacing:"1px",textTransform:"uppercase"}}>Quantity</span>
                <div style={{display:"flex",alignItems:"center",border:`1px solid ${C.sand}`,borderRadius:3,overflow:"hidden"}}>
                  <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{padding:"8px 14px",background:"none",border:"none",fontSize:18,cursor:"pointer",color:C.dark,lineHeight:1}}>−</button>
                  <span style={{padding:"0 16px",fontSize:14,fontWeight:500,color:C.dark,minWidth:32,textAlign:"center"}}>{qty}</span>
                  <button onClick={()=>setQty(q=>Math.min(99,q+1))} style={{padding:"8px 14px",background:"none",border:"none",fontSize:18,cursor:"pointer",color:C.dark,lineHeight:1}}>+</button>
                </div>
              </div>
            )}
            {/* Primary CTAs */}
            {isQuoteRequired?(
              <div style={{background:"#FFF8F0",border:`1px solid #F0D8B0`,borderRadius:3,padding:"13px 16px",marginBottom:14,fontSize:13,color:"#8A6400",lineHeight:1.65}}>
                Final quote required — exact price depends on your city, quantity, and configuration. Request below.
              </div>
            ):(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                <button onClick={handleAddToCart} disabled={!canBuy}
                  style={{padding:"14px",fontFamily:"'Inter',sans-serif",fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase",cursor:canBuy?"pointer":"not-allowed",borderRadius:2,border:`2px solid ${C.gold}`,background:addedMsg?"#e8d9c0":"transparent",color:C.gold,fontWeight:500,transition:"all .2s",opacity:canBuy?1:.5}}>
                  {addedMsg?"✓ Added!":"Add to Basket"}
                </button>
                <button onClick={handleBuyNow} disabled={!canBuy}
                  style={{padding:"14px",fontFamily:"'Inter',sans-serif",fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase",cursor:canBuy?"pointer":"not-allowed",borderRadius:2,border:"none",background:canBuy?C.gold:"#ccc",color:"#fff",fontWeight:500,transition:"background .2s"}}>
                  Buy Now →
                </button>
              </div>
            )}
            {/* Secondary actions */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8}}>
              <button onClick={()=>onWish(p.id)} style={{padding:"10px 6px",fontFamily:"'Inter',sans-serif",fontSize:11,letterSpacing:"1px",textTransform:"uppercase",cursor:"pointer",borderRadius:2,border:`1px solid ${wished?C.gold:C.sand}`,background:wished?C.lgold:"transparent",color:wished?C.gold:"#888",transition:"all .2s"}}>
                {wished?"♥ Saved":"♡ Save"}
              </button>
              <button className="bo" style={{padding:"10px 6px",fontSize:11}} onClick={()=>onInquire(p,"quote")}>Get Quote</button>
              <button className="bo" style={{padding:"10px 6px",fontSize:11}} onClick={()=>onInquire(p,"proforma")}>Proforma</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18}}>
              <button style={{background:"#25D366",color:"#fff",border:"none",padding:"11px 8px",fontFamily:"'Inter',sans-serif",fontSize:11,letterSpacing:"1px",textTransform:"uppercase",cursor:"pointer",borderRadius:2,transition:"background .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}
                onClick={()=>window.open(waMsg(`Hi XIYORA, I'm interested in the ${p.name}${activeVar?` (${activeVar.label})`:""}. Can you share the landed price for my city?`),"_blank")}>
                {WA_ICON}WhatsApp
              </button>
              <button className="bo" style={{padding:"11px 8px",fontSize:11}} onClick={()=>onInquire(p,"bulk")}>Bulk / B2B</button>
            </div>
            {/* Delivery */}
            <div style={{padding:"12px 14px",background:C.beige,borderRadius:3,marginBottom:20,display:"flex",gap:10,alignItems:"flex-start"}}>
              <svg width={18} height={18} fill="none" stroke={C.gold} strokeWidth={1.5} viewBox="0 0 24 24" style={{flexShrink:0,marginTop:2}}><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
              <div>
                <p style={{fontSize:12.5,fontWeight:500,color:C.dark,marginBottom:3}}>Delivery Estimate</p>
                <p style={{fontSize:12.5,color:"#666",lineHeight:1.6}}>Timeline confirmed after stock, city, port, and quantity review. {p.deliveryNote}</p>
              </div>
            </div>
            {/* Document cards */}
            <div style={{padding:"18px",background:C.beige,borderRadius:4,border:`1px solid ${C.sand}`}}>
              <div style={{fontSize:9,letterSpacing:"2.5px",textTransform:"uppercase",color:"#aaa",marginBottom:14,fontWeight:500}}>Documents Available for Buyer Review</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[
                  {title:"OEKO-TEX® Cert",msg:"Hi XIYORA, I would like to request the OEKO-TEX® Standard 100 certificate for my review."},
                  {title:"ISO 9001 Cert",msg:"Hi XIYORA, I would like to request the ISO 9001 Quality Management certificate."},
                  {title:"GTTC Lab Report",msg:"Hi XIYORA, I would like to request the GTTC Lab Testing Report for your latex products."},
                  {title:"Product Catalogue",msg:"Hi XIYORA, please share the full Bingxi product catalogue with specifications and pricing."},
                ].map((d,i)=>(
                  <button key={i} onClick={()=>window.open(`https://wa.me/${BIZ.wa}?text=${encodeURIComponent(d.msg)}`,"_blank")}
                    style={{background:C.white,border:`1px solid ${C.sand}`,borderRadius:3,padding:"10px 12px",cursor:"pointer",textAlign:"left",transition:"all .2s",fontFamily:"'Inter',sans-serif"}}
                    onMouseEnter={(e:any)=>{e.currentTarget.style.borderColor=C.gold;e.currentTarget.style.boxShadow="0 4px 18px rgba(200,169,126,.15)";}}
                    onMouseLeave={(e:any)=>{e.currentTarget.style.borderColor=C.sand;e.currentTarget.style.boxShadow="none";}}>
                    <div style={{fontSize:11.5,fontWeight:500,color:C.dark,marginBottom:5}}>{d.title}</div>
                    <div style={{display:"flex",alignItems:"center",gap:5}}>
                      <svg width={10} height={10} fill="#25D366" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.143.564 4.148 1.549 5.878L0 24l6.29-1.525A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.36-.214-3.733.905.948-3.64-.234-.373A9.818 9.818 0 1112 21.818z"/></svg>
                      <span style={{fontSize:10,color:"#25D366",fontWeight:500}}>Request via WhatsApp</span>
                    </div>
                  </button>
                ))}
              </div>
              <p style={{fontSize:10,color:"#bbb",marginTop:10,fontStyle:"italic",lineHeight:1.5}}>Originals shared within 24 hours. Scope per document.</p>
            </div>
          </div>
        </div>
      </div>
      {p.useCases?.length>0&&(
        <div style={{background:C.beige,padding:"36px 0"}}>
          <div className="container">
            <p style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"#888",marginBottom:14,fontWeight:500}}>Ideal For</p>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              {p.useCases.map((u:string,i:number)=>(
                <div key={i} style={{background:C.white,padding:"12px 18px",borderRadius:3,fontSize:13.5,color:C.dark,boxShadow:"0 2px 10px rgba(0,0,0,.04)"}}>◈ {u}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── CATALOG VIEW ───────────────────────────────────────── */
function CatalogView({cat,setCat,cur,wl,onWish,onOpen,onInquire}:any){
  const C=useC();
  const filtered=cat?PRODUCTS.filter(p=>p.category===cat):PRODUCTS;
  return(
    <div style={{background:C.white,minHeight:"100vh"}}>
      <LuxHero
        crumbs="Home · Collections"
        title={<>The Bingxi <em style={{color:C.gold}}>Collection</em></>}
        subtitle="Natural Latex, Curated for India"
        seal="选"
        intro="Premium Talalay & Dunlop latex pillows, mattresses, toppers, and cushions. Indicative prices — final quotes confirmed after your city and quantity."
        features={[{name:"bed",label:"Mattresses"},{name:"leaf",label:"Toppers"},{name:"heart",label:"Pillows"},{name:"craft",label:"Cushions"}]}
        image="/assets/lux/inkwash-landscape.png"
        imageAlt="Ink-wash mountain landscape"
      />
      <div style={{borderBottom:`1px solid ${C.sand}`,position:"sticky",top:62,zIndex:10,background:"rgba(248,246,242,.97)",backdropFilter:"blur(12px)"}}>
        <div className="container" style={{display:"flex",overflowX:"auto"}}>
          {CATS.map(c=>(
            <button key={c.name} onClick={()=>setCat(c.filter)} style={{background:"none",border:"none",padding:"15px 18px",fontSize:13,fontFamily:"'Inter',sans-serif",cursor:"pointer",whiteSpace:"nowrap",color:cat===c.filter?C.gold:"#888",borderBottom:`2px solid ${cat===c.filter?C.gold:"transparent"}`,transition:"all .2s",letterSpacing:".5px",flexShrink:0}}>
              {c.name} <span style={{fontSize:10,color:"#bbb"}}>({c.name==="All Products"?PRODUCTS.length:PRODUCTS.filter(p=>p.category===c.filter).length})</span>
            </button>
          ))}
        </div>
      </div>
      <div className="container" style={{padding:"44px 40px"}}>
        <div className="grid-3">
          {filtered.map(p=><PCard key={p.id} p={p} cur={cur} wl={wl} onWish={onWish} onOpen={onOpen} onInquire={onInquire}/>)}
        </div>
        <div style={{marginTop:44,padding:"16px 20px",background:C.lgold,borderLeft:`3px solid ${C.gold}`,borderRadius:2}}>
          <p style={{fontSize:13,color:"#888",lineHeight:1.7}}><strong style={{color:C.dark}}>Pricing Note:</strong> Indicative prices include estimated import costs. Shipping, customs, IGST, and local delivery confirmed in your final quote. {BIZ.gstNote}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── BUYER BEST-FIT SELECTOR ────────────────────────────── */
function BuyerBestFit({onCatFilter,onCatalog,onSupplier,onInquire}:any){
  const C=useC();
  const [active,setActive]=useState(BUYER_TYPES[0].key);
  const sel=BUYER_TYPES.find(b=>b.key===active)||BUYER_TYPES[0];
  const act=()=>{
    if(sel.key==="home_buyer"&&sel.catFilter)onCatFilter(sel.catFilter);
    else if(sel.catFilter)onCatFilter(sel.catFilter);
    else if(sel.key==="retailer"||sel.key==="trade_partner")onSupplier();
    else onCatalog();
  };
  return(
    <section className="sec" style={{background:C.beige,paddingTop:64,paddingBottom:64}}>
      <div className="container">
        <Reveal style={{textAlign:"center",marginBottom:34}}>
          <SL>Find Your Best Fit</SL>
          <SH center>Tell Us Who You Are</SH>
          <p style={{fontSize:14.5,color:"#999",marginTop:10,maxWidth:560,margin:"10px auto 0",lineHeight:1.7,fontWeight:300}}>We'll point you to the right starting point — comfort products, catalogue review, or document-backed B2B sourcing.</p>
        </Reveal>
        <Reveal style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",marginBottom:26}}>
          {BUYER_TYPES.map(b=>(
            <button key={b.key} className={`bt-chip${active===b.key?" active":""}`} onClick={()=>setActive(b.key)}>{b.label}</button>
          ))}
        </Reveal>
        <Reveal style={{maxWidth:680,margin:"0 auto"}}>
          <div style={{background:C.white,borderRadius:8,padding:"26px 28px",borderTop:`3px solid ${C.gold}`,boxShadow:"0 12px 40px rgba(0,0,0,.07)",textAlign:"center"}}>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:C.dark,lineHeight:1.5,marginBottom:20}}>{sel.message}</p>
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              <button className="bg xiyora-gold-button" style={{padding:"13px 26px",fontSize:12}} onClick={act}>{sel.cta}</button>
              <button className="bo" style={{padding:"13px 24px",fontSize:11.5}} onClick={()=>onInquire(null,"quote")}>Ask for Guidance</button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── HOME VIEW ──────────────────────────────────────────── */
function HomeView({cur,wl,onWish,onOpen,onCatalog,onCatFilter,onSupplier,onInquire}:any){
  const C=useC();
  const catImages:Record<string,string>={
    Mattresses:"/assets/products/talalay-latex-mattress/talalay-latex-mattress-1.jpg",
    Pillows:"/assets/products/talalay-contour-pillow/talalay-contour-pillow-1.jpg",
    Toppers:"/assets/categories/toppers-premium.png",
    Cushions:"/assets/products/dunlop-standard-seat-cushion/dunlop-standard-seat-cushion-1.jpg",
    "Latex Material":"/assets/categories/latex-material-premium.png",
  };
  return(
    <div>
      {/* HERO — DARK ORNATE (reference-faithful black-lacquer + gold) */}
      <DarkHomeHero onCatalog={onCatalog} onSupplier={onSupplier}/>
      {/* QUICK-NAV BAND (dark) */}
      <section style={{background:C.char,position:"relative",overflow:"hidden"}}>
        <img src="/assets/lux/bonsai-darkwood.png" alt="" aria-hidden style={{position:"absolute",right:0,top:0,height:"100%",width:"34%",objectFit:"cover",opacity:.32,maskImage:"linear-gradient(to left,#000,transparent)",WebkitMaskImage:"linear-gradient(to left,#000,transparent)"}}/>
        <div className="container" style={{position:"relative"}}>
          <div className="grid-4" style={{gap:0}}>
            {[
              {ic:"box",t:"Explore Products",d:"Mattresses, Toppers & More",fn:onCatalog},
              {ic:"handshake",t:"For Businesses",d:"Solutions for Hotels, Retail & Institutions",fn:onSupplier},
              {ic:"doc",t:"Documents",d:"Certifications & Reports",fn:()=>onInquire(null,"general")},
              {ic:"globe",t:"B2B Portal",d:"Official Bingxi Partner for India",fn:onSupplier},
            ].map((q,i)=>(
              <button key={i} type="button" onClick={q.fn} aria-label={`${q.t} — ${q.d}`} style={{display:"flex",alignItems:"flex-start",gap:14,padding:"30px 26px",borderRight:i<3?"1px solid #262320":"none",border:"none",borderTop:"none",borderBottom:"none",borderLeft:"none",background:"transparent",textAlign:"left",width:"100%",cursor:"pointer",transition:"background .3s"}}
                onMouseEnter={(e:any)=>e.currentTarget.style.background="rgba(200,169,126,.05)"}
                onMouseLeave={(e:any)=>e.currentTarget.style.background="transparent"}>
                <LuxIcon name={q.ic} size={24}/>
                <div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:500,color:"#F0EBE3",marginBottom:4}}>{q.t}</div>
                  <div style={{fontSize:11.5,color:"#8a8378",lineHeight:1.5}}>{q.d}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
      {/* OUR PROMISE — 3-UP (latex / sage statement / vase) */}
      <section style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr"}} className="promise-3up">
        <div className="x-frame" style={{position:"relative",minHeight:340,overflow:"hidden"}}>
          <img src="/assets/lux/latex-closeup.png" alt="Natural latex close-up" style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(20,18,16,.7),transparent 55%)"}}/>
          <div style={{position:"absolute",left:0,bottom:0,padding:"26px 24px"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:19,color:"#fff",fontWeight:500}}>Pure by Nature,<br/>Perfected by Science</div>
            <p style={{fontSize:11.5,color:"rgba(255,255,255,.78)",marginTop:8,lineHeight:1.6,maxWidth:230}}>Responsibly sourced natural latex for unmatched comfort and durability.</p>
          </div>
        </div>
        <div style={{background:"#7c8270",display:"flex",flexDirection:"column",justifyContent:"center",padding:"48px 40px",color:"#fff",minHeight:340}}>
          <span style={{fontSize:11,letterSpacing:"3px",textTransform:"uppercase",color:"rgba(255,255,255,.7)",marginBottom:18}}>Our Promise</span>
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.7rem,2.6vw,2.4rem)",fontWeight:500,lineHeight:1.18}}>Elevating Everyday Rest Into an Art of Living.</h3>
          <div style={{marginTop:22}}><Seal ch="美" style={{borderColor:"rgba(255,255,255,.7)",color:"#fff"}}/></div>
        </div>
        <div className="x-frame" style={{position:"relative",minHeight:340,overflow:"hidden"}}>
          <img src="/assets/lux/vase-blossom.png" alt="Ink-wash still life" style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0}}/>
        </div>
      </section>
      <style>{`@media(max-width:860px){.promise-3up{grid-template-columns:1fr!important}}`}</style>
      {/* PROMISE ICON STRIP */}
      <IconStrip items={[{name:"leaf",label:"Sustainable Sourcing"},{name:"wave",label:"Exceptional Breathability"},{name:"drop",label:"Pressure Relief"},{name:"hourglass",label:"Long-Lasting Durability"},{name:"shield",label:"Certified Quality"}]}/>
      {/* BUYER BEST-FIT SELECTOR */}
      <BuyerBestFit onCatFilter={onCatFilter} onCatalog={onCatalog} onSupplier={onSupplier} onInquire={onInquire}/>
      {/* CATEGORIES */}
      <section className="sec paper ink-wash" style={{position:"relative"}}>
        <GoldCloud className="x-drift-slow" size={150} opacity={.16} style={{position:"absolute",top:36,left:24,pointerEvents:"none"}}/>
        <div className="container">
          <Reveal style={{textAlign:"center",marginBottom:52}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:16}}><Seal ch="选" title="Curated collection"/></div>
            <SL>Bingxi Collection</SL>
            <SH center>Shop By Category</SH>
            <div className="x-divider" style={{margin:"16px auto"}}>❖</div>
            <p style={{fontSize:14.5,color:C.ink,maxWidth:440,margin:"10px auto 0",lineHeight:1.7,fontWeight:400}}>From mattresses to specialty cushions — explore the full Bingxi range.</p>
          </Reveal>
          <Stagger className="grid-5">
            {CATS.filter(c=>c.filter).map((cat,i)=>{
              const [imgErr,setImgErr]=useState(false);
              return(
                <div key={i} className="cc x-frame" style={{aspectRatio:"2/3"}} onClick={()=>onCatFilter(cat.filter)}>
                  <img src={imgErr?FALLBACK_IMG:catImages[cat.filter!]} alt={cat.name} className="ci" onError={()=>setImgErr(true)}/>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(20,18,16,.86) 0%,rgba(20,18,16,.1) 50%,transparent 70%)"}}/>
                  <div className="cc-tag x-tag">{cat.name.split(" ")[0]}</div>
                  <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"20px 16px"}}>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:500,color:"#fff",marginBottom:6}}>{cat.name}</div>
                    <div style={{fontSize:10.5,color:"rgba(255,255,255,.6)",letterSpacing:"1.2px",textTransform:"uppercase",marginBottom:10}}>{PRODUCTS.filter(p=>p.category===cat.filter).length} Products</div>
                    <span className="x-link" style={{color:"#fff",fontSize:10.5}}>Explore <span className="ar">→</span></span>
                  </div>
                </div>
              );
            })}
          </Stagger>
        </div>
      </section>
      {/* FEATURED PRODUCTS */}
      <section className="sec" style={{background:C.beige,position:"relative",overflow:"hidden"}}>
        <Sakura className="x-drift-slow" size={170} color="#BFA295" style={{position:"absolute",top:0,right:-10,opacity:.4,pointerEvents:"none"}}/>
        <div className="container">
          <Reveal style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:48,flexWrap:"wrap",gap:18}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:16}}>
              <Seal ch="品" title="Quality catalogue" style={{marginTop:4}}/>
              <div><SL>Bingxi Catalogue</SL><SH>Featured Products</SH></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              <span style={{fontSize:12,color:C.ink}}>Indicative landed ranges</span>
              <button className="x-link" onClick={onCatalog}>View All <span className="ar">→</span></button>
            </div>
          </Reveal>
          <div className="grid-3">
            {PRODUCTS.slice(0,6).map(p=><PCard key={p.id} p={p} cur={cur} wl={wl} onWish={onWish} onOpen={onOpen} onInquire={onInquire}/>)}
          </div>
          <div style={{marginTop:32,padding:"14px 20px",background:C.lgold,borderLeft:`3px solid ${C.gold}`,borderRadius:2}}>
            <p style={{fontSize:13,color:"#888",lineHeight:1.7}}><strong style={{color:C.dark}}>Pricing Note:</strong> All indicative prices include estimated import costs. Final landed price confirmed in your quote. {BIZ.gstNote}</p>
          </div>
        </div>
      </section>
      {/* WHY XIYORA */}
      <section className="sec paper ink-wash" style={{position:"relative"}}>
        <div className="container">
          <div className="grid-2" style={{gap:72}}>
            <Reveal>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:6}}><Seal ch="信" title="Trust"/><SL>Our Promise</SL></div>
              <SH>Why Choose<br/><em>XIYORA?</em></SH>
              <p style={{fontSize:15,color:C.ink,lineHeight:1.85,margin:"18px 0 36px",fontWeight:400,maxWidth:460}}>We connect trusted global latex manufacturers with the Indian market — genuine comfort products with transparent pricing and dedicated support.</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                {[["◈","Honest Sourcing","Official Bingxi sourcing partner. No inflated claims."],["◉","Transparent Pricing","Indicative ranges shown. Full breakdown in your quote."],["◎","B2B Focused","Hotels, retailers, designers, and manufacturers welcome."],["◇","Custom Orders","Non-standard sizes, densities, and branding available."]].map(([ic,t,d],i)=>(
                  <div key={i} style={{padding:"20px 18px",background:C.white,borderRadius:3,borderTop:`2px solid ${C.gold}`,transition:"box-shadow .3s,transform .3s",boxShadow:"0 1px 10px rgba(0,0,0,.03)"}}
                    onMouseEnter={(e:any)=>{e.currentTarget.style.boxShadow="0 12px 32px rgba(0,0,0,.1)";e.currentTarget.style.transform="translateY(-3px)";}}
                    onMouseLeave={(e:any)=>{e.currentTarget.style.boxShadow="0 1px 10px rgba(0,0,0,.03)";e.currentTarget.style.transform="translateY(0)";}}>
                    <div style={{fontSize:20,color:C.gold,marginBottom:9}}>{ic}</div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:500,color:C.dark,marginBottom:6}}>{t}</div>
                    <div style={{fontSize:12.5,color:C.ink,lineHeight:1.7}}>{d}</div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal style={{position:"relative"}}>
              <GoldCloud className="x-drift" size={120} opacity={.5} style={{position:"absolute",top:-30,right:-12,pointerEvents:"none",zIndex:2}}/>
              <div className="x-frame" style={{borderRadius:5}}>
                <img src="/assets/products/talalay-bread-pillow/talalay-bread-pillow-1.jpg" alt="Premium latex comfort" style={{width:"100%",height:520,objectFit:"cover",borderRadius:5,display:"block"}} onError={(e:any)=>{e.currentTarget.src=FALLBACK_IMG;}}/>
              </div>
              <div style={{position:"absolute",bottom:-20,left:-20,background:C.white,padding:"18px 24px",boxShadow:"0 14px 46px rgba(0,0,0,.11)",borderRadius:3,borderLeft:`2px solid ${C.seal}`}}>
                <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:C.ink,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:5}}>Starting From</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:600,color:C.gold}}>₹1,600</div>
                <div style={{fontSize:11,color:C.ink,marginTop:3}}>Indicative · Quote after your city</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      {/* PROCESS */}
      <section className="sec" style={{background:C.beige}}>
        <div className="container">
          <div style={{textAlign:"center",marginBottom:52}}>
            <SL>Simple Process</SL>
            <SH center>How It Works</SH>
          </div>
          <div className="grid-4">
            {[["01","Browse & Select","Explore the full Bingxi catalogue and select products that match your needs."],["02","Get a Quote","Send an inquiry or WhatsApp us. We reply with an indicative landed price for your city."],["03","Confirm Order","Review the proforma invoice, confirm specs, and approve before any payment."],["04","Delivery","Shipped from China and delivered to your door. 3–10 days inland after port clearance."]].map(([n,t,d])=>(
              <div key={n} style={{padding:"26px 22px",background:C.white,borderRadius:3,borderTop:`3px solid ${C.gold}`,transition:"transform .3s,box-shadow .3s"}}
                onMouseEnter={(e:any)=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 14px 38px rgba(0,0,0,.09)";}}
                onMouseLeave={(e:any)=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:40,fontWeight:300,color:C.sand,marginBottom:14,lineHeight:1}}>{n}</div>
                <h4 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:500,color:C.dark,marginBottom:10}}>{t}</h4>
                <p style={{fontSize:13,color:"#888",lineHeight:1.72,fontWeight:300}}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* DOCUMENTS SECTION */}
      <section className="sec" style={{background:C.beige}}>
        <div className="container">
          <div style={{textAlign:"center",marginBottom:44}}>
            <SL>Transparency First</SL>
            <SH>Documents & Certifications</SH>
            <p style={{fontSize:15,color:"#888",maxWidth:540,margin:"14px auto 0",lineHeight:1.8}}>All Bingxi quality documents available for buyer review. Tap any card to request via WhatsApp — we share the original within 24 hours.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
            {[
              {icon:<svg width={28} height={28} fill="none" stroke={C.gold} strokeWidth={1.5} viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,title:"OEKO-TEX® Standard 100",sub:"Tested for harmful substances",msg:"Hi XIYORA, I would like to request the OEKO-TEX® Standard 100 certificate for my review."},
              {icon:<svg width={28} height={28} fill="none" stroke={C.gold} strokeWidth={1.5} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>,title:"ISO 9001 Certificate",sub:"International quality management",msg:"Hi XIYORA, I would like to request the ISO 9001 Quality Management certificate for my review."},
              {icon:<svg width={28} height={28} fill="none" stroke={C.gold} strokeWidth={1.5} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h6M9 17h4"/></svg>,title:"GTTC Lab Testing Report",sub:"Independent third-party test report",msg:"Hi XIYORA, I would like to request the GTTC Lab Testing Report for latex content, density and safety."},
              {icon:<svg width={28} height={28} fill="none" stroke={C.gold} strokeWidth={1.5} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>,title:"Business Licence",sub:"Registered manufacturer document",msg:"Hi XIYORA, I would like to request the Bingxi Business Licence document for our import compliance."},
              {icon:<svg width={28} height={28} fill="none" stroke={C.gold} strokeWidth={1.5} viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,title:"Full Product Catalogue",sub:"37+ products with specs & SKUs",msg:"Hi XIYORA, please share the full Bingxi product catalogue with specifications and pricing."},
              {icon:<svg width={28} height={28} fill="none" stroke={C.gold} strokeWidth={1.5} viewBox="0 0 24 24"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>,title:"Mattress Catalogue",sub:"Sizes, densities & construction details",msg:"Hi XIYORA, please share the Bingxi Mattress & Topper catalogue with specifications and available sizes."},
            ].map((d,i)=>(
              <div key={i}
                style={{background:C.white,borderRadius:4,padding:"26px 24px",border:`1px solid ${C.sand}`,cursor:"pointer",transition:"all .25s",display:"flex",flexDirection:"column",gap:10}}
                onClick={()=>window.open(`https://wa.me/${BIZ.wa}?text=${encodeURIComponent(d.msg)}`,"_blank")}
                onMouseEnter={(e:any)=>{e.currentTarget.style.borderColor=C.gold;e.currentTarget.style.boxShadow="0 10px 36px rgba(200,169,126,.18)";e.currentTarget.style.transform="translateY(-3px)";}}
                onMouseLeave={(e:any)=>{e.currentTarget.style.borderColor=C.sand;e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
                <div style={{width:52,height:52,background:"#F5EDE0",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{d.icon}</div>
                <div>
                  <h4 style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:500,color:C.dark,margin:"0 0 4px"}}>{d.title}</h4>
                  <p style={{fontSize:12,color:"#999",margin:0,lineHeight:1.5}}>{d.sub}</p>
                </div>
                <div style={{marginTop:"auto",paddingTop:12,borderTop:`1px solid ${C.sand}`,display:"flex",alignItems:"center",gap:7}}>
                  <svg width={13} height={13} fill="#25D366" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.143.564 4.148 1.549 5.878L0 24l6.29-1.525A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.36-.214-3.733.905.948-3.64-.234-.373A9.818 9.818 0 1112 21.818z"/></svg>
                  <span style={{fontSize:11.5,color:"#25D366",fontFamily:"'Inter',sans-serif",fontWeight:500,letterSpacing:".3px"}}>Request via WhatsApp</span>
                </div>
              </div>
            ))}
          </div>
          <p style={{textAlign:"center",fontSize:11,color:"#bbb",marginTop:22,fontStyle:"italic"}}>Certificates apply to the scope stated in each document. Original copies shared on request.</p>
        </div>
      </section>
      {/* MOBILE: make doc grid 1 col */}
      <style>{`@media(max-width:900px){.doc-grid-home{grid-template-columns:1fr 1fr!important}}@media(max-width:560px){.doc-grid-home{grid-template-columns:1fr!important}}`}</style>
      {/* B2B BAND — DARK ORNATE (reference-faithful) */}
      <DarkBusinessBand onSupplier={onSupplier}/>
      {/* BOTTOM CTA */}
      <section style={{padding:"64px 0",background:C.beige}}>
        <div className="container" style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:24}}>
          <div>
            <SL>Ready to Start?</SL>
            <SH>Let's Talk About Your Order</SH>
            <p style={{fontSize:14.5,color:"#888",marginTop:10,maxWidth:480,lineHeight:1.72,fontWeight:300}}>Home buyer or B2B buyer — we're ready to share an indicative quote and get you started.</p>
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <button className="bg" onClick={()=>onInquire(null,"general")} style={{padding:"14px 28px",fontSize:12}}>Send Inquiry</button>
            <button style={{background:"#25D366",color:"#fff",border:"none",padding:"14px 28px",fontFamily:"'Inter',sans-serif",fontSize:12,letterSpacing:"1.5px",textTransform:"uppercase",cursor:"pointer",borderRadius:2}}
              onClick={()=>window.open(waMsg("Hi XIYORA, I want to know more about your Bingxi latex products."),"_blank")}>
                <svg width={14} height={14} fill="white" viewBox="0 0 24 24" style={{display:"inline",verticalAlign:"middle",marginRight:5}}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.143.564 4.148 1.549 5.878L0 24l6.29-1.525A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.36-.214-3.733.905.948-3.64-.234-.373A9.818 9.818 0 1112 21.818z"/></svg>
                WhatsApp
              </button>
          </div>
        </div>
      </section>
      {/* TRUST STRIP — DARK (reference-faithful) */}
      <FooterTrustStrip/>
    </div>
  );
}

/* ─── CERT CHIPS STRIP ───────────────────────────────────── */
const CERT_CHIPS_DATA=[
  {label:"OEKO-TEX®",icon:"🛡"},
  {label:"ISO 9001",icon:"◎"},
  {label:"GTTC Lab Report",icon:"◈"},
  {label:"Business Licence",icon:"◇"},
  {label:"Product Catalogue",icon:"◉"},
  {label:"Mattress Catalogue",icon:"◉"},
];
function CertChips({onProof}:{onProof:()=>void}){
  return(
    <div style={{padding:"13px 0",borderTop:`1px solid ${C.sand}`,borderBottom:`1px solid ${C.sand}`,background:C.beige,overflowX:"auto"}}>
      <div className="container">
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"#aaa",flexShrink:0,whiteSpace:"nowrap"}}>Docs for buyer review:</span>
          {CERT_CHIPS_DATA.map((c,i)=>(
            <button key={i} className="cert-chip" onClick={onProof} title="Documents available for buyer review">
              <span style={{color:C.gold,fontSize:9}}>{c.icon}</span>{c.label}
            </button>
          ))}
          <span style={{fontSize:10,color:"#ccc",marginLeft:4,fontStyle:"italic",whiteSpace:"nowrap",flexShrink:0}}>Scope per document.</span>
        </div>
      </div>
    </div>
  );
}

/* ─── SIDE DRAWER ────────────────────────────────────────── */
function SideDrawer({open,onClose,setPage,onCatFilter,onCatalog,onInquire,onProof}:any){
  const C=useC();
  useEffect(()=>{
    if(open)document.body.style.overflow="hidden";
    else document.body.style.overflow="";
    return()=>{document.body.style.overflow="";};
  },[open]);
  const go=(fn:()=>void)=>{fn();onClose();};
  const NavLink=({label,fn}:{label:string;fn:()=>void})=>(
    <button className="sdr-link" onClick={()=>go(fn)}>{label}</button>
  );
  return(
    <>
      {open&&<div className="sdrawer-overlay" onClick={onClose}/>}
      <div className={`sdrawer${open?" open":""}`}>
        {/* Header */}
        <div style={{padding:"24px 24px 16px",borderBottom:"1px solid #2a2a2a",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:600,letterSpacing:6,color:"#F0EBE3"}}>XIYORA</div>
            <button onClick={onClose} style={{background:"none",border:"1px solid #2a2a2a",color:"#888",cursor:"pointer",width:28,height:28,borderRadius:"50%",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}
              onMouseEnter={(e:any)=>{e.currentTarget.style.borderColor="#C8A97E";e.currentTarget.style.color="#F0EBE3";}}
              onMouseLeave={(e:any)=>{e.currentTarget.style.borderColor="#2a2a2a";e.currentTarget.style.color="#888";}}>✕</button>
          </div>
          <div style={{fontSize:10,color:"#555",letterSpacing:"1px",textTransform:"uppercase",lineHeight:1.5}}>Official Bingxi sourcing partner for India</div>
        </div>
        {/* Navigation */}
        <div style={{padding:"8px 0"}}>
          <span className="sdr-section">Navigation</span>
          <NavLink label="Home" fn={()=>setPage("home")}/>
          <NavLink label="All Products" fn={()=>onCatalog()}/>
          <span className="sdr-section">Products</span>
          <NavLink label="Mattresses" fn={()=>onCatFilter("Mattresses")}/>
          <NavLink label="Pillows" fn={()=>onCatFilter("Pillows")}/>
          <NavLink label="Toppers" fn={()=>onCatFilter("Toppers")}/>
          <NavLink label="Cushions" fn={()=>onCatFilter("Cushions")}/>
          <NavLink label="Latex Material" fn={()=>onCatFilter("Latex Material")}/>
          <span className="sdr-section">Partners & Trade</span>
          <NavLink label="Bingxi Partner" fn={()=>setPage("about")}/>
          <NavLink label="B2B / Trade Access" fn={()=>setPage("supplier")}/>
          <NavLink label="Join XIYORA Trade" fn={()=>onInquire(null,"bulk")}/>
          <span className="sdr-section">Documents</span>
          <NavLink label="Documents & Certifications" fn={()=>onProof()}/>
          <NavLink label="Request Quote" fn={()=>onInquire(null,"quote")}/>
          <span className="sdr-section">Info</span>
          <NavLink label="About XIYORA" fn={()=>setPage("about")}/>
          <NavLink label="Contact" fn={()=>setPage("contact")}/>
          <NavLink label="Shipping" fn={()=>setPage("shipping")}/>
          <NavLink label="FAQ" fn={()=>setPage("faq")}/>
          <NavLink label="Terms / Privacy" fn={()=>setPage("terms")}/>
        </div>
        {/* Cert chips */}
        <div style={{padding:"14px 20px 16px",borderTop:"1px solid #252525",borderBottom:"1px solid #252525"}}>
          <div style={{fontSize:9,letterSpacing:"2px",textTransform:"uppercase",color:"#555",marginBottom:10}}>Quality Documents</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {["OEKO-TEX®","ISO 9001","GTTC Report","Business Licence","Catalogue"].map(c=>(
              <button key={c} onClick={()=>go(onProof)}
                style={{padding:"4px 10px",border:"1px solid #333",borderRadius:20,background:"none",color:"#777",fontSize:10,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .2s"}}
                onMouseEnter={(e:any)=>{e.currentTarget.style.borderColor="#C8A97E";e.currentTarget.style.color="#C8A97E";}}
                onMouseLeave={(e:any)=>{e.currentTarget.style.borderColor="#333";e.currentTarget.style.color="#777";}}>{c}</button>
            ))}
          </div>
          <p style={{fontSize:10,color:"#444",marginTop:8,lineHeight:1.5}}>Certificates apply to the scope stated in each document.</p>
        </div>
        {/* Contact */}
        <div style={{padding:"18px 24px 24px"}}>
          <div style={{fontSize:9,letterSpacing:"2px",textTransform:"uppercase",color:"#555",marginBottom:12}}>Contact</div>
          <a href={`https://wa.me/${BIZ.wa}`} target="_blank" rel="noreferrer"
            style={{display:"flex",alignItems:"center",gap:9,color:"#4fd97e",fontSize:13,textDecoration:"none",marginBottom:10,fontFamily:"'Inter',sans-serif"}}>
            <svg width={14} height={14} fill="#4fd97e" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.143.564 4.148 1.549 5.878L0 24l6.29-1.525A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.36-.214-3.733.905.948-3.64-.234-.373A9.818 9.818 0 1112 21.818z"/></svg>
            +91 70283 11226
          </a>
          <a href={`mailto:${BIZ.email}`}
            style={{display:"flex",alignItems:"center",gap:9,color:"#999",fontSize:12,textDecoration:"none",marginBottom:10,fontFamily:"'Inter',sans-serif"}}>
            <svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            {BIZ.email}
          </a>
          <a href={BIZ.ig} target="_blank" rel="noreferrer"
            style={{display:"flex",alignItems:"center",gap:9,color:"#999",fontSize:12,textDecoration:"none",marginBottom:18,fontFamily:"'Inter',sans-serif"}}>
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/></svg>
            @xiyora.zi
          </a>
          <button className="bg" onClick={()=>go(()=>onInquire(null,"quote"))}
            style={{width:"100%",padding:"11px",fontSize:11,letterSpacing:"2px"}}>Request Quote</button>
        </div>
      </div>
    </>
  );
}

/* ─── NAVBAR ─────────────────────────────────────────────── */
function Navbar({page,setPage,cur,setCur,scrolled,wl,cartCount,theme,toggleTheme,onSearch,onCatalog,onCatFilter,onCheckout,onSidebar,onSupplier}:any){
  const NAVBG="rgba(22,19,16,.97)";
  return(
    <nav style={{position:"sticky",top:0,zIndex:200,background:NAVBG,borderBottom:"1px solid rgba(200,169,126,.18)",backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",boxShadow:scrolled?"0 2px 30px rgba(0,0,0,.32)":"none",transition:"all .35s ease"}}>
      {/* corner ornament top-left */}
      <svg className="nav-ornament" width={26} height={26} viewBox="0 0 26 26" fill="none" style={{position:"absolute",top:6,left:10,opacity:.55,pointerEvents:"none"}} aria-hidden>
        <path d="M2 13c0-6 5-11 11-11" stroke="#C8A97E" strokeWidth="1"/><path d="M2 8c0-3 3-6 6-6" stroke="#C8A97E" strokeWidth=".7" opacity=".6"/><circle cx="13" cy="2" r="1.3" fill="#C8A97E"/>
      </svg>
      <div className="container" style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",height:62}}>
        {/* Left: Hamburger + desktop nav links */}
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <button onClick={onSidebar} className="ib" title="Menu" aria-label="Open menu" style={{color:"#D9CBB8"}}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="nc" style={{display:"flex",gap:20,alignItems:"center",marginLeft:8}}>
            {[["Home","home"],["Products","catalog"],["Collections","catalog"],["About XIYORA","about"],["Partnership","supplier"],["Contact","contact"]].map(([l,v],i)=>(
              <button key={i} className="nl" style={{fontSize:11,color:page===v?"#E6C89A":"#D9CBB8",letterSpacing:"1.4px"}} onClick={()=>{
                if(v==="catalog")onCatalog();
                else{window.history.pushState({page:v},"",`/${v}`);setPage(v);}
              }}>{l}</button>
            ))}
          </div>
        </div>
        {/* Center: ornate cartouche — sakura garland + circle-X monogram + XIYORA + 舒适·自然·匠心 */}
        <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center",minWidth:0}}>
          <img src={DECO.sakuraCluster} alt="" aria-hidden className="nav-ornament" style={{position:"absolute",left:-30,top:-14,width:46,opacity:.9,pointerEvents:"none",zIndex:1}}/>
          <img src={DECO.sakuraCluster} alt="" aria-hidden className="nav-ornament" style={{position:"absolute",right:-30,top:-14,width:46,opacity:.9,transform:"scaleX(-1)",pointerEvents:"none",zIndex:1}}/>
          <div className="nav-cartouche" onClick={()=>setPage("home")} title="XIYORA — Home" style={{cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"4px 24px",position:"relative",zIndex:2,border:"1px solid rgba(200,169,126,.32)",borderTop:"none",borderRadius:"0 0 16px 16px",background:"linear-gradient(180deg,rgba(200,169,126,.1),transparent 85%)"}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <svg className="nav-mono" width={24} height={24} viewBox="0 0 48 48" fill="none" style={{flexShrink:0}} aria-hidden>
                <circle cx="24" cy="24" r="22" stroke="#C8A97E" strokeWidth="1.3"/><circle cx="24" cy="24" r="17.5" stroke="#C8A97E" strokeWidth=".6" opacity=".45"/><path d="M16 16l16 16M32 16L16 32" stroke="#C8A97E" strokeWidth="1.4" strokeLinecap="round"/><circle cx="24" cy="24" r="3.2" fill="#C8A97E"/>
              </svg>
              <div className="nav-brand-x" style={{fontFamily:"'Playfair Display',serif",fontSize:23,fontWeight:600,letterSpacing:6,color:"#F2EADB",lineHeight:1,userSelect:"none",whiteSpace:"nowrap"}}>XIYORA</div>
            </div>
            <div className="nav-brand-sub" style={{fontFamily:"'Inter',sans-serif",fontSize:8.5,letterSpacing:3,color:"#B89A6E",userSelect:"none",whiteSpace:"nowrap"}}>舒适 · 自然 · 匠心</div>
          </div>
        </div>
        {/* Right: Currency, Search, Cart, B2B Portal */}
        <div className="nav-right" style={{display:"flex",alignItems:"center",gap:6,justifyContent:"flex-end"}}>
          <select className="nav-cur" value={cur} onChange={e=>setCur(e.target.value)} title={CURRENCY_DISCLAIMER} aria-label="Display currency" style={{background:"rgba(255,255,255,.07)",color:"#E6DCC9",border:"1px solid rgba(200,169,126,.25)",borderRadius:16,padding:"5px 9px",fontSize:11,fontWeight:500,cursor:"pointer",fontFamily:"'Inter',sans-serif",letterSpacing:".3px"}}>
            {CURRENCIES.map(c=>(<option key={c} value={c} style={{background:"#1a1714"}}>{c}</option>))}
          </select>
          <button onClick={toggleTheme} title={theme==="dark"?"Switch to Light Mode":"Switch to Dark Mode"} className="ib nav-theme" style={{color:"#D9CBB8",fontSize:13,padding:"4px 6px"}}>{theme==="dark"?"☀":"◑"}</button>
          <button className="ib" onClick={onSearch} title="Search" style={{color:"#D9CBB8"}}>
            <svg width={17} height={17} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24"><circle cx={11} cy={11} r={8}/><path d="M21 21l-4.35-4.35"/></svg>
          </button>
          <button className="ib nav-wish" onClick={onCheckout} style={{position:"relative",color:"#D9CBB8"}} title="Wishlist / Saved">
            <svg width={17} height={17} fill={wl&&wl.length?"#C8A97E":"none"} stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            {wl&&wl.length>0&&<span style={{position:"absolute",top:-5,right:-5,background:"#C8A97E",color:"#fff",borderRadius:"50%",width:16,height:16,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:600}}>{wl.length}</span>}
          </button>
          <button className="ib" onClick={onCheckout} style={{position:"relative",color:"#D9CBB8"}} title="Basket / Checkout">
            <svg width={17} height={17} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            {cartCount>0&&<span style={{position:"absolute",top:-5,right:-5,background:"#C8A97E",color:"#fff",borderRadius:"50%",width:16,height:16,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:600}}>{cartCount}</span>}
          </button>
          <button className="nc-item" onClick={onSupplier} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",marginLeft:4,color:"#E6C89A",fontFamily:"'Inter',sans-serif",fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase",fontWeight:500,whiteSpace:"nowrap"}}>
            <LuxIcon name="globe" size={15} color="#E6C89A"/>B2B Portal
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────── */
function Footer({setPage,onInquire,onSubscribe}:any){
  const C=useC();
  return(
    <footer style={{background:"#141210",color:"#888",padding:"70px 0 36px",position:"relative",overflow:"hidden"}}>
      <GoldCloud className="x-drift-slow" size={220} opacity={.12} style={{position:"absolute",top:30,right:40,pointerEvents:"none"}}/>
      <div className="container" style={{position:"relative"}}>
        <div className="fc-grid" style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1.6fr",gap:38,marginBottom:52}}>
          <div>
            <div style={{cursor:"pointer",marginBottom:16,display:"inline-block"}} onClick={()=>setPage("home")}><Monogram color="#E9D6B4" size={.95}/></div>
            <p style={{fontSize:13,lineHeight:1.85,color:"#999",marginBottom:18,maxWidth:220}}>Official Bingxi sourcing partner for India. Premium natural latex mattresses, pillows, toppers, and cushions.</p>
            <a href={waMsg("Hi XIYORA")} target="_blank" rel="noreferrer" style={{fontSize:12.5,color:"#aaa",textDecoration:"none",display:"flex",alignItems:"center",gap:7,marginBottom:7,transition:"color .2s"}}
              onMouseEnter={(e:any)=>e.currentTarget.style.color="#4fd97e"}
              onMouseLeave={(e:any)=>e.currentTarget.style.color="#aaa"}>
              <span style={{color:"#25D366",fontSize:9}}>●</span>+91 70283 11226
            </a>
            <a href={`mailto:${BIZ.email}`} style={{fontSize:12.5,color:"#aaa",textDecoration:"none",display:"flex",alignItems:"center",gap:7,marginBottom:8,transition:"color .2s"}}
              onMouseEnter={(e:any)=>e.currentTarget.style.color="#C8A97E"}
              onMouseLeave={(e:any)=>e.currentTarget.style.color="#aaa"}>
              <svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              {BIZ.email}
            </a>
            <a href={BIZ.ig} target="_blank" rel="noreferrer"
              style={{fontSize:12.5,color:"#aaa",textDecoration:"none",display:"flex",alignItems:"center",gap:8,marginBottom:12,transition:"color .25s"}}
              onMouseEnter={(e:any)=>e.currentTarget.style.color="#E1306C"}
              onMouseLeave={(e:any)=>e.currentTarget.style.color="#aaa"}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.01" fill="currentColor" strokeWidth={2.5}/>
              </svg>
              @xiyora.zi
            </a>
            <div style={{display:"flex",gap:10}}>
              <a href={BIZ.ig} target="_blank" rel="noreferrer" title="Instagram"
                style={{width:34,height:34,background:"linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",opacity:.8,transition:"opacity .2s,transform .2s"}}
                onMouseEnter={(e:any)=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="scale(1.1)";}}
                onMouseLeave={(e:any)=>{e.currentTarget.style.opacity=".8";e.currentTarget.style.transform="scale(1)";}}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.01" fill="white" strokeWidth={2.5}/></svg>
              </a>
              <a href={waMsg("Hi XIYORA")} target="_blank" rel="noreferrer" title="WhatsApp"
                style={{width:34,height:34,background:"#25D366",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",opacity:.8,transition:"opacity .2s,transform .2s"}}
                onMouseEnter={(e:any)=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="scale(1.1)";}}
                onMouseLeave={(e:any)=>{e.currentTarget.style.opacity=".8";e.currentTarget.style.transform="scale(1)";}}>
                <svg width={16} height={16} fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.143.564 4.148 1.549 5.878L0 24l6.29-1.525A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.36-.214-3.733.905.948-3.64-.234-.373A9.818 9.818 0 1112 21.818z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <div style={{fontSize:11,letterSpacing:"2px",textTransform:"uppercase",color:"#F0EBE3",marginBottom:18,fontWeight:500}}>Products</div>
            {[["Mattresses","Mattresses"],["Pillows","Pillows"],["Toppers","Toppers"],["Cushions","Cushions"],["All Products","catalog"]].map(([l,v])=>(
              <button key={l} className="fl" onClick={()=>setPage(v==="catalog"?"catalog":"catalog")}>{l}</button>
            ))}
          </div>
          <div>
            <div style={{fontSize:11,letterSpacing:"2px",textTransform:"uppercase",color:"#F0EBE3",marginBottom:18,fontWeight:500}}>Company</div>
            {[["About XIYORA","about"],["For B2B","supplier"],["Contact","contact"],["FAQ","faq"],["Certificates & Proof","proof"]].map(([l,v])=>(
              <button key={l} className="fl" onClick={()=>setPage(v)}>{l}</button>
            ))}
          </div>
          <div>
            <div style={{fontSize:11,letterSpacing:"2px",textTransform:"uppercase",color:"#F0EBE3",marginBottom:18,fontWeight:500}}>Help</div>
            {[["Shipping","shipping"],["Returns","returns"],["Privacy","privacy"],["Terms","terms"]].map(([l,v])=>(
              <button key={l} className="fl" onClick={()=>setPage(v)}>{l}</button>
            ))}
          </div>
          <div>
            <div style={{fontSize:11,letterSpacing:"2px",textTransform:"uppercase",color:"#F0EBE3",marginBottom:18,fontWeight:500}}>Stay in Touch</div>
            <p style={{fontSize:13,color:"#888",lineHeight:1.78,marginBottom:16}}>Product launches, B2B updates, and comfort insights.</p>
            <button className="bg" style={{width:"100%",padding:12,fontSize:12}} onClick={onSubscribe}>Join XIYORA</button>
            <p style={{fontSize:11.5,color:"#666",lineHeight:1.7,marginTop:16,maxWidth:220}}>{BIZ.address}</p>
          </div>
        </div>
        {/* signature bar */}
        <div style={{textAlign:"center",padding:"6px 0 34px",position:"relative"}}>
          <div className="x-divider" style={{margin:"0 auto 16px",color:"#C8A97E"}}>❖</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,letterSpacing:"3px",color:"#E9D6B4"}}>XIYORA · Crafted Comfort</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginTop:10}}>
            <span style={{fontSize:11,letterSpacing:"3px",textTransform:"uppercase",color:"#8a8378"}}>Considered Luxury</span>
            <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:26,height:26,border:"1px solid #9E3B2E",color:"#C04A39",fontFamily:"'Playfair Display',serif",fontSize:13,borderRadius:2}}>印</span>
          </div>
        </div>
        <div style={{borderTop:"1px solid #1e1e1e",paddingTop:22,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div style={{fontSize:12,color:"#666"}}>© 2025 XIYORA. All prices indicative. Proforma / Estimate provided where applicable.</div>
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            {[["Privacy","privacy"],["Terms","terms"],["Shipping","shipping"],["Returns","returns"]].map(([l,v])=>(
              <button key={l} onClick={()=>setPage(v)} style={{background:"none",border:"none",fontSize:11.5,color:"#666",cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"color .2s"}}
                onMouseEnter={(e:any)=>e.currentTarget.style.color="#C8A97E"}
                onMouseLeave={(e:any)=>e.currentTarget.style.color="#666"}>{l}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── CHECKOUT VIEW ──────────────────────────────────────── */
const UPI_ID = "chaitanyagaikwad022@okicici";
const UPI_NAME = "XIYORA";

function CheckoutView({cart,setCart,cur,wl,onWish,onAddToCart,onOpen,onInquire,onCatalog}:any){
  const C=useC();
  const items:CartItem[]=cart||[];
  const wishList:string[]=wl||[];
  const wishProducts=PRODUCTS.filter(p=>wishList.includes(p.id));
  const [payMode,setPayMode]=useState<"upi"|"proforma"|"whatsapp"|"card">("upi");
  const [utr,setUtr]=useState("");
  const [form,setForm]=useState(()=>{
    try{const d=JSON.parse(localStorage.getItem("xiyora_checkout_draft")||"null");if(d&&typeof d==="object")return {name:d.name||"",phone:d.phone||"",email:d.email||"",city:d.city||"",state:d.state||"",pincode:d.pincode||""};}catch{}
    return {name:"",phone:"",email:"",city:"",state:"",pincode:""};
  });
  const [confirmed,setConfirmed]=useState(false);
  const [fieldErr,setFieldErr]=useState<Record<string,string>>({});
  const [loading,setLoading]=useState(false);
  const [submitted,setSubmitted]=useState(false);
  const [savedId,setSavedId]=useState<number|null>(null);
  const [err,setErr]=useState("");
  const hasDraft=!!(form.name||form.phone||form.city);

  const setF=(k:string,v:string)=>{setForm((p:any)=>({...p,[k]:v}));if(confirmed)setConfirmed(false);};
  const removeItem=(cartKey:string)=>setCart((prev:CartItem[])=>prev.filter(i=>i.cartKey!==cartKey));
  const updateQty=(cartKey:string,qty:number)=>setCart((prev:CartItem[])=>prev.map((i:CartItem)=>i.cartKey===cartKey?{...i,quantity:Math.max(1,qty)}:i));

  const moveWishToCart=(p:any)=>{
    const v=p.variants?.[0];
    const item:CartItem={cartKey:`${p.id}__${v?v.sku:"base"}`,productId:p.id,productName:p.name,sku:v?v.sku:"",variantLabel:v?v.label:p.name,priceINR:v?v.priceINR:p.priceINR,priceUSD:v?v.priceUSD:p.priceUSD,priceNumINR:parsePriceNum(v?v.priceINR:p.priceINR),quoteRequired:false,image:p.gallery?.[0]||FALLBACK_IMG,quantity:1};
    onAddToCart(item);onWish(p.id);
  };

  const cartTotalINR=items.reduce((s,i)=>s+(i.priceNumINR||0)*i.quantity,0);
  const productNames=items.map(i=>`${i.productName}${i.variantLabel&&i.variantLabel!==i.productName?` (${i.variantLabel})`:""} ×${i.quantity}`).join(", ");
  const delivery=confirmed?lookupPincode(form.pincode):null;

  const pkgGroups=items.reduce((acc:Record<string,number>,i:CartItem)=>{const cat=PRODUCTS.find(p=>p.id===i.productId)?.category;const t=pkgTypeFor(cat);acc[t]=(acc[t]||0)+i.quantity;return acc;},{});
  const packageCount=Object.entries(pkgGroups).reduce((n,[t,units])=>n+Math.ceil(units/UNITS_PER_PKG[t as PkgType]),0);
  const deliveryINR=delivery?Object.entries(pkgGroups).reduce((sum,[t,units])=>{const pt=t as PkgType;const cnt=Math.ceil(units/UNITS_PER_PKG[pt]);const base=DELIVERY_FEE[pt][delivery.zone]??DELIVERY_FEE[pt].B;return sum+base+(cnt>1?(cnt-1)*base*EXTRA_PKG_FACTOR[pt]:0);},0):0;
  const deliveryINRr=Math.round(deliveryINR);
  const grandTotalINR=cartTotalINR+deliveryINRr;
  const payableINR=delivery?grandTotalINR:cartTotalINR;

  const upiLink=`upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}${payableINR>0?`&am=${payableINR}`:""}&cu=INR&tn=${encodeURIComponent("XIYORA Order: "+productNames.slice(0,50))}`;
  const upiUnlocked=confirmed&&items.length>0;

  const validate=()=>{
    const e:Record<string,string>={};
    if(!form.name.trim())e.name="Full name is required.";
    if(!form.phone.trim()||form.phone.replace(/\D/g,"").length<10)e.phone="Enter a valid WhatsApp number (10+ digits).";
    if(form.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))e.email="Enter a valid email or leave it blank.";
    if(!form.city.trim())e.city="City is required.";
    if(!form.state.trim())e.state="State is required.";
    if(!/^\d{6}$/.test(form.pincode.trim()))e.pincode="Enter a valid 6-digit Indian pincode.";
    return e;
  };
  const confirmDetails=()=>{
    const e=validate();setFieldErr(e);
    if(Object.keys(e).length){setConfirmed(false);return;}
    setConfirmed(true);setErr("");
    try{localStorage.setItem("xiyora_checkout_draft",JSON.stringify(form));}catch{}
  };

  const submitIntent=async()=>{
    if(!confirmed){setErr("Please confirm your details & location first.");return;}
    setLoading(true);setErr("");
    const res=await apiPost("/checkout-intents",{
      name:form.name,phone:form.phone,email:form.email||undefined,
      city:form.city||undefined,state:form.state||undefined,pincode:form.pincode||undefined,
      productName:productNames,currency:cur,
      estimatedPriceRange:cartTotalINR>0?`₹${(delivery?grandTotalINR:cartTotalINR).toLocaleString("en-IN")} (indicative${delivery?", incl. delivery":""})`:"Price on request",
      paymentMode:payMode==="upi"?`UPI Manual — UTR: ${utr||"pending"}`:payMode==="proforma"?"Proforma Invoice":payMode==="whatsapp"?"WhatsApp Confirmation":"Card/Gateway (pending)",
    });
    setLoading(false);
    if(res?.success){setSavedId(res.id);setSubmitted(true);}
    else setErr(res?.error||"Could not save. Please use WhatsApp instead.");
  };

  const checkoutWA=()=>{
    const msg=`Hi XIYORA, I'd like to place an order.\n\n${productNames}\n\nName: ${form.name}\nPhone: ${form.phone}${form.city?`\nCity: ${form.city}, ${form.state} ${form.pincode}`:""}\n\nEstimated total: ₹${(delivery?grandTotalINR:cartTotalINR).toLocaleString("en-IN")} (indicative)`;
    window.open(waMsg(msg),"_blank");
  };

  const sendAddressWA=()=>{
    const ref=savedId?`CHK-${String(savedId).padStart(4,"0")}`:"";
    const msg=`Hi XIYORA, here is my delivery address${ref?` for order ${ref}`:""}:\n\nName: ${form.name}\nPhone: ${form.phone}${form.email?`\nEmail: ${form.email}`:""}\nDelivery to: ${form.city}, ${form.state} — ${form.pincode}\n\nItems: ${productNames}\n\nPlease confirm delivery and next steps.`;
    window.open(waMsg(msg),"_blank");
  };

  const printProforma=()=>{
    const dateStr=new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
    const ref=savedId?`CHK-${String(savedId).padStart(4,"0")}`:"DRAFT (unsaved)";
    const esc=(s:string)=>String(s||"").replace(/[<>&]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;"}[c]||c));
    const rows=items.map(i=>`<tr><td>${esc(i.productName)}${i.variantLabel&&i.variantLabel!==i.productName?`<br><span class="muted">${esc(i.variantLabel)}</span>`:""}<br><span class="muted">SKU: ${esc(i.sku)||"—"}</span></td><td class="c">${i.quantity}</td><td class="r">₹${(i.priceNumINR||0).toLocaleString("en-IN")}</td><td class="r">₹${((i.priceNumINR||0)*i.quantity).toLocaleString("en-IN")}</td></tr>`).join("");
    const html=`<!doctype html><html><head><meta charset="utf-8"><title>XIYORA Proforma ${ref}</title><style>
*{box-sizing:border-box}body{font-family:'Helvetica Neue',Arial,sans-serif;color:#2D2D2D;max-width:760px;margin:0 auto;padding:40px 32px;font-size:13px;line-height:1.6}
h1{font-family:Georgia,serif;letter-spacing:6px;font-size:30px;margin:0 0 2px;font-weight:500}
.tag{letter-spacing:2px;text-transform:uppercase;font-size:10px;color:#C8A97E;margin-bottom:24px}
.head{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #C8A97E;padding-bottom:16px;margin-bottom:20px}
.meta{text-align:right;font-size:12px;color:#666}
.cols{display:flex;gap:32px;margin-bottom:22px}.col{flex:1}
.lbl{text-transform:uppercase;letter-spacing:1px;font-size:10px;color:#999;margin-bottom:6px}
table{width:100%;border-collapse:collapse;margin-bottom:8px}
th{text-align:left;border-bottom:1px solid #ddd;padding:8px 6px;font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:#999}
td{padding:9px 6px;border-bottom:1px solid #f0f0f0;vertical-align:top}
.c{text-align:center}.r{text-align:right}.muted{color:#999;font-size:11px}
.totals{margin-left:auto;width:280px;margin-top:8px}
.totals div{display:flex;justify-content:space-between;padding:5px 0}
.grand{border-top:2px solid #C8A97E;margin-top:6px;padding-top:10px!important;font-size:16px;font-family:Georgia,serif;color:#C8A97E}
.note{margin-top:30px;padding:14px 16px;background:#F5EEE4;border-left:3px solid #C8A97E;font-size:11px;color:#777;line-height:1.7}
@media print{body{padding:16px}.noprint{display:none}}
</style></head><body>
<div class="head"><div><h1>XIYORA</h1><div class="tag">Proforma / Estimate</div></div>
<div class="meta"><strong>Ref: ${ref}</strong><br>Date: ${dateStr}<br>Currency: INR</div></div>
<div class="cols">
<div class="col"><div class="lbl">From</div>XIYORA<br>${esc(BIZ.address)}<br>WhatsApp: +91 ${BIZ.wa.slice(2)}<br>${esc(BIZ.email)}</div>
<div class="col"><div class="lbl">Bill To</div>${esc(form.name)||"—"}<br>${esc(form.phone)||"—"}${form.email?`<br>${esc(form.email)}`:""}${form.city?`<br>${esc(form.city)}, ${esc(form.state)} ${esc(form.pincode)}`:""}</div>
</div>
<table><thead><tr><th>Item</th><th class="c">Qty</th><th class="r">Unit (₹)</th><th class="r">Amount (₹)</th></tr></thead><tbody>${rows}</tbody></table>
<div class="totals">
<div><span>Subtotal (indicative)</span><span>₹${cartTotalINR.toLocaleString("en-IN")}</span></div>
<div><span>Domestic delivery${delivery?` (Zone ${delivery.zone})`:""}</span><span>${delivery?`₹${deliveryINRr.toLocaleString("en-IN")}`:"To be confirmed"}</span></div>
<div class="grand"><span>Estimated Total</span><span>₹${(delivery?grandTotalINR:cartTotalINR).toLocaleString("en-IN")}</span></div>
</div>
<div class="note"><strong>This is a Proforma / Estimate, not a tax invoice.</strong> All prices are indicative and subject to written confirmation. ${delivery?`Delivery routed via ${esc(delivery.port)}, estimated transit ${esc(delivery.days)} days after dispatch.`:"Delivery is estimated once the destination is confirmed."} Formal tax documentation provided where applicable after GST registration. No payment has been collected against this document.</div>
<div class="noprint" style="margin-top:24px;text-align:center"><button onclick="window.print()" style="background:#2D2D2D;color:#fff;border:none;padding:11px 28px;border-radius:2px;letter-spacing:1px;cursor:pointer">Print / Save as PDF</button></div>
</body></html>`;
    const w=window.open("","_blank");
    if(!w){alert("Please allow pop-ups to view your proforma.");return;}
    w.document.write(html);w.document.close();w.focus();
  };

  const inp=(k?:string):React.CSSProperties=>({width:"100%",background:"#fafaf8",border:`1px solid ${k&&fieldErr[k]?"#e0a0a0":C.sand}`,padding:"10px 13px",fontSize:13,borderRadius:3,fontFamily:"'Inter',sans-serif",color:C.dark,marginBottom:fieldErr[k||""]?3:10});
  const lbl:React.CSSProperties={fontSize:11.5,color:"#888",marginBottom:5,display:"block"};
  const ferr=(k:string)=>fieldErr[k]?<div style={{fontSize:11,color:"#cc4444",marginBottom:8}}>{fieldErr[k]}</div>:null;

  return(
    <div style={{background:C.white,minHeight:"60vh",padding:"64px 0"}}>
      <div className="container" style={{maxWidth:900}}>
        <SL>Checkout</SL>
        <SH>Your Basket</SH>

        {!items.length?(
          <div style={{textAlign:"center",padding:"56px 0"}}>
            <div style={{width:80,height:80,background:C.beige,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
              <svg width={32} height={32} fill="none" stroke={C.gold} strokeWidth={1.4} viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            </div>
            <p style={{fontSize:16,color:"#bbb",marginBottom:18}}>Your basket is empty.</p>
            <button className="bg" onClick={onCatalog}>Browse Products</button>
            {wishProducts.length>0&&(
              <div style={{maxWidth:520,margin:"40px auto 0",textAlign:"left"}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12,justifyContent:"center"}}>
                  <svg width={14} height={14} fill={C.gold} viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  <span style={{fontSize:12,fontWeight:500,color:C.dark,letterSpacing:".5px",textTransform:"uppercase"}}>Saved for Later ({wishProducts.length})</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {wishProducts.map((p:any)=>(
                    <div key={p.id} style={{display:"flex",gap:12,alignItems:"center",background:C.lgold,borderRadius:4,padding:"10px 12px"}}>
                      <img src={p.gallery?.[0]||FALLBACK_IMG} alt={p.name} style={{width:48,height:48,objectFit:"contain",borderRadius:3,flexShrink:0,background:C.beige,cursor:"pointer"}} onError={(e:any)=>{e.target.src=FALLBACK_IMG;}} onClick={()=>onOpen(p)}/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14.5,color:C.dark,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:"pointer"}} onClick={()=>onOpen(p)}>{p.name}</div>
                        <div style={{fontSize:12,color:C.gold,fontFamily:"'Playfair Display',serif",fontWeight:500}}>{priceIn(cur,p.priceINR)}</div>
                      </div>
                      <button onClick={()=>moveWishToCart(p)} style={{background:C.gold,color:"#fff",border:"none",padding:"7px 12px",cursor:"pointer",borderRadius:3,fontSize:10.5,letterSpacing:".5px",textTransform:"uppercase",fontFamily:"'Inter',sans-serif",flexShrink:0}}>Move to Basket</button>
                      <button onClick={()=>onWish(p.id)} title="Remove" style={{background:"none",border:`1px solid ${C.sand}`,padding:"6px 9px",cursor:"pointer",borderRadius:2,fontSize:11,color:"#aaa",fontFamily:"'Inter',sans-serif",flexShrink:0}}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ):submitted?(
          <div style={{textAlign:"center",padding:"40px 0",maxWidth:520,margin:"40px auto 0"}}>
            <div style={{width:72,height:72,background:"linear-gradient(135deg,#C8A97E,#B89472)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
              <svg width={28} height={28} fill="none" stroke="white" strokeWidth={2.5} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:24,color:C.dark,marginBottom:10}}>Order Intent Saved</h3>
            {savedId&&<p style={{fontSize:12,color:"#bbb",marginBottom:8}}>Reference: CHK-{String(savedId).padStart(4,"0")}</p>}
            <p style={{fontSize:14,color:"#888",lineHeight:1.75,marginBottom:8}}>
              {payMode==="upi"?`UPI payment pending verification. UTR/Ref: ${utr||"not entered"}.`:""}
              {payMode==="proforma"?"We will prepare your Proforma Invoice and send via WhatsApp / email.":""}
              {payMode==="whatsapp"?"We will confirm your order via WhatsApp shortly.":""}
            </p>
            <p style={{fontSize:13,color:"#aaa",lineHeight:1.7,marginBottom:20}}>We will contact you within 24–48 hours to confirm and proceed with your final invoice.</p>
            <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
              <button style={{background:"#25D366",color:"#fff",border:"none",padding:"13px 26px",fontFamily:"'Inter',sans-serif",fontSize:12,letterSpacing:"1.2px",textTransform:"uppercase",cursor:"pointer",borderRadius:2}}
                onClick={()=>window.open(waMsg(`Hi XIYORA, I placed an order (CHK-${String(savedId).padStart(4,"0")}) for: ${productNames}. Please confirm next steps.`),"_blank")}>
                <svg width={14} height={14} fill="white" viewBox="0 0 24 24" style={{display:"inline",verticalAlign:"middle",marginRight:5}}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.143.564 4.148 1.549 5.878L0 24l6.29-1.525A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.36-.214-3.733.905.948-3.64-.234-.373A9.818 9.818 0 1112 21.818z"/></svg>
                Confirm on WhatsApp
              </button>
              <button className="bg" onClick={sendAddressWA} style={{padding:"13px 26px",fontSize:12}}>Send Delivery Address</button>
              {cartTotalINR>0&&<button className="bo" onClick={printProforma} style={{padding:"13px 26px",fontSize:12}}>View / Print Proforma</button>}
            </div>
            <p style={{fontSize:11.5,color:"#bbb",marginTop:14,lineHeight:1.6}}>Tap “Send Delivery Address” to share your full delivery address with us on WhatsApp so we can finalise dispatch.</p>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:36,marginTop:32}} className="checkout-grid">
            {/* Left: Items */}
            <div>
              <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
                {items.map((item:CartItem)=>(
                  <div key={item.cartKey} style={{display:"flex",gap:14,padding:"14px 16px",background:C.beige,borderRadius:4,alignItems:"center",transition:"box-shadow .2s"}}
                    onMouseEnter={(e:any)=>e.currentTarget.style.boxShadow="0 4px 18px rgba(0,0,0,.07)"}
                    onMouseLeave={(e:any)=>e.currentTarget.style.boxShadow="none"}>
                    <img src={item.image} alt={item.productName} style={{width:68,height:68,objectFit:"contain",borderRadius:3,flexShrink:0,background:C.white}} onError={(e:any)=>{e.target.src=FALLBACK_IMG;}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:500,color:C.dark,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.productName}</div>
                      {item.variantLabel&&item.variantLabel!==item.productName&&<div style={{fontSize:11.5,color:"#888",marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.variantLabel}</div>}
                      <div style={{fontSize:13,color:C.gold,fontFamily:"'Playfair Display',serif",fontWeight:500}}>{priceIn(cur,item.priceINR)} <span style={{fontSize:10,color:"#bbb",fontFamily:"'Inter',sans-serif",fontWeight:400}}>ea.</span></div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                      <div style={{display:"flex",alignItems:"center",border:`1px solid ${C.sand}`,borderRadius:3,overflow:"hidden"}}>
                        <button onClick={()=>updateQty(item.cartKey,item.quantity-1)} style={{padding:"5px 10px",background:"none",border:"none",fontSize:15,cursor:"pointer",color:C.dark}}>−</button>
                        <span style={{padding:"0 10px",fontSize:13,color:C.dark,minWidth:24,textAlign:"center"}}>{item.quantity}</span>
                        <button onClick={()=>updateQty(item.cartKey,item.quantity+1)} style={{padding:"5px 10px",background:"none",border:"none",fontSize:15,cursor:"pointer",color:C.dark}}>+</button>
                      </div>
                      <button onClick={()=>removeItem(item.cartKey)} style={{background:"none",border:`1px solid ${C.sand}`,padding:"5px 10px",cursor:"pointer",borderRadius:2,fontSize:11,color:"#aaa",fontFamily:"'Inter',sans-serif"}}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Saved / Wishlist items */}
              {wishProducts.length>0&&(
                <div style={{background:C.lgold,borderRadius:4,padding:"16px 18px",marginBottom:16}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}>
                    <svg width={14} height={14} fill={C.gold} viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    <span style={{fontSize:12,fontWeight:500,color:C.dark,letterSpacing:".5px",textTransform:"uppercase"}}>Saved for Later ({wishProducts.length})</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {wishProducts.map((p:any)=>(
                      <div key={p.id} style={{display:"flex",gap:12,alignItems:"center",background:C.white,borderRadius:4,padding:"10px 12px"}}>
                        <img src={p.gallery?.[0]||FALLBACK_IMG} alt={p.name} style={{width:48,height:48,objectFit:"contain",borderRadius:3,flexShrink:0,background:C.beige,cursor:"pointer"}} onError={(e:any)=>{e.target.src=FALLBACK_IMG;}} onClick={()=>onOpen(p)}/>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14.5,color:C.dark,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:"pointer"}} onClick={()=>onOpen(p)}>{p.name}</div>
                          <div style={{fontSize:12,color:C.gold,fontFamily:"'Playfair Display',serif",fontWeight:500}}>{priceIn(cur,p.priceINR)}</div>
                        </div>
                        <button onClick={()=>moveWishToCart(p)} style={{background:C.gold,color:"#fff",border:"none",padding:"7px 12px",cursor:"pointer",borderRadius:3,fontSize:10.5,letterSpacing:".5px",textTransform:"uppercase",fontFamily:"'Inter',sans-serif",flexShrink:0}}>Move to Basket</button>
                        <button onClick={()=>onWish(p.id)} title="Remove" style={{background:"none",border:`1px solid ${C.sand}`,padding:"6px 9px",cursor:"pointer",borderRadius:2,fontSize:11,color:"#aaa",fontFamily:"'Inter',sans-serif",flexShrink:0}}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Customer details — Step 1: Confirm Details & Location */}
              <div style={{background:C.beige,borderRadius:4,padding:"18px 20px",marginBottom:16,borderLeft:`3px solid ${confirmed?"#3a9b6e":C.gold}`}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                  <div style={{fontSize:12,fontWeight:500,color:C.dark,letterSpacing:".5px",textTransform:"uppercase"}}>Step 1 · Confirm Details &amp; Location</div>
                  {confirmed&&<span style={{fontSize:10.5,color:"#3a9b6e",fontWeight:600,letterSpacing:".5px",textTransform:"uppercase",display:"flex",alignItems:"center",gap:4}}><svg width={12} height={12} fill="none" stroke="#3a9b6e" strokeWidth={2.5} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Confirmed</span>}
                </div>
                {hasDraft&&!confirmed&&<div style={{fontSize:11,color:"#9a8a6a",marginBottom:10,background:C.lgold,borderRadius:3,padding:"6px 10px"}}>We restored your saved details. Review and confirm to continue.</div>}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
                  <div><label style={lbl}>Name *</label><input style={inp("name")} value={form.name} onChange={e=>setF("name",e.target.value)} placeholder="Full name"/>{ferr("name")}</div>
                  <div><label style={lbl}>Phone / WhatsApp *</label><input style={inp("phone")} value={form.phone} onChange={e=>setF("phone",e.target.value)} placeholder="+91 XXXXX"/>{ferr("phone")}</div>
                  <div><label style={lbl}>Email</label><input style={inp("email")} type="email" value={form.email} onChange={e=>setF("email",e.target.value)} placeholder="your@email.com"/>{ferr("email")}</div>
                  <div><label style={lbl}>City *</label><input style={inp("city")} value={form.city} onChange={e=>setF("city",e.target.value)} placeholder="Mumbai"/>{ferr("city")}</div>
                  <div><label style={lbl}>State *</label><select style={inp("state")} value={form.state} onChange={e=>setF("state",e.target.value)}><option value="">Select state / UT…</option>{INDIAN_STATES.map(s=><option key={s} value={s}>{s}</option>)}</select>{ferr("state")}</div>
                  <div><label style={lbl}>Pincode *</label><input style={inp("pincode")} value={form.pincode} onChange={e=>setF("pincode",e.target.value.replace(/\D/g,""))} placeholder="421004" maxLength={6} inputMode="numeric"/>{ferr("pincode")}</div>
                </div>
                {!confirmed&&<button className="bg" onClick={confirmDetails} style={{width:"100%",padding:"12px",fontSize:11.5,marginTop:6}}>Confirm Details &amp; Location</button>}
                {confirmed&&delivery&&(
                  <div style={{background:C.white,border:`1px solid ${C.sand}`,borderRadius:3,padding:"10px 14px",marginTop:12,fontSize:11.5,color:"#888",lineHeight:1.65}}>
                    <strong style={{color:C.dark}}>{form.city}, {form.state} — {form.pincode}.</strong>{" "}
                    Routing via {delivery.port} (Zone {delivery.zone}). Estimated transit {delivery.days} days after dispatch — final timeline confirmed in your proforma.
                    <span style={{display:"block",marginTop:4,color:"#aaa"}}>Edit any field above to update — you'll be asked to re-confirm before payment.</span>
                  </div>
                )}
              </div>
              {err&&(
                <div style={{background:"#fff7ed",border:"1px solid #f0d9b8",borderRadius:3,padding:"12px 14px",marginBottom:12}}>
                  <div style={{fontSize:12.5,color:"#9a6a2a",lineHeight:1.6,marginBottom:9}}>{err} Your basket is safe — confirm directly or save a proforma.</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    <button onClick={submitIntent} disabled={loading} style={{background:C.dark,color:"#fff",border:"none",padding:"8px 14px",borderRadius:2,fontSize:11,letterSpacing:".8px",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>Try Again</button>
                    <button onClick={checkoutWA} style={{background:"#25D366",color:"#fff",border:"none",padding:"8px 14px",borderRadius:2,fontSize:11,letterSpacing:".8px",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>WhatsApp</button>
                    {cartTotalINR>0&&<button onClick={printProforma} style={{background:C.beige,color:C.dark,border:"none",padding:"8px 14px",borderRadius:2,fontSize:11,letterSpacing:".8px",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>Save Proforma</button>}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Payment */}
            <div>
              <div style={{background:C.lgold,borderRadius:4,padding:"20px 22px",borderLeft:`3px solid ${C.gold}`,marginBottom:16}}>
                <div style={{fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase",color:"#bbb",marginBottom:8}}>Order Summary</div>
                <div style={{fontSize:12,color:"#888",marginBottom:10,lineHeight:1.5}}>{items.map((i:CartItem)=>`${i.productName}${i.variantLabel&&i.variantLabel!==i.productName?` (${i.variantLabel})`:""} ×${i.quantity}`).join(" · ")}</div>
                {cartTotalINR>0?(
                  <div style={{borderTop:`1px solid ${C.sand}`,paddingTop:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12.5,color:"#888",marginBottom:6}}><span>Subtotal (indicative)</span><span>₹{cartTotalINR.toLocaleString("en-IN")}</span></div>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12.5,color:"#888",marginBottom:6}}>
                      <span>Domestic delivery{packageCount>0?` · ${packageCount} ${packageCount===1?"package":"packages"}`:""}</span>
                      <span>{delivery?`₹${deliveryINRr.toLocaleString("en-IN")}`:"Confirm location"}</span>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",borderTop:`1px solid ${C.sand}`,paddingTop:8,marginTop:2}}>
                      <span style={{fontSize:12,letterSpacing:".5px",textTransform:"uppercase",color:"#999"}}>{delivery?"Estimated total":"Subtotal"}</span>
                      <span style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:600,color:C.gold}}>₹{(delivery?grandTotalINR:cartTotalINR).toLocaleString("en-IN")}</span>
                    </div>
                    {cur!=="INR"&&<div style={{textAlign:"right",fontSize:11.5,color:"#aaa",marginTop:3}}>≈ {fmtMoney(cur,delivery?grandTotalINR:cartTotalINR)} {cur}</div>}
                    <div style={{fontSize:10.5,color:"#bbb",lineHeight:1.6,marginTop:8}}>Indicative total. Delivery {delivery?`routed via ${delivery.port} (Zone ${delivery.zone})`:"estimated after you confirm location"}. Final price confirmed via proforma invoice.{cur!=="INR"?` ${CURRENCY_DISCLAIMER}`:""}</div>
                    <button onClick={printProforma} style={{marginTop:10,width:"100%",background:"transparent",color:C.gold,border:`1px solid ${C.gold}`,padding:"9px",borderRadius:2,fontSize:11,letterSpacing:".8px",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>View / Print Proforma Estimate</button>
                  </div>
                ):(
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:600,color:C.gold}}>Price on request</div>
                )}
              </div>

              <div style={{background:C.beige,borderRadius:4,padding:"20px 22px",marginBottom:16}}>
                <div style={{fontSize:12,fontWeight:500,color:C.dark,marginBottom:14,letterSpacing:".5px",textTransform:"uppercase"}}>Payment Method</div>
                {[
                  {k:"upi",label:"UPI / Google Pay / PhonePe / Paytm",sub:"Manual UPI transfer — enter UTR after payment"},
                  {k:"proforma",label:"Request Proforma Invoice",sub:"We send you a formal invoice to review before payment"},
                  {k:"whatsapp",label:"Confirm via WhatsApp",sub:"Finalise details on WhatsApp, pay after confirmation"},
                  {k:"card",label:"Card / Net Banking (coming soon)",sub:"Gateway integration in progress"},
                ].map(({k,label,sub})=>(
                  <div key={k} onClick={()=>setPayMode(k as any)} style={{display:"flex",gap:12,padding:"12px 14px",marginBottom:8,borderRadius:3,border:`2px solid ${payMode===k?C.gold:C.sand}`,background:payMode===k?C.white:"transparent",cursor:"pointer",transition:"all .2s",opacity:k==="card"?.5:1}}>
                    <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${payMode===k?C.gold:"#ccc"}`,background:payMode===k?C.gold:"transparent",flexShrink:0,marginTop:2}}/>
                    <div>
                      <div style={{fontSize:13,fontWeight:500,color:C.dark}}>{label}</div>
                      <div style={{fontSize:11.5,color:"#aaa",marginTop:2}}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {payMode==="upi"&&!upiUnlocked&&(
                <div style={{background:C.beige,border:`1px dashed ${C.sand}`,borderRadius:4,padding:"18px 20px",marginBottom:16,textAlign:"center"}}>
                  <svg width={22} height={22} fill="none" stroke={C.gold} strokeWidth={1.6} viewBox="0 0 24 24" style={{marginBottom:8}}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  <div style={{fontSize:12.5,color:C.dark,fontWeight:500,marginBottom:4}}>UPI Payment Locked</div>
                  <div style={{fontSize:11.5,color:"#999",lineHeight:1.6}}>Complete <strong>Step 1 · Confirm Details &amp; Location</strong> above to unlock UPI payment and view the QR code.</div>
                </div>
              )}
              {payMode==="upi"&&upiUnlocked&&(
                <div style={{background:C.white,border:`1px solid ${C.sand}`,borderRadius:4,padding:"18px 20px",marginBottom:16}}>
                  <div style={{fontSize:12,fontWeight:500,color:C.dark,marginBottom:12}}>UPI Payment Details</div>
                  <div style={{background:C.beige,borderRadius:3,padding:"12px 14px",marginBottom:12}}>
                    <div style={{fontSize:11,color:"#aaa",marginBottom:3}}>UPI ID</div>
                    <div style={{fontSize:14,fontWeight:600,color:C.dark,letterSpacing:".5px"}}>{UPI_ID}</div>
                    <div style={{fontSize:11,color:"#aaa",marginTop:3}}>Google Pay · PhonePe · Paytm · BHIM · Any UPI app</div>
                  </div>
                  <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
                    <div style={{background:C.white,border:`1px solid ${C.sand}`,borderRadius:6,padding:10,textAlign:"center"}}>
                      <img src="/assets/payment/upi-qr.png" alt={`Scan to pay ${UPI_NAME} via UPI`} style={{width:170,height:170,objectFit:"contain",display:"block"}} onError={(e:any)=>{e.currentTarget.parentElement.style.display="none";}}/>
                      <div style={{fontSize:10.5,color:"#aaa",marginTop:6,letterSpacing:".5px"}}>Scan with any UPI app</div>
                    </div>
                  </div>
                  <a href={upiLink} style={{display:"block",textAlign:"center",background:C.gold,color:"#fff",padding:"11px",borderRadius:3,fontSize:12,textDecoration:"none",letterSpacing:"1px",textTransform:"uppercase",marginBottom:12,fontFamily:"'Inter',sans-serif",fontWeight:500}}>
                    Open UPI App to Pay
                  </a>
                  <label style={lbl}>UTR / Reference Number (after payment)</label>
                  <input style={inp()} value={utr} onChange={e=>setUtr(e.target.value)} placeholder="Enter UTR or transaction reference"/>
                  <p style={{fontSize:11.5,color:"#aaa",lineHeight:1.65}}>Payment status: <strong style={{color:"#C8860A"}}>Pending manual verification.</strong> We will confirm within 24 hours after you share the UTR.</p>
                </div>
              )}

              {payMode==="card"&&(
                <div style={{background:"#fff8f0",border:"1px solid #f0d8b0",borderRadius:4,padding:"14px 16px",marginBottom:16,fontSize:13,color:"#8a6400",lineHeight:1.7}}>
                  Online card / net banking payment integration is pending. Please use UPI manual payment, request a proforma invoice, or confirm via WhatsApp.
                </div>
              )}

              <div style={{fontSize:11.5,color:"#bbb",marginBottom:14,lineHeight:1.65,padding:"0 2px"}}>
                No card details are collected here. No payment is processed automatically. Final invoice confirmed before any payment is collected.
              </div>

              <button className="bg" onClick={submitIntent} style={{width:"100%",padding:"14px",fontSize:12,marginBottom:10,opacity:confirmed?1:.55,cursor:confirmed?"pointer":"not-allowed"}} disabled={loading||!confirmed}>
                {loading?<Spinner/>:!confirmed?"Confirm Details & Location First":payMode==="upi"?"Confirm UPI Payment Intent":payMode==="proforma"?"Request Proforma Invoice":payMode==="whatsapp"?"Confirm via WhatsApp":"Submit Order Intent"}
              </button>
              <button style={{width:"100%",background:"#25D366",color:"#fff",border:"none",padding:"13px",fontFamily:"'Inter',sans-serif",fontSize:12,letterSpacing:"1.2px",textTransform:"uppercase",cursor:"pointer",borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}
                onClick={()=>window.open(waMsg(`Hi XIYORA, I'd like to order: ${productNames}. Can you guide me through payment?`),"_blank")}>
                <svg width={15} height={15} fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.143.564 4.148 1.549 5.878L0 24l6.29-1.525A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.36-.214-3.733.905.948-3.64-.234-.373A9.818 9.818 0 1112 21.818z"/></svg>
                WhatsApp Support
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── ACCOUNT VIEW ───────────────────────────────────────── */
function AccountView({setPage}:any){
  const C=useC();
  const [profile,setProfile]=useState(()=>{
    try{return JSON.parse(localStorage.getItem("xiyora_profile")||"null")||{name:"",phone:"",email:"",city:"",state:"",pincode:"",customerType:"Home Buyer"};}catch{return{name:"",phone:"",email:"",city:"",state:"",pincode:"",customerType:"Home Buyer"};}
  });
  const [saved,setSaved]=useState(false);
  const set=(k:string,v:string)=>setProfile((p:any)=>({...p,[k]:v}));
  const save=()=>{localStorage.setItem("xiyora_profile",JSON.stringify(profile));setSaved(true);setTimeout(()=>setSaved(false),3000);};
  const inp:React.CSSProperties={width:"100%",background:"#fafaf8",border:`1px solid ${C.sand}`,padding:"11px 13px",fontSize:13,borderRadius:3,fontFamily:"'Inter',sans-serif",color:C.dark,marginBottom:12};
  const lbl:React.CSSProperties={fontSize:11.5,color:"#888",marginBottom:5,display:"block"};
  return(
    <div style={{background:C.white,minHeight:"70vh",padding:"56px 0"}}>
      <div className="container" style={{maxWidth:640}}>
        <SL>Your Profile</SL>
        <SH>Account</SH>
        <p style={{fontSize:14,color:"#aaa",marginBottom:36,marginTop:10,lineHeight:1.7}}>Your profile is saved locally on this device. We use it to pre-fill enquiry forms for faster checkout.</p>
        <div style={{background:C.beige,borderRadius:4,padding:"28px 28px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
            {([["Full Name","name","text","Your name"],["Phone / WhatsApp","phone","tel","+91 XXXXX"],["Email","email","email","your@email.com"],["City","city","text","Mumbai"],["State","state","text","Maharashtra"],["Pincode","pincode","text","400001"]] as const).map(([l,k,t,ph])=>(
              <div key={k}><label style={lbl}>{l}</label><input style={inp} type={t} value={profile[k]||""} onChange={e=>set(k,e.target.value)} placeholder={ph}/></div>
            ))}
          </div>
          <div><label style={lbl}>I am a</label>
            <select style={inp} value={profile.customerType||"Home Buyer"} onChange={e=>set("customerType",e.target.value)}>
              {["Home Buyer","Hotel / Resort","Interior Designer","Retailer","Manufacturer","Other"].map(o=><option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
            <button onClick={()=>{
              if(!navigator.geolocation){alert("Geolocation not supported by your browser.");return;}
              navigator.geolocation.getCurrentPosition(pos=>{
                alert(`Location detected (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}). Please enter your city and pincode manually for accurate delivery estimates.`);
                localStorage.setItem("xiyora_geo",JSON.stringify({lat:pos.coords.latitude,lng:pos.coords.longitude,ts:Date.now()}));
              },()=>alert("Location access denied. Please enter your city and pincode manually."));
            }} style={{background:C.beige,border:`1px solid ${C.sand}`,color:C.dark,padding:"10px 16px",borderRadius:3,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",gap:8,transition:"border-color .2s"}}
              onMouseEnter={(e:any)=>e.currentTarget.style.borderColor=C.gold}
              onMouseLeave={(e:any)=>e.currentTarget.style.borderColor=C.sand}>
              <svg width={13} height={13} fill="none" stroke={C.gold} strokeWidth={1.8} viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Detect my location
            </button>
            <span style={{fontSize:12,color:"#bbb"}}>Then fill city & pincode below</span>
          </div>
          {saved&&<div style={{background:"#edfaf5",border:"1px solid #1a9e6e",borderRadius:3,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#1a9e6e"}}>✓ Profile saved to this device</div>}
          <button className="bg" onClick={save} style={{padding:"12px 28px",fontSize:12}}>Save Profile</button>
        </div>
        <div style={{marginTop:32,padding:"18px 22px",background:C.beige,borderRadius:4,borderLeft:`3px solid ${C.gold}`}}>
          <p style={{fontSize:14,fontWeight:500,color:C.dark,marginBottom:6}}>Your Enquiries</p>
          <p style={{fontSize:13,color:"#888",lineHeight:1.7}}>Your enquiries are saved in our database. Contact us on WhatsApp at <a href={waMsg("Hi XIYORA, I want to check my enquiry status.")} target="_blank" rel="noreferrer" style={{color:C.gold,textDecoration:"none"}}>+91 70283 11226</a> or email <a href={`mailto:${BIZ.email}`} style={{color:C.gold,textDecoration:"none"}}>{BIZ.email}</a> to check the status of your enquiry.</p>
        </div>
        <button className="bo" style={{marginTop:22,padding:"11px 22px",fontSize:12}} onClick={()=>setPage("home")}>← Back to Home</button>
      </div>
    </div>
  );
}

/* ─── PROOF LIBRARY ──────────────────────────────────────── */
const DOCS=[
  {key:"oeko-tex",title:"OEKO-TEX® Certificate",msg:"Hi XIYORA, I would like to request the OEKO-TEX® Standard 100 certificate for my review."},
  {key:"iso9001",title:"ISO 9001 Certificate",msg:"Hi XIYORA, I would like to request the ISO 9001 Quality Management certificate."},
  {key:"gttc",title:"GTTC Testing Report",msg:"Hi XIYORA, I would like to request the GTTC Lab Testing Report for latex content, density and safety parameters."},
  {key:"biz",title:"Business License",msg:"Hi XIYORA, I would like to request the Bingxi Business Licence document for our import compliance."},
  {key:"catalogue",title:"Full Product Catalogue",msg:"Hi XIYORA, please share the full Bingxi product catalogue with specifications and pricing."},
  {key:"mattress",title:"Mattress Catalogue",msg:"Hi XIYORA, please share the Bingxi Mattress & Topper catalogue with all size and density options."},
  {key:"profile",title:"Bingxi Company Profile",msg:"Hi XIYORA, please share the official Bingxi company profile with manufacturing and export background."},
];

function ProofLibraryView({setPage}:any){
  const C=useC();
  const certs=[
    {
      icon:(<svg width={32} height={32} fill="none" stroke="#C8A97E" strokeWidth={1.5} viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>),
      title:"OEKO-TEX® Standard 100",
      sub:"Tested for Harmful Substances",
      body:"Bingxi products are manufactured with OEKO-TEX® Standard 100 certification. No harmful substances per international safety requirements.",
      tag:"Certificate Available",
      docKey:"oeko-tex",
    },
    {
      icon:(<svg width={32} height={32} fill="none" stroke="#C8A97E" strokeWidth={1.5} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>),
      title:"ISO 9001 Quality Management",
      sub:"International Quality Certification",
      body:"Bingxi holds ISO 9001 quality management system certification — verifying consistent manufacturing processes and quality standards.",
      tag:"Certificate Available",
      docKey:"iso9001",
    },
    {
      icon:(<svg width={32} height={32} fill="none" stroke="#C8A97E" strokeWidth={1.5} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12l2 2 4-4"/></svg>),
      title:"GTTC Lab Testing Report",
      sub:"Independent Quality Testing",
      body:"Third-party GTTC lab test reports covering latex content percentage, density, durability, and safety parameters for Bingxi product lines.",
      tag:"Report Available",
      docKey:"gttc",
    },
    {
      icon:(<svg width={32} height={32} fill="none" stroke="#C8A97E" strokeWidth={1.5} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>),
      title:"Full Product Catalogue",
      sub:"Complete Bingxi Range — 37+ Products",
      body:"Complete product catalogue with specifications, SKUs, and options for the full Bingxi range of Talalay, Dunlop, and hybrid latex products.",
      tag:"Download Available",
      docKey:"catalogue",
    },
    {
      icon:(<svg width={32} height={32} fill="none" stroke="#C8A97E" strokeWidth={1.5} viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>),
      title:"Bingxi Company Profile",
      sub:"Authorised India Sourcing Partner",
      body:"Official Bingxi company profile with manufacturer background, production capacity, export history, and certifications overview.",
      tag:"Download Available",
      docKey:"profile",
    },
    {
      icon:(<svg width={32} height={32} fill="none" stroke="#C8A97E" strokeWidth={1.5} viewBox="0 0 24 24"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>),
      title:"Mattress Catalogue",
      sub:"Mattress & Topper Specifications",
      body:"Detailed mattress and topper specifications, available sizes, density options, and construction details for B2B buyers and interior designers.",
      tag:"Download Available",
      docKey:"mattress",
    },
  ];

  return(
    <div style={{background:C.white}}>
      <div style={{background:"linear-gradient(135deg,#EFE8DE 0%,#F8F6F2 100%)",padding:"60px 0 48px"}}>
        <div className="container">
          <SL>Certificates & Proof</SL>
          <SH>Quality Documentation Library</SH>
          <p style={{fontSize:15,color:"#888",maxWidth:600,lineHeight:1.78,marginTop:12}}>
            XIYORA maintains transparent documentation for all products. Certificates, lab reports, and trade documents are available on request for verified B2B buyers.
          </p>
        </div>
      </div>
      <div className="container" style={{padding:"56px 40px"}}>
        <div className="proof-grid">
          {certs.map((c,i)=>{
            const doc=DOCS.find(d=>d.key===c.docKey);
            return(
              <div key={i} style={{background:C.beige,borderRadius:5,padding:"28px 26px",border:`1px solid ${C.sand}`,transition:"box-shadow .25s",display:"flex",flexDirection:"column"}}
                onMouseEnter={(e:any)=>e.currentTarget.style.boxShadow="0 8px 30px rgba(0,0,0,.09)"}
                onMouseLeave={(e:any)=>e.currentTarget.style.boxShadow="none"}>
                <div style={{marginBottom:16}}>{c.icon}</div>
                <span style={{fontSize:10,letterSpacing:"1.5px",textTransform:"uppercase",color:C.gold,fontWeight:500,background:"#F5EDE0",padding:"3px 10px",borderRadius:20,marginBottom:14,display:"inline-block"}}>{c.tag}</span>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:500,color:C.dark,margin:"10px 0 6px"}}>{c.title}</h3>
                <div style={{fontSize:11.5,color:C.gold,letterSpacing:".4px",marginBottom:10}}>{c.sub}</div>
                <p style={{fontSize:13.5,color:"#666",lineHeight:1.78,fontWeight:400,flex:1}}>{c.body}</p>
                {doc&&(
                  <div style={{marginTop:18}}>
                    <button
                      onClick={()=>window.open(`https://wa.me/${BIZ.wa}?text=${encodeURIComponent(doc.msg)}`,"_blank")}
                      style={{display:"inline-flex",alignItems:"center",gap:8,padding:"11px 20px",background:"#25D366",color:"#fff",border:"none",borderRadius:3,fontSize:12,fontFamily:"'Inter',sans-serif",letterSpacing:"1px",textTransform:"uppercase",fontWeight:500,cursor:"pointer",transition:"background .2s",width:"100%",justifyContent:"center"}}
                      onMouseEnter={(e:any)=>e.currentTarget.style.background="#1ebe59"}
                      onMouseLeave={(e:any)=>e.currentTarget.style.background="#25D366"}>
                      <svg width={15} height={15} fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.143.564 4.148 1.549 5.878L0 24l6.29-1.525A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.36-.214-3.733.905.948-3.64-.234-.373A9.818 9.818 0 1112 21.818z"/></svg>
                      Request via WhatsApp
                    </button>
                    <p style={{fontSize:10,color:"#aaa",marginTop:8,textAlign:"center",fontStyle:"italic"}}>Original shared within 24 hours</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="proof-cta" style={{marginTop:56,background:"linear-gradient(135deg,#2D2D2D,#1a1a1a)",borderRadius:5,padding:"40px 44px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:24,boxSizing:"border-box"}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:11,letterSpacing:"2px",textTransform:"uppercase",color:C.gold,marginBottom:10}}>Request Documentation</div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:24,color:"#F0EBE3",marginBottom:8}}>Need Certificates or Lab Reports?</h3>
            <p style={{fontSize:13.5,color:"#888",lineHeight:1.72,maxWidth:480}}>Send us your company details and the specific documentation required. We will provide the relevant certificates from Bingxi's documentation library for your import/compliance team.</p>
          </div>
          <div className="proof-cta-btns" style={{display:"flex",gap:12,flexShrink:0,flexWrap:"wrap"}}>
            <button className="bg" style={{padding:"14px 26px",fontSize:12,whiteSpace:"nowrap"}}
              onClick={()=>window.open(`https://wa.me/${BIZ.wa}?text=${encodeURIComponent("Hi XIYORA, I need certificates/documentation for import compliance. Company: [your company name]. Documents needed: [specify]")}`)}>
              Request Documents
            </button>
            <button className="bd" style={{padding:"14px 26px",fontSize:12,whiteSpace:"nowrap"}} onClick={()=>setPage("supplier")}>
              B2B Enquiry
            </button>
          </div>
        </div>

        <div style={{marginTop:32,textAlign:"center"}}>
          <button className="bo" onClick={()=>setPage("home")} style={{padding:"12px 28px",fontSize:12}}>Back to Home</button>
        </div>
      </div>
    </div>
  );
}

/* ─── ORDER STATUS VIEW ──────────────────────────────────── */
function OrderStatusView({setPage}:any){
  const C=useC();
  const [ref,setRef]=useState("");
  const [result,setResult]=useState<any>(null);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");

  const STATUS_MAP:Record<string,{label:string;color:string;bg:string;desc:string}>={
    new:{label:"Received",color:"#C8A97E",bg:"#FBF5EC",desc:"Your enquiry has been received. We'll be in touch within 24–48 hours."},
    contacted:{label:"In Touch",color:"#3B82F6",bg:"#EFF6FF",desc:"Our team has reached out to you. Please check your phone or email."},
    quoted:{label:"Quote Sent",color:"#8B5CF6",bg:"#F5F3FF",desc:"A price quote has been sent to you. Please review and let us know."},
    confirmed:{label:"Confirmed",color:"#10B981",bg:"#ECFDF5",desc:"Your order has been confirmed. We are preparing it for dispatch."},
    dispatched:{label:"Dispatched",color:"#F59E0B",bg:"#FFFBEB",desc:"Your order is on its way. Track via your shipping reference."},
    delivered:{label:"Delivered",color:"#10B981",bg:"#ECFDF5",desc:"Your order has been delivered. Thank you for choosing XIYORA!"},
    pending:{label:"Pending",color:"#C8A97E",bg:"#FBF5EC",desc:"Your request is pending review. We'll confirm within 48 hours."},
    cancelled:{label:"Cancelled",color:"#EF4444",bg:"#FEF2F2",desc:"This order has been cancelled. Please contact us if this is a mistake."},
  };

  const lookup=async()=>{
    const r=ref.trim().toUpperCase();
    if(!r){alert("Please enter a reference number (e.g. EQ-0001 or CHK-0001).");return;}
    setLoading(true);setErr("");setResult(null);
    try{
      const res=await fetch(`/api/order-status?ref=${encodeURIComponent(r)}`);
      const json=await res.json();
      if(!res.ok){setErr(json.error||"Order not found. Please check your reference number.");setLoading(false);return;}
      setResult(json);
    }catch{setErr("Network error. Please try WhatsApp for a status update.");}
    setLoading(false);
  };

  const status=result?STATUS_MAP[result.status]||{label:result.status,color:C.gold,bg:C.lgold,desc:""}:null;

  return(
    <div style={{background:C.white,minHeight:"70vh"}}>
      <div style={{background:"linear-gradient(135deg,#EFE8DE,#F8F6F2)",padding:"52px 0 44px",borderBottom:`1px solid ${C.sand}`}}>
        <div className="container">
          <SL>Track Your Request</SL>
          <SH>Order Status</SH>
          <p style={{fontSize:14.5,color:"#888",marginTop:10,maxWidth:500,lineHeight:1.72,fontWeight:300}}>Enter the reference number from your confirmation — EQ-XXXX for enquiries, CHK-XXXX for checkout orders, QR-XXXX for quote requests.</p>
        </div>
      </div>
      <div className="container" style={{maxWidth:640,padding:"56px 40px"}}>
        <div style={{background:C.beige,borderRadius:5,padding:"32px 36px",marginBottom:28,border:`1px solid ${C.sand}`}}>
          <label style={{fontSize:11.5,color:"#888",letterSpacing:".3px",display:"block",marginBottom:8}}>Your Reference Number</label>
          <div style={{display:"flex",gap:10,marginBottom:8}}>
            <input
              value={ref} onChange={e=>setRef(e.target.value)} onKeyDown={e=>e.key==="Enter"&&lookup()}
              placeholder="e.g. EQ-0001" maxLength={12}
              style={{flex:1,background:"#fff",border:`1px solid ${C.sand}`,padding:"12px 14px",fontSize:15,borderRadius:3,fontFamily:"'Inter',sans-serif",color:C.dark,letterSpacing:"1px"}}/>
            <button className="bg" onClick={lookup} disabled={loading} style={{padding:"12px 24px",fontSize:12,letterSpacing:"1.5px",whiteSpace:"nowrap"}}>
              {loading?<Spinner/>:"Track →"}
            </button>
          </div>
          <p style={{fontSize:11.5,color:"#bbb",lineHeight:1.6}}>Your reference was shown after submitting an enquiry or checkout form. Check your WhatsApp or email for it.</p>
        </div>

        {err&&(
          <div style={{background:"#fff0f0",border:"1px solid #ffcccc",borderRadius:4,padding:"16px 20px",marginBottom:20,color:"#cc4444",fontSize:13.5}}>
            {err}
            <div style={{marginTop:10}}>
              <a href={`https://wa.me/${BIZ.wa}?text=${encodeURIComponent("Hi XIYORA, I need a status update on my order.")}`} target="_blank" rel="noreferrer"
                style={{color:C.gold,fontSize:12.5,textDecoration:"none",fontWeight:500}}>→ Ask via WhatsApp</a>
            </div>
          </div>
        )}

        {result&&status&&(
          <div style={{border:`1px solid ${C.sand}`,borderRadius:5,overflow:"hidden",animation:"fadeInUp .3s ease"}}>
            <div style={{background:status.bg,borderBottom:`3px solid ${status.color}`,padding:"22px 26px"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
                <span style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:500,color:C.dark}}>{result.ref}</span>
                <span style={{background:status.color,color:"#fff",padding:"3px 12px",borderRadius:20,fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase",fontWeight:500}}>{status.label}</span>
              </div>
              <p style={{fontSize:14,color:"#666",lineHeight:1.7,margin:0}}>{status.desc}</p>
            </div>
            <div style={{padding:"22px 26px",background:C.white}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                {[
                  ["Type",result.type],
                  ["Product",result.productName||"—"],
                  ["Size",result.selectedSize||"—"],
                  ["Submitted",new Date(result.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})],
                ].map(([k,v])=>(
                  <div key={k} style={{padding:"10px 0",borderBottom:`1px solid ${C.beige}`}}>
                    <div style={{fontSize:10.5,color:"#bbb",letterSpacing:"1.2px",textTransform:"uppercase",marginBottom:4}}>{k}</div>
                    <div style={{fontSize:14,color:C.dark,fontWeight:500}}>{v}</div>
                  </div>
                ))}
              </div>
              <p style={{fontSize:12.5,color:"#aaa",marginTop:18,lineHeight:1.65}}>For the latest update or to make changes, contact us on WhatsApp with your reference number.</p>
              <div style={{display:"flex",gap:10,marginTop:14,flexWrap:"wrap"}}>
                <a href={`https://wa.me/${BIZ.wa}?text=${encodeURIComponent(`Hi XIYORA, I need an update on my order. Reference: ${result.ref}`)}`} target="_blank" rel="noreferrer"
                  style={{background:"#25D366",color:"#fff",padding:"10px 18px",borderRadius:2,fontSize:12,letterSpacing:"1px",textTransform:"uppercase",textDecoration:"none",display:"flex",alignItems:"center",gap:6,fontFamily:"'Inter',sans-serif"}}>
                  <svg width={13} height={13} fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.143.564 4.148 1.549 5.878L0 24l6.29-1.525A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.36-.214-3.733.905.948-3.64-.234-.373A9.818 9.818 0 1112 21.818z"/></svg>
                  WhatsApp Update
                </a>
                <button className="bo" onClick={()=>{setResult(null);setRef("");setErr("");}} style={{padding:"10px 18px",fontSize:12}}>Track Another</button>
              </div>
            </div>
          </div>
        )}

        <div style={{marginTop:40,textAlign:"center"}}>
          <button className="bo" onClick={()=>setPage("home")} style={{padding:"11px 26px",fontSize:12}}>← Back to Home</button>
        </div>
      </div>
    </div>
  );
}

function AdminView(){
  const [pin,setPin]=useState("");
  const [unlocked,setUnlocked]=useState(false);
  const [tab,setTab]=useState<"enquiries"|"subscriptions"|"quotes"|"checkouts">("enquiries");
  const [data,setData]=useState<any[]>([]);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");

  const fetchTab=useCallback(async(t:string,secret:string)=>{
    setLoading(true);setErr("");
    const ep=t==="enquiries"?"/enquiries":t==="subscriptions"?"/subscriptions":t==="quotes"?"/quote-requests":"/checkout-intents";
    try{
      const res=await fetch(`${API_BASE}${ep}`,{headers:{"x-admin-secret":secret}});
      if(res.status===403){setErr("Incorrect admin secret. Set ADMIN_SECRET in your environment.");setLoading(false);return;}
      const rows=await res.json();
      setData(Array.isArray(rows)?rows:[]);
    }catch{setErr("Network error.");}
    setLoading(false);
  },[]);

  const unlock=async()=>{
    if(!pin.trim()){setErr("Enter admin secret.");return;}
    setLoading(true);setErr("");
    try{
      const res=await fetch(`${API_BASE}/enquiries`,{headers:{"x-admin-secret":pin.trim()}});
      setLoading(false);
      if(res.status===403){setErr("Incorrect admin secret. Set ADMIN_SECRET in your Replit environment.");return;}
      if(!res.ok){setErr("Unexpected error — check backend is running.");return;}
      setUnlocked(true);
      const rows=await res.json();
      setData(Array.isArray(rows)?rows:[]);
    }catch{setLoading(false);setErr("Network error — check backend is running.");}
  };

  useEffect(()=>{if(unlocked)fetchTab(tab,pin);},[tab,unlocked]);

  const exportCSV=()=>{
    if(!data.length)return;
    const cols=Object.keys(data[0]);
    const rows=[cols.join(","),...data.map(r=>cols.map(c=>`"${String(r[c]??"")}"`).join(","))];
    const blob=new Blob([rows.join("\n")],{type:"text/csv"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`xiyora-${tab}.csv`;a.click();
  };

  if(!unlocked)return(
    <div style={{background:C.white,minHeight:"60vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:C.beige,borderRadius:4,padding:"40px 48px",maxWidth:400,width:"100%",textAlign:"center"}}>
        <SL>Internal</SL>
        <SH>Admin Panel</SH>
        <p style={{fontSize:13,color:"#aaa",margin:"12px 0 24px",lineHeight:1.7}}>Enter your ADMIN_SECRET environment variable to access leads.</p>
        <input type="password" value={pin} onChange={e=>setPin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&unlock()} placeholder="Admin secret" style={{width:"100%",background:"#fff",border:`1px solid ${C.sand}`,padding:"12px 14px",fontSize:14,borderRadius:3,fontFamily:"'Inter',sans-serif",marginBottom:12}}/>
        {err&&<p style={{color:"#cc4444",fontSize:12,marginBottom:12}}>{err}</p>}
        <button className="bg" onClick={unlock} style={{width:"100%",padding:13}} disabled={loading}>{loading?<Spinner/>:"Unlock"}</button>
      </div>
    </div>
  );

  const tabs=[["enquiries","Enquiries"],["subscriptions","Subscriptions"],["quotes","Quote Requests"],["checkouts","Checkout Intents"]] as const;
  return(
    <div style={{background:C.white,minHeight:"80vh",padding:"40px 0"}}>
      <div className="container">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28,flexWrap:"wrap",gap:12}}>
          <div><SL>Internal Admin</SL><SH>Lead Dashboard</SH></div>
          <button className="bo" onClick={exportCSV} style={{padding:"10px 20px",fontSize:12}}>Export CSV</button>
        </div>
        <div style={{display:"flex",gap:0,borderBottom:`1px solid ${C.sand}`,marginBottom:28}}>
          {tabs.map(([key,label])=>(
            <button key={key} onClick={()=>setTab(key)} style={{background:"none",border:"none",padding:"12px 20px",fontSize:13,fontFamily:"'Inter',sans-serif",cursor:"pointer",color:tab===key?C.gold:"#888",borderBottom:`2px solid ${tab===key?C.gold:"transparent"}`,transition:"all .2s"}}>
              {label}
            </button>
          ))}
        </div>
        {loading&&<div style={{textAlign:"center",padding:"40px",color:"#aaa"}}>Loading…</div>}
        {err&&<div style={{color:"#cc4444",marginBottom:14}}>{err}</div>}
        {!loading&&data.length===0&&!err&&<div style={{textAlign:"center",padding:"40px",color:"#bbb"}}>No records yet.</div>}
        {!loading&&data.length>0&&(
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12.5}}>
              <thead>
                <tr style={{borderBottom:`2px solid ${C.sand}`}}>
                  {Object.keys(data[0]).map(k=>(
                    <th key={k} style={{padding:"10px 12px",textAlign:"left",color:"#888",fontWeight:500,whiteSpace:"nowrap",textTransform:"uppercase",fontSize:10.5,letterSpacing:"1px"}}>{k.replace(/_/g," ")}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row,i)=>(
                  <tr key={i} style={{borderBottom:`1px solid ${C.beige}`,background:i%2===0?"transparent":C.lgold}}>
                    {Object.values(row).map((v,j)=>(
                      <td key={j} style={{padding:"10px 12px",color:C.dark,maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={String(v??"")}>{String(v??"-")}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── SIMPLE PAGE ────────────────────────────────────────── */
const SIMPLE_HERO:Record<string,{img:string;seal:string;subtitle:string;crumbs:string;features?:{name:string;label:string}[]}>={
  "For B2B Buyers":{img:"/assets/lux/handshake-business.png",seal:"商",subtitle:"Partnership, Considered",crumbs:"Home · Partnership",features:[{name:"box",label:"Bulk Pricing"},{name:"sliders",label:"Custom Specs"},{name:"shield",label:"Private Label"},{name:"headset",label:"Dedicated Support"}]},
  "About XIYORA":{img:"/assets/lux/inkwash-landscape.png",seal:"心",subtitle:"Crafted Comfort, Considered Luxury",crumbs:"Home · About XIYORA"},
  "Contact XIYORA":{img:"/assets/lux/moongate-lounge.png",seal:"和",subtitle:"Let Us Guide You",crumbs:"Home · Contact",features:[{name:"headset",label:"WhatsApp"},{name:"doc",label:"Email"},{name:"clock",label:"24–48h Reply"},{name:"globe",label:"@xiyora.zi"}]},
  "FAQ":{img:"/assets/lux/documents-still.png",seal:"问",subtitle:"Answers, Honestly",crumbs:"Home · Resources · FAQ"},
};
function SimplePage({title,content,setPage}:any){
  const C=useC();
  const h=SIMPLE_HERO[title]||{img:"/assets/lux/inkwash-landscape.png",seal:"印",subtitle:"XIYORA",crumbs:`Home · ${title}`};
  return(
    <div style={{background:C.white}}>
      <LuxHero
        crumbs={h.crumbs}
        title={<span style={{color:C.dark}}>{title}</span>}
        subtitle={h.subtitle}
        seal={h.seal}
        features={h.features}
        image={h.img}
        imageAlt={title}
      />
      <div className="container" style={{maxWidth:820,padding:"56px 40px"}}>
        <div className="grid-2" style={{gap:"22px 36px",alignItems:"start"}}>
        {content.map(([k,v]:string[],i:number)=>(
          <div key={i} style={{padding:"22px 22px",background:C.white,borderTop:`2px solid ${C.gold}`,borderRadius:3,boxShadow:"0 1px 12px rgba(0,0,0,.04)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}>
              <LuxIcon name={["box","sliders","shield","craft","globe","doc","clock","headset"][i%8]} size={18}/>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:500,color:C.dark,margin:0}}>{k}</h3>
            </div>
            <p style={{fontSize:14,color:C.ink,lineHeight:1.82,fontWeight:400}}>{v}</p>
          </div>
        ))}
        </div>
        <div style={{display:"flex",gap:12,marginTop:32,flexWrap:"wrap"}}>
          <button className="bg" onClick={()=>setPage("home")}>Back to Home</button>
          <button className="bo" onClick={()=>window.open(waMsg("Hi XIYORA, I have a question."),"_blank")} style={{padding:"13px 26px",fontSize:12,letterSpacing:"1.5px"}}>Chat on WhatsApp</button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN APP ───────────────────────────────────────────── */
export default function App(){
  const [page,setPage]=useState("home");
  const [selProd,setSelProd]=useState<any>(null);
  const [activeCat,setActiveCat]=useState<string|null>(null);
  const [cur,setCur]=useState("INR");
  const [wl,setWl]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem("xiyora_wishlist")||"[]");}catch{return[];}});
  const [cart,setCart]=useState<CartItem[]>(()=>{try{return JSON.parse(localStorage.getItem("xiyora_cart")||"[]");}catch{return[];}});
  const [scrolled,setScrolled]=useState(false);
  const [inquiry,setInquiry]=useState({show:false,product:null as any,intent:"general"});
  const [showSearch,setShowSearch]=useState(false);
  const [showSubscribe,setShowSubscribe]=useState(false);
  const [showSidebar,setShowSidebar]=useState(false);
  const [theme,setTheme]=useState<"light"|"dark">(()=>{try{return(localStorage.getItem("xiyoraTheme")||"light") as "light"|"dark";}catch{return"light";}});
  const toggleTheme=()=>setTheme(t=>{const n=t==="light"?"dark":"light";try{localStorage.setItem("xiyoraTheme",n);}catch{}return n;});
  const tc=theme==="dark"?CD:C;
  useLiveFx(); // refresh indicative currency rates hourly / on load

  useEffect(()=>{
    let s=document.getElementById("xiyora-css") as HTMLStyleElement|null;
    if(!s){s=document.createElement("style") as HTMLStyleElement;s.id="xiyora-css";document.head.appendChild(s);}
    s.textContent=CSS;
    let dk=document.getElementById("xiyora-dark-css") as HTMLStyleElement|null;
    if(theme==="dark"){
      if(!dk){dk=document.createElement("style") as HTMLStyleElement;dk.id="xiyora-dark-css";document.head.appendChild(dk);}
      dk.textContent=DARK_CSS;
    }else{dk?.remove();}
  },[theme]);
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>55);
    window.addEventListener("scroll",fn);return()=>window.removeEventListener("scroll",fn);
  },[]);
  useEffect(()=>{window.scrollTo(0,0);},[page]);
  useEffect(()=>{try{localStorage.setItem("xiyora_wishlist",JSON.stringify(wl));}catch{}},[wl]);
  useEffect(()=>{try{localStorage.setItem("xiyora_cart",JSON.stringify(cart));}catch{}},[cart]);
  useEffect(()=>{
    const VALID=["home","catalog","checkout","account","proof","order-status","supplier","about","contact","faq","shipping","returns","privacy","terms"];
    const segs=(window.location.pathname||"/").split("/").filter(Boolean);
    const first=segs[0]||"home";
    let initPage="home";const initState:any={page:"home"};
    if(first==="products"){initPage="catalog";initState.page="catalog";initState.activeCat=null;setPage("catalog");setActiveCat(null);}
    else if(first==="category"&&segs[1]){
      const slug=segs[1];const match=CATS.find(c=>c.filter&&c.filter.toLowerCase().replace(/\s+/g,"-")===slug);
      const cat=match?match.filter:null;initPage="catalog";initState.page="catalog";initState.activeCat=cat;setPage("catalog");setActiveCat(cat);
    }
    else if(first==="product"&&segs[1]){
      const prod=PRODUCTS.find(p=>p.id===segs[1]);
      if(prod){initPage="product";initState.page="product";initState.selProd=prod;setPage("product");setSelProd(prod);}
    }
    else if(VALID.includes(first)){initPage=first;initState.page=first;if(first!=="home")setPage(first);}
    window.history.replaceState(initState,"",window.location.pathname||"/");
    void initPage;
    const onPop=(e:PopStateEvent)=>{
      const s=e.state;
      if(s?.page){setPage(s.page);if(s.selProd!==undefined)setSelProd(s.selProd);if(s.activeCat!==undefined)setActiveCat(s.activeCat);}
      else setPage("home");
    };
    window.addEventListener("popstate",onPop);
    return()=>window.removeEventListener("popstate",onPop);
  },[]);

  const navigateTo=(newPage:string,opts:{prod?:any;cat?:string|null}={})=>{
    const state:any={page:newPage};
    let url="/";
    if(newPage==="product"&&opts.prod){state.selProd=opts.prod;url=`/product/${opts.prod.id}`;}
    else if(newPage==="catalog"&&opts.cat!=null){state.activeCat=opts.cat;url=`/category/${opts.cat.toLowerCase().replace(/\s+/g,"-")}`;}
    else if(newPage==="catalog"){state.activeCat=null;url="/products";}
    else if(newPage!=="home")url=`/${newPage}`;
    window.history.pushState(state,"",url);
    setPage(newPage);
    if("prod"in opts)setSelProd(opts.prod??null);
    if("cat"in opts)setActiveCat(opts.cat??null);
  };
  const toggleWl=(id:string)=>setWl(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const addToCart=(item:CartItem)=>setCart(prev=>{const idx=prev.findIndex(i=>i.productId===item.productId&&i.sku===item.sku);if(idx>=0){const n=[...prev];n[idx]={...n[idx],quantity:n[idx].quantity+item.quantity};return n;}return[...prev,item];});
  const openProd=(p:any)=>navigateTo("product",{prod:p});
  const openCatalog=()=>navigateTo("catalog",{cat:null});
  const openCatFilter=(cat:string)=>navigateTo("catalog",{cat});
  const openInquiry=(p:any,intent="general")=>setInquiry({show:true,product:p,intent});
  const openProof=()=>navigateTo("proof");

  const renderView=()=>{
    if(page==="product"&&selProd)return<ProductDetail p={selProd} cur={cur} wl={wl} onWish={toggleWl} onBack={()=>window.history.back()} onCatFilter={openCatFilter} onInquire={openInquiry} onAddToCart={addToCart} onGoCheckout={()=>navigateTo("checkout")}/>;
    if(page==="catalog")return<CatalogView cat={activeCat} setCat={setActiveCat} cur={cur} wl={wl} onWish={toggleWl} onOpen={openProd} onInquire={openInquiry}/>;
    if(page==="checkout")return<CheckoutView cart={cart} setCart={setCart} cur={cur} wl={wl} onWish={toggleWl} onAddToCart={addToCart} onOpen={openProd} onInquire={openInquiry} onCatalog={openCatalog}/>;
    if(page==="account")return<AccountView setPage={setPage}/>;
    if(page==="admin")return<AdminView/>;
    if(page==="proof")return<ProofLibraryView setPage={setPage}/>;
    if(page==="order-status")return<OrderStatusView setPage={setPage}/>;
    if(page==="supplier")return<SimplePage title="For B2B Buyers" content={[["B2B Welcome","We welcome retailers, hotels, interior designers, mattress stores, and manufacturers. Contact us for bulk pricing, custom specifications, and private-label options."],["Our Process","Send inquiry → Receive indicative quote → Confirm specs → Proforma invoice → Payment confirmation → Production & shipping → Delivery."],["Bulk Pricing","Volume discounts available for trade buyers. Minimum order quantities vary by product."],["Custom Options","Custom sizes, densities, cover fabrics, and private-label branding available for most products on request."],["Contact",`WhatsApp: +91 70283 11226 | Email: ${BIZ.email}`]]} setPage={setPage}/>;
    if(page==="about")return<SimplePage title="About XIYORA" content={[["Our Mission","To make genuine premium natural latex comfort accessible in India — with transparent pricing, honest sourcing, and dedicated support."],["Bingxi Partnership","XIYORA is the official sourcing partner for Bingxi products in India. Bingxi is a Chinese premium latex manufacturer with a broad portfolio of Talalay, Dunlop, and hybrid latex products."],["Our Address",BIZ.address],["GST",BIZ.gstNote]]} setPage={setPage}/>;
    if(page==="contact")return<SimplePage title="Contact XIYORA" content={[["WhatsApp (Fastest)","+91 70283 11226"],["Email",BIZ.email],["Instagram","@xiyora.zi — instagram.com/xiyora.zi/"],["Address",BIZ.address],["Response Time","We reply within 24–48 hours. WhatsApp is the fastest channel."]]} setPage={setPage}/>;
    if(page==="faq")return<SimplePage title="FAQ" content={[["How is price calculated?","Prices shown are indicative. Final landed price includes product cost, freight, customs, IGST, port handling, and delivery to your city."],["How long does delivery take?","Sea freight from China takes approximately 25–40 days. Inland delivery after port clearance is 3–10 days depending on your location."],["Do you provide tax documentation?",BIZ.gstNote],["Can I order in bulk?","Yes. Contact us for B2B pricing and minimum order quantities."],["Are custom sizes available?","Many products support custom sizes and densities. Contact us for a custom quote."],["Can I visit a showroom?","We currently operate as an import sourcing business. Products are available for order only."]]} setPage={setPage}/>;
    if(page==="shipping")return<SimplePage title="Shipping & Delivery" content={[["Origin","Imported from Bingxi, China via sea freight."],["Indian Ports","Mumbai (Nhava Sheva), Mundra, Chennai, Kolkata, Cochin — based on buyer location."],["Sea Freight","~25–40 days from order confirmation, depending on product and quantity."],["Inland Delivery","3–10 days after port clearance depending on your zone."],["Costs","Shipping, customs, IGST, and inland delivery are included in your final quoted price."]]} setPage={setPage}/>;
    if(page==="returns")return<SimplePage title="Returns & Refunds" content={[["Damaged in Transit","Document with photos within 24 hours of delivery and contact us immediately."],["Wrong Product","We arrange replacement or refund for incorrect products sent."],["Custom Orders","Non-returnable once production has started — confirm all specs before approval."],["Contact",`${BIZ.email} or WhatsApp +91 70283 11226`]]} setPage={setPage}/>;
    if(page==="privacy")return<SimplePage title="Privacy Policy" content={[["Data Collected","Name, phone, email, city from inquiry forms."],["Use","To respond to inquiries, send quotes, and process orders."],["Sharing","Not sold or shared except where required for order processing and delivery."],["Contact",BIZ.email]]} setPage={setPage}/>;
    if(page==="terms")return<SimplePage title="Terms of Use" content={[["Products","Subject to availability. Prices are indicative and subject to change."],["Orders","Confirmed after proforma invoice acceptance and advance payment."],["Pricing","Final landed price confirmed in writing before any payment is collected."],["Governing Law","Maharashtra, India."]]} setPage={setPage}/>;
    return<HomeView cur={cur} wl={wl} onWish={toggleWl} onOpen={openProd} onCatalog={openCatalog} onCatFilter={openCatFilter} onSupplier={()=>navigateTo("supplier")} onInquire={openInquiry}/>;
  };

  return(
    <ThemeCtx.Provider value={tc}>
    <div style={{background:tc.white,minHeight:"100vh",transition:"background .25s,color .25s"}}>
      <SideDrawer open={showSidebar} onClose={()=>setShowSidebar(false)}
        setPage={setPage} onCatFilter={openCatFilter} onCatalog={openCatalog}
        onInquire={openInquiry} onProof={openProof}/>
      {/* Ticker */}
      <div style={{background:"#0c0a08",color:"#C9A876",padding:"9px 0",overflow:"hidden",borderBottom:"1px solid rgba(200,169,126,.14)"}}>
        <div style={{display:"flex",overflow:"hidden"}}>
          <div className="at">
            {[0,1].map(k=>(
              <span key={k} style={{fontSize:11,letterSpacing:"2.5px",textTransform:"uppercase",whiteSpace:"nowrap",paddingRight:80}}>
                Premium Natural Latex Products &nbsp;✦&nbsp; Official Bingxi Partner for India &nbsp;✦&nbsp; WhatsApp: +91 70283 11226 &nbsp;✦&nbsp; {PRODUCTS.length}+ Products Available &nbsp;✦&nbsp; 3–10 Days Inland After Port Clearance &nbsp;✦&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>
      <Navbar page={page} setPage={setPage} cur={cur} setCur={setCur} scrolled={scrolled} wl={wl} cartCount={cart.length}
        theme={theme} toggleTheme={toggleTheme}
        onSearch={()=>setShowSearch(true)} onCatalog={openCatalog} onCatFilter={openCatFilter}
        onCheckout={()=>navigateTo("checkout")} onSidebar={()=>setShowSidebar(true)} onSupplier={()=>navigateTo("supplier")}/>
      <main style={{minHeight:"80vh",paddingBottom:2}}>{renderView()}</main>
      <Footer setPage={setPage} onInquire={openInquiry} onSubscribe={()=>setShowSubscribe(true)}/>
      {/* WhatsApp FAB — positioned above any potential Replit badge */}
      <div className="wb" style={{bottom:80}} onClick={()=>window.open(waMsg("Hi XIYORA, I want to know more about your Bingxi latex products."),"_blank")} title="Chat on WhatsApp">
        <svg width={26} height={26} fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.143.564 4.148 1.549 5.878L0 24l6.29-1.525A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.36-.214-3.733.905.948-3.64-.234-.373A9.818 9.818 0 1112 21.818z"/></svg>
      </div>
      <InquiryModal show={inquiry.show} onClose={()=>setInquiry(i=>({...i,show:false}))} product={inquiry.product} intent={inquiry.intent} currency={cur}/>
      <SubscribeModal show={showSubscribe} onClose={()=>setShowSubscribe(false)}/>
      <SearchOverlay show={showSearch} onClose={()=>setShowSearch(false)} onPickProduct={(p:any)=>{openProd(p);setShowSearch(false);}} onCatalog={openCatalog}/>
      <WhatsAppPopup page={page} context={{product:page==="product"&&selProd?selProd.name:(cart.length?cart.map(i=>i.productName).join(", "):"")}}/>
    </div>
    </ThemeCtx.Provider>
  );
}
