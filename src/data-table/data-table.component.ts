import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { TableResponsiveStrategy } from 'pdm-ui-kit/src/utils';

/**
 * DEPRECATED: Esta interfaz es para backward compatibility
 * Usar PdmDataTableColumn<T> con tipo genérico en su lugar
 */
export interface PdmDataTableRow {
  id: string;
  status: string;
  email: string;
  amount: string;
  selected?: boolean;
}

/**
 * Definición de columna para data-table genérico
 */
export interface PdmDataTableColumn<T = any> {
  /**
   * Key del campo en el objeto de datos
   * Usado para acceder al valor: row[key]
   */
  key: keyof T;
  
  /**
   * Label a mostrar en el header
   */
  label: string;
  
  /**
   * Ancho de la columna (CSS width)
   * Ej: '100px', '20%', 'auto'
   */
  width?: string;
  
  /**
   * Si la columna es sortable
   */
  sortable?: boolean;
  
  /**
   * Alineación del contenido
   */
  align?: 'left' | 'center' | 'right';
  
  /**
   * Función custom para renderizar el valor
   * Si no se provee, se usa toString() del valor
   */
  render?: (value: any, row: T) => string;
  
  /**
   * Template personalizado para la celda
   * Tiene prioridad sobre render()
   */
  cellTemplate?: TemplateRef<{ $implicit: T; value: any }>;
  
  /**
   * Si es true, la columna se oculta en mobile
   * Solo se muestra en breakpoint md+ (768px)
   */
  hideOnMobile?: boolean;
  
  /**
   * CSS classes adicionales para las celdas de esta columna
   */
  cellClass?: string;
  
  /**
   * CSS classes adicionales para el header de esta columna
   */
  headerClass?: string;
}

/**
 * Data-table genérico con paginación, filtrado y selección
 * 
 * NUEVO: Ahora es genérico y configurable via columnas
 * 
 * @example
 * // Definir columnas
 * columns: PdmDataTableColumn<User>[] = [
 *   { key: 'name', label: 'Name', sortable: true },
 *   { key: 'email', label: 'Email', sortable: true },
 *   { key: 'role', label: 'Role', hideOnMobile: true },
 *   { key: 'createdAt', label: 'Created', render: (val) => formatDate(val) }
 * ];
 * 
 * // En el template
 * <pdm-data-table
 *   [columns]="columns"
 *   [rows]="users"
 *   [selectable]="true"
 *   (selectionChange)="onSelect($event)">
 * </pdm-data-table>
 */
@Component({
  selector: 'pdm-data-table',
  templateUrl: './data-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmDataTableComponent<T = any> {
  @Input() className = '';
  
  /**
   * Columnas a mostrar
   * Si no se provee, intenta inferir del primer row (legacy mode)
   */
  @Input() columns: PdmDataTableColumn<T>[] = [];
  
  /**
   * Estrategia responsive de la tabla
   */
  @Input() responsiveStrategy: TableResponsiveStrategy = 'scroll';
  
  /**
   * Si es true, muestra checkbox de selección en cada fila
   */
  @Input() selectable = false;
  
  /**
   * Si es true, muestra botón de acciones (tres puntos) en cada fila
   */
  @Input() showActions = false;
  
  /**
   * Si es true, muestra filtro de búsqueda
   */
  @Input() showFilter = true;
  
  /**
   * Si es true, muestra controles de paginación
   */
  @Input() showPagination = true;
  
  /**
   * Si es true, muestra selector de columnas
   */
  @Input() showColumnSelector = false;
  
  // Labels i18n
  @Input() filterPlaceholder = 'Filter...';
  @Input() columnsLabel = 'Columns';
  @Input() previousLabel = 'Previous';
  @Input() nextLabel = 'Next';
  @Input() emptyLabel = 'No results.';
  @Input() rowsSelectedLabel = 'row(s) selected';
  
  // DEPRECATED: Labels hardcodeados para backward compatibility
  /**
   * @deprecated Use columns configuration instead
   */
  @Input() statusLabel = 'Status';
  /**
   * @deprecated Use columns configuration instead
   */
  @Input() emailLabel = 'Email';
  /**
   * @deprecated Use columns configuration instead
   */
  @Input() amountLabel = 'Amount';
  
  /**
   * Datos a mostrar
   */
  @Input() rows: T[] = [];
  
  /**
   * Página actual (1-indexed)
   */
  @Input() page = 1;
  
  /**
   * Cantidad de filas por página
   */
  @Input() pageSize = 10;
  
  /**
   * Query de filtrado
   */
  @Input() query = '';
  
  /**
   * Función custom de filtrado
   * Si no se provee, busca en todos los campos string
   */
  @Input() filterFn?: (row: T, query: string) => boolean;

  @Output() queryChange = new EventEmitter<string>();
  @Output() rowAction = new EventEmitter<T>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() selectionChange = new EventEmitter<{ row: T; selected: boolean }>();
  @Output() columnSort = new EventEmitter<{ column: PdmDataTableColumn<T>; direction: 'asc' | 'desc' }>();

  // Estado interno
  selectedRows = new Set<T>();
  sortColumn?: PdmDataTableColumn<T>;
  sortDirection: 'asc' | 'desc' = 'asc';

  /**
   * Backward compatibility: si no hay columnas definidas, inferir del primer row
   */
  get effectiveColumns(): PdmDataTableColumn<T>[] {
    if (this.columns.length > 0) {
      return this.columns;
    }
    
    // Legacy mode: inferir columnas del primer row (solo para PdmDataTableRow)
    if (this.rows.length > 0) {
      const firstRow = this.rows[0] as any;
      return Object.keys(firstRow)
        .filter(key => key !== 'selected')
        .map(key => ({
          key: key as keyof T,
          label: this.getLegacyLabel(key),
          align: key === 'amount' ? 'right' : 'left'
        }));
    }
    
    return [];
  }

  /**
   * LEGACY: mapeo de keys a labels hardcodeados
   */
  private getLegacyLabel(key: string): string {
    const map: Record<string, string> = {
      status: this.statusLabel,
      email: this.emailLabel,
      amount: this.amountLabel
    };
    return map[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }

  get filteredRows(): T[] {
    const q = this.query.trim().toLowerCase();
    if (!q) return this.rows;
    
    if (this.filterFn) {
      return this.rows.filter(row => this.filterFn!(row, q));
    }
    
    // Filtrado default: buscar en todos los campos string
    return this.rows.filter(row => {
      return Object.values(row as any).some(val => 
        typeof val === 'string' && val.toLowerCase().includes(q)
      );
    });
  }

  get pagedRows(): T[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRows.length / this.pageSize));
  }

  get selectedCount(): number {
    return this.selectedRows.size;
  }

  onQueryInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.queryChange.emit(value);
  }

  onToggleRow(row: T, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    
    if (checked) {
      this.selectedRows.add(row);
    } else {
      this.selectedRows.delete(row);
    }
    
    this.selectionChange.emit({ row, selected: checked });
  }

  onToggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    
    if (checked) {
      this.pagedRows.forEach(row => this.selectedRows.add(row));
    } else {
      this.pagedRows.forEach(row => this.selectedRows.delete(row));
    }
  }

  isSelected(row: T): boolean {
    return this.selectedRows.has(row);
  }

  previous(): void {
    if (this.page <= 1) return;
    this.pageChange.emit(this.page - 1);
  }

  next(): void {
    if (this.page >= this.totalPages) return;
    this.pageChange.emit(this.page + 1);
  }

  onAction(row: T): void {
    this.rowAction.emit(row);
  }

  onSort(column: PdmDataTableColumn<T>): void {
    if (!column.sortable) return;
    
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    this.columnSort.emit({ column, direction: this.sortDirection });
  }

  getCellValue(row: T, column: PdmDataTableColumn<T>): any {
    const value = row[column.key];
    
    if (column.render) {
      return column.render(value, row);
    }
    
    return value != null ? String(value) : '';
  }

  getCellClass(column: PdmDataTableColumn<T>): string {
    const classes = ['px-2', 'py-2'];
    
    if (column.align === 'center') classes.push('text-center');
    if (column.align === 'right') classes.push('text-right');
    if (column.hideOnMobile) classes.push('hidden', 'md:table-cell');
    if (column.cellClass) classes.push(column.cellClass);
    
    return classes.join(' ');
  }

  getHeaderClass(column: PdmDataTableColumn<T>): string {
    const classes = ['px-2', 'py-2', 'text-left', 'font-medium'];
    
    if (column.hideOnMobile) classes.push('hidden', 'md:table-cell');
    if (column.headerClass) classes.push(column.headerClass);
    
    return classes.join(' ');
  }

  getColumnStyle(column: PdmDataTableColumn<T>): any {
    return column.width ? { width: column.width } : {};
  }
}
