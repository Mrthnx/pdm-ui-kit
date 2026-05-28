import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnDestroy,
	Output,
	ViewChild,
	ViewContainerRef,
} from "@angular/core";
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import { Subscription } from "rxjs";
import { format as formatDateFns } from "date-fns";
import {
	PdmCalendarRange,
	PdmCalendarVariant,
} from "../calendar/calendar.component";
import { PdmOverlayOptions } from "../../overlay/pdm-overlay-options";
import { createFlexiblePositionStrategy } from "../../overlay/create-flexible-position-strategy";
import {
	mergeOverlayPanelClass,
	OVERLAY_BASE_Z_INDEX,
} from "../../overlay/z-index-helper";

let nextDatePickerId = 0;

@Component({
	selector: "pdm-date-picker",
	templateUrl: "./date-picker.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdmDatePickerComponent implements OnDestroy {
	private _value: Date | null = null;
	private _rangeValue: PdmCalendarRange | null = null;
	private _open = false;

	private readonly instanceId = `pdm-date-picker-${++nextDatePickerId}`;
	private triggerFocused = false;

	private overlayRef: OverlayRef | null = null;
	private backdropSub: Subscription | null = null;

	@ViewChild("triggerEl") private triggerRef?: ElementRef<HTMLElement>;
	@ViewChild("panelTemplate") private panelTemplateRef!: any;

	constructor(
		private readonly cdr: ChangeDetectorRef,
		private readonly overlay: Overlay,
		private readonly viewContainerRef: ViewContainerRef,
	) {}

	@Input() id = "";
	@Input() variant: PdmCalendarVariant | string = "single";
	@Input() label = "";
	@Input() labelClassName = "";
	@Input() className = "";
	@Input() triggerClassName = "";
	/**
	 * Additional CSS classes applied to the overlay panel.
	 * Backward-compatible: mapped to `overlayOptions.panelClass` when `overlayOptions` is not set.
	 * When both are supplied, `overlayOptions.panelClass` takes precedence.
	 */
	@Input() panelClassName = "";
	/**
	 * Optional CDK OverlayConfig overrides.
	 * Shallow-merged on top of component defaults — consumer always wins.
	 * Providing `positionStrategy` or `scrollStrategy` replaces the component default entirely.
	 */
	@Input() overlayOptions?: PdmOverlayOptions;
	@Input() placeholder = "Pick a date";
	@Input() rangePlaceholder = "Pick a date range";
	@Input() format = "MMM d, yyyy";
	@Input() disabled = false;
	@Input() readonly = false;
	@Input() required = false;
	@Input() invalid = false;
	@Input() allowSameDayRange = true;
	@Input() closeOnSelect = true;
	@Input() minDate: Date | null = null;
	@Input() maxDate: Date | null = null;
	@Input() minYear: number | null = null;
	@Input() maxYear: number | null = null;
	@Input() disabledDates: Date[] = [];
	@Input() isDateDisabled: ((date: Date) => boolean) | null = null;

	@Output() valueChange = new EventEmitter<Date | null>();
	@Output() rangeValueChange = new EventEmitter<PdmCalendarRange | null>();
	@Output() openChange = new EventEmitter<boolean>();
	@Output() monthChange = new EventEmitter<Date>();

	@Input()
	set open(value: boolean) {
		if (this._open === !!value) return;
		if (value) {
			this.openPanel();
		} else {
			this.closePanel();
		}
	}
	get open(): boolean {
		return this._open;
	}

	@Input()
	set value(value: Date | null) {
		this._value = this.normalizeDate(value);
		this.cdr.markForCheck();
	}
	get value(): Date | null {
		return this._value;
	}

	@Input()
	set rangeValue(value: PdmCalendarRange | null) {
		this._rangeValue = value
			? {
					start: this.normalizeDate(value.start),
					end: this.normalizeDate(value.end),
				}
			: null;
		this.cdr.markForCheck();
	}
	get rangeValue(): PdmCalendarRange | null {
		return this._rangeValue;
	}

	ngOnDestroy(): void {
		this.destroyOverlay();
	}

	get resolvedVariant(): PdmCalendarVariant {
		return this.variant === "range" ? "range" : "single";
	}

	get triggerId(): string {
		return this.id || `${this.instanceId}-trigger`;
	}

	get panelId(): string {
		return `${this.id || this.instanceId}-panel`;
	}

	get hasSingleValue(): boolean {
		return this.resolvedVariant === "single" && !!this._value;
	}

	get hasRangeValue(): boolean {
		return this.resolvedVariant === "range" && !!this._rangeValue?.start;
	}

	get displayText(): string {
		if (this.resolvedVariant === "single") {
			return this._value ? this.formatDate(this._value) : this.placeholder;
		}

		const start = this._rangeValue?.start ?? null;
		const end = this._rangeValue?.end ?? null;

		if (!start) {
			return this.rangePlaceholder;
		}

		if (!end) {
			return `${this.formatDate(start)} -`;
		}

		return `${this.formatDate(start)} - ${this.formatDate(end)}`;
	}

	get textClasses(): string[] {
		const hasValue =
			this.resolvedVariant === "single"
				? this.hasSingleValue
				: this.hasRangeValue;
		return [
			"min-w-0 flex-1 truncate text-left text-sm leading-5",
			hasValue ? "text-foreground" : "text-muted-foreground",
		];
	}

	get rootClasses(): string[] {
		return [
			"grid gap-2",
			this.resolvedVariant === "range" ? "w-[280px]" : "w-[197px]",
			this.className,
		];
	}

	get triggerClasses(): string[] {
		const focusStyle = this._open || this.triggerFocused;

		return [
			"border-input focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 aria-invalid:ring-2 aria-invalid:ring-destructive aria-invalid:border-destructive relative flex w-full appearance-none box-border items-center gap-2 overflow-hidden rounded-lg border bg-background px-3 py-[7.5px] text-left text-sm shadow-sm outline-none transition-colors",
			"min-h-[36px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
			focusStyle ? "border-ring ring-2 ring-ring/50" : "",
			this.invalid ? "border-destructive ring-destructive/20" : "",
			this.triggerClassName,
		];
	}

	toggleOpen(): void {
		if (this.disabled || this.readonly) {
			return;
		}

		this.setOpen(!this._open);
	}

	onTriggerFocus(): void {
		this.triggerFocused = true;
		this.cdr.markForCheck();
	}

	onTriggerBlur(): void {
		this.triggerFocused = false;
		this.cdr.markForCheck();
	}

	onCalendarValueChange(value: Date | null): void {
		this._value = this.normalizeDate(value);
		this.valueChange.emit(this._value ? this.cloneDate(this._value) : null);

		if (this.closeOnSelect && this._value) {
			this.setOpen(false);
		} else {
			this.cdr.markForCheck();
		}
	}

	onCalendarRangeValueChange(value: PdmCalendarRange | null): void {
		this._rangeValue = value
			? {
					start: this.normalizeDate(value.start),
					end: this.normalizeDate(value.end),
				}
			: null;

		this.rangeValueChange.emit(
			this._rangeValue
				? {
						start: this._rangeValue.start
							? this.cloneDate(this._rangeValue.start)
							: null,
						end: this._rangeValue.end
							? this.cloneDate(this._rangeValue.end)
							: null,
					}
				: null,
		);

		if (
			this.closeOnSelect &&
			this._rangeValue?.start &&
			this._rangeValue?.end
		) {
			this.setOpen(false);
			return;
		}

		this.cdr.markForCheck();
	}

	onCalendarMonthChange(month: Date): void {
		this.monthChange.emit(this.cloneDate(month));
	}

	@HostListener("document:keydown.escape")
	onEscape(): void {
		if (this._open) {
			this.setOpen(false);
		}
	}

	private setOpen(nextOpen: boolean): void {
		if (this._open === nextOpen) {
			return;
		}

		if (nextOpen) {
			this.openPanel();
		} else {
			this.closePanel();
		}
	}

	private openPanel(): void {
		if (this.overlayRef) return;

		const triggerEl = this.triggerRef?.nativeElement;
		if (!triggerEl) return;

		this._open = true;
		this.openChange.emit(true);
		this.cdr.markForCheck();

		const positionStrategy = createFlexiblePositionStrategy(
			this.overlay,
			triggerEl,
			8,
		);

		// CRITICAL: Use mergeOverlayPanelClass to ensure z-index is never lost.
		// Consumer classes are appended AFTER base z-index.
		const zIndexEnforced = mergeOverlayPanelClass(
			OVERLAY_BASE_Z_INDEX,
			this.panelClassName,
		);

		// Resolve panelClass: overlayOptions.panelClass wins; otherwise use z-index enforced.
		const resolvedPanelClass = this.overlayOptions?.panelClass
			? mergeOverlayPanelClass(
					OVERLAY_BASE_Z_INDEX,
					this.overlayOptions.panelClass,
				)
			: zIndexEnforced;

		this.overlayRef = this.overlay.create({
			positionStrategy,
			scrollStrategy: this.overlay.scrollStrategies.reposition(),
			// Consumer overrides are spread first.
			...this.overlayOptions,
			// panelClass always enforced last to preserve z-index.
			panelClass: resolvedPanelClass,
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
		if (!this.overlayRef && !this._open) return;

		this._open = false;
		this.openChange.emit(false);
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

	private formatDate(date: Date): string {
		try {
			return formatDateFns(date, this.format || "MMM d, yyyy");
		} catch {
			return formatDateFns(date, "MMM d, yyyy");
		}
	}

	private normalizeDate(value: Date | null | undefined): Date | null {
		if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
			return null;
		}

		return new Date(value.getFullYear(), value.getMonth(), value.getDate());
	}

	private cloneDate(date: Date): Date {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	}
}
