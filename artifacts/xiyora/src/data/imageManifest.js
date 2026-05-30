const B = "/assets/xiyora-products/final";
const p = (slug, ...g) => ({
  hero: `${B}/${slug}/hero.png`,
  gallery: g.map(n => `${B}/${slug}/${n}.png`),
});

export const imageManifest = {
  categories: {
    Mattresses:       `${B}/categories/mattresses.png`,
    Pillows:          `${B}/categories/pillows.png`,
    Toppers:          `${B}/categories/toppers.png`,
    Cushions:         `${B}/categories/cushions.png`,
    "Latex Material": `${B}/categories/latex-material.png`,
    startingFrom:     `${B}/categories/starting-from.png`,
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
    "dunlop-stomach-pillow":        p("dunlop-stomach-pillow",        "g01"),
    "dunlop-throw-pillow":          p("dunlop-throw-pillow",          "g01"),
    "dunlop-u-pillow":              p("dunlop-u-pillow",              "g01"),

    // ── Specialty / massage pillows ────────────────────────────────────────
    "bumpy-massage-pillow":         p("bumpy-massage-pillow",         "g01","g02","g03","g04","g05","g06","g07"),
    "dunlop-seahorse-pillow":       p("dunlop-seahorse-pillow"),
    "peanut-massage-pillow":        p("peanut-massage-pillow"),
    "spiky-massage-pillow":         p("spiky-massage-pillow"),

    // ── Mattresses ─────────────────────────────────────────────────────────
    "talalay-latex-mattress":       p("talalay-latex-mattress",       "g01","g02","g03"),
    "dunlop-bay-window-mattress":   p("dunlop-bay-window-mattress",   "g01"),
    "dunlop-standard-mattress":     p("dunlop-standard-mattress",     "g01"),

    // ── Toppers ────────────────────────────────────────────────────────────
    "latex-topper":                 p("latex-topper",                 "g01","g02","g03"),

    // ── Latex materials ────────────────────────────────────────────────────
    "shredded-talalay-latex":                     p("shredded-talalay-latex"),
    "hybrid-latex-with-bamboo":                   p("hybrid-latex-with-bamboo"),
    "hybrid-latex-with-gel":                      p("hybrid-latex-with-gel"),
    "hybrid-latex-with-graphene":                 p("hybrid-latex-with-graphene"),
    "hybrid-latex-with-lavender":                 p("hybrid-latex-with-lavender"),
    "hybrid-latex-with-negative-oxygen-ion":      p("hybrid-latex-with-negative-oxygen-ion"),
    "hybrid-latex-with-traditional-chinese-medicine": p("hybrid-latex-with-traditional-chinese-medicine"),

    // ── Cushions ───────────────────────────────────────────────────────────
    "dunlop-chunk-seat-cushion":    p("dunlop-chunk-seat-cushion",    "g01"),
    "dunlop-bottom-seat-cushion":   p("dunlop-bottom-seat-cushion",   "g01"),
    "dunlop-bubble-seat-cushion":   p("dunlop-bubble-seat-cushion",   "g01"),
    "dunlop-butterfly-back-cushion":p("dunlop-butterfly-back-cushion","g01"),
    "dunlop-standard-back-cushion": p("dunlop-standard-back-cushion", "g01"),
    "dunlop-standard-seat-cushion": p("dunlop-standard-seat-cushion", "g01"),
    "dunlop-triangle-back-cushion": p("dunlop-triangle-back-cushion", "g01"),
  },
};
