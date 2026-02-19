import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

export interface PdmTabItem {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  selector: 'pdm-tabs',
  templateUrl: './tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmTabsComponent {
  constructor(private readonly cdr: ChangeDetectorRef) {}

  @Input() items: PdmTabItem[] = [];
  @Input() value = '';
  @Input() className = '';

  @Output() valueChange = new EventEmitter<string>();

  select(item: PdmTabItem): void {
    if (!item.disabled) {
      this.value = item.value;
      this.valueChange.emit(item.value);
      this.cdr.markForCheck();
    }
  }
}
