import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import type { PdmNativeSelectOption } from '../native-select/native-select.component';

@Component({
  selector: 'pdm-pagination',
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmPaginationComponent {
  @Input() page = 1;
  @Input() pageCount = 1;
  @Input() maxVisible = 4;
  @Input() className = '';
  @Input() rowsPerPageLabel = 'Rows per page';
  @Input() rowsPerPage = 10;
  @Input() rowsPerPageOptions: number[] = [10, 20, 30, 50];

  @Output() pageChange = new EventEmitter<number>();
  @Output() rowsPerPageChange = new EventEmitter<number>();

  get rowsPerPageSelectOptions(): PdmNativeSelectOption[] {
    return this.rowsPerPageOptions.map((value) => ({
      label: String(value),
      value: String(value)
    }));
  }

  get rowsPerPageValue(): string {
    return String(this.rowsPerPage);
  }

  get visiblePages(): Array<number | 'ellipsis'> {
    const total = Math.max(1, this.pageCount);
    if (total <= Math.max(1, this.maxVisible)) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    return [1, 2, 'ellipsis', total];
  }

  setPage(next: number): void {
    if (next < 1 || next > this.pageCount || next === this.page) {
      return;
    }

    this.pageChange.emit(next);
  }

  onRowsPerPageChangeValue(value: string): void {
    const next = Number(value);
    if (!Number.isFinite(next) || next <= 0 || next === this.rowsPerPage) {
      return;
    }

    this.rowsPerPageChange.emit(next);
  }
}
