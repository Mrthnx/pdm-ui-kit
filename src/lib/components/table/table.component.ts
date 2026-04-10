import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TableResponsiveStrategy, TABLE_RESPONSIVE } from '../../utils/responsive';

export type PdmTableVariant = 'default' | 'data' | 'interactive';

/**
 * Componente base de tabla con soporte responsive
 * 
 * SIMPLIFICADO: Ya no incluye drag & drop (usar pdm-draggable-table para eso)
 * 
 * @example
 * // Tabla simple con scroll horizontal
 * <pdm-table variant="default">
 *   <thead><tr><th>Name</th><th>Email</th></tr></thead>
 *   <tbody><tr><td>John</td><td>john@example.com</td></tr></tbody>
 * </pdm-table>
 * 
 * @example
 * // Tabla interactiva con wrap en mobile
 * <pdm-table variant="interactive" responsiveStrategy="wrap">
 *   ...
 * </pdm-table>
 */
@Component({
  selector: 'pdm-table',
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmTableComponent {
  /**
   * Variante visual de la tabla
   * - default: tabla básica sin estilos extra
   * - data: tabla con bordes y espaciado para data
   * - interactive: tabla con hover, sticky header y estilos interactivos
   */
  @Input() variant: PdmTableVariant = 'default';
  
  /**
   * Estrategia responsive para la tabla
   * - scroll: scroll horizontal en mobile (default, más simple)
   * - wrap: permite que el contenido haga wrap
   * - stack: convierte filas en cards en mobile (requiere data-label en celdas)
   * - collapse: oculta columnas menos importantes en mobile
   */
  @Input() responsiveStrategy: TableResponsiveStrategy = 'scroll';
  
  /**
   * Clases CSS adicionales para el wrapper
   */
  @Input() className = '';
  
  /**
   * Si es true, aplica padding negativo en mobile para scroll edge-to-edge
   * Útil cuando la tabla está dentro de un container con padding
   */
  @Input() fullBleed = false;

  get wrapperClasses(): string[] {
    const baseClasses = ['relative', 'w-full'];
    const strategyClasses = this.getResponsiveStrategyClasses();
    const variantClasses = this.getVariantWrapperClasses();
    
    // Full bleed: scroll edge-to-edge en mobile
    if (this.fullBleed && this.responsiveStrategy === 'scroll') {
      baseClasses.push('-mx-4', 'px-4', 'sm:mx-0', 'sm:px-0');
    }
    
    return [
      ...baseClasses,
      ...strategyClasses,
      ...variantClasses,
      this.className
    ].filter(Boolean);
  }

  get tableClasses(): string[] {
    const baseClasses = ['w-full', 'caption-bottom', 'text-sm'];
    const variantClasses = this.getVariantTableClasses();
    const cellClasses = this.getCellClasses();
    
    return [...baseClasses, ...variantClasses, ...cellClasses].filter(Boolean);
  }

  private getResponsiveStrategyClasses(): string[] {
    const strategy = TABLE_RESPONSIVE[this.responsiveStrategy];
    
    if (this.responsiveStrategy === 'scroll') {
      return ['overflow-x-auto'];
    }
    
    if (this.responsiveStrategy === 'wrap') {
      return ['overflow-x-auto'];
    }
    
    if (this.responsiveStrategy === 'stack') {
      // Stack requiere lógica en el template, aquí solo el wrapper
      return [];
    }
    
    if (this.responsiveStrategy === 'collapse') {
      return ['overflow-x-auto'];
    }
    
    return ['overflow-auto'];
  }

  private getVariantWrapperClasses(): string[] {
    if (this.variant === 'interactive') {
      return ['rounded-xl', 'border', 'border-border', 'bg-background'];
    }
    
    if (this.variant === 'data') {
      return ['rounded-md', 'border', 'border-border', 'bg-background'];
    }
    
    return [];
  }

  private getVariantTableClasses(): string[] {
    if (this.variant === 'data') {
      return [
        'border-collapse',
        'text-foreground',
        '[&_thead_tr]:border-b',
        '[&_thead_tr]:border-border',
        '[&_tbody_tr]:border-b',
        '[&_tbody_tr]:border-border',
        '[&_tbody_tr:last-child]:border-b-0',
        '[&_th]:h-10',
        '[&_th]:px-2',
        '[&_th]:text-left',
        '[&_th]:align-middle',
        '[&_th]:font-medium',
        '[&_td]:p-2',
        '[&_td]:align-middle'
      ];
    }
    
    if (this.variant === 'interactive') {
      return [
        'text-foreground',
        '[&_thead]:sticky',
        '[&_thead]:top-0',
        '[&_thead]:z-10',
        '[&_thead]:bg-muted/70',
        '[&_thead_tr]:border-b',
        '[&_thead_tr]:border-border',
        '[&_th]:h-12',
        '[&_th]:px-4',
        '[&_th]:text-left',
        '[&_th]:align-middle',
        '[&_th]:text-sm',
        '[&_th]:font-medium',
        '[&_tbody_tr]:border-b',
        '[&_tbody_tr]:border-border',
        '[&_tbody_tr]:transition-colors',
        '[&_tbody_tr:hover]:bg-muted/50',
        '[&_tbody_tr:last-child]:border-b-0',
        '[&_td]:h-14',
        '[&_td]:px-4',
        '[&_td]:align-middle',
        '[&_td]:text-sm',
        '[&_svg]:text-muted-foreground'
      ];
    }
    
    return [];
  }

  private getCellClasses(): string[] {
    // Manejo responsive de whitespace
    if (this.responsiveStrategy === 'scroll') {
      // En scroll, permitir wrap en mobile, nowrap en desktop
      return ['[&_td]:whitespace-normal', '[&_th]:whitespace-normal', 'sm:[&_td]:whitespace-nowrap', 'sm:[&_th]:whitespace-nowrap'];
    }
    
    if (this.responsiveStrategy === 'wrap') {
      // En wrap, siempre permitir wrap
      return ['[&_td]:whitespace-normal', '[&_td]:break-words', '[&_th]:whitespace-normal'];
    }
    
    // Default: nowrap (comportamiento anterior para backward compatibility)
    return [];
  }
}
