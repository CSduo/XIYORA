import re

patterns = {
    "cursor": [r"cursor", r"GoldCursor", r"xiyora-cursor", r"mousemove", r"cursorX", r"cursorY"],
    "orb": [r"orb", r"orbDrift", r"x-orb"],
    "canvas": [r"Canvas", r"HeroCanvas", r"particle"],
    "glow": [r"glow", r"neon", r"shadow", r"goldTextShimmer", r"btnBorderAnim", r"sweepBtn"],
    "float": [r"translateY", r"float", r"drift", r"badge"],
    "divider": [r"divider", r"x-gold-divider", r"gradient", r"linear-gradient"],
    "responsive": [r"1340px", r"drawer", r"collapse", r"overflow", r"min-width"],
    "image": [r"object-fit", r"object-cover", r"object-contain"]
}

files = {
    "App.tsx": r"C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\src\App.tsx",
    "luxe.css": r"C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\src\styles\luxe.css"
}

for name, path in files.items():
    print(f"\n=================== {name} ===================")
    with open(path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    for i, line in enumerate(lines, 1):
        for category, regexes in patterns.items():
            for r in regexes:
                if re.search(r, line, re.IGNORECASE):
                    print(f"[{category}] Line {i}: {line.strip()}")
                    break
