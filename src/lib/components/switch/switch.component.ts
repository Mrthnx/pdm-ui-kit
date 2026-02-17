import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pdm-switch',
  templateUrl: './switch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmSwitchComponent {
  @Input() id = '';
  @Input() checked = false;
  @Input() disabled = false;
  @Input() label = '';
  @Input() className = '';

  @Output() checkedChange = new EventEmitter<boolean>();

  onToggle(event: Event): void {
    this.checkedChange.emit((event.target as HTMLInputElement).checked);
  }
}
