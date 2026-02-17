import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type PdmHoverCardSide = 'top' | 'right' | 'bottom' | 'left';
export type PdmHoverCardAlign = 'start' | 'center' | 'end';

@Component({
  selector: 'pdm-hover-card',
  templateUrl: './hover-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmHoverCardComponent {
  @Input() className = '';
  @Input() panelClassName = '';
  @Input() side: PdmHoverCardSide = 'bottom';
  @Input() align: PdmHoverCardAlign = 'start';
  @Input() panelWidth = 304;

  open = false;

  get positionClass(): string {
    const sideClassMap: Record<PdmHoverCardSide, string> = {
      top: 'bottom-full mb-2',
      right: 'left-full ml-2',
      bottom: 'top-full mt-2',
      left: 'right-full mr-2'
    };

    const alignClassMap: Record<PdmHoverCardAlign, string> = {
      start: this.side === 'top' || this.side === 'bottom' ? 'left-0' : 'top-0',
      center: this.side === 'top' || this.side === 'bottom' ? 'left-1/2 -translate-x-1/2' : 'top-1/2 -translate-y-1/2',
      end: this.side === 'top' || this.side === 'bottom' ? 'right-0' : 'bottom-0'
    };

    return `${sideClassMap[this.side]} ${alignClassMap[this.align]}`;
  }
}
