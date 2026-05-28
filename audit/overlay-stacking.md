## Review

### Correct
- `pdm-select`, `pdm-dropdown-menu`, and `pdm-date-picker` already use CDK Overlay + `Z_INDEX.popover`, which is the right escape hatch for scroll/overflow clipping in consuming apps (`src/lib/components/select/select.component.ts:146-154`, `src/lib/components/dropdown-menu/dropdown-menu.component.ts:187-197`, `src/lib/components/date-picker/date-picker.component.ts:291-301`).

### Blocker
- Several overlay-like components are still rendered inline instead of through CDK Overlay/Portal, so they remain vulnerable to ancestor `overflow`, transforms, and stacking-context clipping in host apps: `pdm-tooltip` (`src/lib/components/tooltip/tooltip.component.html:1-3`), `pdm-hover-card` (`src/lib/components/hover-card/hover-card.component.html:1-23`), `pdm-popover` (`src/lib/components/popover/popover.component.ts:67-73`), `pdm-menubar` submenu (`src/lib/components/menubar/menubar.component.html:1-4`), and `pdm-context-menu` (`src/lib/components/context-menu/context-menu.component.html:1-14`). This is the main root cause for "covered/clipped" behavior.
- The z-index scale is not actually enforced consistently. `Z_INDEX.drawerBackdrop` and `Z_INDEX.overlay` are unused, while `Z_INDEX.drawer` and `Z_INDEX.modalBackdrop` both resolve to `z-50` (`src/lib/utils/z-index.ts:21-78`). That makes drawer/modal ordering depend on DOM insertion order instead of a stable layer model. The problem shows up in `pdm-dialog` (`src/lib/components/dialog/dialog.component.ts:154-167`, `src/lib/components/dialog/dialog.component.ts:227-234`), `pdm-drawer` (`src/lib/components/drawer/drawer.component.ts:129-149`), and `pdm-sheet` (`src/lib/components/sheet/sheet.component.ts:1-4`).

### Note
- `overlayOptions.panelClass` can replace the library’s default z-index guard entirely, so a consumer theme class can accidentally reintroduce stacking bugs (`src/lib/components/select/select.component.ts:146-154`, `src/lib/components/dropdown-menu/dropdown-menu.component.ts:187-197`, `src/lib/components/date-picker/date-picker.component.ts:291-301`). Merge custom classes with the base z-index instead of replacing it.
- I did not find any `*.spec.ts` files under `src/`, and `package.json` only exposes build/publish scripts (`package.json:20-24`). There is no automated coverage for overlay stacking regressions.
- Requested `plan.md` / `progress.md` were not present at the provided paths, so I reviewed the codebase and design docs directly.

### Phased fix plan
1. Normalize the z-index contract: make drawer/backdrop/modal values distinct and replace hard-coded literals with `Z_INDEX` constants everywhere.
2. Port inline overlay components to a shared CDK Overlay/Portal pattern (tooltip, hover-card, popover, menubar submenu, context menu; then audit adjacent inline dropdown-like components).
3. Preserve base z-index when accepting custom `panelClass` input; only append consumer classes.
4. Add regression coverage for modal + overlay nesting, table-header overlap, and overflow-clipping scenarios.
