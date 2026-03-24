import { OverlayConfig } from '@angular/cdk/overlay';

/**
 * Optional overrides for CDK {@link OverlayConfig}.
 *
 * All properties are optional. When provided, they are shallow-merged **on top of**
 * each component's own defaults, so the consumer always wins.
 *
 * `positionStrategy` and `scrollStrategy`, when supplied, **replace** the component's
 * defaults entirely — supply a factory-created instance, not a plain object.
 *
 * @example
 * ```html
 * <!-- Render the panel inside the CDK overlay container (escapes scroll clips)
 *      and add a custom panel class for styling. -->
 * <pdm-select
 *   [options]="items"
 *   [overlayOptions]="{ panelClass: ['my-select-panel'], minWidth: 300 }"
 * ></pdm-select>
 * ```
 */
export type PdmOverlayOptions = Partial<OverlayConfig>;
