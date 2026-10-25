import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import type { PdmDataTableColumn } from 'pdm-ui-kit/src/data-table';

/**
 * Virtualized table built on top of `@angular/cdk/scrolling`.
 *
 * Only the rows visible in the viewport are rendered in the DOM, which keeps
 * change detection cheap for large datasets (hundreds or thousands of rows).
 *
 * The cell rendering rules are shared with `pdm-data-table`: `render`,
 * `cellTemplate`, `align`, `hideOnMobile`, `cellClass`, `headerClass`,
 * `width` and `key` are all honored.
 *
 * @example
 * columns: PdmDataTableColumn<User>[] = [
 *   { key: 'name', label: 'Name' },
 *   { key: 'email', label: 'Email', hideOnMobile: true },
 * ];
 *
 * <pdm-virtual-table
 *   [columns]="columns"
 *   [rows]="users"
 *   [rowHeight]="48"
 *   [height]="600"
 *   [selectable]="true"
 *   (selectionChange)="onSelectionChange($event)">
 * </pdm-virtual-table>
 */
@Component({
  selector: 'pdm-virtual-table',
  templateUrl: './virtual-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdmVirtualTableComponent<T = any> {
  /**
   * Additional CSS classes applied to the component wrapper.
   */
  @Input() className = '';

  /**
   * Columns to render. Reuses the `pdm-data-table` column definition.
   */
  @Input() columns: PdmDataTableColumn<T>[] = [];

  /**
   * Rows to render. Only the visible window is instantiated in the DOM.
   */
  @Input() rows: T[] = [];

  /**
   * Fixed height of every row, in pixels. Must match the rendered row height
   * so the virtual scroll geometry stays correct.
   */
  @Input() rowHeight = 44;

  /**
   * Height of the scrolling viewport, in pixels.
   */
  @Input() height = 400;

  /**
   * If true, renders a checkbox column with per-row selection.
   */
  @Input() selectable = false;

  /**
   * If true, renders an actions column that emits `rowAction`.
   */
  @Input() showActions = false;

  /**
   * Label rendered when there are no rows.
   */
  @Input() emptyLabel = 'No results.';

  /**
   * Emits the row the user asked to act on.
   */
  @Output() rowAction = new EventEmitter<T>();

  /**
   * Emits every selection change.
   */
  @Output() selectionChange = new EventEmitter<{
    row: T;
    selected: boolean;
  }>();

  /**
   * Identifiers of the currently selected rows.
   */
  private readonly selectedKeys = new Set<unknown>();

  /**
   * Tracks rows by a stable identity: `row.id` when available, the row index
   * otherwise. Using the index as fallback keeps the track-by function total
   * for rows without an identifier.
   */
  trackByRow = (index: number, row: T): unknown => {
    const id = (row as unknown as { id?: unknown } | null | undefined)?.id;
    return id !== undefined && id !== null ? id : index;
  };

  /**
   * Raw value of a cell, before the optional `render` function is applied.
   */
  rawValue(row: T, column: PdmDataTableColumn<T>): unknown {
    return row[column.key];
  }

  /**
   * Text rendered for a cell when no `cellTemplate` is provided.
   */
  getCellValue(row: T, column: PdmDataTableColumn<T>): string {
    const value = this.rawValue(row, column);

    if (column.render) {
      return column.render(value, row);
    }

    return value !== null && value !== undefined ? String(value) : '';
  }

  getCellClass(column: PdmDataTableColumn<T>): string {
    const classes = ['px-2', 'py-2'];

    if (column.align === 'center') {
      classes.push('text-center');
    } else if (column.align === 'right') {
      classes.push('text-right');
    }

    if (column.hideOnMobile) {
      classes.push('hidden', 'md:flex');
    }

    if (column.cellClass) {
      classes.push(column.cellClass);
    }

    return classes.join(' ');
  }

  getHeaderClass(column: PdmDataTableColumn<T>): string {
    const classes = ['px-2', 'py-2', 'text-left', 'font-medium'];

    if (column.hideOnMobile) {
      classes.push('hidden', 'md:flex');
    }

    if (column.headerClass) {
      classes.push(column.headerClass);
    }

    return classes.join(' ');
  }

  /**
   * Inline style for a column. Columns with an explicit width keep it, the
   * remaining ones share the available space evenly.
   */
  getColumnStyle(column: PdmDataTableColumn<T>): Record<string, string> {
    if (column.width) {
      return { width: column.width, flex: '0 0 auto' };
    }

    return { flex: '1 1 0%', minWidth: '0' };
  }

  /**
   * Fixed width of the selection / actions columns.
   */
  get utilityColumnStyle(): Record<string, string> {
    return { width: '40px', flex: '0 0 auto' };
  }

  isSelected(row: T, index: number): boolean {
    return this.selectedKeys.has(this.trackByRow(index, row));
  }

  onToggleRow(row: T, index: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const key = this.trackByRow(index, row);

    if (checked) {
      this.selectedKeys.add(key);
    } else {
      this.selectedKeys.delete(key);
    }

    this.selectionChange.emit({ row, selected: checked });
  }

  /**
   * Selects or deselects every row currently loaded in the component.
   * A `selectionChange` event is emitted for every row whose state changed.
   */
  onToggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    this.rows.forEach((row, index) => {
      const key = this.trackByRow(index, row);
      const wasSelected = this.selectedKeys.has(key);

      if (checked) {
        this.selectedKeys.add(key);
      } else {
        this.selectedKeys.delete(key);
      }

      if (wasSelected !== checked) {
        this.selectionChange.emit({ row, selected: checked });
      }
    });
  }

  onAction(row: T): void {
    this.rowAction.emit(row);
  }
}
