import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type PdmBadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'icon'
  | 'number'
  | 'destructive-number'
  | 'secondary-number';

@Component({
  selector: 'pdm-badge',
  templateUrl: './badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmBadgeComponent {
  @Input() variant: PdmBadgeVariant = 'default';
  @Input() text = 'Badge';
  @Input() className = '';
}

