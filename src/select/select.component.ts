import {
	AfterContentInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ContentChildren,
	DoCheck,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnDestroy,
	Output,
	QueryList,
	ViewChild,
	ViewContainerRef,
} from "@angular/core";
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import { Subscription } from "rxjs";
import { PdmSelectOptionDirective } from "./select-option.directive";
import { PdmOverlayOptions } from "pdm-ui-kit/src/overlay";
import { createFlexiblePositionStrategy } from "pdm-ui-kit/src/overlay";
import { Z_INDEX } from "pdm-ui-kit/src/utils";

export interface PdmSelectOption {
	label: string;
	value: string;
	disabled?: boolean;
}

@Component({
	selector: "pdm-select",
	templateUrl: "./select.component.html",
	styles: [":host { display: block; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdmSelectComponent implements AfterContentInit, DoCheck, OnDestroy {
	@Input() id = "";
	@Input() value = "";
	@Input()
	set options(value: PdmSelectOption[] | null | undefined) {
		this.inputOptions = value ?? [];
		this.cdr.markForCheck();
	}
	get options(): PdmSelectOption[] {
		return this.inputOptions;
	}
	@Input() disabled = false;
	@Input() invalid = false;
	@Input() className = "";
	@Input() placeholder = "Select an option";
	/**
	 * Optional CDK OverlayConfig overrides.
	 * Shallow-merged on top of component defaults — consumer always wins.
	 * Providing `positionStrategy` or `scrollStrategy` replaces the component default entirely.
	 */
	@Input() overlayOptions?: PdmOverlayOptions;

	open = false;

	@Output() valueChange = new EventEmitter<string>();

	@ViewChild("triggerEl") private triggerRef?: ElementRef<HTMLElement>;
	@ViewChild("panelTemplate") private panelTemplateRef!: any;

	/** Collects any `<pdm-select-option>` children projected into this component. */
	@ContentChildren(PdmSelectOptionDirective)
	private projectedOptions!: QueryList<PdmSelectOptionDirective>;

	private overlayRef: OverlayRef | null = null;
	private backdropSub: Subscription | null = null;
	private projectedOptionsSub: Subscription | null = null;
	private inputOptions: PdmSelectOption[] = [];
	private readonly projectedOptionCache = new WeakMap<
		PdmSelectOptionDirective,
		PdmSelectOption
	>();
	private readonly cachedProjectedOptions: PdmSelectOption[] = [];

	constructor(
		private readonly cdr: ChangeDetectorRef,
		private readonly overlay: Overlay,
		private readonly viewContainerRef: ViewContainerRef,
	) {}

	ngAfterContentInit(): void {
		this.syncProjectedOptions();
		// Re-render when projected options change (e.g. *ngFor on pdm-select-option).
		this.projectedOptionsSub = this.projectedOptions.changes.subscribe(() => {
			this.syncProjectedOptions();
			this.cdr.markForCheck();
		});
	}

	ngDoCheck(): void {
		this.syncProjectedOptions();
	}

	ngOnDestroy(): void {
		if (this.projectedOptionsSub) {
			this.projectedOptionsSub.unsubscribe();
			this.projectedOptionsSub = null;
		}
		this.destroyOverlay();
	}

	/**
	 * Returns the effective list of options.
	 * Projected `<pdm-select-option>` children take priority over the `[options]` input.
	 * Falls back to `[options]` when no children are projected.
	 */
	get resolvedOptions(): PdmSelectOption[] {
		if (this.projectedOptions && this.projectedOptions.length > 0) {
			return this.cachedProjectedOptions;
		}
		return this.inputOptions;
	}

	get selectedOption(): PdmSelectOption | undefined {
		return this.resolvedOptions.find((option) => option.value === this.value);
	}

	get selectedLabel(): string {
		return this.selectedOption?.label || this.placeholder;
	}

	toggle(): void {
		if (this.disabled) return;
		if (this.open) {
			this.closePanel();
		} else {
			this.openPanel();
		}
	}

	onChange(event: Event): void {
		this.valueChange.emit((event.target as HTMLSelectElement).value);
	}

	selectOption(option: PdmSelectOption): void {
		if (option.disabled) return;
		this.valueChange.emit(option.value);
		this.closePanel();
	}

	trackByOptionValue = (index: number, option: PdmSelectOption): string => {
		return this.optionKey(option, index);
	};

	@HostListener("document:keydown.escape")
	onEscape(): void {
		if (this.open) {
			this.closePanel();
		}
	}

	private syncProjectedOptions(): void {
		if (!this.projectedOptions || this.projectedOptions.length === 0) {
			if (this.cachedProjectedOptions.length > 0) {
				this.cachedProjectedOptions.length = 0;
			}
			return;
		}

		let index = 0;
		this.projectedOptions.forEach((directive) => {
			let option = this.projectedOptionCache.get(directive);
			if (!option) {
				option = {
					label: directive.resolvedLabel,
					value: directive.value,
					disabled: directive.disabled,
				};
				this.projectedOptionCache.set(directive, option);
			}

			option.label = directive.resolvedLabel;
			option.value = directive.value;
			option.disabled = directive.disabled;
			this.cachedProjectedOptions[index] = option;
			index += 1;
		});

		if (this.cachedProjectedOptions.length !== index) {
			this.cachedProjectedOptions.length = index;
		}
	}

	private optionKey(option: PdmSelectOption | null | undefined, index: number): string {
		const value = option?.value;
		return value == null ? `index:${index}` : `value:${String(value)}`;
	}

	private openPanel(): void {
		if (this.overlayRef) return;

		const triggerEl = this.triggerRef?.nativeElement;
		if (!triggerEl) return;

		this.open = true;
		this.cdr.markForCheck();

		const positionStrategy = createFlexiblePositionStrategy(
			this.overlay,
			triggerEl,
			4,
		);

		this.overlayRef = this.overlay.create({
			// CRÍTICO: z-[70] para aparecer SOBRE modals (z-[60])
			// panelClass se aplica al cdk-overlay-pane wrapper
			panelClass: [Z_INDEX.popover],
			positionStrategy,
			scrollStrategy: this.overlay.scrollStrategies.reposition(),
			width: triggerEl.offsetWidth,
			// Consumer overrides are spread last — they win over every default above.
			...this.overlayOptions,
		});

		const portal = new TemplatePortal(
			this.panelTemplateRef,
			this.viewContainerRef,
		);
		this.overlayRef.attach(portal);

		this.backdropSub = this.overlayRef
			.outsidePointerEvents()
			.subscribe((event) => {
				const target = event.target as Node;
				if (!triggerEl.contains(target)) {
					this.closePanel();
				}
			});

		this.cdr.markForCheck();
	}

	private closePanel(): void {
		if (!this.overlayRef) return;

		this.open = false;
		this.destroyOverlay();
		this.cdr.markForCheck();
	}

	private destroyOverlay(): void {
		if (this.backdropSub) {
			this.backdropSub.unsubscribe();
			this.backdropSub = null;
		}
		if (this.overlayRef) {
			this.overlayRef.dispose();
			this.overlayRef = null;
		}
	}
}
