import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	inject,
	Input,
	Output,
} from "@angular/core";

export type PdmSwitchSize = "default" | "sm";

@Component({
	selector: "pdm-switch",
	templateUrl: "./switch.component.html",
	styles: [
		`
			button[data-slot="switch"] {
				background-color: hsl(var(--switch-track-unchecked, var(--input)));
				border-color: hsl(var(--switch-track-border, var(--border)));
				box-shadow: inset 0 0 0 1px hsl(var(--switch-track-border, var(--border)));
			}

			button[data-slot="switch"][data-state="checked"] {
				background-color: hsl(var(--switch-track-checked, var(--primary)));
				border-color: hsl(var(--switch-track-checked, var(--primary)));
				box-shadow: none;
			}

			button[data-slot="switch"]:disabled {
				opacity: var(--switch-disabled-opacity, 0.5);
			}

			span[data-slot="switch-thumb"] {
				background-color: hsl(var(--switch-thumb, var(--background)));
				box-shadow: 0 1px 2px hsl(var(--foreground) / 0.22), 0 0 0 1px hsl(var(--border) / 0.4);
			}

			button[data-slot="switch"][data-state="checked"] span[data-slot="switch-thumb"] {
				background-color: hsl(var(--switch-thumb-checked, var(--background)));
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdmSwitchComponent {
	private readonly cdr = inject(ChangeDetectorRef);

	@Input() id = "";
	@Input() checked = false;
	@Input() disabled = false;
	@Input() label = "";
	@Input() className = "";
	@Input() size: PdmSwitchSize = "default";

	@Output() checkedChange = new EventEmitter<boolean>();

	get rootClasses(): string[] {
		return [
			"peer relative inline-flex appearance-none box-border shrink-0 items-center justify-start rounded-full border border-solid p-0 outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
			this.size === "sm" ? "h-[14px] w-[24px]" : "h-[18.4px] w-[32px]",
			this.checked ? "bg-primary" : "bg-input dark:bg-input/80",
		];
	}

	get thumbClasses(): string[] {
		return [
			"pointer-events-none self-center block shrink-0 rounded-full bg-background ring-0 transition-transform",
			this.size === "sm" ? "size-3" : "size-4",
			this.checked ? "translate-x-[calc(100%-2px)]" : "translate-x-0",
		];
	}

	onToggle(): void {
		if (this.disabled) return;
		const next = !this.checked;
		this.checked = next;
		this.checkedChange.emit(next);
		this.cdr.markForCheck();
	}
}
