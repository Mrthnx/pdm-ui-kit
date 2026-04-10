import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

export type PdmSheetSide = 'top' | 'right' | 'bottom' | 'left';
export type PdmSheetSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Sheet/Side panel component con soporte responsive
 * 
 * MEJORADO en v0.2.0:
 * - Tamaños configurables
 * - Mejor manejo de overflow
 * - Responsive sizes
 * 
 * @example
 * <pdm-sheet [open]="isOpen" side="right" size="md">
 *   <h3>Settings</h3>
 *   <p>Content here</p>
 * </pdm-sheet>
 */
@Component({
  selector: 'pdm-sheet',
  templateUrl: './sheet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmSheetComponent {
  @Input() open = false;
  
  /**
   * Lado desde donde aparece el sheet
   */
  @Input() side: PdmSheetSide = 'right';
  
  /**
   * Tamaño del sheet
   * - sm: 320px (side) / 40vh (top/bottom)
   * - md: 400px (side) / 50vh (top/bottom) (default)
   * - lg: 500px (side) / 66vh (top/bottom)
   * - xl: 640px (side) / 80vh (top/bottom)
   * - full: 100%
   */
  @Input() size: PdmSheetSize = 'md';
  
  @Input() className = '';
  @Input() closeOnEsc = true;
  @Input() closeOnBackdropClick = true;

  @Output() openChange = new EventEmitter<boolean>();

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.open && this.closeOnEsc) {
      this.close();
    }
  }

  onBackdropClick(): void {
    if (this.closeOnBackdropClick) {
      this.close();
    }
  }

  close(): void {
    this.openChange.emit(false);
  }

  get panelClass(): string {
    const base = 'absolute bg-background border-border shadow-lg overflow-auto';
    const position = this.getPositionClass();
    const sizing = this.getSizingClass();
    
    return `${base} ${position} ${sizing} ${this.className}`.trim();
  }

  private getPositionClass(): string {
    const map: Record<PdmSheetSide, string> = {
      left: 'left-0 top-0 h-full border-r',
      right: 'right-0 top-0 h-full border-l',
      top: 'top-0 left-0 w-full border-b',
      bottom: 'bottom-0 left-0 w-full border-t'
    };
    
    return map[this.side];
  }

  private getSizingClass(): string {
    if (this.size === 'full') {
      return 'w-full h-full';
    }

    const isHorizontal = this.side === 'left' || this.side === 'right';
    
    if (isHorizontal) {
      const widthMap = {
        sm: 'w-full max-w-[320px] sm:max-w-[320px]',
        md: 'w-full max-w-[360px] sm:max-w-[400px]',
        lg: 'w-full max-w-[400px] sm:max-w-[500px]',
        xl: 'w-full max-w-[500px] sm:max-w-[640px]'
      };
      return widthMap[this.size] || widthMap.md;
    } else {
      const heightMap = {
        sm: 'max-h-[40vh]',
        md: 'max-h-[50vh]',
        lg: 'max-h-[66vh]',
        xl: 'max-h-[80vh]'
      };
      return heightMap[this.size] || heightMap.md;
    }
  }
}
