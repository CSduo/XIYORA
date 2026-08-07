import sys, os, re

sys.stdout.reconfigure(encoding='utf-8')

app_path = r"C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\src\App.tsx"
css_path = r"C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\src\styles\luxe.css"
admin_path = r"C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\src\components\AdminPanel.tsx"

print("==================================================")
print("COMPREHENSIVE CODEBASE AUDIT FINDINGS (R3 & R4)")
print("==================================================")

with open(app_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

print("\n--- 2. SIMPLE PAGE INVISIBLE TEXT BUG ---")
for i, line in enumerate(lines, 1):
    if 6670 <= i <= 6695:
        print(f"Line {i}: {line.strip()}")

print("\n--- 3. LUXE.CSS OVERRIDE CONFLICTS ---")
with open(css_path, "r", encoding="utf-8") as f:
    css_lines = f.readlines()
    for i, line in enumerate(css_lines, 1):
        if "!important" in line:
            if "color:" in line and ("26,26,26" in line or "0,0,0,0.3" in line or "0,0,0,0.4" in line or "#1a1a1a" in line):
                print(f"Line {i}: {line.strip()}")

print("\n--- 4. OVERLAY COMPONENTS CHECK ---")
overlay_names = ["SideDrawer", "WishlistDrawer", "InquiryModal", "GlobalFreightCalculator", "LocationPromptModal", "SearchOverlay", "SubscribeModal"]
for name in overlay_names:
    found = False
    for i, line in enumerate(lines, 1):
        if f"function {name}" in line or f"const {name}" in line:
            print(f"Found {name} at line {i}")
            found = True
            break
    if not found:
        print(f"NOT FOUND: {name}")

print("\n--- 5. RESPONSIVE BREAKPOINT AUDIT IN CSS & COMPONENTS ---")
for i, line in enumerate(css_lines, 1):
    if "@media" in line:
        print(f"Luxe.css Line {i}: {line.strip()}")

print("\n--- 6. SEARCH FOR HARDCODED INVISIBLE CONTRAST INSTANCES ---")
for i, line in enumerate(lines, 1):
    if "C.white" in line and "color:\"#f5f2ed\"" in line:
        print(f"Line {i}: {line.strip()}")
    if "C.white" in line and "color:\"#ffffff\"" in line:
        print(f"Line {i}: {line.strip()}")
    if "background:C.white" in line and ("#f5f2ed" in line or "#ffffff" in line):
        print(f"Line {i}: {line.strip()}")

