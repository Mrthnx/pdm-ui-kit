import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	HostListener,
	Input,
	Output,
} from "@angular/core";
import { responsive } from "pdm-ui-kit/src/utils";
import { Z_INDEX } from "pdm-ui-kit/src/utils";

export type PdmDialogVariant = "default" | "custom-close";

/**
 * @deprecated Use 'responsive' mode instead. Will be removed in v0.3.0
 */
export type PdmDialogSize =
	| "desktop"
	| "mobile"
	| "mobile-fullscreen"
	| "sm"
	| "md"
	| "lg"
	| "xl"
	| "responsive";

export type PdmDialogFooterAlign = "right" | "full-width" | "left";

/**
 * Modal/Dialog component con soporte responsive
 *
 * MEJORADO en v0.2.0:
 * - Modo 'responsive' (default): fullscreen en mobile, modal en desktop
 * - Tamaños predefinidos: sm, md, lg, xl
 * - Mejor manejo de scroll en mobile
 *
 * @example
 * // Responsive (recomendado)
 * <pdm-dialog [open]="isOpen" size="responsive">
 *   <p>Content</p>
 * </pdm-dialog>
 *
 * @example
 * // Tamaño fijo
 * <pdm-dialog [open]="isOpen" size="lg">
 *   <p>Content</p>
 * </pdm-dialog>
 */
@Component({
	selector: "pdm-dialog",
	templateUrl: "./dialog.component.html",
	styles: [
		`
    :host {
      display: block;
    }
  `,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdmDialogComponent {
	@Input() open = false;
	@Input() variant: PdmDialogVariant = "default";

	/**
	 * Tamaño del dialog
	 * - responsive: fullscreen mobile, modal desktop (recomendado)
	 * - sm: 400px max
	 * - md: 500px max
	 * - lg: 640px max (default)
	 * - xl: 800px max
	 * - desktop/mobile/mobile-fullscreen: legacy, deprecado
	 */
	@Input() size: PdmDialogSize = "responsive";

	@Input() title = "";
	@Input() description = "";
	@Input() closeOnBackdrop = true;
	@Input() closeOnEsc = true;
	@Input() showCloseButton = true;
	@Input() showHeader = true;
	@Input() showFooter = true;
	@Input() primaryActionText = "Save changes";
	@Input() secondaryActionText = "Cancel";
	@Input() alignFooter: PdmDialogFooterAlign = "right";
	@Input() headerClassName = "";
	@Input() bodyClassName = "";
	@Input() footerClassName = "";
	@Input() className = "";

	@Output() openChange = new EventEmitter<boolean>();
	@Output() primaryAction = new EventEmitter<void>();
	@Output() secondaryAction = new EventEmitter<void>();

	@HostListener("document:keydown.escape")
	onEsc(): void {
		if (this.open && this.closeOnEsc) {
			this.close();
		}
	}

	close(): void {
		this.openChange.emit(false);
	}

	onPrimaryAction(): void {
		this.primaryAction.emit();
	}

	onSecondaryAction(): void {
		this.secondaryAction.emit();
	}

	onBackdropClick(): void {
		if (this.closeOnBackdrop) {
			this.close();
		}
	}

	get panelClassName(): string {
		// Legacy sizes (backward compatibility)
		if (this.size === "desktop") {
			return this.buildPanelClasses([
				"max-w-[640px]",
				"max-h-[calc(100vh-2rem)]",
				"rounded-[10px]",
			]);
		}

		if (this.size === "mobile") {
			return this.buildPanelClasses([
				"max-w-[320px]",
				"min-h-[240px]",
				"rounded-[10px]",
			]);
		}

		if (this.size === "mobile-fullscreen") {
			return this.buildPanelClasses([
				"max-w-[320px]",
				"h-[min(100dvh,640px)]",
				"rounded-none",
				"sm:rounded-[10px]",
			]);
		}

		// New responsive mode (recomendado)
		if (this.size === "responsive") {
			return this.buildPanelClasses([
				// Mobile: fullscreen con bordes redondeados solo arriba
				"w-full",
				"h-full",
				"max-h-[100dvh]",
				"rounded-t-[10px]",
				"sm:rounded-[10px]",
				// Desktop: modal centrado
				"sm:w-auto",
				"sm:h-auto",
				"sm:max-w-[640px]",
				"sm:max-h-[calc(100vh-4rem)]",
			]);
		}

		// New size options
		const sizeMap = {
			sm: "sm:max-w-[400px]",
			md: "sm:max-w-[500px]",
			lg: "sm:max-w-[640px]",
			xl: "sm:max-w-[800px]",
		};

		const maxWidth = sizeMap[this.size as keyof typeof sizeMap] || sizeMap.lg;

		return this.buildPanelClasses([
			// Mobile: fullscreen
			"w-full",
			"h-full",
			"max-h-[100dvh]",
			"rounded-t-[10px]",
			// Desktop: modal
			"sm:rounded-[10px]",
			"sm:w-auto",
			"sm:h-auto",
			maxWidth,
			"sm:max-h-[calc(100vh-4rem)]",
		]);
	}

	private buildPanelClasses(sizeClasses: string[]): string {
		const base = [
			"relative",
			Z_INDEX.modal, // z-50 - debe estar sobre backdrop (z-40)
			"flex",
			"flex-col",
			"border border-solid",
			"border-border",
			"bg-background",
			"text-foreground",
			"shadow-lg",
			"overflow-hidden",
			...sizeClasses,
			this.className,
		];

		return base.filter(Boolean).join(" ");
	}

	get bodyWrapperClassName(): string {
		// min-h-0 is CRITICAL for flex child to shrink and allow internal scroll
		const base = [
			"flex-1",
			"min-h-0",
			"overflow-y-auto",
			"px-4",
			"py-6",
			"sm:px-6",
			this.bodyClassName,
		];

		return base.filter(Boolean).join(" ");
	}

	get headerWrapperClassName(): string {
		const base = [
			"flex",
			"items-start",
			"justify-between",
			"gap-3",
			"p-4",
			"sm:p-6",
			"border-b",
			"border-border",
			this.headerClassName,
		];

		return base.filter(Boolean).join(" ");
	}

	get footerWrapperClassName(): string {
		const effectiveAlign =
			this.alignFooter === "right" && this.variant === "custom-close"
				? "left"
				: this.alignFooter;

		const base = [
			"p-4",
			"sm:p-6",
			"border-t",
			"border-border",
			// Mobile: siempre full-width
			"flex",
			"flex-col",
			"gap-2",
			// Desktop: según alignFooter
			effectiveAlign === "full-width"
				? "sm:flex-col"
				: "sm:flex-row sm:items-center",
			effectiveAlign === "left" ? "sm:justify-start" : "",
			effectiveAlign === "right" ? "sm:justify-end" : "",
			this.footerClassName,
		];

		return base.filter(Boolean).join(" ");
	}

	get containerClassName(): string {
		// Container con backdrop z-40
		// Mobile: fullscreen desde el bottom
		// Desktop: centrado
		return responsive({
			default: `fixed inset-x-0 bottom-0 ${Z_INDEX.modalBackdrop} flex items-end justify-center`,
			sm: `fixed inset-0 ${Z_INDEX.modalBackdrop} flex items-center justify-center p-4`,
		});
	}
}
