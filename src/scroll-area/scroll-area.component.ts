import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'pdm-scroll-area',
  templateUrl: './scroll-area.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmScrollAreaComponent {
  @Input() maxHeight = '16rem';
  @Input() className = '';
}
