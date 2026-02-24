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

export interface PdmSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  selector: 'pdm-select',
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmSelectComponent {
  @Input() id = '';
  @Input() value = '';
  @Input() options: PdmSelectOption[] = [];
  @Input() disabled = false;
  @Input() invalid = false;
  @Input() className = '';
  @Input() placeholder = 'Select an option';

  open = false;
  panelPlacement: 'top' | 'bottom' = 'bottom';
  panelMaxHeightPx: number | null = null;

  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('triggerEl') private triggerRef?: ElementRef<HTMLElement>;
  @ViewChild('panelEl') private panelRef?: ElementRef<HTMLElement>;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly cdr: ChangeDetectorRef
  ) {}

  get selectedOption(): PdmSelectOption | undefined {
    return this.options.find((option) => option.value === this.value);
  }

  get selectedLabel(): string {
    return this.selectedOption?.label || this.placeholder;
  }

  get panelClasses(): string[] {
    return [
      'absolute left-0 z-50 w-full overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md',
      this.panelPlacement === 'top' ? 'bottom-[calc(100%+4px)]' : 'top-[calc(100%+4px)]'
    ];
  }

  toggle(): void {
    if (this.disabled) return;
    this.open = !this.open;

    if (this.open) {
      this.schedulePanelPlacementUpdate();
      return;
    }

    this.panelPlacement = 'bottom';
    this.panelMaxHeightPx = null;
  }

  onChange(event: Event): void {
    this.valueChange.emit((event.target as HTMLSelectElement).value);
  }

  selectOption(option: PdmSelectOption): void {
    if (option.disabled) return;
    this.valueChange.emit(option.value);
    this.open = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.open) return;
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.open = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.open = false;
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

    const triggerEl = this.triggerRef?.nativeElement;
    const panelEl = this.panelRef?.nativeElement;
    if (!triggerEl || !panelEl || typeof window === 'undefined') {
      return;
    }

    const viewportHeight = window.innerHeight;
    const gap = 4;
    const triggerRect = triggerEl.getBoundingClientRect();
    const panelHeight = panelEl.offsetHeight;
    const spaceBelow = Math.max(0, viewportHeight - triggerRect.bottom - gap);
    const spaceAbove = Math.max(0, triggerRect.top - gap);
    const nextPlacement: 'top' | 'bottom' =
      spaceBelow < panelHeight && spaceAbove > spaceBelow ? 'top' : 'bottom';
    const availableHeight = nextPlacement === 'top' ? spaceAbove : spaceBelow;

    this.panelPlacement = nextPlacement;
    this.panelMaxHeightPx = Math.max(120, Math.min(384, Math.floor(availableHeight)));
    this.cdr.markForCheck();
  }
}
