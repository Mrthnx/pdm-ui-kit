import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'pdm-skeleton',
  templateUrl: './skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmSkeletonComponent {
  @Input() className = '';
}
