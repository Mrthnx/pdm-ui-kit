import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type PdmAlertVariant = 'default' | 'title-only' | 'destructive';

@Component({
  selector: 'pdm-alert',
  templateUrl: './alert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmAlertComponent {
  @Input() variant: PdmAlertVariant = 'default';
  @Input() title = 'Success! Your changes have been saved';
  @Input() description = 'This is an alert with icon, title and description.';
  @Input() details: string[] = [];
  @Input() className = '';

  get isDestructive(): boolean {
    return this.variant === 'destructive';
  }

  get isTitleOnly(): boolean {
    return this.variant === 'title-only';
  }
}

