import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { responsive } from 'pdm-ui-kit/src/utils';
import { Z_INDEX } from 'pdm-ui-kit/src/utils';

export type PdmDrawerPosition = 'bottom' | 'left' | 'right' | 'top';
export type PdmDrawerSize = 'sm' | 'md' | 'lg' | 'full';

/**
 * @deprecated Use specific drawer types. Will be removed in v0.3.0
 */
export type PdmDrawerVariant = 'drawer' | 'responsive-dialog';

/**
 * Drawer/Sheet component con soporte responsive
 * 
 * MEJORADO en v0.2.0:
 * - Posicionamiento configurable (bottom, left, right, top)
 * - Tamaños predefinidos
 * - Responsive: bottom sheet en mobile, side panel en desktop
 * - Contenido genérico via ng-content
 * 
 * @example
 * // Drawer simple desde el bottom
 * <pdm-drawer [open]="isOpen" position="bottom">
 *   <h3>Title</h3>
 *   <p>Content</p>
 * </pdm-drawer>
 * 
 * @example
 * // Side panel desde la right
 * <pdm-drawer [open]="isOpen" position="right" size="md">
 *   <p>Content</p>
 * </pdm-drawer>
 */
@Component({
  selector: 'pdm-drawer',
  templateUrl: './drawer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmDrawerComponent {
  @Input() open = false;
  
  /**
   * Posición del drawer
   * - bottom: desde abajo (default, mejor para mobile)
   * - left: side panel desde izquierda
   * - right: side panel desde derecha
   * - top: desde arriba (poco común)
   */
  @Input() position: PdmDrawerPosition = 'bottom';
  
  /**
   * Tamaño del drawer
   * - sm: 400px (side) / 50vh (bottom/top)
   * - md: 500px (side) / 66vh (bottom/top) (default)
   * - lg: 640px (side) / 80vh (bottom/top)
   * - full: 100% ancho/alto
   */
  @Input() size: PdmDrawerSize = 'md';
  
  /**
   * @deprecated Use position="bottom" instead
   */
  @Input() variant: PdmDrawerVariant = 'drawer';
  
  @Input() className = '';
  @Input() title = '';
  @Input() description = '';
  
  /**
   * Mostrar handle visual (línea para arrastrar)
   * Solo tiene sentido en position="bottom"
   */
  @Input() showHandle = true;
  
  /**
   * Mostrar botón de cerrar
   */
  @Input() showCloseButton = true;
  
  @Input() closeOnEsc = true;
  @Input() closeOnBackdropClick = true;

  @Output() openChange = new EventEmitter<boolean>();

  // DEPRECATED: contenido específico que se movió a ng-content
  @Input() value: number | string = '';
  @Input() unit = '';
  @Input() decrementLabel = '-';
  @Input() incrementLabel = '+';
  @Input() primaryLabel = '';
  @Input() secondaryLabel = '';
  @Input() profileTitle = '';
  @Input() profileDescription = '';
  @Input() nameLabel = 'Name';
  @Input() nameValue = '';
  @Input() usernameLabel = 'Username';
  @Input() usernameValue = '';
  @Input() responsivePrimaryLabel = '';
  @Input() bars: number[] = [];
  @Output() primaryAction = new EventEmitter<void>();
  @Output() secondaryAction = new EventEmitter<void>();

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

  onPrimaryAction(): void {
    this.primaryAction.emit();
  }

  onSecondaryAction(): void {
    this.secondaryAction.emit();
  }

  get containerClassName(): string {
    return `fixed inset-0 ${Z_INDEX.drawer} ${this.className}`;
  }

  get panelClassName(): string {
    const base = [
      'absolute',
      'bg-background',
      'border border-solid',
      'border-border',
      'shadow-lg',
      'overflow-auto'
    ];

    // Posicionamiento
    const positionClasses = this.getPositionClasses();
    
    // Tamaño
    const sizeClasses = this.getSizeClasses();

    return [...base, ...positionClasses, ...sizeClasses].filter(Boolean).join(' ');
  }

  private getPositionClasses(): string[] {
    const map: Record<PdmDrawerPosition, string[]> = {
      bottom: ['inset-x-0', 'bottom-0', 'rounded-t-xl'],
      top: ['inset-x-0', 'top-0', 'rounded-b-xl'],
      left: ['inset-y-0', 'left-0', 'rounded-r-xl'],
      right: ['inset-y-0', 'right-0', 'rounded-l-xl']
    };

    return map[this.position] || map.bottom;
  }

  private getSizeClasses(): string[] {
    const isVertical = this.position === 'bottom' || this.position === 'top';
    
    if (this.size === 'full') {
      return ['w-full', 'h-full'];
    }

    const sizeMap = {
      sm: isVertical ? 'max-h-[50vh]' : 'max-w-[400px]',
      md: isVertical ? 'max-h-[66vh]' : 'max-w-[500px]',
      lg: isVertical ? 'max-h-[80vh]' : 'max-w-[640px]'
    };

    const maxDimension = sizeMap[this.size] || sizeMap.md;

    if (isVertical) {
      return ['w-full', maxDimension];
    } else {
      return ['h-full', maxDimension];
    }
  }

  get showLegacyContent(): boolean {
    // Mostrar contenido legacy si variant está siendo usado
    return this.variant === 'drawer' || this.variant === 'responsive-dialog';
  }
}
