import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export type PdmInputSize = 'mini' | 'small' | 'regular' | 'large';
export type PdmInputRoundness = 'default' | 'round';

@Component({
  selector: 'pdm-input',
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmInputComponent {
  @Input() id = '';
  @Input() type = 'text';
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

  onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }

  onBlur(event: FocusEvent): void {
    this.blurred.emit(event);
  }
}
