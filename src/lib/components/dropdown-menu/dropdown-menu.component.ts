import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

export type PdmDropdownMenuVariant = 'default' | 'checkboxes' | 'radio-group';

export interface PdmMenuItem {
  type?: 'item' | 'label' | 'separator';
  label?: string;
  value?: string;
  shortcut?: string;
  disabled?: boolean;
  inset?: boolean;
  showChevron?: boolean;
  checked?: boolean;
  radioSelected?: boolean;
}

@Component({
  selector: 'pdm-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmDropdownMenuComponent {
  @Input() triggerText = 'Open';
  @Input() variant: PdmDropdownMenuVariant = 'default';
  @Input() items: PdmMenuItem[] = [];
  @Input() closeOnSelect = true;
  @Input() panelClassName = '';
  @Input() className = '';

  @Output() itemSelect = new EventEmitter<string>();
  @Output() itemsChange = new EventEmitter<PdmMenuItem[]>();

  open = false;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  toggle(): void {
    this.open = !this.open;
  }

  get resolvedItems(): PdmMenuItem[] {
    if (this.items.length) {
      return this.items;
    }

    if (this.variant === 'checkboxes') {
      return [
        { type: 'label', label: 'Appearance' },
        { type: 'separator' },
        { type: 'item', label: 'Status Bar', value: 'status-bar', checked: true },
        { type: 'item', label: 'Activity Bar', value: 'activity-bar', checked: false },
        { type: 'item', label: 'Panel', value: 'panel', checked: false }
      ];
    }

    if (this.variant === 'radio-group') {
      return [
        { type: 'label', label: 'Panel Position' },
        { type: 'separator' },
        { type: 'item', label: 'Top', value: 'top', radioSelected: true },
        { type: 'item', label: 'Bottom', value: 'bottom', radioSelected: false },
        { type: 'item', label: 'Right', value: 'right', radioSelected: false }
      ];
    }

    return [
      { type: 'label', label: 'My Account', inset: true },
      { type: 'separator' },
      { type: 'item', label: 'Profile', value: 'profile', shortcut: '⇧⌘P' },
      { type: 'item', label: 'Billing', value: 'billing', shortcut: '⌘B' },
      { type: 'item', label: 'Settings', value: 'settings', shortcut: '⌘S' },
      { type: 'item', label: 'Keyboard shortcuts', value: 'shortcuts', shortcut: '⌘K' },
      { type: 'separator' },
      { type: 'item', label: 'Team', value: 'team' },
      { type: 'item', label: 'Invite users', value: 'invite', showChevron: true },
      { type: 'item', label: 'New Team', value: 'new-team', shortcut: '⌘+T' },
      { type: 'separator' },
      { type: 'item', label: 'GitHub', value: 'github' },
      { type: 'item', label: 'Support', value: 'support' },
      { type: 'item', label: 'API', value: 'api', disabled: true },
      { type: 'separator' },
      { type: 'item', label: 'Log out', value: 'logout', shortcut: '⇧⌘Q' }
    ];
  }

  select(item: PdmMenuItem): void {
    if (item.disabled || item.type === 'separator' || item.type === 'label' || !item.value) return;

    if (this.variant === 'checkboxes') {
      const updated = this.resolvedItems.map((entry) =>
        entry.value === item.value ? { ...entry, checked: !entry.checked } : entry
      );
      this.itemsChange.emit(updated);
    }

    if (this.variant === 'radio-group') {
      const updated = this.resolvedItems.map((entry) =>
        entry.type === 'item'
          ? { ...entry, radioSelected: entry.value === item.value }
          : entry
      );
      this.itemsChange.emit(updated);
    }

    this.itemSelect.emit(item.value);

    const shouldClose = this.variant === 'default' ? this.closeOnSelect : false;
    if (shouldClose) {
      this.open = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.open = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.open) return;
    const target = event.target as Node | null;
    if (target && !this.elementRef.nativeElement.contains(target)) {
      this.open = false;
    }
  }
}
