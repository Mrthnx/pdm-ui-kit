import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'pdm-input-otp',
  templateUrl: './input-otp.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmInputOtpComponent {
  @Input() length = 6;
  @Input() groupSize = 3;
  @Input() disabled = false;
  @Input() invalid = false;
  @Input() className = '';

  @Output() valueChange = new EventEmitter<string>();
  @Output() completed = new EventEmitter<string>();

  @ViewChildren('otpInput') private readonly inputs?: QueryList<ElementRef<HTMLInputElement>>;

  values: string[] = Array.from({ length: this.length }, () => '');

  ngOnChanges(): void {
    if (this.values.length !== this.length) {
      this.values = Array.from({ length: this.length }, (_, index) => this.values[index] ?? '');
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  onInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const char = (input.value || '').replace(/\D+/g, '').slice(-1);

    this.values[index] = char;
    input.value = char;
    this.emit();

    if (char) {
      this.focusInput(index + 1, true);
    }
  }

  onKeyDown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.values[index]) {
      this.focusInput(index - 1);
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.focusInput(index - 1);
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.focusInput(index + 1);
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();

    const pastedText = (event.clipboardData?.getData('text') ?? '').replace(/\D+/g, '').slice(0, this.length);

    if (!pastedText) {
      return;
    }

    this.values = Array.from({ length: this.length }, (_, index) => pastedText[index] ?? '');
    this.emit();

    const nextIndex = Math.min(pastedText.length, this.length - 1);
    this.focusInput(nextIndex);
  }

  getInputClasses(index: number): string {
    const classes = [
      'h-9 w-9 appearance-none border bg-background text-center text-sm font-normal text-foreground outline-none transition focus:outline-none focus-visible:outline-none',
      'shadow-sm',
      'focus:border-input focus:ring-1 focus:ring-primary/30',
      'disabled:cursor-not-allowed disabled:opacity-50',
    ];

    if (this.invalid) {
      classes.push('border-destructive focus:border-destructive focus:ring-destructive');
    } else {
      classes.push('border-input');
    }

    if (this.isGroupStart(index)) {
      classes.push('rounded-l-md border-l');
    } else {
      classes.push('border-l-0');
    }

    if (this.isGroupEnd(index)) {
      classes.push('rounded-r-md');
    }

    return classes.join(' ');
  }

  shouldShowSeparator(index: number): boolean {
    return this.groupSize > 0 && (index + 1) % this.groupSize === 0 && index < this.length - 1;
  }

  private isGroupStart(index: number): boolean {
    return this.groupSize <= 0 || index % this.groupSize === 0;
  }

  private isGroupEnd(index: number): boolean {
    if (this.groupSize <= 0) {
      return index === this.length - 1;
    }
    return (index + 1) % this.groupSize === 0 || index === this.length - 1;
  }

  private emit(): void {
    const value = this.values.join('');
    this.valueChange.emit(value);

    if (value.length === this.length && !this.values.includes('')) {
      this.completed.emit(value);
    }
  }

  private focusInput(index: number, deferred = false): void {
    if (deferred) {
      requestAnimationFrame(() => this.focusInput(index, false));
      return;
    }

    if (!this.inputs || index < 0 || index >= this.length) {
      return;
    }

    const input = this.inputs.get(index)?.nativeElement;
    if (input) {
      input.focus();
      input.select();
    }
  }
}
