import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export interface PdmSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  selector: 'pdm-select',
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmSelectComponent {
  @Input() id = '';
  @Input() value = '';
  @Input() options: PdmSelectOption[] = [];
  @Input() disabled = false;
  @Input() invalid = false;
  @Input() className = '';

  @Output() valueChange = new EventEmitter<string>();

  onChange(event: Event): void {
    this.valueChange.emit((event.target as HTMLSelectElement).value);
  }
}
