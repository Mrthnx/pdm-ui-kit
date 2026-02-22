import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

export type PdmDatePickerVariant = 'default' | 'with-input' | 'date-time' | 'natural-language' | 'range';

@Component({
  selector: 'pdm-date-picker',
  templateUrl: './date-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmDatePickerComponent {
  @Input() variant: PdmDatePickerVariant = 'default';
  @Input() className = '';
  @Input() open = false;

  @Input() label = 'Date of Birth';
  @Input() value = 'Select a date';
  @Input() month = 6;
  @Input() year = 2025;
  @Input() selectedDay = 25;
  @Input() time = '10:30:00';
  @Input() naturalLanguageValue = 'In 2 days';
  @Input() naturalLanguageHint = 'Your post will be published on June 21, 2025.';
  @Input() closeOnSelect = true;
  @Input() rangeStartValue = 'Jan 20, 2026';
  @Input() rangeEndValue = 'Feb 09, 2026';

  @Output() openChange = new EventEmitter<boolean>();
  @Output() valueChange = new EventEmitter<string>();

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  toggle(): void {
    this.open = !this.open;
    this.openChange.emit(this.open);
  }

  close(): void {
    if (!this.open) return;
    this.open = false;
    this.openChange.emit(false);
  }

  selectPreset(value: string): void {
    this.value = value;
    this.valueChange.emit(value);
  }

  get displayValue(): string {
    if (this.variant === 'natural-language') {
      return this.naturalLanguageValue;
    }

    if (this.variant === 'range') {
      return `${this.rangeStartValue} - ${this.rangeEndValue}`;
    }

    return this.value;
  }

  onCalendarDateSelect(date: Date): void {
    const formatted = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);

    this.value = formatted;
    this.month = date.getMonth() + 1;
    this.year = date.getFullYear();
    this.selectedDay = date.getDate();
    this.valueChange.emit(formatted);

    if (this.closeOnSelect && this.variant !== 'date-time' && this.variant !== 'range') {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.close();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.open) return;
    const target = event.target as Node | null;
    if (target && !this.elementRef.nativeElement.contains(target)) {
      this.close();
    }
  }
}
