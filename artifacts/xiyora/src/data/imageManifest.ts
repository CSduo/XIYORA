const B = "/assets/xiyora-products/final";

const p = (slug: string, ...g: string[]) => ({
  hero: `${B}/${slug}/hero.webp`,
  gallery: g.map(n => `${B}/${slug}/${n}.webp`),
});

export const imageManifest = {
  categories: {
    Mattresses:       `${B}/categories/mattresses.webp`,
    Pillows:          `${B}/categories/pillows.webp`,
    Toppers:          `${B}/categories/toppers.webp`,
    Cushions:         `${B}/categories/cushions.webp`,
    "Latex Material": `${B}/categories/starting-from.webp`,
    startingFrom:     `${B}/categories/starting-from.webp`,
  },
  products: {
    // ── Talalay pillows ────────────────────────────────────────────────────
    "talalay-bread-pillow":         p("talalay-bread-pillow",         "g01","g02","g03","g04","g05","g06"),
    "talalay-contour-pillow":       p("talalay-contour-pillow",       "g01","g02","g03","g04","g05","g06"),
    "talalay-junior-pillow":        p("talalay-junior-pillow",        "g01","g02"),

    // ── Dunlop pillows ─────────────────────────────────────────────────────
    "dunlop-bone-pillow":           p("dunlop-bone-pillow",           "g01","g02","g03","g04","g05","g06","g07"),
    "dunlop-bread-pillow":          p("dunlop-bread-pillow",          "g01","g02","g03","g04","g05","g06"),
    "dunlop-butterfly-pillow":      p("dunlop-butterfly-pillow",      "g01","g02","g03","g04","g05","g06","g07"),
    "dunlop-cloud-pillow":          p("dunlop-cloud-pillow",          "g01","g02","g03","g04","g05","g06","g07"),
    "dunlop-contour-pillow":        p("dunlop-contour-pillow",        "g01","g02","g03","g04","g05","g06"),
    "dunlop-contour-pillow-high":   p("dunlop-contour-pillow-high",   "g01","g02","g03","g04","g05","g06","g07"),
    "dunlop-contour-pillow-junior": p("dunlop-contour-pillow-junior", "g01","g02","g03","g04","g05","g06"),
    "dunlop-couples-pillow":        p("dunlop-couples-pillow",        "g01","g02","g03","g04","g05","g06"),
    "dunlop-cylinder-pillow":       p("dunlop-cylinder-pillow",       "g01","g02","g03","g04","g05","g06"),

    // ── Pillows with v2 replacement images ────────────────────────────────
    "dunlop-seahorse-pillow":  p("dunlop-seahorse-pillow",  "g01","g02"),
    "peanut-massage-pillow":   p("peanut-massage-pillow",   "g01","g02"),
    "spiky-massage-pillow":    p("spiky-massage-pillow",    "g01","g02"),
    "dunlop-stomach-pillow":   p("dunlop-stomach-pillow",   "g01"),
    "dunlop-throw-pillow":     p("dunlop-throw-pillow",     "g01"),
    "dunlop-u-pillow":         p("dunlop-u-pillow",         "g01"),

    // ── Specialty / massage pillows ────────────────────────────────────────
    "bumpy-massage-pillow": p("bumpy-massage-pillow", "g01","g02","g03","g04","g05","g06","g07"),

    // ── Mattresses ─────────────────────────────────────────────────────────
    // v2 fix: Talalay and Standard were switched — now using correct folder per product
    "talalay-latex-mattress":     p("talalay-latex-mattress",     "g01","g02"),
    "dunlop-standard-mattress":   p("dunlop-standard-mattress",   "g01","g02","g03","g04"),
    "dunlop-bay-window-mattress": p("dunlop-bay-window-mattress", "g01","g02"),

    // ── Toppers ────────────────────────────────────────────────────────────
    // v2 fix: only topper images; EXCLUDED bay-window measurement panel removed
    "latex-topper": p("latex-topper", "g01","g02","g03"),

    // ── Latex materials — v2 fix: 3 split gallery panels per product ───────
    // hero = panel 1; gallery = panels 2 & 3 (source strip is reference only)
    "shredded-talalay-latex": {
      hero: `${B}/shredded-talalay-latex/mat_p1.webp`,
      gallery: [`${B}/shredded-talalay-latex/mat_p2.webp`, `${B}/shredded-talalay-latex/mat_p3.webp`],
    },
    "hybrid-latex-with-bamboo": {
      hero: `${B}/hybrid-latex-with-bamboo/mat_p1.webp`,
      gallery: [`${B}/hybrid-latex-with-bamboo/mat_p2.webp`, `${B}/hybrid-latex-with-bamboo/mat_p3.webp`],
    },
    "hybrid-latex-with-gel": {
      hero: `${B}/hybrid-latex-with-graphene/mat_p1.webp`,
      gallery: [`${B}/hybrid-latex-with-graphene/mat_p2.webp`, `${B}/hybrid-latex-with-graphene/mat_p3.webp`],
    },
    "hybrid-latex-with-graphene": {
      hero: `${B}/hybrid-latex-with-gel/mat_p1.webp`,
      gallery: [`${B}/hybrid-latex-with-gel/mat_p2.webp`, `${B}/hybrid-latex-with-gel/mat_p3.webp`],
    },
    "hybrid-latex-with-lavender": {
      hero: `${B}/hybrid-latex-with-lavender/mat_p1.webp`,
      gallery: [`${B}/hybrid-latex-with-lavender/mat_p2.webp`, `${B}/hybrid-latex-with-lavender/mat_p3.webp`],
    },
    "hybrid-latex-with-negative-oxygen-ion": {
      hero: `${B}/hybrid-latex-with-negative-oxygen-ion/mat_p1.webp`,
      gallery: [`${B}/hybrid-latex-with-negative-oxygen-ion/mat_p2.webp`, `${B}/hybrid-latex-with-negative-oxygen-ion/mat_p3.webp`],
    },
    "hybrid-latex-with-traditional-chinese-medicine": {
      hero: `${B}/hybrid-latex-with-traditional-chinese-medicine/mat_p1.webp`,
      gallery: [
        `${B}/hybrid-latex-with-traditional-chinese-medicine/mat_p2.webp`,
        `${B}/hybrid-latex-with-traditional-chinese-medicine/mat_p3.webp`,
      ],
    },

    // ── Cushions — v2 fix: product-specific images, no repeated wedge ──────
    "dunlop-standard-seat-cushion":  p("dunlop-standard-seat-cushion",  "g01","g02","g03","g04"),
    "dunlop-bottom-seat-cushion":    p("dunlop-bottom-seat-cushion",    "g01","g02"),
    "dunlop-bubble-seat-cushion":    p("dunlop-bubble-seat-cushion",    "g01","g02"),
    "dunlop-chunk-seat-cushion":     p("dunlop-chunk-seat-cushion",     "g01","g02"),
    "dunlop-butterfly-back-cushion": p("dunlop-butterfly-back-cushion", "g01","g02"),
    "dunlop-standard-back-cushion":  p("dunlop-standard-back-cushion",  "g01","g02"),
    "dunlop-triangle-back-cushion":  p("dunlop-triangle-back-cushion",  "g01","g02","g03"),
  },
};
