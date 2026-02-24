import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

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

  @Output() valueChange = new EventEmitter<string>();

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  get selectedOption(): PdmSelectOption | undefined {
    return this.options.find((option) => option.value === this.value);
  }

  get selectedLabel(): string {
    return this.selectedOption?.label || this.placeholder;
  }

  toggle(): void {
    if (this.disabled) return;
    this.open = !this.open;
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
}
