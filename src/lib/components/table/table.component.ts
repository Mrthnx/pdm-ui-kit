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

export type PdmTableVariant = 'default' | 'data' | 'interactive';

@Component({
  selector: 'pdm-table',
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmTableComponent {
  @Input() variant: PdmTableVariant = 'default';
  @Input() reorderRows = false;
  @Input() dragHandleSelector = '[data-drag-handle],[data-slot=row-drag-handle],.row-drag-handle,[data-auto-drag-handle]';
  @Input() className = '';
  @Output() rowOrderChange = new EventEmitter<string[]>();

  @ViewChild('tableElement') tableElement?: ElementRef<HTMLTableElement>;

  private cleanupListeners: Array<() => void> = [];
  private observer?: MutationObserver;
  private draggedRow: HTMLTableRowElement | null = null;

  constructor(private readonly renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.syncReorderBehavior();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reorderRows'] || changes['variant']) {
      this.syncReorderBehavior();
    }
  }

  ngOnDestroy(): void {
    this.cleanupReorderBehavior();
  }

  get wrapperClasses(): string[] {
    return [
      'relative w-full overflow-auto',
      this.variant === 'interactive' ? 'overflow-x-auto overflow-y-hidden rounded-xl border border-border bg-background' : '',
      this.variant === 'data' ? 'overflow-hidden rounded-md border border-border bg-background' : '',
      this.className
    ];
  }

  get tableClasses(): string[] {
    return [
      'w-full caption-bottom text-sm',
      this.variant === 'data'
        ? 'border-collapse text-foreground [&_thead_tr]:border-b [&_thead_tr]:border-border [&_tbody_tr]:border-b [&_tbody_tr]:border-border [&_tbody_tr:last-child]:border-b-0 [&_th]:h-10 [&_th]:px-2 [&_th]:text-left [&_th]:align-middle [&_th]:font-medium [&_td]:p-2 [&_td]:align-middle'
        : '',
      this.variant === 'interactive'
        ? 'text-foreground [&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10 [&_thead]:bg-muted/70 [&_thead_tr]:border-b [&_thead_tr]:border-border [&_th]:h-12 [&_th]:px-4 [&_th]:text-left [&_th]:align-middle [&_th]:text-sm [&_th]:font-medium [&_th]:whitespace-nowrap [&_tbody_tr]:border-b [&_tbody_tr]:border-border [&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-muted/50 [&_tbody_tr:last-child]:border-b-0 [&_td]:h-14 [&_td]:px-4 [&_td]:align-middle [&_td]:text-sm [&_td]:whitespace-nowrap [&_td:first-child]:w-10 [&_td:last-child]:w-10 [&_svg]:text-muted-foreground'
        : ''
    ];
  }

  private syncReorderBehavior(): void {
    this.cleanupReorderBehavior();

    if (!this.isReorderEnabled) {
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

  private get isReorderEnabled(): boolean {
    return this.reorderRows;
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
