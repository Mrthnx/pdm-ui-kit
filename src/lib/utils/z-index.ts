/**
 * Z-Index Scale - Sistema centralizado de z-index
 * 
 * JERARQUÍA (de menor a mayor):
 * 1. base (z-0) - Elementos normales del DOM
 * 2. dropdown (z-10) - Selects, combobox, date-pickers
 * 3. sticky (z-20) - Headers, navigation bars
 * 4. overlay (z-30) - Popovers, hover cards, context menus
 * 5. drawer (z-40) - Sidebar drawer, sheets laterales
 * 6. modal (z-50) - Dialogs, alert-dialogs
 * 7. modal-backdrop (z-40) - Backdrop de modals
 * 8. popover (z-60) - Tooltips, dropdowns DENTRO de modals
 * 9. toast (z-[100]) - Notificaciones que deben estar sobre TODO
 * 
 * REGLA CRÍTICA: 
 * - Componentes overlay (select options, dropdown menu, tooltip) SIEMPRE z-60 o mayor
 * - Esto permite que funcionen DENTRO de modals (z-50)
 * - Backdrop de modal debe ser z-40 para estar DEBAJO del contenido del modal (z-50)
 */

export const Z_INDEX = {
  /**
   * Base - contenido normal del DOM
   */
  base: 'z-0',
  
  /**
   * Dropdown - Selects, combobox, date-pickers
   * Debe estar SOBRE contenido normal pero BAJO modals
   */
  dropdown: 'z-10',
  
  /**
   * Sticky - Headers, navigation fija
   */
  sticky: 'z-20',
  
  /**
   * Overlay - Popovers, hover cards, context menus
   * Debe estar SOBRE sticky pero BAJO modals
   */
  overlay: 'z-30',
  
  /**
   * Drawer backdrop - Backdrop de sidebar drawer
   * Debe estar DEBAJO del drawer panel
   */
  drawerBackdrop: 'z-40',
  
  /**
   * Drawer - Sidebar drawer, sheets laterales
   * Debe estar SOBRE su backdrop pero BAJO modals
   */
  drawer: 'z-50',
  
  /**
   * Modal backdrop - Backdrop de dialogs
   * Debe estar SOBRE drawers pero DEBAJO del contenido del modal
   */
  modalBackdrop: 'z-50',
  
  /**
   * Modal - Dialogs, alert-dialogs, sheets
   * Debe estar SOBRE su backdrop
   */
  modal: 'z-[60]',
  
  /**
   * Popover - Tooltips, dropdowns, selects options DENTRO de modals
   * CRÍTICO: Debe ser MAYOR que modal (z-50) para aparecer sobre modals
   */
  popover: 'z-[70]',
  
  /**
   * Toast - Notificaciones globales
   * Debe estar sobre TODO
   */
  toast: 'z-[100]'
} as const;

/**
 * Helper para debugging z-index issues
 */
export function logZIndexStack(element: HTMLElement): void {
  if (typeof window === 'undefined') return;
  
  let current: HTMLElement | null = element;
  const stack: Array<{ element: string; zIndex: string; position: string }> = [];
  
  while (current && current !== document.body) {
    const computed = window.getComputedStyle(current);
    const zIndex = computed.zIndex;
    const position = computed.position;
    
    if (zIndex !== 'auto') {
      stack.push({
        element: current.tagName + (current.className ? `.${current.className.split(' ')[0]}` : ''),
        zIndex,
        position
      });
    }
    
    current = current.parentElement;
  }
  
  console.table(stack);
}
