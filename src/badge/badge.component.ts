import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class PdmBadgeComponent {
  @Input() variant: PdmBadgeVariant = 'default';
  @Input() text = 'Badge';
  @Input() className = '';
}

