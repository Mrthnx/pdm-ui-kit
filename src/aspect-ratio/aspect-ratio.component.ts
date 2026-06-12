import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'pdm-aspect-ratio',
  templateUrl: './aspect-ratio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmAspectRatioComponent {
  @Input() ratio = 16 / 9;
  @Input() imageSrc = '';
  @Input() imageAlt = '';
  @Input() className = '';

  get paddingTop(): string {
    if (!this.ratio || this.ratio <= 0) return '56.25%';
    return (100 / this.ratio).toFixed(4) + '%';
  }
}
