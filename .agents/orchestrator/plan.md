# Project Plan: XIYORA Aesthetic Re-engineering

## Mission
Orchestrate the re-engineering of the XIYORA website aesthetics to use a premium, 2D dark-mode layout system, replacing AI-template elements with clean borders, typography, and responsive layouts, and finalize with the MINERAL brand-level redesign.

## Architecture
- **Tech Stack**: React, Vite, Tailwind CSS v4, TypeScript, PNPM Workspaces.
- **Frontend Code**: `artifacts/xiyora/src/App.tsx` (main component containing pages, components, and injected styles) and `artifacts/xiyora/src/styles/luxe.css` (custom CSS declarations).

## Milestones
| # | Name | Track | Scope | Dependencies | Status |
|---|------|-------|-------|--------------|--------|
| 1 | E2E Test Suite | E2E Testing Track | Design and implement automated test cases (Tiers 1-4) verifying removal of AI template elements, layout alignment, solid border/rounding styles, and mobile responsiveness. Publishes `TEST_READY.md`. | None | DONE |
| 2 | Implementation: Aesthetic Re-engineering | Implementation Track | Modify styles and TSX to remove orbs, cursors, shimmers, 3D tilt, and canvas. Apply fine borders, organic rounding, and clean typography. Ensure build passes. | None | DONE |
| 3 | MINERAL Brand-Level Redesign | Implementation Track | Write replace_mineral.js, execute it, verify updates, compile & build, delete script, git commit and push. | Milestone 2 | IN_PROGRESS |

## Interface Contracts
- **Custom Cursor**: Default to native browser cursor. Custom cursor classes (`.xiyora-cursor`, `.xiyora-cursor-dot`) must be fully removed.
- **Section Dividers**: Clean 2D line borders utilizing `rgba(246, 239, 224, 0.08)`. No gradient sweeps or glowing lines.
- **Card/Button Styling**: Rounding between `rounded-[2rem]` (32px) and `rounded-[3rem]` (48px). Solid fine border lines (`1px solid rgba(246, 239, 224, 0.08)`).
- **Typography**: Headers use serif font (`Libre Baskerville`), body text and descriptions use sans-serif font (`Space Grotesk`).
- **Responsive Layout**: No horizontal scroll on screen widths down to 320px. No overlapping header/navigation items.

