import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'pdm-tooltip',
  templateUrl: './tooltip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmTooltipComponent {
  @Input() text = '';
  @Input() side: 'top' | 'right' | 'bottom' | 'left' = 'top';
  @Input() className = '';
  open = false;

  get positionClass(): string {
    if (this.side === 'bottom') return 'top-full left-1/2 -translate-x-1/2 mt-2';
    if (this.side === 'left') return 'right-full top-1/2 -translate-y-1/2 mr-2';
    if (this.side === 'right') return 'left-full top-1/2 -translate-y-1/2 ml-2';
    return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
  }
}
