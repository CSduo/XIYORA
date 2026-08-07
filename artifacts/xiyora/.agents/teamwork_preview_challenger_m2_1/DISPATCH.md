# Task Dispatch for Challenger 1 (Milestone M2)

**Identity**: `teamwork_preview_challenger_m2_1`  
**Role**: `teamwork_preview_challenger`  
**Working Directory**: `C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\.agents\teamwork_preview_challenger_m2_1`  
**Project Workspace**: `C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora`

## Required Reading (Paths)
- Original Request: `C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\.agents\ORIGINAL_REQUEST.md`
- Project Spec: `C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\PROJECT.md`
- Worker Handoff: `C:\Users\ADMIN\.gemini\antigravity\scratch\XIYORA\artifacts\xiyora\.agents\teamwork_preview_worker_m2\handoff.md`

## Assignment
Adversarially challenge and stress-test the implementation of Milestone M2 (Seamless Loading & Connectivity Resilience).

### Specific Tests to Perform:
1. **Network Retry Simulation**: Stress test `fetchWithRetry` logic. Check edge cases like multiple consecutive failures, 500/502/503 status codes, network aborts, and non-ok status codes.
2. **Hydration & Counter Flashes**: Verify no resets, jumps, or flash of white/black during HTML -> React hydration.
3. **AbortController Compatibility**: Verify no unhandled DOMException on abort or timeout.
4. **Offline Resilience**: Verify `OfflineBanner` appearance/disappearance on offline/online events and static fallbacks for catalog/rates.
5. **Build & Typecheck Verification**: Execute `pnpm run typecheck` and `pnpm run build` to confirm build speed and 0 errors.

## Output Requirements
Write `handoff.md` in your working directory with your verdict (`APPROVE` or `REQUEST_CHANGES`), stress testing methodology, results, and recommendations. Update `progress.md` as a liveness heartbeat.
Send a completion message back to orchestrator.
