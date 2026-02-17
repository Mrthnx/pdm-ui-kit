import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'pdm-popover',
  templateUrl: './popover.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmPopoverComponent {
  @Input() open = false;
  @Input() triggerText = 'Open';
  @Input() className = '';
  @Input() panelClassName = '';
  @Input() showTrigger = true;
  @Output() openChange = new EventEmitter<boolean>();

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

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
}
