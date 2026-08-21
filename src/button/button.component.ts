import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BUTTON_TONE_MAP } from './button-theme.constant';

export type PdmButtonVariant =
  | 'default'
  | 'primary'
  | 'destructive'
  | 'outline'
  | 'subtle'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'with-icon'
  | 'icon'
  | 'icon-circle'
  | 'rounded'
  | 'loading';
export type PdmButtonState = 'default' | 'hover';
export type PdmButtonSize = 'small' | 'default' | 'large';

@Component({
  selector: 'pdm-button',
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: PdmButtonVariant | string = 'default';
  @Input() state: PdmButtonState | string = 'default';
  @Input() size: PdmButtonSize | string = 'default';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() className = '';

  @Output() pressed = new EventEmitter<MouseEvent>();

  readonly toneClassMap = BUTTON_TONE_MAP;

  get isDisabled(): boolean {
    return this.disabled || this.loading || this.variant === 'loading';
  }

  get resolvedVariant(): PdmButtonVariant {
    return this.isValidVariant(this.variant) ? this.variant : 'default';
  }

  get resolvedState(): PdmButtonState {
    return this.state === 'hover' ? 'hover' : 'default';
  }

  get resolvedSize(): PdmButtonSize {
    if (this.size === 'small' || this.size === 'large') {
      return this.size;
    }

    return 'default';
  }

  get showsIconSlot(): boolean {
    const variant = this.resolvedVariant;
    return variant === 'with-icon' || variant === 'icon' || variant === 'icon-circle' || variant === 'rounded';
  }

  get rootClasses(): string[] {
    const currentState = this.resolvedState;
    const variant = this.resolvedVariant;
    const toneClass = this.toneClassMap[variant][currentState];

    return [
      'inline-flex appearance-none box-border items-center justify-center gap-2 rounded-md border border-solid text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-clip-padding',
      variant === 'link' ? 'px-4 py-2 h-9' : '',
      variant === 'icon' ? 'h-9 w-9 p-0' : '',
      variant === 'icon-circle' ? 'h-10 w-10 rounded-full p-0' : '',
      variant === 'rounded' ? 'h-9 w-9 rounded-full p-0' : '',
      variant !== 'icon' && variant !== 'icon-circle' && variant !== 'rounded'
        ? this.resolvedSize === 'small'
          ? 'h-8 px-3 text-xs'
          : this.resolvedSize === 'large'
            ? 'h-10 px-8'
            : 'h-9 px-4'
        : '',
      variant === 'link' && currentState === 'hover' ? 'underline underline-offset-4' : '',
      toneClass,
      this.className
    ];
  }

  onClick(event: MouseEvent): void {
    if (!this.isDisabled) {
      this.pressed.emit(event);
    }
  }

  private isValidVariant(value: unknown): value is PdmButtonVariant {
    return (
      value === 'default' ||
      value === 'primary' ||
      value === 'destructive' ||
      value === 'outline' ||
      value === 'subtle' ||
      value === 'secondary' ||
      value === 'ghost' ||
      value === 'link' ||
      value === 'with-icon' ||
      value === 'icon' ||
      value === 'icon-circle' ||
      value === 'rounded' ||
      value === 'loading'
    );
  }
}
