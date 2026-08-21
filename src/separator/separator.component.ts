import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pdm-separator',
  templateUrl: './separator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class PdmSeparatorComponent {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() decorative = true;
  @Input() className = '';

  get orientationClass(): string {
    return this.orientation === 'vertical' ? 'h-full w-px' : 'h-px w-full';
  }
}
