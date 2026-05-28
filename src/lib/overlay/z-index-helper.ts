export interface OverlayConfig {
	panelClass?: string | string[];
	// ... other properties
}

/**
 * Z-Index helper for overlay components.
 *
 * CRITICAL: Consumer custom panelClass MUST NOT replace the base z-index.
 * This helper ensures z-index is preserved when merging custom classes.
 */

/**
 * Base z-index class for overlays - MUST be included in any overlay panel.
 * This ensures overlays appear above modals (z-50) and drawers (z-40).
 */
export const OVERLAY_BASE_Z_INDEX = "z-[70]";

/**
 * Merge consumer's panelClass with our base z-index.
 * Consumer classes are APPENDED, not replacing our z-index guarantee.
 *
 * @param baseZIndex - Base z-index class to enforce (default: OVERLAY_BASE_Z_INDEX)
 * @param consumerClasses - Optional additional classes from consumer
 * @returns Array of classes safe for CDK Overlay panelClass
 */
export function mergeOverlayPanelClass(
	baseZIndex: string = OVERLAY_BASE_Z_INDEX,
	consumerClasses?: string | string[],
): string[] {
	const baseClasses = baseZIndex.split(" ");

	if (!consumerClasses) {
		return baseClasses;
	}

	const consumerClassArray = Array.isArray(consumerClasses)
		? consumerClasses
		: consumerClasses.split(" ");

	// Consumer classes are appended AFTER base classes
	// This ensures z-index from baseClasses is preserved first
	return [...baseClasses, ...consumerClassArray];
}

/**
 * Create OverlayConfig with guaranteed z-index.
 * Use this instead of direct OverlayConfig to ensure z-index enforcement.
 *
 * @param baseConfig - Base overlay configuration
 * @param consumerPanelClass - Optional consumer panelClass to merge
 * @returns OverlayConfig with z-index guarantee
 */
export function createZIndexEnforcedOverlay(
	baseConfig: OverlayConfig,
	consumerPanelClass?: string | string[],
): OverlayConfig {
	const mergedClasses = mergeOverlayPanelClass(
		OVERLAY_BASE_Z_INDEX,
		consumerPanelClass,
	);

	const existingPanelClass = baseConfig.panelClass;

	if (existingPanelClass) {
		const existingArray = Array.isArray(existingPanelClass)
			? existingPanelClass
			: existingPanelClass.split(" ");

		return {
			...baseConfig,
			panelClass: [...mergedClasses, ...existingArray],
		};
	}

	return {
		...baseConfig,
		panelClass: mergedClasses,
	};
}

/**
 * Helper to extract z-index from a class string for debugging.
 */
export function extractZIndex(classes: string | string[]): string | null {
	const classArray = Array.isArray(classes) ? classes : classes.split(" ");

	for (const cls of classArray) {
		if (cls.startsWith("z-") || cls.startsWith("z-[")) {
			return cls;
		}
	}

	return null;
}
