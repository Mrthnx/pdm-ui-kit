import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { format as formatDateFns } from 'date-fns';
import { PdmCalendarRange, PdmCalendarVariant } from '../calendar/calendar.component';

let nextDatePickerId = 0;

@Component({
  selector: 'pdm-date-picker',
  templateUrl: './date-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmDatePickerComponent {
  private _value: Date | null = null;
  private _rangeValue: PdmCalendarRange | null = null;
  private _open = false;

  private readonly instanceId = `pdm-date-picker-${++nextDatePickerId}`;
  private triggerFocused = false;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly cdr: ChangeDetectorRef
  ) {}

  @Input() id = '';
  @Input() variant: PdmCalendarVariant | string = 'single';
  @Input() label = '';
  @Input() labelClassName = '';
  @Input() className = '';
  @Input() triggerClassName = '';
  @Input() panelClassName = '';
  @Input() placeholder = 'Pick a date';
  @Input() rangePlaceholder = 'Pick a date range';
  @Input() format = 'MMM d, yyyy';
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
    this._open = !!value;
    this.cdr.markForCheck();
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
          end: this.normalizeDate(value.end)
        }
      : null;
    this.cdr.markForCheck();
  }
  get rangeValue(): PdmCalendarRange | null {
    return this._rangeValue;
  }

  get resolvedVariant(): PdmCalendarVariant {
    return this.variant === 'range' ? 'range' : 'single';
  }

  get triggerId(): string {
    return this.id || `${this.instanceId}-trigger`;
  }

  get panelId(): string {
    return `${this.id || this.instanceId}-panel`;
  }

  get hasSingleValue(): boolean {
    return this.resolvedVariant === 'single' && !!this._value;
  }

  get hasRangeValue(): boolean {
    return this.resolvedVariant === 'range' && !!this._rangeValue?.start;
  }

  get displayText(): string {
    if (this.resolvedVariant === 'single') {
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
    const hasValue = this.resolvedVariant === 'single' ? this.hasSingleValue : this.hasRangeValue;
    return [
      'min-w-0 flex-1 truncate text-left text-sm leading-5',
      hasValue ? 'text-foreground' : 'text-muted-foreground'
    ];
  }

  get rootClasses(): string[] {
    return [
      'grid gap-2',
      this.resolvedVariant === 'range' ? 'w-[280px]' : 'w-[197px]',
      this.className
    ];
  }

  get triggerClasses(): string[] {
    const focusStyle = this.open || this.triggerFocused;

    return [
      'relative flex w-full items-center gap-2 overflow-hidden rounded-lg border px-3 py-[7.5px] text-left shadow-xs outline-none transition-colors',
      'min-h-[36px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      focusStyle
        ? 'bg-accent border-neutral-400 ring-3 ring-neutral-300'
        : 'bg-input border-input',
      this.invalid ? 'border-destructive ring-destructive/20' : '',
      this.triggerClassName
    ];
  }

  get panelClasses(): string[] {
    return [
      'absolute left-0 top-full z-30 mt-2',
      this.panelClassName
    ];
  }

  toggleOpen(): void {
    if (this.disabled || this.readonly) {
      return;
    }

    this.setOpen(!this.open);
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
          end: this.normalizeDate(value.end)
        }
      : null;

    this.rangeValueChange.emit(
      this._rangeValue
        ? {
            start: this._rangeValue.start ? this.cloneDate(this._rangeValue.start) : null,
            end: this._rangeValue.end ? this.cloneDate(this._rangeValue.end) : null
          }
        : null
    );

    if (this.closeOnSelect && this._rangeValue?.start && this._rangeValue?.end) {
      this.setOpen(false);
      return;
    }

    this.cdr.markForCheck();
  }

  onCalendarMonthChange(month: Date): void {
    this.monthChange.emit(this.cloneDate(month));
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) {
      this.setOpen(false);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.open) {
      return;
    }

    const target = event.target as Node | null;
    if (target && !this.elementRef.nativeElement.contains(target)) {
      this.setOpen(false);
    }
  }

  private setOpen(nextOpen: boolean): void {
    if (this._open === nextOpen) {
      return;
    }

    this._open = nextOpen;
    this.openChange.emit(this._open);
    this.cdr.markForCheck();
  }

  private formatDate(date: Date): string {
    try {
      return formatDateFns(date, this.format || 'MMM d, yyyy');
    } catch {
      return formatDateFns(date, 'MMM d, yyyy');
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
