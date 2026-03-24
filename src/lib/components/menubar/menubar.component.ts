import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
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
export class PdmMenubarComponent implements OnInit, OnDestroy {
  @Input() menus: PdmMenubarItem[] = [];
  @Input() className = '';
  @Output() itemSelect = new EventEmitter<string>();

  openIndex = -1;

  private boundPointerDown!: (event: PointerEvent) => void;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.boundPointerDown = (event: PointerEvent) => this.onDocumentPointerDown(event);
    document.addEventListener('pointerdown', this.boundPointerDown, { capture: true });
  }

  ngOnDestroy(): void {
    if (this.boundPointerDown) {
      document.removeEventListener('pointerdown', this.boundPointerDown, { capture: true });
    }
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.openIndex >= 0) {
      this.openIndex = -1;
      this.cdr.markForCheck();
    }
  }

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

  private onDocumentPointerDown(event: PointerEvent): void {
    if (this.openIndex < 0) return;

    const target = event.target as Node | null;
    if (!target) return;

    if (!this.elementRef.nativeElement.contains(target)) {
      this.openIndex = -1;
      this.cdr.markForCheck();
    }
  }
}
