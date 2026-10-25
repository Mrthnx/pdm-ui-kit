import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { PdmControlValueAccessor } from 'pdm-ui-kit/src/utils';

export interface PdmNativeSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  selector: 'pdm-native-select',
  templateUrl: './native-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PdmNativeSelectComponent),
      multi: true
    }
  ]
})
export class PdmNativeSelectComponent extends PdmControlValueAccessor<string> {
  @Input() id = '';
  @Input() value = '';
  @Input() disabled = false;
  @Input() invalid = false;
  @Input() options: PdmNativeSelectOption[] = [];
  @Input() placeholder = 'Select an option';
  @Input() className = '';

  @Output() valueChange = new EventEmitter<string>();

  onChange(event: Event): void {
    const next = (event.target as HTMLSelectElement).value;
    this.value = next;
    this.valueChange.emit(this.value);
    this.notifyValueChange(this.value);
  }

  onBlur(event: FocusEvent): void {
    this.notifyTouched();
  }

  /** Writes the model value into the component without emitting back to the model. */
  protected applyValue(value: string | null): void {
    this.value = value ?? '';
  }

  /** Applies the model disabled state to the component. */
  protected applyDisabled(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
