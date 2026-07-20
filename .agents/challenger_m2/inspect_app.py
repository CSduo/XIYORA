import re

file_path = r"C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\src\App.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's find all function declarations or component declarations
components = re.findall(r"function\s+([A-Z]\w*)|const\s+([A-Z]\w*)\s*=\s*(?:\([^)]*\)|_?)\s*=>", content)
flat_components = sorted(list(set([c[0] or c[1] for c in components if c[0] or c[1]])))

print(f"Total components found: {len(flat_components)}")
print("Components list:")
for comp in flat_components:
    # Let's count how many lines this component spans or search for its definition
    print(f" - {comp}")

# Let's look for responsiveness indicators: tailwind media query classes, inline mobile styling, etc.
# Check if tailwind max-width or flex/grid responsive styles are used (e.g. md:, lg:, sm:)
responsive_classes = re.findall(r'className="[^"]*(?:sm:|md:|lg:|xl:|2xl:|max-w-|w-|grid-cols-|flex-col|flex-row|overflow-)[^"]*"', content)
print(f"\nFound {len(responsive_classes)} responsive class patterns. Example of some:")
for c in responsive_classes[:15]:
    print(f"  {c}")

# Let's search for horizontal scroll and overflow in inline styles or className
overflow_patterns = re.findall(r'className="[^"]*overflow-[^"]*"', content)
print(f"\nFound {len(overflow_patterns)} overflow class patterns:")
for op in overflow_patterns:
    print(f"  {op}")
