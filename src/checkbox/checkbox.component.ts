import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { PdmControlValueAccessor } from 'pdm-ui-kit/src/utils';

export type PdmCheckboxVariant = 'default' | 'subtext' | 'card';

@Component({
  selector: 'pdm-checkbox',
  templateUrl: './checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PdmCheckboxComponent),
      multi: true
    }
  ]
})
export class PdmCheckboxComponent extends PdmControlValueAccessor<boolean> {
  @Input() id = '';
  @Input() checked = false;
  @Input() disabled = false;
  @Input() variant: PdmCheckboxVariant = 'default';
  @Input() label = 'Accept terms and conditions';
  @Input() description = '';
  @Input() className = '';

  @Output() checkedChange = new EventEmitter<boolean>();

  get hasDescription(): boolean {
    return this.variant === 'subtext' || this.variant === 'card' ? !!this.description : false;
  }

  onToggle(): void {
    if (this.disabled) {
      return;
    }

    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
    this.notifyValueChange(this.checked);
    this.formCdr.markForCheck();
  }

  onBlur(): void {
    this.notifyTouched();
  }

  /** Writes the model value into the component without emitting back to the model. */
  protected applyValue(value: boolean | null): void {
    this.checked = !!value;
  }

  /** Applies the model disabled state to the component. */
  protected applyDisabled(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
