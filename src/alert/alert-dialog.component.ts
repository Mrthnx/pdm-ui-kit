import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	HostListener,
	Input,
	Output,
} from "@angular/core";
import { cn, responsive, Z_INDEX } from "pdm-ui-kit/src/utils";

type PdmAlertDialogSize =
	| "desktop"
	| "mobile"
	| "mobile-fullscreen"
	| "sm"
	| "md"
	| "lg"
	| "xl"
	| "responsive";

@Component({
	selector: "pdm-alert-dialog",
	templateUrl: "./alert-dialog.component.html",
	styles: [
		`
        /*
         * Custom maxWidth support. See PdmDialogComponent for the full rationale.
         * The consumer value is exposed as the --pdm-alert-dialog-max-width custom
         * property on the panel and applied from this static, component-scoped media
         * query mirroring Tailwind's default sm breakpoint (640px). The marker class
         * is added only when a maxWidth is set, so an empty maxWidth preserves the
         * default size behavior. Component-scoped specificity (0,2,0) beats the
         * Tailwind sm:max-w-* utility (0,1,0), so the custom value wins at sm+.
         */
        @media (min-width: 640px) {
          .pdm-alert-dialog-max-width {
            max-width: var(--pdm-alert-dialog-max-width);
          }
        }
      `,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdmAlertDialogComponent {
	@Input() open = false;
	@Input() showTrigger = false;
	@Input() triggerText = "Show dialog";
	@Input() title = "Are you absolutely sure?";
	@Input() description = "";
	@Input() confirmText = "Continue";
	@Input() cancelText = "Cancel";
	@Input() size: PdmAlertDialogSize = "responsive";
	@Input() maxWidth = "";
	@Input() className = "";
	@Input() bodyClassName = "";
	@Input() showFooter = true;
	@Input() closeOnBackdrop = true;

	/** Close when the ESC key is pressed. Default: `true`. */
	@Input() closeOnEsc = true;

	@Output() openChange = new EventEmitter<boolean>();
	@Output() confirm = new EventEmitter<void>();
	@Output() cancel = new EventEmitter<void>();

	/**
	 * Returns `true` when at least one consumer listens to `openChange`.
	 * - **Controlled** (has observers): parent manages `open` via two-way binding → only emit.
	 * - **Uncontrolled** (no observers): we own the `open` state → mutate it locally.
	 */
	private get isControlled(): boolean {
		return this.openChange.observed;
	}

	/**
	 * Whether a custom `maxWidth` is configured. Drives the template's
	 * `--pdm-alert-dialog-max-width` custom-property binding and
	 * `.pdm-alert-dialog-max-width` marker class (see component styles).
	 * Intentionally kept out of `panelClassName` so it is not processed by
	 * `tailwind-merge`.
	 */
	get hasMaxWidth(): boolean {
		return !!this.maxWidth;
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

	get containerClassName(): string {
		return responsive({
			default: `fixed inset-x-0 bottom-0 ${Z_INDEX.modalBackdrop} flex items-end justify-center`,
			sm: `fixed inset-0 ${Z_INDEX.modalBackdrop} flex items-center justify-center p-4`,
		});
	}

	get bodyWrapperClassName(): string {
		return cn(
			"flex-1 min-h-0 overflow-y-auto px-4 py-4 sm:px-6",
			this.bodyClassName,
		);
	}

	onTriggerClick(): void {
		if (!this.isControlled) {
			this.open = true;
		}
		this.openChange.emit(true);
	}

	onCancel(): void {
		this.cancel.emit();
		if (!this.isControlled) {
			this.open = false;
		}
		this.openChange.emit(false);
	}

	onConfirm(): void {
		this.confirm.emit();
		if (!this.isControlled) {
			this.open = false;
		}
		this.openChange.emit(false);
	}

	onBackdropClick(): void {
		if (this.closeOnBackdrop) {
			this.onCancel();
		}
	}

	@HostListener("document:keydown.escape")
	onEsc(): void {
		if (this.open && this.closeOnEsc) {
			this.onCancel();
		}
	}

	private buildPanelClasses(sizeClasses: string[]): string {
		return cn(
			"relative",
			Z_INDEX.modal,
			"flex flex-col border border-solid border-border bg-background text-foreground shadow-lg overflow-hidden",
			...sizeClasses,
			this.className,
		);
	}
}
