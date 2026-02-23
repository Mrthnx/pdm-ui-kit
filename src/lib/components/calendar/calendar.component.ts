import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

export type PdmCalendarVariant = 'single' | 'range';

export interface PdmCalendarRange {
  start: Date | null;
  end: Date | null;
}

interface PdmCalendarCell {
  date: Date;
  label: number;
  muted: boolean;
  disabled: boolean;
  selected: boolean;
  inRange: boolean;
  rangeFill: boolean;
  rangeLeftCap: boolean;
  rangeRightCap: boolean;
}

interface PdmCalendarMonthView {
  date: Date;
  title: string;
  titleStyle: 'dropdowns' | 'plain';
  dropdownMonth?: string;
  dropdownYear?: string;
  showPrevButton: boolean;
  showNextButton: boolean;
  weeks: readonly (readonly PdmCalendarCell[])[];
}

const DEFAULT_VIEW_MONTH = new Date();
const DAY_MS = 24 * 60 * 60 * 1000;

@Component({
  selector: 'pdm-calendar',
  templateUrl: './calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmCalendarComponent {
  private _value: Date | null = null;
  private _rangeValue: PdmCalendarRange | null = null;
  private _month: Date | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  @Input() variant: PdmCalendarVariant | string = 'single';
  @Input() className = '';
  @Input() disabledDates: Date[] = [];
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() minYear: number | null = null;
  @Input() maxYear: number | null = null;
  @Input() isDateDisabled: ((date: Date) => boolean) | null = null;
  @Input() allowSameDayRange = true;
  @Input() readonly = false;

  @Output() valueChange = new EventEmitter<Date | null>();
  @Output() rangeValueChange = new EventEmitter<PdmCalendarRange | null>();
  @Output() monthChange = new EventEmitter<Date>();
  @Output() dateClick = new EventEmitter<Date>();
  @Output() disabledDateClick = new EventEmitter<Date>();

  @Input()
  set value(value: Date | null) {
    this._value = this.normalizeDate(value);
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
  }
  get rangeValue(): PdmCalendarRange | null {
    return this._rangeValue;
  }

  @Input()
  set month(value: Date | null) {
    this._month = value ? this.startOfMonth(value) : null;
  }
  get month(): Date | null {
    return this._month;
  }

  readonly weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;
  readonly monthOptions = [
    { value: 0, label: 'Jan' },
    { value: 1, label: 'Feb' },
    { value: 2, label: 'Mar' },
    { value: 3, label: 'Apr' },
    { value: 4, label: 'May' },
    { value: 5, label: 'Jun' },
    { value: 6, label: 'Jul' },
    { value: 7, label: 'Aug' },
    { value: 8, label: 'Sep' },
    { value: 9, label: 'Oct' },
    { value: 10, label: 'Nov' },
    { value: 11, label: 'Dec' }
  ] as const;

  get resolvedVariant(): PdmCalendarVariant {
    return this.variant === 'range' ? 'range' : 'single';
  }

  get visibleMonths(): readonly PdmCalendarMonthView[] {
    const baseMonth = this.getAnchorMonth();

    if (this.resolvedVariant === 'single') {
      return [
        {
          date: baseMonth,
          title: this.formatMonthYear(baseMonth),
          titleStyle: 'dropdowns',
          dropdownMonth: this.formatMonthShort(baseMonth),
          dropdownYear: String(baseMonth.getFullYear()),
          showPrevButton: true,
          showNextButton: true,
          weeks: this.buildMonthWeeks(baseMonth, false)
        }
      ];
    }

    const nextMonth = this.addMonths(baseMonth, 1);
    return [
      {
        date: baseMonth,
        title: this.formatMonthYear(baseMonth),
        titleStyle: 'plain',
        showPrevButton: true,
        showNextButton: false,
        weeks: this.buildMonthWeeks(baseMonth, true)
      },
      {
        date: nextMonth,
        title: this.formatMonthYear(nextMonth),
        titleStyle: 'plain',
        showPrevButton: false,
        showNextButton: true,
        weeks: this.buildMonthWeeks(nextMonth, true)
      }
    ];
  }

  get singleHeaderMonth(): number {
    return this.getAnchorMonth().getMonth();
  }

  get singleHeaderYear(): number {
    return this.getAnchorMonth().getFullYear();
  }

  get yearOptions(): readonly number[] {
    const currentYear = this.singleHeaderYear;
    let minYear = this.minYear ?? (this.minDate ? this.minDate.getFullYear() : currentYear - 100);
    let maxYear = this.maxYear ?? (this.maxDate ? this.maxDate.getFullYear() : currentYear + 10);
    const years: number[] = [];

    if (minYear > maxYear) {
      const nextMin = maxYear;
      maxYear = minYear;
      minYear = nextMin;
    }

    for (let year = minYear; year <= maxYear; year += 1) {
      years.push(year);
    }

    return years;
  }

  get rootClasses(): string[] {
    return [
      'border-border bg-background relative rounded-[10px] border p-3 shadow-sm',
      this.resolvedVariant === 'range'
        ? 'inline-flex items-start justify-center gap-4 shrink-0 grow-0 basis-auto'
        : 'inline-flex flex-col gap-4 shrink-0 grow-0 basis-auto',
      this.className
    ];
  }

  get rootStyle(): Record<string, string> {
    const width = this.resolvedVariant === 'range' ? '488px' : '250px';

    return {
      width,
      minWidth: width,
      maxWidth: width,
      minHeight: '293px',
      flex: '0 0 auto',
      alignSelf: 'flex-start'
    };
  }

  monthPanelClasses(_index: number): string[] {
    return ['flex flex-col items-start', this.resolvedVariant === 'range' ? 'w-[224px] gap-4' : 'w-full gap-0'];
  }

  headerClasses(month: PdmCalendarMonthView): string[] {
    return ['flex w-full items-center justify-between', month.titleStyle === 'dropdowns' ? '' : 'mb-4'];
  }

  navButtonClasses(): string[] {
    return [
      'flex h-8 w-8 items-center justify-center rounded-md text-foreground',
      'disabled:pointer-events-none disabled:opacity-40'
    ];
  }

  navPlaceholderClasses(): string[] {
    return ['h-7 w-7 shrink-0'];
  }

  dropdownWrapClasses(): string[] {
    return ['flex w-40 items-center justify-center gap-2'];
  }

  dropdownClasses(widthClass: string): string[] {
    return ['flex h-8 items-center justify-center gap-1 px-1', widthClass];
  }

  dropdownSelectClasses(): string[] {
    return [
      'text-foreground h-full bg-transparent text-sm font-medium leading-5',
      'appearance-none border-0 outline-none ring-0 focus:outline-none focus:ring-0 text-center cursor-pointer'
    ];
  }

  get dropdownSelectStyle(): Record<string, string> {
    return {
      appearance: 'none',
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      background: 'transparent',
      border: '0',
      boxShadow: 'none',
      outline: '0',
      padding: '0',
      margin: '0'
    };
  }

  calendarGridWrapClasses(): string[] {
    return ['flex w-full flex-col items-start'];
  }

  weekdayRowClasses(): string[] {
    return ['flex w-full items-center'];
  }

  weekdayCellClasses(): string[] {
    return ['text-muted-foreground flex h-[21px] w-8 items-center justify-center rounded-md text-xs leading-4'];
  }

  weekRowClasses(): string[] {
    return ['flex w-full items-start pt-2'];
  }

  dayCellClasses(cell: PdmCalendarCell): string[] {
    return [
      'relative flex h-8 w-8 shrink-0 items-center justify-center',
      cell.rangeFill ? 'bg-accent' : '',
      cell.rangeLeftCap ? 'rounded-l-md' : '',
      cell.rangeRightCap ? 'rounded-r-md' : ''
    ];
  }

  dayButtonClasses(cell: PdmCalendarCell): string[] {
    return [
      'relative z-10 flex h-8 w-8 items-center justify-center rounded-md text-sm leading-5',
      cell.selected ? 'bg-primary text-primary-foreground' : cell.rangeFill ? 'text-accent-foreground' : 'text-foreground',
      cell.muted && !cell.rangeFill ? 'opacity-50' : '',
      cell.disabled ? 'cursor-not-allowed opacity-40' : '',
      !cell.disabled && !this.readonly && !cell.selected ? 'hover:bg-accent/70' : ''
    ];
  }

  dayLabelClasses(_cell: PdmCalendarCell): string[] {
    return ['font-normal'];
  }

  trackByIndex = (index: number): number => {
    return index;
  }

  trackByDate = (_index: number, cell: PdmCalendarCell): string => {
    return this.dateKey(cell.date);
  }

  goToPreviousMonth(): void {
    this.setAnchorMonth(this.addMonths(this.getAnchorMonth(), -1));
  }

  goToNextMonth(): void {
    this.setAnchorMonth(this.addMonths(this.getAnchorMonth(), 1));
  }

  onSingleMonthChange(monthValue: string): void {
    const month = Number(monthValue);
    if (Number.isNaN(month) || month < 0 || month > 11) {
      return;
    }

    const anchor = this.getAnchorMonth();
    this.setAnchorMonth(new Date(anchor.getFullYear(), month, 1));
  }

  onSingleYearChange(yearValue: string): void {
    const year = Number(yearValue);
    if (Number.isNaN(year)) {
      return;
    }

    const anchor = this.getAnchorMonth();
    this.setAnchorMonth(new Date(year, anchor.getMonth(), 1));
  }

  onDatePressed(cell: PdmCalendarCell): void {
    const date = this.cloneDate(cell.date);

    if (cell.disabled) {
      this.disabledDateClick.emit(date);
      return;
    }

    if (this.readonly) {
      return;
    }

    this.dateClick.emit(date);

    if (this.resolvedVariant === 'single') {
      this._value = date;
      this.valueChange.emit(this.cloneDate(date));
      this.syncVisibleMonthToDate(date);
      this.cdr.markForCheck();
      return;
    }

    this.handleRangeSelection(date);
    this.cdr.markForCheck();
  }

  private handleRangeSelection(date: Date): void {
    const current = this._rangeValue;
    const currentStart = current?.start ? this.cloneDate(current.start) : null;
    const currentEnd = current?.end ? this.cloneDate(current.end) : null;

    if (!currentStart || (currentStart && currentEnd)) {
      this._rangeValue = { start: date, end: null };
      this.rangeValueChange.emit({ start: this.cloneDate(date), end: null });
      this.syncVisibleMonthToDate(date);
      return;
    }

    if (this.isSameDay(currentStart, date) && !this.allowSameDayRange) {
      this._rangeValue = { start: date, end: null };
      this.rangeValueChange.emit({ start: this.cloneDate(date), end: null });
      return;
    }

    const start = this.compareDate(date, currentStart) < 0 ? date : currentStart;
    const end = this.compareDate(date, currentStart) < 0 ? currentStart : date;

    if (this.rangeContainsBlockedDate(start, end)) {
      this.disabledDateClick.emit(this.cloneDate(date));
      return;
    }

    this._rangeValue = { start, end };
    this.rangeValueChange.emit({ start: this.cloneDate(start), end: this.cloneDate(end) });
    this.syncVisibleMonthToDate(start);
  }

  private buildMonthWeeks(month: Date, includeRange: boolean): readonly (readonly PdmCalendarCell[])[] {
    const firstOfMonth = this.startOfMonth(month);
    const start = this.startOfWeek(firstOfMonth);
    const end = this.endOfWeek(this.endOfMonth(firstOfMonth));
    const weeks: PdmCalendarCell[][] = [];

    let cursor = this.cloneDate(start);
    while (this.compareDate(cursor, end) <= 0) {
      const row: PdmCalendarCell[] = [];

      for (let col = 0; col < 7; col += 1) {
        row.push(this.buildCell(cursor, month, includeRange));
        cursor = this.addDays(cursor, 1);
      }

      weeks.push(row);
    }

    for (const row of weeks) {
      for (let col = 0; col < row.length; col += 1) {
        const cell = row[col];
        if (!cell.inRange) {
          continue;
        }

        const leftInRow = col > 0 ? row[col - 1].inRange : false;
        const rightInRow = col < row.length - 1 ? row[col + 1].inRange : false;

        cell.rangeLeftCap = !leftInRow;
        cell.rangeRightCap = !rightInRow;
      }
    }

    return weeks;
  }

  private buildCell(date: Date, visibleMonth: Date, includeRange: boolean): PdmCalendarCell {
    const normalized = this.cloneDate(date);
    const inCurrentMonth = normalized.getMonth() === visibleMonth.getMonth() && normalized.getFullYear() === visibleMonth.getFullYear();
    const disabled = this.isBlocked(normalized);

    const selectedSingle = this.resolvedVariant === 'single' && !!this._value && this.isSameDay(normalized, this._value);
    const rangeStart = includeRange && !!this._rangeValue?.start && this.isSameDay(normalized, this._rangeValue.start);
    const rangeEnd = includeRange && !!this._rangeValue?.end && this.isSameDay(normalized, this._rangeValue.end);
    const inRange =
      includeRange &&
      !!this._rangeValue?.start &&
      !!this._rangeValue?.end &&
      this.compareDate(normalized, this._rangeValue.start) >= 0 &&
      this.compareDate(normalized, this._rangeValue.end) <= 0;

    return {
      date: normalized,
      label: normalized.getDate(),
      muted: !inCurrentMonth,
      disabled,
      selected: selectedSingle || rangeStart || rangeEnd,
      inRange,
      rangeFill: inRange,
      rangeLeftCap: false,
      rangeRightCap: false
    };
  }

  private getAnchorMonth(): Date {
    if (this._month) {
      return this.cloneDate(this._month);
    }

    if (this.resolvedVariant === 'single' && this._value) {
      return this.startOfMonth(this._value);
    }

    if (this.resolvedVariant === 'range' && this._rangeValue?.start) {
      return this.startOfMonth(this._rangeValue.start);
    }

    return this.startOfMonth(DEFAULT_VIEW_MONTH);
  }

  private setAnchorMonth(month: Date): void {
    this._month = this.startOfMonth(month);
    this.monthChange.emit(this.cloneDate(this._month));
  }

  private syncVisibleMonthToDate(date: Date): void {
    const nextMonth = this.startOfMonth(date);
    if (!this._month || !this.isSameMonth(this._month, nextMonth)) {
      this._month = nextMonth;
      this.monthChange.emit(this.cloneDate(nextMonth));
    }
  }

  private isBlocked(date: Date): boolean {
    if (this.minDate && this.compareDate(date, this.minDate) < 0) {
      return true;
    }

    if (this.maxDate && this.compareDate(date, this.maxDate) > 0) {
      return true;
    }

    const blockedSet = new Set((this.disabledDates || []).map((item) => this.dateKey(item)));
    if (blockedSet.has(this.dateKey(date))) {
      return true;
    }

    return !!this.isDateDisabled?.(this.cloneDate(date));
  }

  private rangeContainsBlockedDate(start: Date, end: Date): boolean {
    let cursor = this.cloneDate(start);

    while (this.compareDate(cursor, end) <= 0) {
      if (this.isBlocked(cursor)) {
        return true;
      }
      cursor = this.addDays(cursor, 1);
    }

    return false;
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

  private startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private endOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  private startOfWeek(date: Date): Date {
    return this.addDays(date, -date.getDay());
  }

  private endOfWeek(date: Date): Date {
    return this.addDays(date, 6 - date.getDay());
  }

  private addMonths(date: Date, months: number): Date {
    return new Date(date.getFullYear(), date.getMonth() + months, 1);
  }

  private addDays(date: Date, days: number): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
  }

  private compareDate(a: Date, b: Date): number {
    return this.dateValue(a) - this.dateValue(b);
  }

  private dateValue(date: Date): number {
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS;
  }

  private isSameDay(a: Date, b: Date): boolean {
    return this.compareDate(a, b) === 0;
  }

  private isSameMonth(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
  }

  private dateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private formatMonthShort(date: Date): string {
    return date.toLocaleString('en-US', { month: 'short' });
  }

  private formatMonthYear(date: Date): string {
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  }
}
