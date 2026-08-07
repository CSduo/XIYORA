## Implementation Dispatch for teamwork_preview_worker_m2

Objective: Implement Milestone M2 — Seamless Loading & Connectivity Resilience across XIYORA.

Reference Files:
- User Requirements: `C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\.agents\ORIGINAL_REQUEST.md`
- Scope & Architecture: `C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\PROJECT.md`
- Survey Explorer 2 Analysis & Recommendations: `C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\.agents\teamwork_preview_explorer_survey_2\handoff.md`

Tasks to execute:

1. **Seamless Loading Screen & Hydration (`index.html` & `src/App.tsx`)**:
   - In `src/App.tsx` (lines 6815-6818), replace instant `el.remove()` on `#xi-loader` with a smooth 300ms CSS fade-out class (`xi-fade`) before removal.
   - In `src/App.tsx` (`LoadingScreen` component), optimize the state update counter loop (use 30ms-40ms interval or `requestAnimationFrame`) to progress smoothly 1% -> 100% without counter resets, frame drops, or black screen flashes. Ensure `#root` and `body` share `#1a1a1a` dark obsidian background.

2. **Connectivity Auto-Retry Helper & Browser Compatibility (`src/App.tsx`)**:
   - Add `fetchWithRetry` helper function in `src/App.tsx`:
     ```ts
     async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 2, backoff = 500): Promise<Response> {
       try {
         const res = await fetch(url, options);
         if (!res.ok && retries > 0 && res.status >= 500) {
           await new Promise(r => setTimeout(r, backoff));
           return fetchWithRetry(url, options, retries - 1, backoff * 1.5);
         }
         return res;
       } catch (err) {
         if (retries > 0) {
           await new Promise(r => setTimeout(r, backoff));
           return fetchWithRetry(url, options, retries - 1, backoff * 1.5);
         }
         throw err;
       }
     }
     ```
   - Update `/products`, `/site-content`, `/fx-rates`, `/enquiries`, `/checkout-intents`, and `apiPost` in `src/App.tsx` to use `fetchWithRetry`.
   - Replace `AbortSignal.timeout(6000)` in `fetchBackendRates` (around line 1228) with standard `AbortController` + `setTimeout` fallback for cross-browser stability.

3. **Offline Banner & Global Error Safeguards (`src/App.tsx` & `src/ErrorBoundary.tsx`)**:
   - Create `OfflineBanner` component in `src/App.tsx` monitoring `navigator.onLine`. Display a subtle, non-intrusive status banner when offline ("Operating in offline mode — displaying cached product catalog & static rates.").
   - In `src/ErrorBoundary.tsx`, add `window.addEventListener("unhandledrejection")` and `window.addEventListener("error")` event listeners in `componentDidMount` to capture and safely log async network promise rejections without crashing the React component tree.

4. **Verification**:
   - Run `pnpm run typecheck` and confirm 0 TypeScript errors.
   - Run `pnpm run build` and confirm successful production build (<10s).

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Write your handoff report to `C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\.agents\teamwork_preview_worker_m2\handoff.md`.

## 2026-08-07T07:14:50Z
**Context**: XIYORA Front-end Overhaul - Milestone M2 Implementation (Seamless Loading & Connectivity Resilience)
**Content**: Read user requirements at `C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\.agents\ORIGINAL_REQUEST.md`, PROJECT.md at `C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\PROJECT.md`, Survey Explorer 2 recommendations at `C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\.agents\teamwork_preview_explorer_survey_2\handoff.md`, and dispatch instructions at `C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\.agents\teamwork_preview_worker_m2\DISPATCH.md`. Your working directory is `C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\.agents\teamwork_preview_worker_m2`.

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

**Action**: Implement smooth loader hydration transition, `fetchWithRetry` helper, AbortController compatibility, `OfflineBanner`, and `unhandledrejection` error boundary listeners. Run `pnpm run typecheck` and `pnpm run build`. Write handoff.md in your working directory and notify parent.
