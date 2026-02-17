import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'pdm-item',
  templateUrl: './item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmItemComponent {
  @Input() className = '';
  @Input() disabled = false;
  @Input() selected = false;
}
