import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export type PdmDatePickerVariant = 'default' | 'with-input' | 'date-time' | 'natural-language';

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

  @Output() openChange = new EventEmitter<boolean>();
  @Output() valueChange = new EventEmitter<string>();

  toggle(): void {
    this.openChange.emit(!this.open);
  }

  selectPreset(value: string): void {
    this.valueChange.emit(value);
  }

  get monthLabel(): string {
    return new Date(this.year, this.month - 1, 1).toLocaleString('en-US', { month: 'short' });
  }
}
