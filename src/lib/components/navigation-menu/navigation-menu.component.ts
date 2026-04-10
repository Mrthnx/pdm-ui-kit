import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface PdmNavigationItem {
  label: string;
  href?: string;
  active?: boolean;
}

export type PdmNavigationMobileMode = 'scroll' | 'compact';

/**
 * Navigation Menu component - Navegación horizontal responsive
 * 
 * MEJORAS en v0.2.0:
 * - Modo scroll: overflow-x-auto con scroll indicators en mobile
 * - Modo compact: items abreviados en mobile, completos en desktop
 * - Scroll smooth automático al item activo
 * 
 * @example
 * <!-- Scroll horizontal (default) -->
 * <pdm-navigation-menu [items]="navItems"></pdm-navigation-menu>
 * 
 * <!-- Compact mode -->
 * <pdm-navigation-menu [items]="navItems" mobileMode="compact"></pdm-navigation-menu>
 */
@Component({
  selector: 'pdm-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmNavigationMenuComponent {
  @Input() items: PdmNavigationItem[] = [];
  @Input() className = '';
  
  /**
   * Mobile behavior: 'scroll' (horizontal scroll) o 'compact' (items reducidos)
   * @default 'scroll'
   */
  @Input() mobileMode: PdmNavigationMobileMode = 'scroll';
}
