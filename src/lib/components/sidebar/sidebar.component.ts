import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'pdm-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmSidebarComponent {
  @Input() collapsed = false;
  @Input() className = '';
}
