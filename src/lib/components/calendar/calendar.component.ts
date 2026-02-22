import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

export type PdmCalendarMode = 'single' | 'range';

interface CalendarCell {
  date: Date;
  day: number;
  outside: boolean;
  selected: boolean;
  inRange: boolean;
}

@Component({
  selector: 'pdm-calendar',
  templateUrl: './calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmCalendarComponent implements OnChanges {
  @Input() mode: PdmCalendarMode = 'single';
  @Input() month = 6; // 1-based
  @Input() year = 2025;
  @Input() selectedDay = 25;
  @Input() rangeStartDay = 25;
  @Input() rangeEndDay = 9;
  @Input() className = '';
  @Input() minYear = 2000;
  @Input() maxYear = 2035;

  @Output() monthChange = new EventEmitter<number>();
  @Output() yearChange = new EventEmitter<number>();
  @Output() selectedDayChange = new EventEmitter<number>();
  @Output() dateSelect = new EventEmitter<Date>();

  readonly weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  readonly monthOptions = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  leftCells: CalendarCell[] = [];
  rightCells: CalendarCell[] = [];

  ngOnChanges(_: SimpleChanges): void {
    this.rebuild();
  }

  get yearOptions(): number[] {
    const start = Math.min(this.minYear, this.maxYear);
    const end = Math.max(this.minYear, this.maxYear);
    const years: number[] = [];
    for (let y = start; y <= end; y += 1) years.push(y);
    return years;
  }

  get leftMonthName(): string {
    return this.monthOptions[this.clampMonth(this.month) - 1];
  }

  get rightMonthName(): string {
    const next = this.shiftMonth(this.year, this.month, 1);
    return this.monthOptions[next.month - 1];
  }

  get rightYear(): number {
    return this.shiftMonth(this.year, this.month, 1).year;
  }

  trackByIndex(index: number): number {
    return index;
  }

  previousMonth(): void {
    const next = this.shiftMonth(this.year, this.month, -1);
    this.setMonthYear(next.month, next.year);
  }

  nextMonth(): void {
    const next = this.shiftMonth(this.year, this.month, 1);
    this.setMonthYear(next.month, next.year);
  }

  onMonthSelect(value: string): void {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return;
    this.setMonthYear(this.clampMonth(parsed), this.year);
  }

  onYearSelect(value: string): void {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return;
    this.setMonthYear(this.month, parsed);
  }

  selectCell(cell: CalendarCell, panel: 'left' | 'right' = 'left'): void {
    if (this.mode === 'single') {
      let targetDate = cell.date;

      if (cell.outside) {
        this.setMonthYear(targetDate.getMonth() + 1, targetDate.getFullYear());
        targetDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
      }

      this.selectedDay = targetDate.getDate();
      this.selectedDayChange.emit(this.selectedDay);
      this.dateSelect.emit(new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()));
      this.rebuild();
      return;
    }

    const day = cell.date.getDate();
    if (panel === 'left') {
      this.rangeStartDay = day;
    } else {
      this.rangeEndDay = day;
    }
    this.dateSelect.emit(new Date(cell.date.getFullYear(), cell.date.getMonth(), day));
    this.rebuild();
  }

  private setMonthYear(month: number, year: number): void {
    this.month = this.clampMonth(month);
    this.year = year;
    this.monthChange.emit(this.month);
    this.yearChange.emit(this.year);
    this.rebuild();
  }

  private rebuild(): void {
    const normalizedMonth = this.clampMonth(this.month);
    if (normalizedMonth !== this.month) {
      this.month = normalizedMonth;
    }

    this.leftCells = this.buildMonthCells(
      this.year,
      this.month - 1,
      this.mode === 'single' ? this.selectedDay : undefined,
      this.mode === 'range' ? this.rangeStartDay : undefined,
      this.mode === 'range' ? 31 : undefined
    );

    const right = this.shiftMonth(this.year, this.month, 1);
    this.rightCells = this.buildMonthCells(
      right.year,
      right.month - 1,
      this.mode === 'range' ? this.rangeEndDay : undefined,
      this.mode === 'range' ? 1 : undefined,
      this.mode === 'range' ? this.rangeEndDay : undefined
    );
  }

  private buildMonthCells(
    year: number,
    monthIndex: number,
    selectedDay?: number,
    rangeStartDay?: number,
    rangeEndDay?: number
  ): CalendarCell[] {
    const firstDay = new Date(year, monthIndex, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const totalCells = Math.max(35, Math.ceil((startWeekday + daysInMonth) / 7) * 7);
    const cells: CalendarCell[] = [];

    for (let i = 0; i < totalCells; i += 1) {
      const dayNumber = i - startWeekday + 1;
      const date = new Date(year, monthIndex, dayNumber);
      const outside = dayNumber < 1 || dayNumber > daysInMonth;
      const day = date.getDate();
      const selected = !outside && !!selectedDay && day === selectedDay;
      const inRange = !outside && !!rangeStartDay && !!rangeEndDay && day >= rangeStartDay && day <= rangeEndDay;
      cells.push({ date, day, outside, selected, inRange });
    }

    return cells;
  }

  private shiftMonth(year: number, month: number, offset: number): { month: number; year: number } {
    const base = new Date(year, month - 1 + offset, 1);
    return { month: base.getMonth() + 1, year: base.getFullYear() };
  }

  private clampMonth(month: number): number {
    if (month < 1) return 1;
    if (month > 12) return 12;
    return month;
  }
}
