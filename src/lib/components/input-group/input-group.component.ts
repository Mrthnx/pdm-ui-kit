import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pdm-input-group',
  templateUrl: './input-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmInputGroupComponent {
  @Input() id = '';
  @Input() type = 'text';
  @Input() value = '';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() invalid = false;
  @Input() prefixText = '';
  @Input() suffixText = '';
  @Input() prefixIcon = '';
  @Input() suffixIcon = '';
  @Input() buttonText = '';
  @Input() className = '';

  @Output() valueChange = new EventEmitter<string>();
  @Output() buttonClick = new EventEmitter<MouseEvent>();

  onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }

  onButtonClick(event: MouseEvent): void {
    this.buttonClick.emit(event);
  }
}
