import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'pdm-progress',
  templateUrl: './progress.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmProgressComponent {
  @Input() value = 0;
  @Input() max = 100;
  @Input() indeterminate = false;
  @Input() className = '';

  get width(): string {
    if (this.indeterminate) return '100%';
    const safeMax = this.max > 0 ? this.max : 100;
    const pct = Math.min(100, Math.max(0, (this.value / safeMax) * 100));
    return pct + '%';
  }
}
