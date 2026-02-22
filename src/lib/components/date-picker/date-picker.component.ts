import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

export type PdmDatePickerVariant = 'default' | 'with-input' | 'date-time' | 'natural-language' | 'range';

@Component({
  selector: 'pdm-date-picker',
  templateUrl: './date-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmDatePickerComponent implements OnChanges {
  @Input() variant: PdmDatePickerVariant = 'default';
  @Input() className = '';
  @Input() open = false;

  @Input() label = 'Date of Birth';
  @Input() value = 'Select a date';
  @Input() month = 6;
  @Input() year = 2025;
  @Input() selectedDay = 25;
  @Input() time = '10:30:00';
  @Input() endTime = '12:30:00';
  @Input() naturalLanguageValue = 'In 2 days';
  @Input() naturalLanguageHint = 'Your post will be published on June 21, 2025.';
  @Input() closeOnSelect = true;
  @Input() rangeStartValue = 'Jan 20, 2026';
  @Input() rangeEndValue = 'Feb 09, 2026';

  @Output() openChange = new EventEmitter<boolean>();
  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('popupAnchor') popupAnchorRef?: ElementRef<HTMLElement>;
  @ViewChild('popupPanel') popupPanelRef?: ElementRef<HTMLElement>;

  openDirection: 'up' | 'down' = 'down';

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  toggle(): void {
    this.open = !this.open;
    this.openChange.emit(this.open);
    if (this.open) {
      this.schedulePopupPositionUpdate();
    }
  }

  close(): void {
    if (!this.open) return;
    this.open = false;
    this.openDirection = 'down';
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']?.currentValue) {
      this.schedulePopupPositionUpdate();
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

  @HostListener('window:resize')
  @HostListener('window:scroll')
  onViewportChange(): void {
    if (this.open) {
      this.schedulePopupPositionUpdate();
    }
  }

  private schedulePopupPositionUpdate(): void {
    setTimeout(() => this.updatePopupDirection());
  }

  private updatePopupDirection(): void {
    const anchorEl = this.popupAnchorRef?.nativeElement;
    const popupEl = this.popupPanelRef?.nativeElement;

    if (!anchorEl || !popupEl) return;

    const anchorRect = anchorEl.getBoundingClientRect();
    const popupHeight = popupEl.offsetHeight || popupEl.getBoundingClientRect().height;
    const gap = 8;
    const spaceBelow = window.innerHeight - anchorRect.bottom;
    const spaceAbove = anchorRect.top;

    this.openDirection = spaceBelow < popupHeight + gap && spaceAbove > spaceBelow ? 'up' : 'down';
  }
}
