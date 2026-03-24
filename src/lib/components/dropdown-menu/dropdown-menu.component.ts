import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';
import { PdmOverlayOptions } from '../../overlay/pdm-overlay-options';
import { createFlexiblePositionStrategy } from '../../overlay/create-flexible-position-strategy';

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
export class PdmDropdownMenuComponent implements OnDestroy {
  @Input() triggerText = 'Open';
  @Input() variant: PdmDropdownMenuVariant = 'default';
  @Input() items: PdmMenuItem[] = [];
  @Input() closeOnSelect = true;
  /**
   * Additional CSS classes applied to the trigger wrapper element.
   * Preserved for backward compatibility.
   */
  @Input() className = '';
  /**
   * Additional CSS classes applied to the overlay panel.
   * Backward-compatible: mapped to `overlayOptions.panelClass` when `overlayOptions` is not set.
   * When both are supplied, `overlayOptions.panelClass` takes precedence.
   */
  @Input() panelClassName = '';
  /**
   * Optional CDK OverlayConfig overrides.
   * Shallow-merged on top of component defaults — consumer always wins.
   * Providing `positionStrategy` or `scrollStrategy` replaces the component default entirely.
   */
  @Input() overlayOptions?: PdmOverlayOptions;

  @Output() itemSelect = new EventEmitter<string>();
  @Output() itemsChange = new EventEmitter<PdmMenuItem[]>();

  open = false;

  @ViewChild('triggerEl') private triggerRef?: ElementRef<HTMLElement>;
  @ViewChild('panelTemplate') private panelTemplateRef!: any;

  private overlayRef: OverlayRef | null = null;
  private backdropSub: Subscription | null = null;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly cdr: ChangeDetectorRef,
    private readonly overlay: Overlay,
    private readonly viewContainerRef: ViewContainerRef
  ) {}

  ngOnDestroy(): void {
    this.destroyOverlay();
  }

  toggle(): void {
    if (this.open) {
      this.closePanel();
    } else {
      this.openPanel();
    }
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
      this.closePanel();
    }
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.closePanel();
  }

  private openPanel(): void {
    if (this.overlayRef) return;

    const triggerEl = this.triggerRef?.nativeElement;
    if (!triggerEl) return;

    this.open = true;
    this.cdr.markForCheck();

    const positionStrategy = createFlexiblePositionStrategy(
      this.overlay,
      triggerEl,
      8
    );

    // Resolve panelClass: overlayOptions.panelClass wins; otherwise map panelClassName.
    const resolvedPanelClass = this.overlayOptions?.panelClass
      ?? (this.panelClassName ? ['block', this.panelClassName] : ['block']);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      // Consumer overrides are spread last — they win over every default above.
      ...this.overlayOptions,
      // panelClass always overrides last: it already merges panelClassName + overlayOptions.
      panelClass: resolvedPanelClass
    });

    const portal = new TemplatePortal(this.panelTemplateRef, this.viewContainerRef);
    this.overlayRef.attach(portal);

    this.backdropSub = this.overlayRef.outsidePointerEvents().subscribe((event) => {
      const target = event.target as Node;
      if (!triggerEl.contains(target)) {
        this.closePanel();
      }
    });

    this.cdr.markForCheck();
  }

  private closePanel(): void {
    if (!this.overlayRef) return;

    this.open = false;
    this.destroyOverlay();
    this.cdr.markForCheck();
  }

  private destroyOverlay(): void {
    if (this.backdropSub) {
      this.backdropSub.unsubscribe();
      this.backdropSub = null;
    }
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}
