import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PdmMenuItem } from '../dropdown-menu/dropdown-menu.component';

export interface PdmMenubarItem {
  label: string;
  items: PdmMenuItem[];
}

@Component({
  selector: 'pdm-menubar',
  templateUrl: './menubar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmMenubarComponent {
  @Input() menus: PdmMenubarItem[] = [];
  @Input() className = '';
  @Output() itemSelect = new EventEmitter<string>();

  openIndex = -1;

  toggle(index: number): void {
    this.openIndex = this.openIndex === index ? -1 : index;
  }

  select(value: string): void {
    this.itemSelect.emit(value);
    this.openIndex = -1;
  }

  selectItem(item: PdmMenuItem): void {
    if (item.disabled || !item.value) {
      return;
    }

    this.select(item.value);
  }
}
