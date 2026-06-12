import {
  AfterContentInit,
  Directive,
  ElementRef,
  Input
} from '@angular/core';

/**
 * Directive used to declare an option inside `<pdm-select>` via content projection.
 *
 * Usage:
 * ```html
 * <pdm-select [(value)]="val">
 *   <pdm-select-option value="a">Option A</pdm-select-option>
 *   <pdm-select-option value="b" [disabled]="true">Option B</pdm-select-option>
 *   <pdm-select-option value="c" label="Option C"></pdm-select-option>
 * </pdm-select>
 * ```
 *
 * When `label` is not provided, the text content of the projected node is used.
 */
@Directive({
  selector: 'pdm-select-option'
})
export class PdmSelectOptionDirective implements AfterContentInit {
  /** The option value that will be emitted on selection. */
  @Input() value = '';

  /** When true, the option is rendered but cannot be selected. */
  @Input() disabled = false;

  /**
   * Explicit label for the option.
   * When omitted, the directive reads the element's `textContent` after content init.
   */
  @Input() label = '';

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngAfterContentInit(): void {
    // If no explicit label, harvest text from the projected node.
    if (!this.label) {
      this.label = (this.el.nativeElement.textContent ?? '').trim();
    }
  }

  /** Resolved label string — always non-empty after ngAfterContentInit. */
  get resolvedLabel(): string {
    return this.label || this.value;
  }
}
