import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';

/**
 * Emits `(pdmOutsideClick)` whenever a `pointerdown` event fires outside the host element.
 *
 * Uses the CAPTURE phase so it intercepts clicks even when inner elements call
 * `stopPropagation()` (e.g. CDK overlay panels).
 *
 * SSR-safe: no listener is registered when running on the server.
 *
 * @example
 * ```html
 * <div [pdmOutsideClick]
 *      (pdmOutsideClick)="close()"
 *      [pdmOutsideClickDisabled]="!open">
 * </div>
 * ```
 */
@Directive({
  selector: '[pdmOutsideClick]'
})
export class PdmOutsideClickDirective implements OnInit, OnDestroy {
  /** When `true`, the outside-click listener is inactive. */
  @Input() pdmOutsideClickDisabled = false;

  /**
   * Additional elements to exclude from the "outside" check.
   * Useful when the trigger lives outside the host (e.g. a menubar button
   * that opens a floating panel bound to a different root element).
   */
  @Input() pdmOutsideClickExclude: Array<HTMLElement | ElementRef<HTMLElement>> = [];

  /** Fires when a `pointerdown` lands outside the host (and excluded elements). */
  @Output() readonly pdmOutsideClick = new EventEmitter<PointerEvent>();

  private readonly isBrowser: boolean;
  private boundHandler!: (event: PointerEvent) => void;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.boundHandler = (event: PointerEvent) => this.onPointerDown(event);
    this.document.addEventListener('pointerdown', this.boundHandler, { capture: true });
  }

  ngOnDestroy(): void {
    if (!this.isBrowser || !this.boundHandler) return;
    this.document.removeEventListener('pointerdown', this.boundHandler, { capture: true });
  }

  private onPointerDown(event: PointerEvent): void {
    if (this.pdmOutsideClickDisabled) return;

    const target = event.target as Node | null;
    if (!target) return;

    // Check if click is inside the host element.
    if (this.elementRef.nativeElement.contains(target)) return;

    // Check if click is inside any excluded element.
    for (const excluded of this.pdmOutsideClickExclude) {
      const el = excluded instanceof ElementRef ? excluded.nativeElement : excluded;
      if (el && el.contains(target)) return;
    }

    this.pdmOutsideClick.emit(event);
  }
}
