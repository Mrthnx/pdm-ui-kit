# Fix dialog maxWidth Tailwind JIT sizing

## Goal
Make `maxWidth` work for `pdm-dialog` and `pdm-alert-dialog` without requiring consumers to safelist runtime Tailwind arbitrary classes.

## Context
`maxWidth` was converted to a runtime Tailwind class like `sm:max-w-[min(92vw, 1100px)]`. Tailwind JIT does not generate CSS for dynamic arbitrary classes, so static size classes such as `sm:max-w-[800px]` win.

## Tasks
- [x] Inspect dialog and alert sizing implementation.
- [x] Implement `maxWidth` through a non-JIT-dependent mechanism for `pdm-dialog`.
- [x] Apply the same fix to `pdm-alert-dialog`.
- [x] Run focused verification/build checks.

## Implementation
- Replaced dynamic Tailwind `sm:max-w-[${maxWidth}]` generation with a static marker class plus CSS custom property.
- `pdm-dialog` uses `.pdm-dialog-max-width` and `--pdm-dialog-max-width` inside a component-scoped `@media (min-width: 640px)` rule.
- `pdm-alert-dialog` uses `.pdm-alert-dialog-max-width` and `--pdm-alert-dialog-max-width` with the same breakpoint behavior.
- Empty `maxWidth` does not add the marker class or CSS custom property, preserving default size behavior.

## Verification
- `npm run build` passed on 2026-10-05.

## Evidence
- `src/dialog/dialog.component.ts`
- `src/dialog/dialog.component.html`
- `src/alert/alert-dialog.component.ts`
- `src/alert/alert-dialog.component.html`

## Commits
- Not committed: repository policy says never commit unless explicitly requested.
