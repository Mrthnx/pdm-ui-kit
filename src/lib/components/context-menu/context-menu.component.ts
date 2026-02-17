import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { PdmMenuItem } from '../dropdown-menu/dropdown-menu.component';

export interface PdmContextMenuItem extends PdmMenuItem {
  checked?: boolean;
  selectedDot?: boolean;
}

@Component({
  selector: 'pdm-context-menu',
  templateUrl: './context-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmContextMenuComponent {
  @Input() items: PdmContextMenuItem[] = [
    { type: 'item', label: 'Back', value: 'back', inset: true, shortcut: '⌘[' },
    { type: 'item', label: 'Forward', value: 'forward', inset: true, shortcut: '⌘]', disabled: true },
    { type: 'item', label: 'Reload', value: 'reload', inset: true, shortcut: '⌘R' },
    { type: 'item', label: 'More Tools', value: 'more-tools', inset: true, showChevron: true },
    { type: 'separator' },
    { type: 'item', label: 'Show Bookmarks Bar', value: 'show-bookmarks', checked: true },
    { type: 'item', label: 'Show Full URLs', value: 'show-urls', inset: true },
    { type: 'separator' },
    { type: 'label', label: 'People' },
    { type: 'separator' },
    { type: 'item', label: 'Pedro Duarte', value: 'pedro', selectedDot: true },
    { type: 'item', label: 'Colm Tuite', value: 'colm', inset: true }
  ];
  @Input() className = '';
  @Input() triggerLabel = 'Right click here';
  @Input() width = 300;
  @Input() height = 150;
  @Output() itemSelect = new EventEmitter<string>();

  open = false;
  x = 0;
  y = 0;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.x = event.clientX;
    this.y = event.clientY;
    this.open = true;
  }

  select(item: PdmContextMenuItem): void {
    if (item.disabled || item.type === 'separator' || item.type === 'label' || !item.value) return;
    this.itemSelect.emit(item.value);
    this.open = false;
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
