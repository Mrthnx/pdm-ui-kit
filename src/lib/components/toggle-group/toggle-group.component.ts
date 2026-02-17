import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export interface PdmToggleGroupItem {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  selector: 'pdm-toggle-group',
  templateUrl: './toggle-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmToggleGroupComponent {
  @Input() items: PdmToggleGroupItem[] = [];
  @Input() value = '';
  @Input() className = '';

  @Output() valueChange = new EventEmitter<string>();

  onSelect(next: string, disabled?: boolean): void {
    if (!disabled && next !== this.value) {
      this.valueChange.emit(next);
    }
  }
}
