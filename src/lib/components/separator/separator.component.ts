import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'pdm-separator',
  templateUrl: './separator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmSeparatorComponent {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() decorative = true;
  @Input() className = '';

  get orientationClass(): string {
    return this.orientation === 'vertical' ? 'h-full w-px' : 'h-px w-full';
  }
}
