import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import type { PdmIconName } from '../icon/icon.component';

export interface PdmCommandItem {
  label: string;
  value: string;
  group?: string;
  icon?: PdmIconName;
  shortcut?: string;
  disabled?: boolean;
}

@Component({
  selector: 'pdm-command',
  templateUrl: './command.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmCommandComponent {
  @Input() open = true;
  @Input() hintLabel = 'Press';
  @Input() hintKey = 'J';
  @Input() placeholder = 'Type a command or search...';
  @Input() emptyMessage = 'No results found.';
  @Input() items: PdmCommandItem[] = [
    { label: 'Calendar', value: 'calendar', group: 'Suggestions', icon: 'calendar' },
    { label: 'Search emoji', value: 'emoji', group: 'Suggestions', icon: 'smile' },
    { label: 'Calculator', value: 'calculator', group: 'Suggestions', icon: 'calculator', disabled: true },
    { label: 'Profile', value: 'profile', group: 'Settings', icon: 'user', shortcut: '⌘P' },
    { label: 'Billing', value: 'billing', group: 'Settings', icon: 'credit-card', shortcut: '⌘B' },
    { label: 'Settings', value: 'settings', group: 'Settings', icon: 'settings', shortcut: '⌘S' }
  ];
  @Input() className = '';

  @Output() itemSelect = new EventEmitter<string>();
  @Output() openChange = new EventEmitter<boolean>();

  query = '';

  get filteredItems(): PdmCommandItem[] {
    const q = this.query.toLowerCase().trim();
    if (!q) return this.items;
    return this.items.filter((item) => item.label.toLowerCase().includes(q));
  }

  get groupedItems(): { name: string; items: PdmCommandItem[] }[] {
    const map = new Map<string, PdmCommandItem[]>();
    for (const item of this.filteredItems) {
      const key = item.group || '';
      const arr = map.get(key) ?? [];
      arr.push(item);
      map.set(key, arr);
    }
    return Array.from(map.entries()).map(([name, items]) => ({ name, items }));
  }

  onQueryChange(event: Event): void {
    this.query = (event.target as HTMLInputElement).value;
  }

  toggleOpen(): void {
    this.openChange.emit(!this.open);
  }

  select(value: string): void {
    this.itemSelect.emit(value);
  }
}
