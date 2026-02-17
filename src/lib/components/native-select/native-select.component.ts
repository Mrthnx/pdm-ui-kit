import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export interface PdmNativeSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  selector: 'pdm-native-select',
  templateUrl: './native-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmNativeSelectComponent {
  @Input() id = '';
  @Input() value = '';
  @Input() disabled = false;
  @Input() invalid = false;
  @Input() options: PdmNativeSelectOption[] = [];
  @Input() placeholder = 'Select an option';
  @Input() className = '';

  @Output() valueChange = new EventEmitter<string>();

  onChange(event: Event): void {
    this.valueChange.emit((event.target as HTMLSelectElement).value);
  }
}
