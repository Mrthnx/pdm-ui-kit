# Code Context

## Files Retrieved
1. `src/lib/styles/tokens.css` (lines 1-182) - core shadcn-like token contract and consumer Tailwind guidance.
2. `src/lib/components/button/button.component.ts` (lines 1-124) - button variant/state system and utility-class composition pattern.
3. `src/lib/components/input/input.component.html` (lines 1-39) - canonical field styling, sizing, invalid-state treatment.
4. `src/lib/components/dialog/dialog.component.ts` (lines 1-260) - overlay/modal layout, z-index, responsive sizing, scroll behavior.
5. `src/lib/components/dialog/dialog.component.html` (lines 1-61) - backdrop/panel/footer visuals and action button styling.
6. `src/lib/components/select/select.component.html` (lines 1-90) - trigger + CDK overlay listbox styling and accessibility pattern.
7. `src/lib/components/sidebar/sidebar.component.html` (lines 1-32) - drawer/sidebar responsive layout conventions.
8. `src/lib/components/tabs/tabs.component.html` (lines 1-24) - segmented-control style tabs with scrollable mobile treatment.
9. `src/lib/components/data-table/data-table.component.html` (lines 1-201) - composite responsive toolbar/footer/table layout.
10. `src/lib/components/chart/chart.component.html` (lines 1-146) - chart card surface and token-driven chart visuals.
11. `src/lib/components/button-group/button-group.component.ts` (lines 1-213) - grouped control composition and nested selector-heavy styling.
12. `README.md` (lines 1-260) - consumer setup expectations, shadcn positioning, and docs gaps.
13. `package.json` (lines 1-54) - package metadata, peer deps, and Tailwind/shadcn positioning.

## Key Code
- Tokens are the visual contract: `--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--radius`, plus `--chart-1..5` (`src/lib/styles/tokens.css:18-88`).
- Consumer Tailwind must scan the library path (`node_modules/pdm-ui-kit/**/*.{ts,html}`) and map CSS vars into theme colors (`src/lib/styles/tokens.css:119-181`).
- Buttons are class-builder driven with multiple variants, including some non-shadcn-ish extras (`with-icon`, `icon-circle`, `rounded`, `loading`) and heavy reliance on borders/shadows (`src/lib/components/button/button.component.ts:36-99`).
- Inputs follow the most shadcn-faithful pattern: label above field, `border-input`, `focus-visible:ring`, `aria-invalid:*`, muted helper/error text (`src/lib/components/input/input.component.html:1-39`).
- Dialog is the strongest overlay primitive: backdrop blur, `bg-background`, `border-border`, `shadow-lg`, responsive fullscreen mobile, `min-h-0` scroll fix (`src/lib/components/dialog/dialog.component.ts:120-260`, `src/lib/components/dialog/dialog.component.html:1-61`).
- Select uses a hidden native fallback plus CDK overlay listbox, with `bg-popover`, `shadow-md`, and stateful option highlight (`src/lib/components/select/select.component.html:1-90`).
- Tabs use a pill/segmented control pattern with `bg-muted` track and active `bg-background shadow-sm` tab (`src/lib/components/tabs/tabs.component.html:1-24`).
- Data table and chart are visually richer composites; both lean on card surfaces, muted metadata, and many fixed-size/layout utilities (`src/lib/components/data-table/data-table.component.html:1-201`, `src/lib/components/chart/chart.component.html:1-146`).
- Button group is a dense nested-selector implementation that normalizes many child primitives, but it also increases style complexity and fidelity risk (`src/lib/components/button-group/button-group.component.ts:23-211`).

## Architecture
- The kit is Angular NgModule-based, not standalone, and exports a broad component surface from one module/public API (`src/lib/pdm-ui-kit.module.ts`, `src/public-api.ts`).
- Visual styling is almost entirely inline Tailwind utility strings in templates/TS, not shared CSS files.
- That means fidelity depends on consumer Tailwind compilation seeing these source files and on the consumer supplying the token variables.
- The library generally mirrors shadcn/ui surfaces: rounded cards, muted borders, subtle shadows, primary actions, and focus rings.
- Deviations come from product-specific additions (extra button variants, stronger shadows, custom sizes, mobile drawer/sidebar behavior, chart/data-table polish).

## Strengths
- Strong token-based design system; easy to theme consistently.
- Most primitives use shadcn-like affordances: border/input/ring colors, muted surfaces, and accessible focus states.
- Dialog/select/sidebar patterns are coherent and production-oriented.
- Composite widgets (tabs, data-table, chart) show a consistent language rather than ad hoc styling.

## Weaknesses
- Several components drift from shadcn defaults via extra rounding (`rounded-lg`/`rounded-[10px]`), heavier shadows, and custom variants.
- Styling is fragmented across many templates, so fidelity depends on each component being reviewed individually.
- Some docs/token guidance is incomplete compared to runtime needs (notably chart tokens and full Tailwind consumer setup).
- Button-group/data-table/sidebar add layout complexity that can create mobile or composition edge cases.

## Top Improvement Opportunities
1. Normalize the visual primitives to a stricter shadcn baseline (radius, shadow, button tone, active states).
2. Tighten docs so consumers get a copy-paste Tailwind scan + token setup.
3. Reduce custom variant surface where it doesn’t add product value (`button`, `dialog`, grouped controls).
4. Audit composite components for mobile layout consistency and overflow behavior.
5. Consider a small shared styling contract/helper layer to reduce divergence between similar controls.

## Start Here
Open `src/lib/styles/tokens.css` first: it defines the theme contract, points to consumer Tailwind setup, and explains most of the visual language used everywhere else.

## Supervisor coordination
Progress update sent; no blocking decision was required.
