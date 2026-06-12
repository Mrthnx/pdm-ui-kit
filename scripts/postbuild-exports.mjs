#!/usr/bin/env node
/**
 * Post-build script:
 * 1. Adds clean sub-path aliases (./button → ./src/button FESM)
 * 2. Adds typesVersions for TypeScript moduleResolution:node compatibility
 *
 * ng-packagr generates ./src/button → fesm2020/pdm-ui-kit-src-button.mjs.
 * This script adds the clean aliases without the 'src/' prefix AND
 * typesVersions so Angular 14 consumers (moduleResolution:node) can resolve types.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist", "pdm-ui-kit");

// All secondary entry points (without 'src/' prefix)
const aliases = [
	"accordion",
	"alert",
	"aspect-ratio",
	"avatar",
	"badge",
	"breadcrumb",
	"button",
	"calendar",
	"card",
	"carousel",
	"chart",
	"checkbox",
	"collapsible",
	"combobox",
	"command",
	"context-menu",
	"data-table",
	"dialog",
	"drawer",
	"dropdown-menu",
	"empty",
	"field",
	"hover-card",
	"icon",
	"input",
	"item",
	"kbd",
	"label",
	"menubar",
	"native-select",
	"navigation-menu",
	"pagination",
	"popover",
	"progress",
	"radio-group",
	"scroll-area",
	"select",
	"separator",
	"sidebar",
	"skeleton",
	"slider",
	"sonner",
	"spinner",
	"switch",
	"tabs",
	"toggle",
	"tooltip",
	"overlay",
	"utils",
];

const pkgPath = path.join(DIST, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
const exportsMap = pkg.exports || {};

// ── 1. Clean alias entries in exports ──────────────────────────────────────
let addedCount = 0;
for (const name of aliases) {
	const srcPath = `./src/${name}`;
	const cleanPath = `./${name}`;
	if (exportsMap[srcPath]) {
		exportsMap[cleanPath] = { ...exportsMap[srcPath] };
		addedCount++;
	}
}
pkg.exports = exportsMap;

// ── 2. typesVersions (for moduleResolution:node — Angular 14 default) ──────
// TypeScript with moduleResolution:node ignores the exports.types field.
// typesVersions is the supported workaround for sub-path type resolution.
const typesVersions = { "*": {} };
for (const name of aliases) {
	const dtsPath = `./src/${name}/index.d.ts`;
	// Only add if the declaration file actually exists
	if (fs.existsSync(path.join(DIST, `src/${name}/index.d.ts`))) {
		typesVersions["*"][name] = [dtsPath];
	}
}
pkg.typesVersions = typesVersions;

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

console.log(`Added ${addedCount} clean sub-path aliases`);
console.log(
	`Added typesVersions for ${Object.keys(typesVersions["*"]).length} sub-paths`,
);
console.log(`Total exports entries: ${Object.keys(exportsMap).length}`);
