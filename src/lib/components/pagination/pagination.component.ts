import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pdm-pagination',
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmPaginationComponent {
  @Input() page = 1;
  @Input() pageCount = 1;
  @Input() maxVisible = 5;
  @Input() className = '';

  @Output() pageChange = new EventEmitter<number>();

  get visiblePages(): number[] {
    const total = Math.max(1, this.pageCount);
    const visible = Math.max(1, this.maxVisible);
    const half = Math.floor(visible / 2);
    let start = Math.max(1, this.page - half);
    let end = Math.min(total, start + visible - 1);

    if (end - start + 1 < visible) {
      start = Math.max(1, end - visible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  setPage(next: number): void {
    if (next < 1 || next > this.pageCount || next === this.page) {
      return;
    }

    this.pageChange.emit(next);
  }
}
