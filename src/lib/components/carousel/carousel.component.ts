import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export type PdmCarouselVariant = 'default' | 'sizes' | 'orientation' | 'api';

@Component({
  selector: 'pdm-carousel',
  templateUrl: './carousel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmCarouselComponent {
  @Input() variant: PdmCarouselVariant = 'default';
  @Input() className = '';
  @Input() slides: number[] = [1, 2, 3, 4, 5];
  @Input() startIndex = 0;
  @Input() loop = false;

  @Output() indexChange = new EventEmitter<number>();

  private _index = 0;

  ngOnInit(): void {
    this._index = this.normalizeIndex(this.startIndex);
  }

  get index(): number {
    return this._index;
  }

  get canPrev(): boolean {
    return this.loop || this._index > 0;
  }

  get canNext(): boolean {
    return this.loop || this._index < this.maxIndex;
  }

  get maxIndex(): number {
    if (this.slides.length === 0) {
      return 0;
    }
    if (this.variant === 'sizes') {
      return Math.max(0, this.slides.length - 3);
    }
    if (this.variant === 'orientation') {
      return Math.max(0, this.slides.length - 2);
    }
    return Math.max(0, this.slides.length - 1);
  }

  get visibleSlides(): number[] {
    if (this.slides.length === 0) {
      return [];
    }

    if (this.variant === 'sizes') {
      return this.sliceWindow(3);
    }

    if (this.variant === 'orientation') {
      return this.sliceWindow(2);
    }

    return [this.slides[this._index]];
  }

  onPrev(): void {
    if (!this.canPrev) {
      return;
    }

    const next = this._index - 1;
    this.setIndex(this.loop && next < 0 ? this.maxIndex : next);
  }

  onNext(): void {
    if (!this.canNext) {
      return;
    }

    const next = this._index + 1;
    this.setIndex(this.loop && next > this.maxIndex ? 0 : next);
  }

  private setIndex(value: number): void {
    const normalized = this.normalizeIndex(value);
    this._index = normalized;
    this.indexChange.emit(this._index);
  }

  private normalizeIndex(value: number): number {
    if (this.slides.length === 0) {
      return 0;
    }
    return Math.min(this.maxIndex, Math.max(0, value));
  }

  private sliceWindow(size: number): number[] {
    return this.slides.slice(this._index, this._index + size);
  }
}
