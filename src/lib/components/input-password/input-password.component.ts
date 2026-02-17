import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PdmInputRoundness, PdmInputSize } from '../input/input.component';

@Component({
  selector: 'pdm-input-password',
  templateUrl: './input-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmInputPasswordComponent {
  @Input() id = '';
  @Input() value = '';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() invalid = false;
  @Input() size: PdmInputSize = 'regular';
  @Input() roundness: PdmInputRoundness = 'default';
  @Input() className = '';
  @Input() inputClassName = '';
  @Input() label = '';
  @Input() helperText = '';
  @Input() errorText = '';

  @Output() valueChange = new EventEmitter<string>();
  @Output() blurred = new EventEmitter<FocusEvent>();

  showPassword = false;

  get inputType(): 'text' | 'password' {
    return this.showPassword ? 'text' : 'password';
  }

  onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }

  onBlur(event: FocusEvent): void {
    this.blurred.emit(event);
  }

  toggleVisibility(): void {
    if (this.disabled) {
      return;
    }

    this.showPassword = !this.showPassword;
  }
}
