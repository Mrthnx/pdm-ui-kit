# Kit modernization (pdmdirector UX audit requests K1–K9)

Additive, non-breaking API modernization of `pdm-ui-kit` requested by the `pdmdirector` consumer app (Angular 16.2.12, pdm-ui-kit 1.8.5, Tailwind 3.4.17). Target release: **1.9.0** (minor, no breaking changes). All new inputs are optional and default to current behavior.

## Specs

### S1 (K1) — `pdm-data-table` server-side mode

> Add a SERVER-SIDE mode. Today the component owns pagination+filter+sort internally through filteredRows/pagedRows getters. We need @Input() paginationMode: client|server, totalRows, sortState, loading, and queryChange/pageChange/columnSort to behave as external events.

Why (verbatim):

> The consumer backend already paginates server-side. With the current API the consumer cannot use this component at all.

Accepted API:

- `@Input() paginationMode: 'client' | 'server' = 'client'`
- `@Input() totalRows?: number` — total rows available on the server (used for `totalPages` and the footer count)
- `@Input() sortState?: { column: PdmDataTableColumn<T>; direction: 'asc' | 'desc' }` — external sort state
- `@Input() loading = false`
- In `server` mode: `rows` are rendered as-is (no client filter, no client sort, no client slicing); `filteredRows`/`pagedRows` return `rows`; `totalPages = ceil(totalRows ?? rows.length / pageSize)`
- `queryChange`, `pageChange`, `columnSort` remain the only channel to the host in server mode; the component must not mutate or re-slice `rows`
- `loading` renders a loading state (skeleton rows + `aria-busy="true"`) and suppresses the empty-state row
- Client mode behavior must be unchanged

### S2 (K2) — row virtualization

> Row virtualization, ideally via @angular/cdk/scrolling (already a peerDependency of the kit).

Why (verbatim):

> The consumer allows pageSize up to 1000 and renders every row in the DOM. Without virtualization this is a per-keystroke change-detection problem.

Accepted API: new component `pdm-virtual-table` built on `@angular/cdk/scrolling` (`CdkVirtualScrollViewport` + `cdkVirtualFor`), reusing `PdmDataTableColumn<T>`; inputs `columns`, `rows`, `rowHeight`, `height`, `selectable`, `showActions`, `emptyLabel`, `className`; sticky header row outside the viewport; no change to `pdm-data-table` client/server behavior.

### S3 (K3) — `pdm-input` debounce

> Add a debounceMs input.

Why (verbatim):

> The consumer reimplements a 700ms setTimeout debounce by hand in its shared table-search component.

Accepted API: `@Input() debounceMs = 0`. `valueChange` fires immediately when `debounceMs === 0` (current behavior) and after the configured quiet period otherwise. The pending timer is cleared when the component is destroyed.

### S4 (K4) — `pdm-chart` per-point colors and value formatting

> Add per-datapoint colors (colors?: string[]) and a valueFormatter / custom tick formatter.

Why (verbatim):

> The consumer needs semantic RED/YELLOW/GREEN per bar and categorical axis labels (GREEN/YELLOW/RED). The current API cannot express either.

Accepted API: `@Input() colors?: string[]` (CSS color per data point, applied to bars and pie segments) and `@Input() valueFormatter?: (value: number, index: number) => string` (formats the numeric values the chart renders).

### S5 (K5) — reduced motion support

> Honour prefers-reduced-motion (motion-reduce: variants).

Why (verbatim):

> The kit ships no reduced-motion support. The consumer cannot fix this from the outside.

Accepted API: kit-owned styles honour `prefers-reduced-motion: reduce`; entry/transform animations are disabled when the user asks for reduced motion.

### S6 (K6) — resolve the `animate-in` dependency

> Resolve the animate-in dependency: either declare tailwindcss-animate as a peerDependency, or ship the keyframes.

Why (verbatim):

> The kit references animate-in classes but the consumer does not install tailwindcss-animate, so those entrance animations are never generated. Currently a silent dead dependency in both projects.

Accepted API: the kit ships its own keyframes and no longer depends on `tailwindcss-animate`; consumers must not install it for the kit to work.

### S7 (K7) — `pdm-sonner` toasts list mode

> Either ship the [toasts] list mode described in the skill doc, or correct the doc.

Why (verbatim):

> The skill doc promises a [toasts] input but v1.8.5 only exposes title/description/tone for a single toast. The consumer works around it with its own NotificationService on top of pdm-alert, which is acceptable.

Accepted API: `@Input() toasts?: PdmToastItem[]` renders a stack of toasts (each with its own tone and dismiss button). Without `toasts`, the component keeps its current single-toast behavior. The kit docs must describe the shipped API.

### S8 (K8) — `pdm-table` caption and aria-sort

> Optional caption and aria-sort inputs.

Why (verbatim):

> The consumer has 30 tables with 0 caption and 0 aria-sort elements.

Accepted API: `pdm-table` gains `@Input() caption` (rendered as a `<caption>`); a `pdmSortHeader` directive sets `aria-sort` on a projected `<th>`; `pdm-data-table` sets `aria-sort` on its sortable headers from the active sort state.

### S9 (K9) — shared z-index tokens

> Export the Z_INDEX scale as shared Tailwind tokens.

Why (verbatim):

> The consumer defines a conflicting z-index scale (modal 500, popover 600, tooltip 700) against the kit z-50 / z-[70] / z-[100], and its loading overlay uses z-index 9500. This is a live overlay-stacking bug risk.

Accepted API: the kit exports the z-index scale as reusable Tailwind tokens (numeric values + a Tailwind preset) so the consumer can drop its conflicting scale.

### S10 — peer request to answer

> Please confirm which of K1-K9 you will land, in which version, and what the consumer must do to adopt each (version pin + any breaking API change). We will hold the consumer-side tasks that depend on the kit and implement everything that does not.

The kit must answer `pdmdirector` over the agent mesh with: the landed set, the target version, and the per-item adoption steps.

### Non-goals (verbatim from the peer)

> pdm-empty, pdm-card, pdm-badge, pdm-spinner, pdm-sidebar, pdm-command, pdm-combobox exist in the kit but are unused by the consumer. That is consumer-side adoption work, not a kit gap.

## Tasks

- T1 (S1, S8) — `pdm-data-table` server-side mode + `pdm-table` caption + `pdmSortHeader` + `aria-sort` — inline/worker — commit: `feat(data-table): server-side pagination mode and table a11y attributes`
- T2 (S2) — new `pdm-virtual-table` component on `@angular/cdk/scrolling` — worker — commit: `feat(virtual-table): add cdk-virtual-scroll table component`
- T3 (S3) — `pdm-input` `debounceMs` — inline — commit: `feat(input): add debounceMs input`
- T4 (S4) — `pdm-chart` `colors` + `valueFormatter` — worker — commit: `feat(chart): support per-datapoint colors and value formatting`
- T5 (S5, S6) — reduced motion support + kit-owned tooltip keyframes (drop `tailwindcss-animate` reliance) — worker — commit: `feat(styles): honour prefers-reduced-motion and ship own keyframes`
- T6 (S9) — z-index scale as shared Tailwind tokens — worker — commit: `feat(utils): export z-index scale as tailwind tokens`
- T7 (S7) — `pdm-sonner` toasts list mode — worker — commit: `feat(sonner): support toasts list mode`
- T8 (S1–S10) — public API wiring, docs (README/USAGE), build verification, reply to `pdmdirector` — inline — commit: `docs: document 1.9.0 modernization APIs and consumer adoption steps`

## Log

- L1 — Original request from `pdmdirector` (verbatim):

```json
{"type":"kit-modernization-requirements","from":"pdmdirector consumer app (Angular 16.2.12, pdm-ui-kit 1.8.5, Tailwind 3.4.17)","subject":"pdm-ui-kit changes required by the pdmdirector UX modernization audit","priority":"K1/K2 block our biggest screens; K4/K5 are quick wins","requirements":[{"id":"K1","component":"pdm-data-table","ask":"Add a SERVER-SIDE mode. Today the component owns pagination+filter+sort internally through filteredRows/pagedRows getters. We need @Input() paginationMode: client|server, totalRows, sortState, loading, and queryChange/pageChange/columnSort to behave as external events.","why":"The consumer backend already paginates server-side. With the current API the consumer cannot use this component at all."},{"id":"K2","component":"pdm-data-table / new pdm-virtual-table","ask":"Row virtualization, ideally via @angular/cdk/scrolling (already a peerDependency of the kit).","why":"The consumer allows pageSize up to 1000 and renders every row in the DOM. Without virtualization this is a per-keystroke change-detection problem."},{"id":"K3","component":"pdm-input","ask":"Add a debounceMs input.","why":"The consumer reimplements a 700ms setTimeout debounce by hand in its shared table-search component."},{"id":"K4","component":"pdm-chart","ask":"Add per-datapoint colors (colors?: string[]) and a valueFormatter / custom tick formatter.","why":"The consumer needs semantic RED/YELLOW/GREEN per bar and categorical axis labels (GREEN/YELLOW/RED). The current API cannot express either."},{"id":"K5","component":"kit-wide","ask":"Honour prefers-reduced-motion (motion-reduce: variants).","why":"The kit ships no reduced-motion support. The consumer cannot fix this from the outside."},{"id":"K6","component":"kit-wide","ask":"Resolve the animate-in dependency: either declare tailwindcss-animate as a peerDependency, or ship the keyframes.","why":"The kit references animate-in classes but the consumer does not install tailwindcss-animate, so those entrance animations are never generated. Currently a silent dead dependency in both projects."},{"id":"K7","component":"pdm-sonner","ask":"Either ship the [toasts] list mode described in the skill doc, or correct the doc.","why":"The skill doc promises a [toasts] input but v1.8.5 only exposes title/description/tone for a single toast. The consumer works around it with its own NotificationService on top of pdm-alert, which is acceptable."},{"id":"K8","component":"pdm-table","ask":"Optional caption and aria-sort inputs.","why":"The consumer has 30 tables with 0 caption and 0 aria-sort elements."},{"id":"K9","component":"kit-wide","ask":"Export the Z_INDEX scale as shared Tailwind tokens.","why":"The consumer defines a conflicting z-index scale (modal 500, popover 600, tooltip 700) against the kit z-50 / z-[70] / z-[100], and its loading overlay uses z-index 9500. This is a live overlay-stacking bug risk."}],"lowerPriorityKitSide":["pdm-empty, pdm-card, pdm-badge, pdm-spinner, pdm-sidebar, pdm-command, pdm-combobox exist in the kit but are unused by the consumer. That is consumer-side adoption work, not a kit gap."],"ask":"Please confirm which of K1-K9 you will land, in which version, and what the consumer must do to adopt each (version pin + any breaking API change). We will hold the consumer-side tasks that depend on the kit and implement everything that does not."}
```

- L2 — Decision (2026-10-25): land **all of K1–K9** as **1.9.0**, additive and non-breaking. K7 resolved by shipping the `[toasts]` list mode (and correcting the kit docs), not by a doc-only change. No breaking API changes; every new input is optional and defaults to current behavior.
- L3 — Verification baseline: `npm run build` (ng-packagr) passed on the unmodified tree before any change (exit 0). The kit has no test runner installed (`node_modules` has no jest/karma/jasmine/vitest), so the applicable verification is the library build plus manual API review; no automated test suite can be added without introducing a test framework dependency (out of scope for this feature).
- L4 — Work-unit commits on `feature/kit-modernization` (slice boundary after 6 units / ~994 authored changed lines; the remaining units ship as separate commits): `a9e3755` data-table server mode + a11y, `b50f521` virtual table, `e8003cb` input debounce, `4d4ce63` chart colors/formatter, `a77b2c8` z-index tokens, `e9cf9bd` sonner toasts list. Delivery strategy: one reviewable commit per behavior unit, plus a final wiring/docs/release commit.
- L5 — Parent corrections applied to delegated work: (a) reverted an unintended `page` mutation in `pdm-data-table.previous()/next()` so client mode stays byte-identical to 1.8.x; (b) re-applied the z-index change as a purely additive diff instead of rewriting the file's existing Spanish comments; (c) shipped the Tailwind preset also as a standalone `pdm-ui-kit/tailwind-preset` file (CJS + ESM) because the kit package is ESM-only and `require('pdm-ui-kit')` fails in CommonJS Tailwind configs.
- L6 — Build verification: `npm run build` (ng-packagr) green after the feature units, including the new `virtual-table` secondary entry point and the generated `tailwind-preset.cjs` / `tailwind-preset.mjs` artifacts.
- L7 — Final work units: `5eb91d4` reduced motion + kit-owned keyframes (+ `motion-reduce:` variants on sidebar, accordion, skeleton, spinner, button, progress, data-table skeleton) and a final wiring/docs/release commit (`chore(release)`) with `src/public-api.ts`, `src/pdm-ui-kit.module.ts`, `scripts/postbuild-exports.mjs`, `README.md`, `USAGE.md`, `package.json` (version 1.9.0) and this document.
- L8 — Notes carried into the release commit: (a) the `tailwindcss-animate` plugin line was removed from the consumer Tailwind setup documented in `README.md`/`src/styles/tokens.css`; (b) `package.json` also carries the pending publish-target guard wiring that was already present in the working tree before this feature started; (c) publishing to npm stays a human decision — the branch is ready but not pushed.
- L9 — Reduced-motion scoping decision (parent): the kit ships `motion-reduce:` variants plus its own tooltip keyframes and does NOT apply a global reduced-motion reset in `pdm-ui-kit/styles`, to avoid overriding the consumer's own animation decisions; documented in `src/styles/tokens.css`.
