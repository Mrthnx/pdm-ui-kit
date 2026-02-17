import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export interface PdmRadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  selector: 'pdm-radio-group',
  templateUrl: './radio-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmRadioGroupComponent {
  @Input() name = 'pdm-radio-group';
  @Input() value = '';
  @Input() options: PdmRadioOption[] = [];
  @Input() direction: 'vertical' | 'horizontal' = 'vertical';
  @Input() className = '';

  @Output() valueChange = new EventEmitter<string>();

  optionId(option: PdmRadioOption): string {
    return `${this.name}-${option.value}`;
  }

  onChange(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }
}
