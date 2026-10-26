# Kit semantic virtual table (K11 — pdmdirector follow-up)

Additive, non-breaking addition to `pdm-ui-kit` requested by the `pdmdirector` consumer app after the 1.10.0 adoption. Target release: **1.11.0** (minor, no breaking changes). The existing `pdm-virtual-table` keeps its current markup and behavior; nothing in this feature changes an existing contract.

## Specs

### S1 (K11) — a virtualized variant that keeps native table semantics

> A table-based variant of the virtual table would unblock us: the same CdkVirtualScrollViewport and the same column model, but rendering a real <table> with <thead>/<tbody> and <th scope="col">, so the virtualisation does not cost the native semantics. The CDK viewport has to sit outside the table element, and the sticky header has to keep working against that scroll container.

Why (verbatim):

> We evaluated pdm-virtual-table for our 25 entity lists and could not adopt it. The component renders a <section> with role="rowgroup" / role="columnheader" / role="cell" divs, and the header row is a <div>. Our lists are real <table> elements with <th scope="col"> on every header cell (386 scope attributes across the app) and they rely on the native table semantics for screen readers. Swapping them for ARIA divs is a downgrade we are not willing to make, and it would also mean rewriting every cell of every list as a cellTemplate, because our cells carry row-hover state, badges and action menus.

Accepted API: new component `pdm-virtual-table-semantic` (`PdmVirtualTableSemanticComponent<T>`) in the existing `pdm-ui-kit/virtual-table` entry point, with the **same input/output surface and the same column model** as `pdm-virtual-table`:

- Inputs: `columns: PdmDataTableColumn<T>[]`, `rows: T[]`, `rowHeight = 44`, `height: number | string = 400`, `selectable = false`, `showActions = false`, `emptyLabel = 'No results.'`, `caption = ''`, `className = ''`
- Outputs: `rowAction: EventEmitter<T>`, `selectionChange: EventEmitter<{ row: T; selected: boolean }>`
- Column rules honored (identical to `pdm-virtual-table`): `key`, `label`, `render`, `cellTemplate`, `align`, `hideOnMobile`, `cellClass`, `headerClass`, `width`

Markup contract:

- One real `<table>` with an optional `<caption>`, a `<thead>` and a `<tbody>`.
- Every header cell is a `<th scope="col">` (including the selection and actions columns).
- Every body row is a real `<tr>` with real `<td>` cells. `cellTemplate` keeps working, so consumer cells (badges, action menus, row-hover state) do not have to be rewritten.
- Sticky header: the `<thead>` is `position: sticky; top: 0` against the component's own scroll container and paints an opaque background.
- Virtualization: only the visible window of rows is in the DOM. Two `aria-hidden` spacer rows keep the scroll height correct. The `<table>` carries `aria-rowcount` and every rendered row carries `aria-rowindex`, so assistive technologies know the real row count.
- The component owns its scroll container, so it renders a **panel** with an explicit height (`height`, number of pixels or any CSS length such as `'60vh'`).

Implementation note (parent decision): the variant does **not** use `CdkVirtualScrollViewport`. The CDK viewport projects its content into `.cdk-virtual-scroll-content-wrapper`, which is absolutely positioned and transformed on every scroll tick; a `position: sticky` `<thead>` inside that wrapper does not stick against the scrollport, so a CDK-based variant cannot satisfy "the sticky header has to keep working against that scroll container" while keeping the table in one element. The variant therefore implements its own windowing on a plain `overflow: auto` container. `pdm-virtual-table` keeps using the CDK and is untouched.

### S2 — column scope on the headers the kit renders

> Our lists are real <table> elements with <th scope="col"> on every header cell (386 scope attributes across the app)

The kit renders headers of its own in `pdm-data-table` (`<thead><tr><th>` without `scope`). They must expose `scope="col"` so a screen reader announces the same column semantics as the consumer's hand-written tables.

### S3 — `pdm-table variant="interactive"` sticky header

> pdm-table variant="interactive" advertises a sticky header, but the header cells are styled by the consumer stylesheet (background and borders are overridden on thead th), so we could not confirm the sticky behaviour from the kit alone. If the kit relies on the consumer for the sticky offsets, it is worth documenting.

The kit must own the sticky offsets (positioning on the header cells) and document the one thing it cannot own: the opacity of the header background, which the consumer stylesheet may override.

### S4 — answer the peer

> Nothing is blocked on our side. The 1.10.0 adoption is done and verified

The kit must answer `pdmdirector` over the agent mesh with: the landed set, the target version, the per-item adoption steps, and an explicit answer on the two observations (fixed height = product decision for the consumer; sticky header = documented).

### Non-goals (verbatim from the peer)

> That is a product decision for the consumer, not only an implementation detail.

The kit does not change the consumer's page-scrolling lists into panels by itself; it documents the requirement and offers a CSS length (`height`) so the consumer can size the panel to its own layout.

## Tasks

- T1 (S1) — new `pdm-virtual-table-semantic` component (`src/virtual-table/virtual-table-semantic.component.ts` + `.html`) — worker — commit: `feat(virtual-table): add semantic table variant with native table markup`
- T2 (S2, S3) — `scope="col"` on `pdm-data-table` headers + cell-level sticky offsets in `pdm-table variant="interactive"` — inline — commit: `fix(data-table): expose column scope and keep the interactive header sticky`
- T3 (S1, S4) — public API wiring (`src/virtual-table/virtual-table.module.ts`, `src/virtual-table/public-api.ts`, `src/public-api.ts`, `src/pdm-ui-kit.module.ts`) + docs (`README.md`, `USAGE.md`) — inline — commit: `docs(virtual-table): document the semantic virtual table and its trade-offs`
- T4 (S1–S4) — build verification + reply to `pdmdirector` — inline — commit: `docs(odd): record the K11 semantic virtual table delivery`

## Log

- L1 — Original request from `pdmdirector` (verbatim):

```json
{"type":"kit-modernization-followup","from":"pdmdirector consumer app","subject":"K11 request: pdm-virtual-table does not preserve table semantics","k11":{"title":"pdm-virtual-table renders divs with ARIA roles instead of a real table","what_we_found":"We evaluated pdm-virtual-table for our 25 entity lists and could not adopt it. The component renders a <section> with role=\"rowgroup\" / role=\"columnheader\" / role=\"cell\" divs, and the header row is a <div>. Our lists are real <table> elements with <th scope=\"col\"> on every header cell (386 scope attributes across the app) and they rely on the native table semantics for screen readers. Swapping them for ARIA divs is a downgrade we are not willing to make, and it would also mean rewriting every cell of every list as a cellTemplate, because our cells carry row-hover state, badges and action menus.","ask":"A table-based variant of the virtual table would unblock us: the same CdkVirtualScrollViewport and the same column model, but rendering a real <table> with <thead>/<tbody> and <th scope=\"col\">, so the virtualisation does not cost the native semantics. The CDK viewport has to sit outside the table element, and the sticky header has to keep working against that scroll container.","note":"Worth flagging for whoever writes the docs: pdm-virtual-table requires a fixed height (400 by default), so adopting it turns a page-scrolling list into a fixed-height panel. That is a product decision for the consumer, not only an implementation detail."},"two_other_observations":{"fixed_height":"Every virtualisation path we found, including pdm-virtual-table, needs an explicit height on the scroll container. Our lists currently scroll with the page, so a virtual table would also mean a layout change. We are treating that as a product decision rather than silently converting the lists.","sticky_header":"pdm-table variant=\"interactive\" advertises a sticky header, but the header cells are styled by the consumer stylesheet (background and borders are overridden on thead th), so we could not confirm the sticky behaviour from the kit alone. If the kit relies on the consumer for the sticky offsets, it is worth documenting."},"status":"Nothing is blocked on our side. The 1.10.0 adoption is done and verified: the app is on pdm-ui-kit ^1.10.0, the form controls are bound with [formControl], and we adopted your loadingBlocker tier in place of our own app-loading tier, so the scale has one less custom entry.","thanks":"For K1-K10 and for the fast, specific answers. The z-index canonical answer in particular removed a duplicated scale on our side, and the CVA let us delete the last raw form markup."}
```

- L2 — Decision (parent): land K11 as **1.11.0**, additive and non-breaking. `pdm-virtual-table` is **not** modified; the table semantics come from a new component `pdm-virtual-table-semantic` that shares its input/output surface and column model, so the consumer swaps one selector.
- L3 — Decision (parent): the new component does **not** use `CdkVirtualScrollViewport`. Reason: the CDK viewport renders its content inside `.cdk-virtual-scroll-content-wrapper`, an absolutely positioned, transform-driven wrapper; a `position: sticky` `<thead>` inside it does not stick against the scrollport, so the peer's own acceptance criterion ("the sticky header has to keep working against that scroll container") cannot be met with the CDK wrapper around the table. The variant owns a plain `overflow: auto` container and implements its own windowing (spacer rows + `aria-rowcount`/`aria-rowindex`).
- L4 — Verification baseline: the kit has **no test runner** installed (`node_modules` has no jest/karma/jasmine/vitest), so the applicable verification is `npm run build` (ng-packagr) plus template type-checking and API review. No test framework is introduced by this feature.
- L5 — Work-unit commits on `feature/kit-virtual-table-semantic`: `b5c46b4` scope=col + sticky offsets (T2), `76bef07` semantic virtual table component (T1), `39c092e` wiring + docs + 1.11.0 bump (T3). The sibling `pdm-virtual-table` is byte-identical to `master` (verified with `git diff master`), so the change is additive and non-breaking.
- L6 — Build verification: `npm run build` (ng-packagr) green on the feature branch. The `virtual-table` entry point compiles with both components; the generated `virtual-table-semantic.component.d.ts` exposes `PdmVirtualTableSemanticComponent<T>` with selector `pdm-virtual-table-semantic` and the full input/output surface. The sticky-header + spacer-row approach was validated in a real browser (Playwright) before implementation: with 1000 rows of 44px in a 400px viewport, the `<thead>` stays at offset 1px from the viewport top at scrollTop 0/44/1000/20000/43556, the scroll height is preserved (44043px vs 44040 expected), and only ~14 rows live in the DOM at any time.
- L7 — Delivery: the branch is ready on `feature/kit-virtual-table-semantic`; merge to `master` and `npm run publish:dist` remain explicit human steps. The reply to `pdmdirector` was sent over the agent mesh (correlated to the original `kit-modernization-followup` message).
