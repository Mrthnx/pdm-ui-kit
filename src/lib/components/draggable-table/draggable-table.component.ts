import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { PdmTableVariant } from '../table/table.component';
import { TableResponsiveStrategy } from '../../utils/responsive';

/**
 * Tabla con funcionalidad de reordenamiento de filas mediante drag & drop
 * 
 * Extiende pdm-table agregando la capacidad de reordenar filas.
 * Si no necesitás drag & drop, usá pdm-table directamente (más simple y liviano).
 * 
 * @example
 * <pdm-draggable-table 
 *   variant="interactive"
 *   [reorderRows]="true"
 *   (rowOrderChange)="onOrderChange($event)">
 *   <tbody>
 *     <tr data-row-id="1"><td>Row 1</td></tr>
 *     <tr data-row-id="2"><td>Row 2</td></tr>
 *   </tbody>
 * </pdm-draggable-table>
 * 
 * IMPORTANTE: Cada <tr> debe tener un atributo data-row-id único
 */
@Component({
  selector: 'pdm-draggable-table',
  templateUrl: './draggable-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmDraggableTableComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() variant: PdmTableVariant = 'default';
  @Input() responsiveStrategy: TableResponsiveStrategy = 'scroll';
  @Input() className = '';
  @Input() fullBleed = false;
  
  /**
   * Habilita el reordenamiento de filas mediante drag & drop
   */
  @Input() reorderRows = false;
  
  /**
   * Selector CSS para identificar los handles de drag
   * Por defecto busca: [data-drag-handle], [data-slot=row-drag-handle], .row-drag-handle
   * Si no encuentra ninguno, inserta un handle automático
   */
  @Input() dragHandleSelector = '[data-drag-handle],[data-slot=row-drag-handle],.row-drag-handle,[data-auto-drag-handle]';
  
  /**
   * Emite el nuevo orden de las filas cuando el usuario termina de arrastrar
   * Array de data-row-id en el nuevo orden
   */
  @Output() rowOrderChange = new EventEmitter<string[]>();

  @ViewChild('tableElement') tableElement?: ElementRef<HTMLTableElement>;

  private cleanupListeners: Array<() => void> = [];
  private observer?: MutationObserver;
  private draggedRow: HTMLTableRowElement | null = null;

  constructor(private readonly renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.syncReorderBehavior();
  }

  // Getters para clases CSS (mismo comportamiento que pdm-table)
  get wrapperClasses(): string[] {
    const baseClasses = ['relative', 'w-full'];
    const strategyClasses = this.getResponsiveStrategyClasses();
    const variantClasses = this.getVariantWrapperClasses();
    
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
    if (this.responsiveStrategy === 'scroll' || this.responsiveStrategy === 'wrap' || this.responsiveStrategy === 'collapse') {
      return ['overflow-x-auto'];
    }
    return [];
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
        'border-collapse', 'text-foreground',
        '[&_thead_tr]:border-b', '[&_thead_tr]:border-border',
        '[&_tbody_tr]:border-b', '[&_tbody_tr]:border-border',
        '[&_tbody_tr:last-child]:border-b-0',
        '[&_th]:h-10', '[&_th]:px-2', '[&_th]:text-left', '[&_th]:align-middle', '[&_th]:font-medium',
        '[&_td]:p-2', '[&_td]:align-middle'
      ];
    }
    
    if (this.variant === 'interactive') {
      return [
        'text-foreground',
        '[&_thead]:sticky', '[&_thead]:top-0', '[&_thead]:z-10', '[&_thead]:bg-muted/70',
        '[&_thead_tr]:border-b', '[&_thead_tr]:border-border',
        '[&_th]:h-12', '[&_th]:px-4', '[&_th]:text-left', '[&_th]:align-middle', '[&_th]:text-sm', '[&_th]:font-medium',
        '[&_tbody_tr]:border-b', '[&_tbody_tr]:border-border',
        '[&_tbody_tr]:transition-colors', '[&_tbody_tr:hover]:bg-muted/50',
        '[&_tbody_tr:last-child]:border-b-0',
        '[&_td]:h-14', '[&_td]:px-4', '[&_td]:align-middle', '[&_td]:text-sm',
        '[&_svg]:text-muted-foreground'
      ];
    }
    
    return [];
  }

  private getCellClasses(): string[] {
    if (this.responsiveStrategy === 'scroll') {
      return ['[&_td]:whitespace-normal', '[&_th]:whitespace-normal', 'sm:[&_td]:whitespace-nowrap', 'sm:[&_th]:whitespace-nowrap'];
    }
    if (this.responsiveStrategy === 'wrap') {
      return ['[&_td]:whitespace-normal', '[&_td]:break-words', '[&_th]:whitespace-normal'];
    }
    return [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reorderRows'] || changes['variant']) {
      this.syncReorderBehavior();
    }
  }

  ngOnDestroy(): void {
    this.cleanupReorderBehavior();
  }

  private syncReorderBehavior(): void {
    this.cleanupReorderBehavior();

    if (!this.reorderRows) {
      return;
    }

    const tbody = this.getTbody();
    if (!tbody) {
      return;
    }

    this.setRowsDraggable(tbody, true);

    this.cleanupListeners.push(
      this.renderer.listen(tbody, 'mousedown', (event: MouseEvent) => this.armDragFromHandle(event)),
      this.renderer.listen(tbody, 'dragstart', (event: DragEvent) => this.onDragStart(event)),
      this.renderer.listen(tbody, 'dragover', (event: DragEvent) => this.onDragOver(event, tbody)),
      this.renderer.listen(tbody, 'drop', (event: DragEvent) => this.onDrop(event)),
      this.renderer.listen(tbody, 'dragend', () => this.onDragEnd())
    );

    // Observer para detectar cambios en el DOM (filas agregadas/removidas)
    this.observer = new MutationObserver(() => this.setRowsDraggable(tbody, true));
    this.observer.observe(tbody, { childList: true });
  }

  private cleanupReorderBehavior(): void {
    this.cleanupListeners.forEach((dispose) => dispose());
    this.cleanupListeners = [];

    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }

    const tbody = this.getTbody();
    if (tbody) {
      this.setRowsDraggable(tbody, false);
    }

    this.draggedRow = null;
  }

  private getTbody(): HTMLTableSectionElement | null {
    return this.tableElement?.nativeElement.tBodies.item(0) ?? null;
  }

  private setRowsDraggable(tbody: HTMLTableSectionElement, enabled: boolean): void {
    const rows = Array.from(tbody.rows);
    rows.forEach((row) => {
      this.syncAutoDragHandle(row, enabled);
      row.draggable = false;
      if (!enabled) {
        delete row.dataset['dragging'];
        delete row.dataset['dragArmed'];
      }
    });
  }

  /**
   * Inserta un handle de drag automático si no existe uno custom
   */
  private syncAutoDragHandle(row: HTMLTableRowElement, enabled: boolean): void {
    const firstCell = row.cells.item(0);
    if (!firstCell) {
      return;
    }

    const existingAutoHandle = firstCell.querySelector('[data-auto-drag-handle]');
    if (!enabled) {
      existingAutoHandle?.remove();
      return;
    }

    const hasCustomHandle = !!firstCell.querySelector('[data-drag-handle],[data-slot=row-drag-handle],.row-drag-handle');
    if (hasCustomHandle || existingAutoHandle) {
      return;
    }

    // Crear handle automático
    const button = this.renderer.createElement('button') as HTMLButtonElement;
    this.renderer.setAttribute(button, 'type', 'button');
    this.renderer.setAttribute(button, 'aria-label', 'Drag row');
    this.renderer.setAttribute(button, 'data-auto-drag-handle', 'true');
    this.renderer.addClass(button, 'inline-flex');
    this.renderer.addClass(button, 'h-7');
    this.renderer.addClass(button, 'w-7');
    this.renderer.addClass(button, 'items-center');
    this.renderer.addClass(button, 'justify-center');
    this.renderer.addClass(button, 'cursor-grab');
    this.renderer.addClass(button, 'active:cursor-grabbing');
    this.renderer.addClass(button, 'text-muted-foreground');

    const dots = this.renderer.createElement('span');
    this.renderer.addClass(dots, 'text-sm');
    this.renderer.addClass(dots, 'leading-none');
    this.renderer.setProperty(dots, 'textContent', '⋮⋮');
    this.renderer.appendChild(button, dots);

    this.renderer.insertBefore(firstCell, button, firstCell.firstChild);
  }

  private onDragStart(event: DragEvent): void {
    const target = event.target as HTMLElement | null;
    const row = target?.closest('tr');
    if (!row) {
      return;
    }

    const handle = target?.closest(this.dragHandleSelector);
    const isArmed = row.dataset['dragArmed'] === 'true';
    if ((!handle || !row.contains(handle)) && !isArmed) {
      event.preventDefault();
      return;
    }

    this.draggedRow = row as HTMLTableRowElement;
    this.draggedRow.dataset['dragging'] = 'true';

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', '');
    }
  }

  private onDragOver(event: DragEvent, tbody: HTMLTableSectionElement): void {
    if (!this.draggedRow) {
      return;
    }

    event.preventDefault();
    const target = event.target as HTMLElement | null;
    const targetRow = target?.closest('tr') as HTMLTableRowElement | null;

    if (!targetRow || targetRow === this.draggedRow) {
      return;
    }

    const rect = targetRow.getBoundingClientRect();
    const shouldInsertBefore = event.clientY < rect.top + rect.height / 2;
    tbody.insertBefore(this.draggedRow, shouldInsertBefore ? targetRow : targetRow.nextSibling);
  }

  private onDrop(event: DragEvent): void {
    event.preventDefault();
  }

  private onDragEnd(): void {
    const tbody = this.getTbody();
    if (tbody) {
      Array.from(tbody.rows).forEach((row) => {
        row.draggable = false;
        delete row.dataset['dragArmed'];
      });
    }

    if (this.draggedRow) {
      delete this.draggedRow.dataset['dragging'];
      this.draggedRow = null;
    }

    if (!tbody) {
      return;
    }

    const order = Array.from(tbody.rows).map((row, index) => row.getAttribute('data-row-id') || String(index));
    this.rowOrderChange.emit(order);
  }

  private armDragFromHandle(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    const handle = target?.closest(this.dragHandleSelector);
    if (!handle) {
      return;
    }

    const row = handle.closest('tr') as HTMLTableRowElement | null;
    if (!row) {
      return;
    }

    row.draggable = true;
    row.dataset['dragArmed'] = 'true';
  }
}
