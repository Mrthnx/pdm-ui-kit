import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'pdm-popover',
  templateUrl: './popover.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmPopoverComponent {
  private _open = false;
  @Input() triggerText = 'Open';
  @Input() className = '';
  @Input() panelClassName = '';
  @Input() showTrigger = true;
  @Output() openChange = new EventEmitter<boolean>();

  panelPlacement: 'top' | 'bottom' = 'bottom';

  @ViewChild('anchorEl') private anchorRef?: ElementRef<HTMLElement>;
  @ViewChild('triggerEl') private triggerRef?: ElementRef<HTMLElement>;
  @ViewChild('panelEl') private panelRef?: ElementRef<HTMLElement>;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly cdr: ChangeDetectorRef
  ) {}

  @Input()
  set open(value: boolean) {
    this._open = !!value;
    if (this._open) {
      this.schedulePanelPlacementUpdate();
    } else {
      this.panelPlacement = 'bottom';
    }
    this.cdr.markForCheck();
  }
  get open(): boolean {
    return this._open;
  }

  get panelClasses(): string[] {
    return [
      this.panelPlacement === 'top'
        ? 'absolute bottom-full left-0 z-30 mb-2 min-w-80 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md'
        : 'absolute left-0 top-full z-30 mt-2 min-w-80 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md',
      this.panelClassName
    ];
  }

  toggle(): void {
    this.open = !this.open;
    this.openChange.emit(this.open);
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.open) {
      this.open = false;
      this.openChange.emit(false);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.open) return;
    const target = event.target as Node | null;
    if (target && !this.elementRef.nativeElement.contains(target)) {
      this.open = false;
      this.openChange.emit(false);
    }
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  onViewportChange(): void {
    this.updatePanelPlacement();
  }

  private schedulePanelPlacementUpdate(): void {
    setTimeout(() => this.updatePanelPlacement());
  }

  private updatePanelPlacement(): void {
    if (!this.open) return;

    const anchorEl = this.triggerRef?.nativeElement || this.anchorRef?.nativeElement;
    const panelEl = this.panelRef?.nativeElement;
    if (!anchorEl || !panelEl || typeof window === 'undefined') {
      return;
    }

    const viewportHeight = window.innerHeight;
    const gap = 8;
    const anchorRect = anchorEl.getBoundingClientRect();
    const panelHeight = panelEl.offsetHeight;
    const spaceBelow = Math.max(0, viewportHeight - anchorRect.bottom - gap);
    const spaceAbove = Math.max(0, anchorRect.top - gap);
    const nextPlacement: 'top' | 'bottom' =
      spaceBelow < panelHeight && spaceAbove > spaceBelow ? 'top' : 'bottom';

    if (this.panelPlacement !== nextPlacement) {
      this.panelPlacement = nextPlacement;
      this.cdr.markForCheck();
    }
  }
}
