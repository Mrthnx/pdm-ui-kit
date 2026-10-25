import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import type { PdmNativeSelectOption } from 'pdm-ui-kit/src/native-select';
import type { PdmSelectComponent } from 'pdm-ui-kit/src/select';

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

  /** Rows-per-page select, used to re-assert the authoritative value. */
  @ViewChild('rowsPerPageSelect') private rowsPerPageSelect?: PdmSelectComponent;

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
    const current = Math.min(Math.max(1, this.page), total);
    const maxNumericPages = Math.max(3, Math.floor(this.maxVisible));

    if (total <= maxNumericPages) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const middleSlots = maxNumericPages - 2;
    let start = current - Math.floor((middleSlots - 1) / 2);
    let end = start + middleSlots - 1;

    if (start < 2) {
      start = 2;
      end = start + middleSlots - 1;
    }

    if (end > total - 1) {
      end = total - 1;
      start = end - middleSlots + 1;
    }

    const pages = [1];
    for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
      pages.push(pageNumber);
    }
    pages.push(total);

    return pages.reduce<Array<number | 'ellipsis'>>((result, pageNumber) => {
      const previous = result[result.length - 1];

      if (typeof previous === 'number') {
        if (pageNumber - previous === 2) {
          result.push(previous + 1);
        } else if (pageNumber - previous > 2) {
          result.push('ellipsis');
        }
      }

      result.push(pageNumber);
      return result;
    }, []);
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
      this.restoreRowsPerPageValue();
      return;
    }

    this.rowsPerPageChange.emit(next);

    // The host owns `rowsPerPage`: when it does not apply the new value, the
    // control must keep showing the page size the pagination is really using.
    if (String(this.rowsPerPage) !== String(next)) {
      this.restoreRowsPerPageValue();
    }
  }

  /**
   * Writes the authoritative rows-per-page value back into the select.
   *
   * `pdm-select` keeps its internal value in sync with the user's pick (the
   * ControlValueAccessor contract: Angular Forms never writes the model value
   * back into the view), so a host that ignores `rowsPerPageChange` would leave
   * the control displaying a page size the pagination is not using.
   */
  private restoreRowsPerPageValue(): void {
    this.rowsPerPageSelect?.writeValue(this.rowsPerPageValue);
  }
}
