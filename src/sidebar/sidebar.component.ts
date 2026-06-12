import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export type PdmSidebarMobileMode = 'drawer' | 'sidebar';

/**
 * Sidebar component - Navegación lateral responsive
 * 
 * MEJORAS en v0.2.0:
 * - Mobile drawer mode: overlay fullscreen en mobile, sidebar fijo en desktop
 * - Sidebar mode: sidebar persistente con widths responsive
 * - Backdrop automático en mobile drawer mode
 * 
 * @example
 * <!-- Mobile drawer (default) -->
 * <pdm-sidebar [open]="sidebarOpen" (openChange)="sidebarOpen = $event">
 *   <nav>Menu items...</nav>
 * </pdm-sidebar>
 * 
 * <!-- Sidebar persistente -->
 * <pdm-sidebar mobileMode="sidebar" [collapsed]="collapsed">
 *   <nav>Menu items...</nav>
 * </pdm-sidebar>
 */
@Component({
  selector: 'pdm-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmSidebarComponent {
  /**
   * Mobile behavior: 'drawer' (overlay) o 'sidebar' (persistente)
   * @default 'drawer'
   */
  @Input() mobileMode: PdmSidebarMobileMode = 'drawer';
  
  /**
   * Collapsed state (solo aplica en mobileMode="sidebar")
   */
  @Input() collapsed = false;
  
  /**
   * Open state (solo aplica en mobileMode="drawer")
   */
  @Input() open = false;
  
  @Input() className = '';
  
  /**
   * Emite cuando el drawer se cierra (solo en mobileMode="drawer")
   */
  @Output() openChange = new EventEmitter<boolean>();
  
  onBackdropClick() {
    if (this.mobileMode === 'drawer') {
      this.open = false;
      this.openChange.emit(false);
    }
  }
}
