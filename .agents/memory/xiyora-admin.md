---
name: XIYORA Admin Panel
description: Key decisions and non-obvious constraints for the /xiyora-admin panel and product DB migration.
---

# XIYORA Admin Panel

## Auth — fail-closed
`adminAuth.ts` throws if `ADMIN_SECRET` is missing — no hardcoded fallback allowed. JWT signed with this secret; token stored in `localStorage` as `xiyora_admin_token`. Also accepts legacy `x-admin-secret` header for backward compat.

**Why:** A hardcoded fallback would allow token forgery in any misconfigured environment.

## Admin panel renders fullscreen
`App.tsx` early-returns `<AdminPanel/>` wrapped in `ThemeCtx.Provider` before the public nav/footer tree when `page==="xiyora-admin"`. The `renderView()` switch also has the case but it is unreachable — the early-return is the live path.

**Why:** The panel was initially rendered inside the public nav/footer shell; the early-return was added to fix that.

## Product reorder — correct swap pattern
`moveSort` in `ProductsPanel` must copy the array, read both sortOrder values, then set them in a single pass. The original map-then-mutate approach produced duplicate sort orders.

**How to apply:** Always do `[arr[i], arr[j]] = [arr[j], arr[i]]` pattern (or explicit temp-swap on pre-copied array), never use `.map()` with partial conditional assignment for a two-element swap.

## Route contract — slug-or-id
PUT/DELETE `/admin/products/:slugOrId` accepts either a numeric id or a slug string. Numeric strings resolve via `eq(productsTable.id, parseInt(...))`, others via `eq(productsTable.slug, ...)`. This keeps the frontend simple (always passes slug) while allowing future ID-based clients.

## Price validation
`save()` in `ProductEditor` requires at least one of `priceINR` or `priceUSD` to be non-empty before calling the API. Backend `insertProductSchema` does not enforce price at the DB level (fields are nullable text), so the UI is the enforcement point.

## zod in api-server
Do NOT import `zod` directly in api-server routes — it's not a direct dep and esbuild will fail. Use schemas from `@workspace/db` (`insertProductSchema` etc.) or plain JS validation.
