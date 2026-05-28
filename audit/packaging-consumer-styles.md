# Packaging / consumer-style carryover audit

## Thesis
The library does **not** ship a prebuilt CSS theme bundle. Almost all visual styling lives in Angular templates / inline class builders, so the consuming app must generate the Tailwind utilities and provide the expected CSS variables. If the consumer’s Tailwind config does not scan this library (or safelist the needed utilities), the UI will degrade to mostly unstyled markup.

## Architecture map

**Build / package path**
- `package.json` → `ng-packagr` build script (`build`) + published package metadata.
- `ng-package.json` → single entry-point package from `src/public-api.ts`.
- `src/public-api.ts` → root re-exports for module, utilities, overlay helpers, and component files.
- `src/lib/pdm-ui-kit.module.ts` → declares + exports the component/directive surface.
- Component templates / TS getters → Tailwind utility classes, CSS variables, and overlay z-index classes.
- Consuming app → must provide Tailwind build output + token variables.

## Evidence

### 1) Packaging is JS-module-first; no CSS bundle/assets are defined
- `package.json:19` (`"sideEffects": false`)
- `package.json:27-30` (peer deps include Angular >=15, lucide, CDK)
- `package.json:38-47` (dev deps are Angular 14.2 / ng-packagr 14.2 / Tailwind 3.4.19)
- `ng-package.json:3-7` only sets `dest`, `entryFile`, and allowed non-peer deps; no `assets`, no `styleIncludePaths`, no stylesheet entry.
- Repo search found **no** `.css`, `.scss`, `.svg`, or `.png` files.

### 2) Styling is embedded in templates/TS, so Tailwind must see the library sources
Representative examples:
- `src/lib/components/button/button.component.ts:20-80` builds class strings in TS (`toneClassMap`, `rootClasses`).
- `src/lib/components/dialog/dialog.component.ts:34-37, 156-233` builds responsive panel/backdrop classes in TS.
- `src/lib/components/select/select.component.ts:31-49, 147-155` uses CDK overlay `panelClass: [Z_INDEX.popover]`.
- `src/lib/components/tabs/tabs.component.html:4,12` uses `overflow-x-auto scrollbar-thin`, `whitespace-nowrap`, `md:w-fit`.
- `src/lib/components/navigation-menu/navigation-menu.component.html:4,18-19` uses `overflow-x-auto scrollbar-thin`, `ring-offset-background`, `hover:bg-accent`.
- `src/lib/components/tooltip/tooltip.component.html:3` uses `z-[70] animate-in fade-in-0 zoom-in-95`.
- `src/lib/components/table/table.component.ts:125-174` uses arbitrary variants like `[&_thead]:sticky`, `[&_tbody_tr:hover]:bg-muted/50`, `sm:[&_td]:whitespace-nowrap`.

**Implication:** if the consumer’s Tailwind `content` globs don’t include `node_modules/pdm-ui-kit/**` (or the published dist JS), those utilities will not be generated.

### 3) CSS-variable contract is larger than the short README snippet
Docs show the theme contract, but the runtime uses more than the README’s small token list:
- `README.md:22-24` says Tailwind CSS v3 + consumer CSS variables.
- `README.md:278-280` says components read tokens from the consumer project.
- `design.md:33-73` enumerates `--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--radius`.
- `src/lib/components/chart/chart.component.ts:94,111` also consumes `--chart-1..4` and `--muted` in gradients.

**Gap:** README does not enumerate the full token set (especially chart tokens), so a consumer that only copies the short snippet can still get mismatched colors.

### 4) Style encapsulation is default Angular component encapsulation, not a global CSS export
- No `encapsulation:` override was found anywhere in `src/lib`.
- No `styleUrls:` were found either.
- `src/lib/components/icon/icon.component.ts:60-78` has only inline host styles, not a shared stylesheet.

**Implication:** there is no globally injected stylesheet to “carry over” into the consumer. Styling only appears if the consuming build generates the same Tailwind utilities.

### 5) Assets are not packaged
- No local image/SVG asset files were found in the repo.
- `src/lib/components/icon/icon.component.html:1-22` renders either an external `assetUrl` image or inline Lucide SVG markup.

**Implication:** if the consumer expects packaged icons/assets, they are not present; assets are consumer-supplied or inline-only.

### 6) Public API / module export audit
- `src/public-api.ts:1-6,51` exports the module plus overlay helpers and utilities.
- `src/lib/pdm-ui-kit.module.ts:42,49,104,111,129-133` declares/exports `PdmOutsideClickDirective` and `PdmSelectOptionDirective` along with components and imports `CommonModule` + `OverlayModule`.

**Result:** I did **not** find a missing component/directive export/import in the module/public-api sweep. The likely failure mode is styling integration, not API exposure.

### 7) Documentation coverage is partial for consumer setup
- `README.md` covers basic usage and theming but does **not** mention Tailwind `content` globs, safelisting, or scanning the package.
- `MIGRATION.md` focuses on API migrations (`pdm-table`, `pdm-card`, `pdm-sidebar`, z-index) and likewise does **not** describe Tailwind build integration.
- `design.md` is the most complete token contract, but it is not surfaced in the consumer-facing quick-start path.

## Likely consumer integration gaps (ranked)
1. **Tailwind scan gap**: library classes are not generated because consumer Tailwind doesn’t scan the package/dist.
2. **Token gap**: consumer defines only the short README token subset; chart/popover/card/input/muted/accent/destructive tokens are incomplete.
3. **No CSS bundle**: consumer expects package to “bring styles,” but the package ships only Angular declarations + utility classes.
4. **Docs gap**: no explicit copy-paste Tailwind integration snippet (content/safelist) in README or MIGRATION.
5. **Asset expectation gap**: no packaged images/SVGs; icon component is inline or remote-only.
6. **Version skew risk**: package dev deps target Angular 14.2 while peer deps require >=15, so local verification may not mirror consumer reality.

## Remediation options

### Option A — Document the consumer contract (lowest risk)
Add a short “consumer integration” section to README:
- Tailwind `content` example including the published library path.
- Optional safelist guidance for dynamic/arbitrary utilities.
- Full CSS-variable block (including chart tokens).
- Note that there is no packaged CSS file.

### Option B — Publish a prebuilt theme stylesheet
Ship a CSS entry that defines required tokens / base styles so consumers don’t have to copy token boilerplate.

### Option C — Add a Tailwind preset / starter config
Provide a reusable preset or snippet that preconfigures:
- token names,
- safelist for generated utilities,
- optional scrollbar / animation helpers if needed.

### Option D — Ship assets explicitly (if desired)
If icon/image assets must be reusable, add a packaged asset pipeline or document external asset provisioning.

### Option E — Align package maintenance metadata
Bring devDependencies in line with peer range (or clearly document the build/test matrix) to reduce integration drift.

## Compact meta-prompt for the next implementation worker
**Goal:** add consumer-facing packaging/style integration guidance so the library renders correctly in consuming Angular + Tailwind apps.

**Evidence:** `package.json`, `ng-package.json`, `README.md`, `MIGRATION.md`, `design.md`, and representative components (`button`, `dialog`, `select`, `tabs`, `navigation-menu`, `tooltip`, `table`, `chart`, `icon`). No CSS bundle/assets exist; styling is utility-class driven; public API/module export audit found no missing exports.

**Success criteria:**
- README (or dedicated docs) clearly tells consumers how to configure Tailwind `content`/safelist for this library.
- Docs enumerate the full token contract, including chart variables.
- Docs state explicitly that the package does not ship a CSS bundle.
- No API/export regressions.

**Hard constraints:**
- Do not change component behavior unless required for documentation accuracy.
- Preserve existing module/public-api surface unless there is a proven missing export.

**Suggested approach:**
1. Add a minimal consumer integration section.
2. Add a complete token table / code block.
3. Add one example Tailwind config snippet for scanning the package.
4. Cross-check the docs against the actual component class usage.

**Validation:**
- Manual doc audit against the file evidence above.
- If code is changed, verify no module/public-api export deltas.

**Stop rules:**
- Escalate if asked to alter build packaging or publish assets without product approval.
- Stop once the consumer contract is explicit and evidence-backed.
