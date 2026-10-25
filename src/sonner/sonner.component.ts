import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';

export type PdmToastTone = 'default' | 'success' | 'error' | 'warning';

/**
 * A single toast rendered by the list mode of `pdm-sonner`.
 *
 * All fields are optional so a consumer can pass partial items, e.g.
 * `{ title: 'Saved' }` or `{ description: 'Something happened', tone: 'error' }`.
 *
 * @remarks
 * `duration` is accepted for API symmetry with other toast libraries, but the
 * kit does **not** auto-dismiss toasts: the host owns the lifetime of every
 * item and removes it from the `toasts` array when it should disappear.
 */
export interface PdmToastItem {
  /** Bold headline of the toast. */
  title?: string;
  /** Secondary line rendered under the title. */
  description?: string;
  /** Semantic tone driving the border/background/text colors. */
  tone?: PdmToastTone;
  /**
   * Optional stable identifier. When present it is used to track the item
   * across input updates; otherwise the item position is used.
   */
  id?: string | number;
  /**
   * Accepted for API symmetry only. The kit does not auto-dismiss toasts,
   * so this value is never used to trigger a timer.
   */
  duration?: number;
}

@Component({
  selector: 'pdm-sonner',
  templateUrl: './sonner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmSonnerComponent implements OnChanges {
  @Input() title = '';
  @Input() description = '';
  @Input() tone: PdmToastTone = 'default';
  @Input() className = '';

  /**
   * List of toasts to render as a stack.
   *
   * When omitted or empty the component keeps its single-toast behavior
   * (`title` / `description` / `tone` inputs).
   *
   * @remarks
   * Projected content (`<ng-content>`) belongs to the single-toast mode. In
   * list mode each toast renders its own `title` / `description` / `tone`.
   */
  @Input() toasts?: PdmToastItem[];

  /** Emitted when the single toast is dismissed. Unchanged for backwards compatibility. */
  @Output() dismissed = new EventEmitter<void>();

  /** Emitted with the dismissed item when a toast of the list mode is dismissed. */
  @Output() toastDismissed = new EventEmitter<PdmToastItem>();

  /** Keys of the list-mode items dismissed by the user during this input cycle. */
  private dismissedKeys = new Set<string>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['toasts']) {
      // A new input reference means a new set of items: forget the previous
      // dismissals so previously dismissed toasts can show up again.
      this.dismissedKeys = new Set<string>();
    }
  }

  /** True when the list mode should be rendered (a non-empty `toasts` array was provided). */
  get hasToasts(): boolean {
    return Array.isArray(this.toasts) && this.toasts.length > 0;
  }

  /** Toasts of the list mode that have not been dismissed yet, with their tracking keys. */
  get visibleToasts(): { toast: PdmToastItem; key: string }[] {
    if (!this.hasToasts) return [];

    return (this.toasts as PdmToastItem[])
      .map((toast, index) => ({ toast, key: this.toastKey(toast, index) }))
      .filter(entry => !this.dismissedKeys.has(entry.key));
  }

  /** Stable key for a list-mode item, used to track dismissals. */
  toastKey(toast: PdmToastItem, index: number): string {
    if (toast.id !== undefined && toast.id !== null) return `id:${toast.id}`;

    return `pos:${index}`;
  }

  /** Tone classes for a list-mode item. */
  toneClassFor(tone?: PdmToastTone): string {
    return this.toneClassOf(tone);
  }

  /** Track-by helper for the list mode. */
  trackByKey(_index: number, entry: { toast: PdmToastItem; key: string }): string {
    return entry.key;
  }

  /** Dismiss a single toast of the list mode and notify the host. */
  dismissToast(toast: PdmToastItem, key: string): void {
    this.dismissedKeys.add(key);
    this.toastDismissed.emit(toast);
  }

  get toneClass(): string {
    return this.toneClassOf(this.tone);
  }

  private toneClassOf(tone?: PdmToastTone): string {
    if (tone === 'success') return 'border-emerald-200 bg-emerald-50 text-emerald-900';
    if (tone === 'error') return 'border-red-200 bg-red-50 text-red-900';
    if (tone === 'warning') return 'border-amber-200 bg-amber-50 text-amber-900';

    return 'border-border bg-background text-foreground';
  }
}
