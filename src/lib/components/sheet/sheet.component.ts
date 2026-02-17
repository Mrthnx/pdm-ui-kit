import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export type PdmSheetSide = 'top' | 'right' | 'bottom' | 'left';

@Component({
  selector: 'pdm-sheet',
  templateUrl: './sheet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmSheetComponent {
  @Input() open = false;
  @Input() side: PdmSheetSide = 'right';
  @Input() className = '';

  @Output() openChange = new EventEmitter<boolean>();

  close(): void {
    this.openChange.emit(false);
  }

  get panelClass(): string {
    if (this.side === 'left') return 'left-0 top-0 h-full w-full max-w-[360px] border-r';
    if (this.side === 'top') return 'top-0 left-0 w-full border-b';
    if (this.side === 'bottom') return 'bottom-0 left-0 w-full border-t';

    return 'right-0 top-0 h-full w-full max-w-[360px] border-l';
  }
}
