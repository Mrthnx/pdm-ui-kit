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
 *
 * REGLA CRÍTICA:
 * - Componentes overlay (select options, dropdown menu, tooltip) SIEMPRE z-[70] o mayor
 * - Esto permite que funcionen DENTRO de modals (z-50)
 * - Backdrop de modal debe ser z-40 para estar DEBAJO del contenido del modal (z-50)
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
