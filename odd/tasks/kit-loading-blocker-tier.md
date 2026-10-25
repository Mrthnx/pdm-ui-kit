# Kit loading tier — canonical answer for the global loader vs toast (K9 follow-up)

Additive, non-breaking extension of the z-index scale of `pdm-ui-kit`, answering the open question raised by the `pdmdirector` consumer app after it adopted K9 on 1.9.1. Target release: **1.10.0** (minor).

## Specs

### S1 — the consumer's question, verbatim

> Separately: the loading-overlay tier question (kit z-[200] above toast vs our z-[80] below toast) is still open on your side. We have kept the loader below the toast tier because our notification host is a fixed top-right element and a loader above it would hide every toast raised while a request is in flight. If the kit intends loading-overlay to be the top tier, say so and we will follow the kit.

> The kit exposes loadingOverlay as z-[200] (numeric 200), which sits ABOVE toast (z-[100]). Our global loading overlay is a full-screen blocker, and we deliberately keep it BELOW the toast tier... Putting the loader above toasts would reintroduce that.

### S2 — canonical rule

The kit's scale has **one** answer for "where does a global request loader go", and it does not hide notifications:

- `loadingBlocker` (80) is the canonical tier for an app-level request loader/blocker: it covers modals (50) and popovers (70) and leaves toasts (100) visible.
- `loadingOverlay` (200) stays in the scale, unchanged, as the explicit opt-in for a full-cover loader that must also block notifications (for example an "app is updating" screen).

No existing token changes value, class or name, so 1.9.x adopters are not affected silently.

### S3 — public surface

- `Z_INDEX.loadingBlocker === "z-[80]"`.
- `Z_INDEX_VALUE.loadingBlocker === 80`.
- `pdmZIndex("loadingBlocker") === 80`.
- `PDM_TAILWIND_PRESET.theme.extend.zIndex["loading-blocker"] === 80`, and the standalone preset (`pdm-ui-kit/tailwind-preset`) exposes the same utility.

### S4 — documentation

`README.md` states the notification rule and points a consumer request loader at `loadingBlocker` instead of `loadingOverlay`.

## Tasks

- T1 (S2, S3) — add the `loadingBlocker` tier to `src/utils/z-index.ts` and to the generated Tailwind preset (`scripts/postbuild-exports.mjs`) — inline — commit: `feat(z-index): add the loadingBlocker tier below the toast tier`
- T2 (S4) — document the rule in `README.md` — inline — commit: (same commit as T1)
- T3 (S1, S2) — answer the consumer over the agent mesh — inline — commit: (no code)

## Log

- L1 — Peer request (verbatim): "the loading-overlay tier question (kit z-[200] above toast vs our z-[80] below toast) is still open on your side... If the kit intends loading-overlay to be the top tier, say so and we will follow the kit."
- L2 — The kit's own comment on `loadingOverlay` justified the value with "para que una request pendiente nunca quede oculta detrás de una notificación", but the stacking it produces hides the notification instead of the loader: the consumer reported that every toast raised during a request disappeared behind the global loader. The stated intent and the shipped effect are opposites, so the scale needed an explicit rule rather than a reinterpretation of the existing token.
- L3 — Decision: the toast tier (100) is the top of the scale for the kit's own overlays. `loadingBlocker` (80) is added as the canonical tier for a request loader; `loadingOverlay` (200) is kept unchanged as the explicit full-cover opt-in. The change is additive: no published token changes value, so no silent behaviour change for 1.9.x adopters.
- L4 — Evidence: `npm run build` green; the generated `dist/pdm-ui-kit/tailwind-preset.cjs` exposes `"loading-blocker": 80`; runtime checks against the built FESM bundle assert every token value (including the untouched ones) and `pdmZIndex("loadingBlocker") === 80`.
- L5 — Consumer answer: the peer is told that (a) `loadingBlocker` (80) is the canonical kit tier for its app-loading loader, replacing its hand-rolled `app-loading 80`, (b) its other three app tiers stay app-owned (the app owns a dynamic modal host and the CDK overlay container) and fit in the gap between 80 and 100, and (c) `loadingOverlay` (200) remains available for a full-cover loader that must also block notifications.
- L6 — Merged into `master` together with the K10 feature (`2c88fdb`) and pushed to `origin/master` by explicit human approval. The consumer confirmed the alignment and will adopt `loadingBlocker` once 1.10.0 is resolvable from the registry.
