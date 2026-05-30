const B = "/assets/xiyora-products/final";
const p = (slug, ...g) => ({
  hero: `${B}/${slug}/hero.png`,
  gallery: g.map(n => `${B}/${slug}/${n}.png`),
});

export const imageManifest = {
  categories: {
    Mattresses:     `${B}/categories/mattresses.png`,
    Pillows:        `${B}/categories/pillows.png`,
    Toppers:        `${B}/categories/toppers.png`,
    Cushions:       `${B}/categories/pillows.png`,
    "Latex Material": `${B}/categories/toppers.png`,
    startingFrom:   `${B}/categories/starting-from.png`,
  },
  products: {
    "talalay-bread-pillow":         p("talalay-bread-pillow",         "g01","g02","g03","g04","g05","g06"),
    "talalay-contour-pillow":       p("talalay-contour-pillow",       "g01","g02","g03","g04","g05","g06"),
    "bumpy-massage-pillow":         p("bumpy-massage-pillow",         "g01","g02","g03","g04","g05","g06","g07"),
    "dunlop-bone-pillow":           p("dunlop-bone-pillow",           "g01","g02","g03","g04","g05","g06","g07"),
    "dunlop-bread-pillow":          p("dunlop-bread-pillow",          "g01","g02","g03","g04","g05","g06"),
    "dunlop-butterfly-pillow":      p("dunlop-butterfly-pillow",      "g01","g02","g03","g04","g05","g06","g07"),
    "dunlop-cloud-pillow":          p("dunlop-cloud-pillow",          "g01","g02","g03","g04","g05","g06","g07"),
    "dunlop-contour-pillow":        p("dunlop-contour-pillow",        "g01","g02","g03","g04","g05","g06"),
    "dunlop-contour-pillow-high":   p("dunlop-contour-pillow-high",   "g01","g02","g03","g04","g05","g06","g07"),
    "dunlop-contour-pillow-junior": p("dunlop-contour-pillow-junior", "g01","g02","g03","g04","g05","g06"),
    "dunlop-couples-pillow":        p("dunlop-couples-pillow",        "g01","g02","g03","g04","g05","g06"),
    "dunlop-cylinder-pillow":       p("dunlop-cylinder-pillow",       "g01","g02","g03","g04","g05","g06"),
    "dunlop-seahorse-pillow":       p("dunlop-seahorse-pillow"),
    "peanut-massage-pillow":        p("peanut-massage-pillow"),
    "spiky-massage-pillow":         p("spiky-massage-pillow"),
    "talalay-latex-mattress":       p("talalay-latex-mattress",       "g01","g02","g03"),
    "dunlop-bay-window-mattress":   p("dunlop-bay-window-mattress",   "g01"),
    "dunlop-standard-mattress":     p("dunlop-standard-mattress",     "g01"),
    "latex-topper":                 p("latex-topper",                 "g01","g02","g03"),
    "shredded-talalay-latex":       p("shredded-talalay-latex"),
    "hybrid-latex-with-bamboo":     p("hybrid-latex-with-bamboo"),
    "hybrid-latex-with-gel":        p("hybrid-latex-with-gel"),
    "dunlop-chunk-seat-cushion":    p("dunlop-chunk-seat-cushion",    "g01"),
  },
};
