# Project: XIYORA Aesthetic Re-engineering

## Architecture
- **Tech Stack**: React, Vite, Tailwind CSS v4, TypeScript, PNPM Workspaces.
- **Frontend Code**: `artifacts/xiyora/src/App.tsx` (main component containing pages, components, and injected styles) and `artifacts/xiyora/src/styles/luxe.css` (custom CSS declarations).
- **Core Interfaces**:
  - CSS variables and styling classes in `luxe.css`.
  - Embedded CSS strings in `App.tsx` (`CSS`, `DARK_CSS`, dynamic element style attributes).

## Milestones
| # | Name | Track | Scope | Dependencies | Status |
|---|------|-------|-------|--------------|--------|
| 1 | E2E Test Suite | E2E Testing Track | Design and implement automated test cases (Tiers 1-4) verifying removal of AI template elements, layout alignment, solid border/rounding styles, and mobile responsiveness. Publishes `TEST_READY.md`. | None | DONE |
| 2 | Implementation: Aesthetic Re-engineering | Implementation Track | Modify styles and TSX to remove orbs, cursors, shimmers, 3D tilt, and canvas. Apply fine borders, organic rounding, and clean typography. Ensure build passes. | None | IN_PROGRESS (349b5143-9228-4e16-bbc9-0061c52f7e31) |
| 3 | E2E Integration & Verification | Implementation Track | Integrate codebase with E2E test suite and iterate until 100% of E2E tests pass. | Milestone 1, Milestone 2 | PLANNED |
| 4 | Adversarial Hardening (Tier 5) | Implementation Track | Perform white-box analysis, identify untested code paths, write adversarial test cases, and fix outstanding visual/layout edge cases. | Milestone 3 | PLANNED |

## Interface Contracts
- **Custom Cursor**: Default to native browser cursor. Custom cursor classes (`.xiyora-cursor`, `.xiyora-cursor-dot`) must be fully removed.
- **Section Dividers**: Clean 2D line borders utilizing `rgba(246, 239, 224, 0.08)`. No gradient sweeps or glowing lines.
- **Card/Button Styling**: Rounding between `rounded-[2rem]` (32px) and `rounded-[3rem]` (48px). Solid fine border lines (`1px solid rgba(246, 239, 224, 0.08)`).
- **Typography**: Headers use serif font (`Playfair Display`), body text and descriptions use sans-serif font (`Inter`).
- **Responsive Layout**: No horizontal scroll on screen widths down to 320px. No overlapping header/navigation items.
