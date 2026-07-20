import re

app_path = r"C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\src\App.tsx"
luxe_path = r"C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\src\styles\luxe.css"

print("--- ANALYZING App.tsx ---")
with open(app_path, "r", encoding="utf-8") as f:
    app_lines = f.readlines()

patterns = {
    "cursor": r"cursor(?!:\s*['\"]pointer['\"])",  # Match cursor but not standard css cursor: pointer
    "xiyora-cursor": r"xiyora-cursor",
    "cursorX": r"cursorX",
    "cursorY": r"cursorY",
    "orb": r"\borb\b|\borbs\b",
    "canvas": r"canvas|HeroCanvas",
    "glow": r"glow|shimmer|btnBorderAnim|sweepBtn",
    "min-width": r"min-width|minWidth",
    "1340": r"1340px|1340",
}

for key, pattern in patterns.items():
    print(f"\nSearching for pattern: '{key}'")
    regex = re.compile(pattern, re.IGNORECASE)
    matches = 0
    for idx, line in enumerate(app_lines):
        if regex.search(line):
            print(f"Line {idx+1}: {line.strip()[:140]}")
            matches += 1
            if matches > 40:
                print("... truncated matches for this pattern ...")
                break

print("\n--- ANALYZING luxe.css ---")
with open(luxe_path, "r", encoding="utf-8") as f:
    luxe_lines = f.readlines()

for key, pattern in patterns.items():
    print(f"\nSearching for pattern: '{key}'")
    regex = re.compile(pattern, re.IGNORECASE)
    matches = 0
    for idx, line in enumerate(luxe_lines):
        if regex.search(line):
            print(f"Line {idx+1}: {line.strip()[:140]}")
            matches += 1
            if matches > 40:
                print("... truncated matches for this pattern ...")
                break
