import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export type PdmCardVariant = 'default' | 'login';

@Component({
  selector: 'pdm-card',
  templateUrl: './card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmCardComponent {
  @Input() variant: PdmCardVariant = 'default';
  @Input() className = '';

  @Input() title = 'Login to your account';
  @Input() description = 'Enter your email below to login to your account';
  @Input() actionText = 'Sign up';
  @Input() emailLabel = 'Email';
  @Input() emailPlaceholder = 'm@example.com';
  @Input() passwordLabel = 'Password';
  @Input() passwordHint = 'Forgot password?';
  @Input() primaryActionText = 'Login';
  @Input() secondaryActionText = 'Login with Google';

  @Output() primaryAction = new EventEmitter<void>();
  @Output() secondaryAction = new EventEmitter<void>();
  @Output() actionPressed = new EventEmitter<void>();

  onPrimaryAction(): void {
    this.primaryAction.emit();
  }

  onSecondaryAction(): void {
    this.secondaryAction.emit();
  }

  onActionPressed(): void {
    this.actionPressed.emit();
  }
}
