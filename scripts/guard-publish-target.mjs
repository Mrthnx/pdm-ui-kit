#!/usr/bin/env node
/**
 * Guard de publicación — evita publicar el árbol de código en lugar del build.
 *
 * CONTEXTO
 * El paquete se publica desde `dist/pdm-ui-kit` (salida de ng-packagr), no
 * desde la raíz del repo. Publicar la raíz subiría el código fuente y el
 * `dist/` crudo en lugar del paquete compilado.
 *
 * ESTE SCRIPT
 * - `npm run verify-publish-target` (o `npm run pack:dist` / `publish:dist`):
 *   verifica que `dist/pdm-ui-kit` existe, que su nombre y versión coinciden
 *   con el `package.json` de la raíz y que contiene los entry points
 *   compilados. Sale con código 0 si el target es publicable.
 * - `npm pack` / `npm publish` ejecutados en la raíz: se ABORTAN, porque
 *   publicarían el árbol de código en vez del build. Usá `npm run pack:dist`
 *   o `npm run publish:dist`.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist", "pdm-ui-kit");
const ROOT_PACKAGE = path.join(ROOT, "package.json");

const EVENT = process.env.npm_lifecycle_event || "";
const CWD = process.cwd();

function fail(message) {
	console.error(`\n✖ guard-publish-target: ${message}\n`);
	process.exit(1);
}

function readJson(file) {
	try {
		return JSON.parse(fs.readFileSync(file, "utf-8"));
	} catch (error) {
		fail(`no se pudo leer ${path.relative(ROOT, file)}: ${error.message}`);
	}
}

// ── 1. ¿Se está intentando empaquetar/publicar la raíz del repo? ──────────
const isRootLifecycle = EVENT === "prepack" || EVENT === "prepublishOnly";
if (isRootLifecycle && path.resolve(CWD) === ROOT) {
	fail(
		"este comando publicaría el código fuente del repo, no el paquete compilado.\n" +
			"    Usá `npm run pack:dist` o `npm run publish:dist` (publican ./dist/pdm-ui-kit).",
	);
}

// ── 2. Verificación del target de publicación ─────────────────────────────
if (!fs.existsSync(DIST)) {
	fail(
		"no existe dist/pdm-ui-kit. Corré `npm run build` antes de publicar.",
	);
}

const rootPkg = readJson(ROOT_PACKAGE);
const distPkg = readJson(path.join(DIST, "package.json"));

if (distPkg.name !== rootPkg.name) {
	fail(
		`el nombre del build (${distPkg.name}) no coincide con package.json (${rootPkg.name}).`,
	);
}

if (distPkg.version !== rootPkg.version) {
	fail(
		`el build es la v${distPkg.version} pero package.json dice v${rootPkg.version}.\n` +
			"    Corré `npm run build` para regenerar el paquete.",
	);
}

const requiredFiles = [
	"index.d.ts",
	"fesm2015/pdm-ui-kit.mjs",
	"fesm2020/pdm-ui-kit.mjs",
	"package.json",
];

const missing = requiredFiles.filter(
	(file) => !fs.existsSync(path.join(DIST, file)),
);

if (missing.length) {
	fail(`el build está incompleto, faltan: ${missing.join(", ")}`);
}

console.log(
	`✔ guard-publish-target: ${rootPkg.name}@${rootPkg.version} en dist/pdm-ui-kit está listo para publicar.`,
);
console.log(
	"  Comandos: `npm run pack:dist` (tgz) o `npm run publish:dist` (npm).",
);
