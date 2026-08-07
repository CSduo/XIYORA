## Implementation Dispatch for teamwork_preview_worker_m1

Objective: Implement Milestone M1 — Contrast & Readability Overhaul (WCAG AA) across XIYORA.

Requirements & Reference Files:
- User Requirements: `C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\.agents\ORIGINAL_REQUEST.md`
- Scope & Architecture: `C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\PROJECT.md`
- Survey Explorer 1 Audit & Proposals: `C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\.agents\teamwork_preview_explorer_survey_1\handoff.md`
- Survey Explorer 3 Audit & Proposals: `C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\.agents\teamwork_preview_explorer_survey_3\handoff.md`

Tasks to execute:
1. **`src/styles/luxe.css`**: Replace late dark-text `!important` overrides with high-contrast tokens:
   - `.btn-ivory`: `#F5F2ED` background with `#1A1A1A` text and `#1A1A1A` border (hover: `#1A1A1A` bg, `#FFFFFF` text).
   - `.sl, .sec-label`: `#C8C3BA !important; opacity: 1 !important;`.
   - `.gold-grad`: `background: linear-gradient(135deg, #E5DFCD 0%, #C8C3BA 100%) !important; -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important;`.
   - `.gold-italic`: `#E8D6B4 !important; -webkit-text-fill-color: initial !important;`.
   - `.bo, .btn-gold-out`: `#F5EEF0 !important; border: 1px solid rgba(245,242,237,0.4) !important;`.
   - `.cat-card-explore`, `.ql-card:hover .ql-arrow`, `.benefit-noir .bn:hover .bnl`, `.x-link:hover`, `.cat-intro .ci-label`: `#F5F2ED !important;`.

2. **`src/App.tsx`**:
   - `SimplePage` (around line 6686): change light ivory text on light card background `<p style={{fontSize:14,color:"#f5f2ed"...}}>` to `<p style={{fontSize:14,color:C.dark,lineHeight:1.82,fontWeight:400,opacity:0.85}}>{v}</p>`.
   - Form input labels `lbl` (around line 3309): change `#666` to `rgba(245,242,237,0.85)`.
   - Placeholder text (around line 1156): change `rgba(245,242,237,.3)` to `rgba(245,242,237,.65)`.
   - Strike price (around line 3449): change `rgba(255,255,255,0.4)` to `rgba(255,255,255,0.75)`.
   - Footer address & copyright text (around lines 5681, 5694, 5697): change `#666` to `rgba(255,255,255,0.75)`.

3. **`src/components/AdminPanel.tsx`**:
   - Change `#888` / `#aaa` form label and table header text colors to `#D0C8B8` / `#E5DFCD`.

4. **Verification**:
   - Run `pnpm run typecheck` and confirm 0 TypeScript errors.
   - Run `pnpm run build` and confirm successful build completion.

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Write your handoff report to `C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\.agents\teamwork_preview_worker_m1\handoff.md`.
