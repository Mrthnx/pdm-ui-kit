import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'pdm-label',
  templateUrl: './label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmLabelComponent {
  @Input() forId = '';
  @Input() required = false;
  @Input() className = '';
}
