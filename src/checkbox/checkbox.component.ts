import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export type PdmCheckboxVariant = 'default' | 'subtext' | 'card';

@Component({
  selector: 'pdm-checkbox',
  templateUrl: './checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmCheckboxComponent {
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

    this.checkedChange.emit(!this.checked);
  }
}
