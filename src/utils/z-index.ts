/**
 * Z-Index Scale - Sistema centralizado de z-index
 *
 * JERARQUÍA (de menor a mayor):
 * 1. base (z-0) - Elementos normales del DOM
 * 2. dropdown (z-10) - Selects, combobox, date-pickers
 * 3. sticky (z-20) - Headers, navigation bars
 * 4. drawerBackdrop (z-30) - Backdrop de drawers
 * 5. drawer (z-40) - Sidebar drawer, sheets laterales
 * 6. modalBackdrop (z-40) - Backdrop de modals ( mismo nivel que drawer)
 * 7. modal (z-50) - Dialogs, alert-dialogs
 * 8. popover (z-[70]) - Tooltips, dropdowns DENTRO de modals
 * 9. toast (z-[100]) - Notificaciones que deben estar sobre TODO
 * 10. loadingOverlay (z-[200]) - Loading overlays del consumidor, por encima de los toasts
 *
 * REGLA CRÍTICA:
 * - Componentes overlay (select options, dropdown menu, tooltip) SIEMPRE z-[70] o mayor
 * - Esto permite que funcionen DENTRO de modals (z-50)
 * - Backdrop de modal debe ser z-40 para estar DEBAJO del contenido del modal (z-50)
 * - El consumidor NO debe definir su propia escala (modal 500 / popover 600 /
 *   tooltip 700 / loading 9500): usar estos tokens (Z_INDEX, Z_INDEX_VALUE,
 *   pdmZIndex o el preset PDM_TAILWIND_PRESET) evita conflictos de stacking.
 */

export const Z_INDEX = {
	/**
	 * Base - contenido normal del DOM
	 */
	base: "z-0",

	/**
	 * Dropdown - Selects, combobox, date-pickers
	 * Debe estar SOBRE contenido normal pero BAJO overlays
	 */
	dropdown: "z-10",

	/**
	 * Sticky - Headers, navigation fija
	 */
	sticky: "z-20",

	/**
	 * Drawer backdrop - Backdrop de sidebar drawer
	 * Debe estar DEBAJO del drawer panel y DEBAJO de modals
	 */
	drawerBackdrop: "z-30",

	/**
	 * Drawer - Sidebar drawer, sheets laterales
	 * Debe estar SOBRE su backdrop pero BAJO modals
	 */
	drawer: "z-40",

	/**
	 * Modal backdrop - Backdrop de dialogs
	 * Mismo nivel que drawer backdrop (z-40)
	 */
	modalBackdrop: "z-40",

	/**
	 * Modal - Dialogs, alert-dialogs
	 * Debe estar SOBRE su backdrop
	 */
	modal: "z-50",

	/**
	 * Popover - Tooltips, dropdowns, selects options DENTRO de modals
	 * CRÍTICO: Debe ser MAYOR que modal (z-50) para aparecer sobre modals
	 * USAR SIEMPRE mergeOverlayPanelClass() para asegurar este valor
	 */
	popover: "z-[70]",

	/**
	 * Toast - Notificaciones globales
	 * Debe estar sobre TODO
	 */
	toast: "z-[100]",

	/**
	 * Loading overlay - Loading overlays del consumidor
	 * Debe estar por encima de los toasts (z-[100]) para que una request
	 * pendiente nunca quede oculta detrás de una notificación
	 */
	loadingOverlay: "z-[200]",
} as const;

/**
 * Nombres de token disponibles en la escala de z-index
 */
export type ZIndexToken = keyof typeof Z_INDEX;

/**
 * Valor numérico de cada token de la escala de z-index.
 *
 * Útil para estilos inline (`[style.zIndex]`) y para consumidores que no
 * usan Tailwind. El tipo garantiza una entrada numérica por token.
 */
export const Z_INDEX_VALUE: Readonly<Record<ZIndexToken, number>> = {
	base: 0,
	dropdown: 10,
	sticky: 20,
	drawerBackdrop: 30,
	drawer: 40,
	modalBackdrop: 40,
	modal: 50,
	popover: 70,
	toast: 100,
	loadingOverlay: 200,
};

/**
 * Devuelve el valor numérico de z-index de un token.
 *
 * ```ts
 * overlay.style.zIndex = String(pdmZIndex("modal")); // "50"
 * ```
 */
export function pdmZIndex(token: ZIndexToken): number {
	return Z_INDEX_VALUE[token];
}

/**
 * Mapa `theme.extend.zIndex` expuesto por el kit.
 *
 * El index signature es permisivo a propósito para que el preset siga siendo
 * asignable al tipo `Config` de Tailwind (que modela los valores de z-index
 * como strings aunque el runtime acepta números).
 */
export interface PdmTailwindZIndexExtend {
	readonly [token: string]: any;
}

/**
 * Forma del preset de Tailwind exportado por el kit.
 */
export interface PdmTailwindPreset {
	readonly theme: {
		readonly extend: {
			readonly zIndex: PdmTailwindZIndexExtend;
		};
	};
}

/**
 * Preset de Tailwind que expone la escala de z-index del kit como tokens
 * compartidos.
 *
 * Se consume desde el `tailwind.config.js` del consumidor:
 *
 * ```js
 * // tailwind.config.js
 * const { PDM_TAILWIND_PRESET } = require("pdm-ui-kit/tailwind-preset");
 *
 * module.exports = {
 *   presets: [PDM_TAILWIND_PRESET],
 *   // ...
 * };
 * ```
 *
 * Las utilidades generadas son `z-base`, `z-dropdown`, `z-sticky`,
 * `z-drawer-backdrop`, `z-drawer`, `z-modal-backdrop`, `z-modal`, `z-popover`,
 * `z-toast` y `z-loading-overlay`.
 */
export const PDM_TAILWIND_PRESET: PdmTailwindPreset = {
	theme: {
		extend: {
			zIndex: {
				base: 0,
				dropdown: 10,
				sticky: 20,
				"drawer-backdrop": 30,
				drawer: 40,
				"modal-backdrop": 40,
				modal: 50,
				popover: 70,
				toast: 100,
				"loading-overlay": 200,
			},
		},
	},
} as const;

/**
 * Helper para debugging z-index issues
 */
export function logZIndexStack(element: HTMLElement): void {
	if (typeof window === "undefined") return;

	let current: HTMLElement | null = element;
	const stack: Array<{ element: string; zIndex: string; position: string }> =
		[];

	while (current && current !== document.body) {
		const computed = window.getComputedStyle(current);
		const zIndex = computed.zIndex;
		const position = computed.position;

		if (zIndex !== "auto") {
			stack.push({
				element:
					current.tagName +
					(current.className ? `.${current.className.split(" ")[0]}` : ""),
				zIndex,
				position,
			});
		}

		current = current.parentElement;
	}

	console.table(stack);
}
