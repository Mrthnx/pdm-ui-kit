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
export class PdmSelectComponent implements OnDestroy {
  @Input() id = '';
  @Input() value = '';
  @Input() options: PdmSelectOption[] = [];
  @Input() disabled = false;
  @Input() invalid = false;
  @Input() className = '';
  @Input() placeholder = 'Select an option';

  open = false;

  @Output() valueChange = new EventEmitter<string>();

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

  get selectedOption(): PdmSelectOption | undefined {
    return this.options.find((option) => option.value === this.value);
  }

  get selectedLabel(): string {
    return this.selectedOption?.label || this.placeholder;
  }

  toggle(): void {
    if (this.disabled) return;
    if (this.open) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }

  onChange(event: Event): void {
    this.valueChange.emit((event.target as HTMLSelectElement).value);
  }

  selectOption(option: PdmSelectOption): void {
    if (option.disabled) return;
    this.valueChange.emit(option.value);
    this.closePanel();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closePanel();
  }

  private openPanel(): void {
    if (this.overlayRef) return;

    const triggerEl = this.triggerRef?.nativeElement;
    if (!triggerEl) return;

    this.open = true;
    this.cdr.markForCheck();

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(triggerEl)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 4
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetY: -4
        }
      ])
      .withFlexibleDimensions(false)
      .withPush(true);

    this.overlayRef = this.overlay.create({
      panelClass: 'block w-full',
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      width: triggerEl.offsetWidth
    });

    const portal = new TemplatePortal(
      this.panelTemplateRef,
      this.viewContainerRef
    );
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
