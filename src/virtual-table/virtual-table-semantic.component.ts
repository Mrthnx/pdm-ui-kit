import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import type { PdmDataTableColumn } from 'pdm-ui-kit/src/data-table';

/**
 * Amount of rows rendered above and below the visible window.
 */
const OVERSCAN = 2;

/**
 * Virtualized table that keeps native table semantics.
 *
 * Unlike `pdm-virtual-table` (which renders a `<section>` with ARIA roles),
 * this component renders a real `<table>` with a `<thead>`, a `<tbody>` and
 * `<th scope="col">` headers, so screen readers announce the same column
 * semantics as a hand written table.
 *
 * The column model is the one of `pdm-data-table`: `key`, `label`, `render`,
 * `cellTemplate`, `align`, `hideOnMobile`, `cellClass`, `headerClass` and
 * `width` are all honored, which means consumer cells (badges, action menus,
 * row hover state) do not have to be rewritten.
 *
 * Why the component does NOT use `CdkVirtualScrollViewport`:
 * the CDK viewport projects its content into `.cdk-virtual-scroll-content-wrapper`,
 * an absolutely positioned, transform driven wrapper. A `position: sticky`
 * `<thead>` inside that wrapper does not stick against the scrollport, so the
 * CDK cannot satisfy "the sticky header has to keep working against that
 * scroll container" while keeping the table in a single element. This
 * component therefore owns a plain `overflow: auto` scroll container and
 * windows the rows itself (two `aria-hidden` spacer rows keep the scroll
 * height correct).
 *
 * @example
 * columns: PdmDataTableColumn<User>[] = [
 *   { key: 'name', label: 'Name' },
 *   { key: 'email', label: 'Email', hideOnMobile: true },
 * ];
 *
 * <pdm-virtual-table-semantic
 *   [columns]="columns"
 *   [rows]="users"
 *   [rowHeight]="48"
 *   [height]="'60vh'"
 *   [selectable]="true"
 *   (selectionChange)="onSelectionChange($event)">
 * </pdm-virtual-table-semantic>
 */
@Component({
  selector: 'pdm-virtual-table-semantic',
  templateUrl: './virtual-table-semantic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdmVirtualTableSemanticComponent<T = any>
  implements OnChanges, AfterViewInit, OnDestroy {
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
   * Height of the scroll container. Either a number of pixels or any CSS
   * length (`'60vh'`, `'100%'`, ...).
   */
  @Input() height: number | string = 400;

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
   * Optional caption. When non-empty it is rendered as a real `<caption>`.
   */
  @Input() caption = '';

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
   * The scroll container of the component.
   */
  @ViewChild('scrollContainer') scrollContainer?: ElementRef<HTMLElement>;

  /**
   * Identifiers of the currently selected rows.
   */
  private readonly selectedKeys = new Set<unknown>();

  /**
   * Scroll container element, cached after the view is initialized.
   */
  private scrollElement?: HTMLElement;

  /**
   * Observer keeping `viewportHeight` in sync with the container size.
   */
  private resizeObserver?: ResizeObserver;

  /**
   * Measured height (in pixels) of the scroll container.
   */
  private viewportHeight = 0;

  /**
   * Absolute index of the first rendered row.
   */
  private windowStart = 0;

  /**
   * Absolute index right after the last rendered row.
   */
  private windowEnd = 0;

  constructor(
    private readonly zone: NgZone,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  /**
   * Rows currently rendered in the DOM (the visible window).
   */
  get visibleRows(): T[] {
    return this.rows.slice(this.windowStart, this.windowEnd);
  }

  /**
   * Absolute index of the first rendered row.
   */
  get startIndex(): number {
    return this.windowStart;
  }

  /**
   * Total amount of columns, including the selection and the actions column.
   */
  get totalColumns(): number {
    return (
      this.columns.length + (this.selectable ? 1 : 0) + (this.showActions ? 1 : 0)
    );
  }

  /**
   * Row height used for the virtual scroll geometry. Guards against a
   * non-positive `rowHeight` (which would break the math).
   */
  get effectiveRowHeight(): number {
    return this.rowHeight > 0 ? this.rowHeight : 1;
  }

  /**
   * Height of the spacer row rendered before the visible window.
   */
  get topSpacerHeight(): number {
    return this.windowStart * this.effectiveRowHeight;
  }

  /**
   * Height of the spacer row rendered after the visible window.
   */
  get bottomSpacerHeight(): number {
    return Math.max(
      0,
      (this.rows.length - this.windowEnd) * this.effectiveRowHeight
    );
  }

  /**
   * Height applied to the scroll container. Numbers are pixels, strings are
   * used as-is so any CSS length (`'60vh'`) works.
   */
  get containerHeight(): string {
    return typeof this.height === 'number' ? `${this.height}px` : this.height;
  }

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
   * Track-by function used by the rendered window. The index is translated
   * back to its absolute position so the keys stay stable while scrolling.
   */
  trackByRenderedRow = (index: number, row: T): unknown => {
    return this.trackByRow(this.windowStart + index, row);
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
    const classes = ['px-2', 'py-2', 'align-middle'];

    if (column.align === 'center') {
      classes.push('text-center');
    } else if (column.align === 'right') {
      classes.push('text-right');
    }

    if (column.hideOnMobile) {
      classes.push('hidden', 'md:table-cell');
    }

    if (column.cellClass) {
      classes.push(column.cellClass);
    }

    return classes.join(' ');
  }

  getHeaderClass(column: PdmDataTableColumn<T>): string {
    const classes = ['px-2', 'py-2', 'text-left', 'font-medium', 'align-middle'];

    if (column.hideOnMobile) {
      classes.push('hidden', 'md:table-cell');
    }

    if (column.headerClass) {
      classes.push(column.headerClass);
    }

    return classes.join(' ');
  }

  /**
   * Inline style for a column header. Only the width is owned by the kit, the
   * table itself stays `w-full` with the default `table-auto` layout.
   */
  getColumnStyle(column: PdmDataTableColumn<T>): Record<string, string> {
    if (column.width) {
      return { width: column.width };
    }

    return {};
  }

  /**
   * Fixed width of the selection / actions columns.
   */
  get utilityColumnStyle(): Record<string, string> {
    return { width: '40px' };
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

  ngOnChanges(changes: SimpleChanges): void {
    if (
      !changes['rows'] &&
      !changes['rowHeight'] &&
      !changes['columns'] &&
      !changes['selectable'] &&
      !changes['showActions']
    ) {
      return;
    }

    this.clampWindow();
    this.updateWindow();
    this.syncScrollTop();
  }

  ngAfterViewInit(): void {
    const element = this.scrollContainer?.nativeElement;

    if (!element) {
      return;
    }

    this.scrollElement = element;

    // The scroll listener is registered manually (not through a template
    // binding) so it runs outside of the Angular zone: scrolling must not
    // trigger change detection on every tick.
    this.zone.runOutsideAngular(() => {
      element.addEventListener('scroll', this.handleScroll, { passive: true });

      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(() => this.handleScroll());
        this.resizeObserver.observe(element);
      }
    });

    // The first measurement is deferred: the container is only measurable
    // once it has been laid out, and updating the window synchronously here
    // would change the rendered rows during the current change detection
    // cycle.
    Promise.resolve().then(() => {
      if (!this.scrollElement) {
        return;
      }

      this.handleScroll();
    });
  }

  ngOnDestroy(): void {
    this.scrollElement?.removeEventListener('scroll', this.handleScroll);
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.scrollElement = undefined;
  }

  /**
   * Scroll handler. Runs outside of the Angular zone, so it re-enters the
   * zone only when the computed window actually changed.
   */
  private readonly handleScroll = (): void => {
    if (this.refreshWindow()) {
      this.zone.run(() => this.changeDetector.markForCheck());
    }
  };

  /**
   * Re-measures the viewport and recomputes the window.
   *
   * @returns `true` when the rendered window changed.
   */
  private refreshWindow(): boolean {
    if (this.scrollElement) {
      this.viewportHeight = this.scrollElement.clientHeight;
    }

    return this.updateWindow();
  }

  /**
   * Computes the visible window from the scroll position and the viewport
   * height, applying two rows of overscan on both sides.
   *
   * @returns `true` when the rendered window changed.
   */
  private updateWindow(): boolean {
    const rowHeight = this.effectiveRowHeight;
    const total = this.rows.length;
    const scrollTop = this.scrollElement ? this.scrollElement.scrollTop : 0;
    const viewportHeight =
      this.viewportHeight > 0 ? this.viewportHeight : rowHeight;

    let start = Math.max(0, Math.floor(scrollTop / rowHeight) - OVERSCAN);
    let end = Math.min(
      total,
      Math.ceil((scrollTop + viewportHeight) / rowHeight) + OVERSCAN
    );

    if (start > total) {
      start = total;
    }

    if (end < start) {
      end = start;
    }

    if (start === this.windowStart && end === this.windowEnd) {
      return false;
    }

    this.windowStart = start;
    this.windowEnd = end;

    return true;
  }

  /**
   * Keeps the window inside the available range.
   */
  private clampWindow(): void {
    const total = this.rows.length;

    if (this.windowStart > total) {
      this.windowStart = total;
    }

    if (this.windowEnd > total) {
      this.windowEnd = total;
    }

    if (this.windowEnd < this.windowStart) {
      this.windowEnd = this.windowStart;
    }
  }

  /**
   * Prevents the container from staying scrolled past the end of the content
   * when the rows change.
   */
  private syncScrollTop(): void {
    const element = this.scrollElement;

    if (!element) {
      return;
    }

    const maxScrollTop = Math.max(
      0,
      this.rows.length * this.effectiveRowHeight - this.viewportHeight
    );

    if (element.scrollTop > maxScrollTop) {
      element.scrollTop = maxScrollTop;
    }
  }
}
