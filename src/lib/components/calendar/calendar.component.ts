import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
export class PdmCalendarComponent {
  @Input() mode: PdmCalendarMode = 'single';
  @Input() month = 6;
  @Input() year = 2025;
  @Input() selectedDay = 25;
  @Input() rangeStartDay = 25;
  @Input() rangeEndDay = 9;
  @Input() className = '';

  readonly weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  get leftMonthName(): string {
    return this.monthName(this.month - 1);
  }

  get rightMonthName(): string {
    const rightMonth = this.month % 12;
    return this.monthName(rightMonth);
  }

  get leftCells(): CalendarCell[] {
    return this.buildMonthCells(this.year, this.month - 1, this.selectedDay, this.mode === 'range' ? this.rangeStartDay : undefined, this.mode === 'range' ? 31 : undefined);
  }

  get rightCells(): CalendarCell[] {
    const rightMonth = this.month % 12;
    const rightYear = this.month === 12 ? this.year + 1 : this.year;
    return this.buildMonthCells(rightYear, rightMonth, this.mode === 'range' ? this.rangeEndDay : undefined, 1, this.mode === 'range' ? this.rangeEndDay : undefined);
  }

  private monthName(monthIndex: number): string {
    const safe = ((monthIndex % 12) + 12) % 12;
    return new Date(this.year, safe, 1).toLocaleString('en-US', { month: 'long' });
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
    const cells: CalendarCell[] = [];

    for (let i = 0; i < 42; i += 1) {
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
}

