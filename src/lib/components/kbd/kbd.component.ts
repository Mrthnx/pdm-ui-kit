import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'pdm-kbd',
  templateUrl: './kbd.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmKbdComponent {
  @Input() className = '';
}
