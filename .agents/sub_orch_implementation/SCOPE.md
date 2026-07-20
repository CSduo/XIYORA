# Scope: Implementation Track

## Architecture
- Tech Stack: React, Vite, Tailwind CSS v4, TypeScript, PNPM Workspaces.
- Key files: `artifacts/xiyora/src/App.tsx`, `artifacts/xiyora/src/styles/luxe.css`.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 2 | Aesthetic Re-engineering | AI Aesthetic Removal (gradient orbs, custom cursors, 3D tilt, shimmers, particle canvas, sakura overlay) and 2D styling (organic rounding, fine borders, serif/sans-serif fonts). | None | IN_PROGRESS |
| 3 | E2E Integration and E2E Test Pass | Poll for TEST_READY.md, then run and pass all E2E tests in the workspace. | Milestone 2 | PLANNED |
| 4 | Adversarial Hardening (Tier 5) | Perform white-box analysis, identify untested code paths, write adversarial test cases, and fix outstanding visual/layout edge cases. | Milestone 3 | PLANNED |

## Interface Contracts
- Custom Cursor: Default to native browser cursor. Custom cursor classes (`.xiyora-cursor`, `.xiyora-cursor-dot`) must be fully removed.
- Section Dividers: Clean 2D line borders utilizing `rgba(246, 239, 224, 0.08)`. No gradient sweeps or glowing lines.
- Card/Button Styling: Rounding between `rounded-[2rem]` (32px) and `rounded-[3rem]` (48px). Solid fine border lines (`1px solid rgba(246, 239, 224, 0.08)`).
- Typography: Headers use serif font (`Playfair Display`), body text and descriptions use sans-serif font (`Inter`).
- Responsive Layout: No horizontal scroll on screen widths down to 320px. No overlapping header/navigation items.
