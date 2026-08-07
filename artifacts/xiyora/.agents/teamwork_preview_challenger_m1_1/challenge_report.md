# Adversarial Challenge Report — Milestone M1

## Challenge Summary

**Overall risk assessment**: HIGH (Unresolved WCAG AA contrast failures due to late CSS `!important` overrides and low-contrast utility classes)

---

## Critical Findings & Challenges

### [High Risk] Challenge 1: `.nl` Late `!important` Override in `src/styles/luxe.css` Line 1064

- **Assumption challenged**: Worker assumed header navigation links in `<button className="nl" style={{color: page===v ? "#ffffff" : "rgba(245,242,237,0.65)"}}>` (App.tsx line 5542) would render with ivory text.
- **Attack scenario**: `src/styles/luxe.css` line 1064 contains `.nl { color: rgba(0,0,0,0.45) !important; }`. Because CSS `!important` in a stylesheet overrides inline React styles without `!important`, all main navigation menu items in the header render with semi-transparent black text (`rgba(0,0,0,0.45)`).
- **Blast radius**: Entire top header navigation on obsidian dark header (`#07090E`).
- **Contrast ratio**: **1.24:1** (Fails WCAG AA minimum 4.5:1 requirement).
- **Mitigation**: Remove or adjust `.nl { color: ... !important; }` in `luxe.css` or ensure header links use high-contrast token classes without dark `!important` overrides.

### [High Risk] Challenge 2: `h2.serif` Late `!important` Override in `src/styles/luxe.css` Line 1036

- **Assumption challenged**: Worker assumed `<h2 className="serif" style={{color: "#f5f2ed"}}>` headings in dark sections (`.lux-noir`, `.latex-story`) would display light ivory text.
- **Attack scenario**: `src/styles/luxe.css` line 1036 defines `.sh-title, h2.serif { color: #1a1a1a !important; -webkit-text-fill-color: #1a1a1a !important; }`. This forces every `<h2 className="serif">` heading on dark section backgrounds (`App.tsx` lines 2249, 2359, 2994, 4683) to render as near-black `#1a1a1a` text.
- **Blast radius**: All major section headings in dark brand storytelling sections.
- **Contrast ratio**: **1.08:1** (Fails WCAG AA minimum 3.0:1 requirement for large text).
- **Mitigation**: Remove `h2.serif { color: #1a1a1a !important; }` from `luxe.css` or scope it exclusively to light/paper containers (e.g. `.paper h2.serif`).

### [Medium Risk] Challenge 3: `.fl` Low-Contrast Link Color in `src/App.tsx` Line 1560

- **Assumption challenged**: Worker claimed all footer text and links were updated to high-contrast `rgba(255,255,255,0.75)`.
- **Attack scenario**: `src/App.tsx` line 1560 defines `.fl { font-size:13px; color:#666; ... }`. Footer link buttons (`className="fl"` in `App.tsx` lines 5662, 5668, 5674) inherit `#666` text on dark footer background `#141414`.
- **Blast radius**: All footer quick links across the site.
- **Contrast ratio**: **3.08:1** (Fails WCAG AA minimum 4.5:1 requirement for normal text).
- **Mitigation**: Update `.fl` color in `App.tsx` from `#666` to `rgba(255,255,255,0.75)` or `rgba(245,242,237,0.85)`.

---

## Stress Test & Verification Results

| Test Harness / Tool | Target | Result | Status |
|--------------------|--------|--------|--------|
| `verify_m1_contrast.cjs` | Synthetic check of worker's targeted color fixes | 16/16 Passed | PASS |
| `verify_all_overrides.cjs` | Empirical CSS cascade & contrast audit across codebase | 3 Defects Found | **FAIL** |
| `pnpm run typecheck` | TypeScript compilation check | Exit 0 (0 errors) | PASS |
| `pnpm run build` | Production Vite compilation | Exit 0 (Built in 5.43s) | PASS |

---

## Unchallenged Areas

- Milestone M2, M3, M4 features (Loading hydration, network retries, responsive overlays, chunking) — out of scope for M1.
