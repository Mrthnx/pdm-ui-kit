import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type PdmBreadcrumbMode =
  | 'custom-separator'
  | 'dropdown'
  | 'collapsed'
  | 'link-component'
  | 'responsive';

/**
 * Breadcrumb component con soporte responsive
 * 
 * MEJORADO en v0.2.0:
 * - Modo responsive real con overflow-x-auto
 * - Collapse inteligente en mobile
 * 
 * @example
 * <pdm-breadcrumb
 *   mode="responsive"
 *   [items]="['Home', 'Products', 'Electronics', 'Laptops']">
 * </pdm-breadcrumb>
 */
@Component({
  selector: 'pdm-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmBreadcrumbComponent {
  @Input() mode: PdmBreadcrumbMode = 'link-component';
  @Input() items: string[] = ['Home', 'Components', 'Breadcrumb'];
  @Input() className = '';
  
  /**
   * Cantidad mínima de items para mostrar en mobile cuando mode="responsive"
   * Default: 2 (primer y último item)
   */
  @Input() minItemsMobile = 2;

  get renderedItems(): string[] {
    if (this.mode === 'collapsed' && this.items.length > 3) {
      return [this.items[0], '...', this.items[this.items.length - 2], this.items[this.items.length - 1]];
    }
    
    // Responsive mode: no collapse en el TS, se maneja en el template con CSS
    return this.items;
  }
  
  /**
   * Determina si un item debe estar visible en mobile (modo responsive)
   */
  shouldShowInMobile(index: number): boolean {
    if (this.mode !== 'responsive') return true;
    
    const totalItems = this.items.length;
    if (totalItems <= this.minItemsMobile) return true;
    
    // Siempre mostrar primero y último
    return index === 0 || index === totalItems - 1;
  }
}
