import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pdm-slider',
  templateUrl: './slider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmSliderComponent {
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() value = 0;
  @Input() disabled = false;
  @Input() className = '';

  @Output() valueChange = new EventEmitter<number>();

  get percentage(): number {
    const safeRange = this.max - this.min;
    if (safeRange <= 0) {
      return 0;
    }

    const bounded = Math.min(this.max, Math.max(this.min, this.value));
    return ((bounded - this.min) / safeRange) * 100;
  }

  onInput(event: Event): void {
    this.valueChange.emit(Number((event.target as HTMLInputElement).value));
  }
}
