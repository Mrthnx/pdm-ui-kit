import {
	ChangeDetectionStrategy,
	Component,
	ContentChild,
	Directive,
	EventEmitter,
	HostListener,
	Input,
	Output,
} from "@angular/core";
import { cn, responsive, Z_INDEX } from "pdm-ui-kit/src/utils";

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

@Directive({ selector: "[pdmHeader]" })
export class PdmDialogHeaderDirective {}

@Directive({ selector: "[pdmFooter]" })
export class PdmDialogFooterDirective {}

/**
 * Responsive modal/dialog component.
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
	 * Dialog size. Responsive mode is fullscreen on mobile and a modal on desktop.
	 */
	@Input() size: PdmDialogSize = "responsive";

	/**
	 * Custom desktop maximum width, such as `800px` or `min(90vw, 800px)`.
	 * Overrides `size` at the `sm` breakpoint; responsive mobile mode remains fullscreen.
	 */
	@Input() maxWidth = "";

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

	@ContentChild(PdmDialogHeaderDirective) customHeader?: PdmDialogHeaderDirective;
	@ContentChild(PdmDialogFooterDirective) customFooter?: PdmDialogFooterDirective;

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

		if (this.size === "responsive") {
			return this.buildPanelClasses([
				"w-full",
				"h-full",
				"max-h-[100dvh]",
				"rounded-t-[10px]",
				"sm:rounded-[10px]",
				"sm:w-auto",
				"sm:h-auto",
				"sm:max-w-[640px]",
				"sm:max-h-[calc(100vh-4rem)]",
			]);
		}

		const sizeMap = {
			sm: "sm:max-w-[400px]",
			md: "sm:max-w-[500px]",
			lg: "sm:max-w-[640px]",
			xl: "sm:max-w-[800px]",
		};
		const maxWidth = sizeMap[this.size as keyof typeof sizeMap] || sizeMap.lg;

		return this.buildPanelClasses([
			"w-full",
			"h-full",
			"max-h-[100dvh]",
			"rounded-t-[10px]",
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
			Z_INDEX.modal,
			"flex",
			"flex-col",
			"border border-solid",
			"border-border",
			"bg-background",
			"text-foreground",
			"shadow-lg",
			"overflow-hidden",
		];
		const maxWidthClass = this.maxWidth ? `sm:max-w-[${this.maxWidth}]` : "";

		return cn(...base, ...sizeClasses, maxWidthClass, this.className);
	}

	get bodyWrapperClassName(): string {
		return cn(
			"flex-1 min-h-0 overflow-y-auto px-4 py-6 sm:px-6",
			this.bodyClassName,
		);
	}

	get headerWrapperClassName(): string {
		return cn(
			"flex items-start justify-between gap-3 p-4 sm:p-6 border-b border-border",
			this.headerClassName,
		);
	}

	get footerWrapperClassName(): string {
		const effectiveAlign =
			this.alignFooter === "right" && this.variant === "custom-close"
				? "left"
				: this.alignFooter;

		return cn(
			"p-4 sm:p-6 border-t border-border flex flex-col gap-2",
			effectiveAlign === "full-width"
				? "sm:flex-col"
				: "sm:flex-row sm:items-center",
			effectiveAlign === "left" ? "sm:justify-start" : "",
			effectiveAlign === "right" ? "sm:justify-end" : "",
			this.footerClassName,
		);
	}

	get containerClassName(): string {
		return responsive({
			default: `fixed inset-x-0 bottom-0 ${Z_INDEX.modalBackdrop} flex items-end justify-center`,
			sm: `fixed inset-0 ${Z_INDEX.modalBackdrop} flex items-center justify-center p-4`,
		});
	}
}
