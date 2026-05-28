# Responsive/Layout Audit

Scope note: `plan.md` and `progress.md` were not present at the requested repo paths at review time, so this audit is based on source and docs only.

## Findings

### High — Table responsive modes are incomplete / overpromised
- `TableResponsiveStrategy` advertises `scroll`, `stack`, `wrap`, and `collapse` in `src/lib/utils/responsive.ts:34-38,167-199`.
- `PdmTableComponent` only changes whitespace for `scroll`/`wrap`; `stack` and `collapse` do not apply any row/cell behavior, and `wrap` still returns `overflow-x-auto` in `src/lib/components/table/table.component.ts:84-104,170-184`.
- `README.md:238-241` promises mobile collapse/scroll behavior that the implementation does not actually provide.

Risk: consuming apps can still get horizontal overflow or unchanged table behavior on mobile when they opt into non-scroll strategies.

Recommended fix: either implement `stack`/`collapse` in the component/template, or remove those modes from the public API/docs. Add regression coverage for each strategy.

### High — Group primitives do not adapt on narrow screens
- `pdm-button-group` is `inline-flex w-fit` with attached-segment classes, but no wrap/stack fallback in `src/lib/components/button-group/button-group.component.ts:188-199`.
- `pdm-toggle-group` is a single-line `inline-flex` row with fixed `h-8` buttons in `src/lib/components/toggle-group/toggle-group.component.html:1-16`.
- `pdm-input-group` is one-row flex layout with `shrink-0` prefix/suffix/button and no `flex-wrap` in `src/lib/components/input-group/input-group.component.html:1-57`.
- `pdm-data-table` toolbar uses `flex ... justify-between gap-2` with no wrap, so filter + column selector can squeeze or overflow on mobile in `src/lib/components/data-table/data-table.component.html:1-22`.

Risk: labels and controls can clip, compress to unusable widths, or overflow their container in consuming apps.

Recommended fix: add mobile stack/wrap patterns (`flex-col sm:flex-row`, `flex-wrap`, `min-w-0`, `w-full` on actions) and keep the segmented layout only at `sm+`.

### Medium — Dialog internal scroll area is missing `min-h-0`
- Dialog panel is `flex flex-col overflow-hidden` and the body is `flex-1 overflow-y-auto` in `src/lib/components/dialog/dialog.component.ts:154-183` and `src/lib/components/dialog/dialog.component.html:26-29`.
- The scrollable body does not set `min-h-0`.

Risk: on tall content, the flex child may refuse to shrink cleanly and the intended inner scroll can fail or overflow the viewport on some browsers.

Recommended fix: add `min-h-0` to the body wrapper (and verify on iOS Safari).

### Note — Drawer/sheet “responsive” behavior is mostly static
- `PdmDrawerComponent` imports `responsive` but never uses it; sizing is only derived from `position`/`size` in `src/lib/components/drawer/drawer.component.ts:1-3,129-181`.
- `PdmSheetComponent` similarly only maps side/size to static classes in `src/lib/components/sheet/sheet.component.ts:66-109`.

Risk: docs imply viewport-adaptive behavior, but the component does not switch layouts by breakpoint automatically.

Recommended fix: either implement breakpoint-aware classes, or narrow the docs/API to the actual behavior.

### Note — Host display styles are only explicit for `pdm-icon`
- `pdm-icon` sets `:host { display: inline-flex; ... }` in `src/lib/components/icon/icon.component.ts:60-75`.
- I did not find equivalent host display rules for the layout primitives above.

Risk: when consumers place component tags directly in flex/grid layouts or apply sizing to the host element, layout can be inconsistent.

Recommended fix: add explicit host display contracts for block primitives (`display: block` / `width: 100%` where intended).

### Note — No spec coverage found
- `find *.spec.ts` returned no test files.

Risk: responsive regressions are currently unguarded.

## Phased fix plan
1. Fix table strategy parity (`scroll`/`wrap`/`stack`/`collapse`) and align docs.
2. Add mobile wrapping/stacking for button-group, toggle-group, input-group, and the data-table toolbar.
3. Patch dialog scroll behavior with `min-h-0`; then review drawer/sheet viewport behavior.
4. Add minimal regression tests/stories for mobile layouts and host sizing.

## Risk summary
- `draggable-table` duplicates the table responsive logic and will need the same follow-up.
- Current docs overstate responsiveness in a few places; keep docs and API aligned to avoid consumer misuse.
