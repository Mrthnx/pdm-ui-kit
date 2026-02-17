import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'pdm-spinner',
  templateUrl: './spinner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmSpinnerComponent {
  @Input() size = 16;
  @Input() className = '';
}
