import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type PdmButtonGroupVariant = 'default' | 'orientation' | 'separator' | 'nested';

@Component({
  selector: 'pdm-button-group',
  templateUrl: './button-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmButtonGroupComponent {
  @Input() variant: PdmButtonGroupVariant = 'default';
  @Input() items: string[] = ['Archive', 'Report'];
  @Input() className = '';
}

