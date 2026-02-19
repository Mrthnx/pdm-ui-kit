import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export interface PdmDataTableRow {
  id: string;
  status: string;
  email: string;
  amount: string;
  selected?: boolean;
}

@Component({
  selector: 'pdm-data-table',
  templateUrl: './data-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmDataTableComponent {
  @Input() className = '';
  @Input() filterPlaceholder = 'Filter...';
  @Input() columnsLabel = 'Columns';
  @Input() statusLabel = 'Status';
  @Input() emailLabel = 'Email';
  @Input() amountLabel = 'Amount';
  @Input() previousLabel = 'Previous';
  @Input() nextLabel = 'Next';
  @Input() emptyLabel = 'No results.';
  @Input() rows: PdmDataTableRow[] = [];

  @Input() page = 1;
  @Input() pageSize = 5;
  @Input() query = '';

  @Output() queryChange = new EventEmitter<string>();
  @Output() rowAction = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() selectionChange = new EventEmitter<{ id: string; selected: boolean }>();

  get filteredRows(): PdmDataTableRow[] {
    const q = this.query.trim().toLowerCase();
    if (!q) return this.rows;
    return this.rows.filter((r) => r.email.toLowerCase().includes(q));
  }

  get pagedRows(): PdmDataTableRow[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRows.length / this.pageSize));
  }

  get selectedCount(): number {
    return this.rows.filter((row) => row.selected).length;
  }

  onQueryInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.queryChange.emit(value);
  }

  onToggleRow(row: PdmDataTableRow, event: Event): void {
    this.selectionChange.emit({ id: row.id, selected: (event.target as HTMLInputElement).checked });
  }

  previous(): void {
    if (this.page <= 1) return;
    this.pageChange.emit(this.page - 1);
  }

  next(): void {
    if (this.page >= this.totalPages) return;
    this.pageChange.emit(this.page + 1);
  }

  onAction(row: PdmDataTableRow): void {
    this.rowAction.emit(row.id);
  }
}
