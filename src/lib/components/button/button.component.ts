import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

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
  @Input() variant: PdmButtonVariant = 'default';
  @Input() state: PdmButtonState = 'default';
  @Input() size: PdmButtonSize = 'default';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() className = '';

  @Output() pressed = new EventEmitter<MouseEvent>();

  readonly toneClassMap: Record<PdmButtonVariant, { default: string; hover: string }> = {
    default: { default: 'border-transparent bg-primary text-primary-foreground', hover: 'border-transparent bg-primary text-primary-foreground opacity-90' },
    primary: { default: 'border-transparent bg-primary text-primary-foreground', hover: 'border-transparent bg-primary text-primary-foreground opacity-90' },
    destructive: { default: 'border-transparent bg-destructive text-destructive-foreground', hover: 'border-transparent bg-destructive text-destructive-foreground opacity-90' },
    outline: { default: 'border-border bg-background text-foreground', hover: 'border-border bg-muted text-foreground' },
    subtle: { default: 'border-transparent bg-secondary text-secondary-foreground', hover: 'border-transparent bg-accent text-accent-foreground' },
    secondary: { default: 'border-transparent bg-secondary text-secondary-foreground', hover: 'border-transparent bg-accent text-accent-foreground' },
    ghost: { default: 'border-transparent bg-transparent text-foreground', hover: 'border-transparent bg-accent text-accent-foreground' },
    link: { default: 'border-transparent bg-transparent text-primary', hover: 'border-transparent bg-transparent text-primary underline underline-offset-4' },
    'with-icon': { default: 'border-transparent bg-primary text-primary-foreground', hover: 'border-transparent bg-primary text-primary-foreground opacity-90' },
    icon: { default: 'border-border bg-background text-foreground', hover: 'border-border bg-accent text-accent-foreground' },
    'icon-circle': { default: 'border-border bg-background text-foreground', hover: 'border-border bg-accent text-accent-foreground' },
    rounded: { default: 'border-border bg-background text-foreground', hover: 'border-border bg-accent text-accent-foreground' },
    loading: { default: 'border-transparent bg-primary text-primary-foreground opacity-70', hover: 'border-transparent bg-primary text-primary-foreground opacity-70' }
  };

  get isDisabled(): boolean {
    return this.disabled || this.loading || this.variant === 'loading';
  }

  get rootClasses(): string[] {
    const currentState = this.state === 'hover' ? 'hover' : 'default';
    const toneClass = this.toneClassMap[this.variant][currentState];

    return [
      'inline-flex items-center justify-center gap-2 rounded-md border text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-clip-padding',
      this.variant === 'link' ? 'px-4 py-2 h-9' : '',
      this.variant === 'icon' ? 'h-9 w-9 p-0' : '',
      this.variant === 'icon-circle' ? 'h-10 w-10 rounded-full p-0' : '',
      this.variant === 'rounded' ? 'h-9 w-9 rounded-full p-0' : '',
      this.variant !== 'icon' && this.variant !== 'icon-circle' && this.variant !== 'rounded'
        ? this.size === 'small'
          ? 'h-8 px-3 text-xs'
          : this.size === 'large'
            ? 'h-10 px-8'
            : 'h-9 px-4'
        : '',
      this.variant === 'link' && this.state === 'hover' ? 'underline underline-offset-4' : '',
      toneClass,
      this.className
    ];
  }

  onClick(event: MouseEvent): void {
    if (!this.isDisabled) {
      this.pressed.emit(event);
    }
  }
}
