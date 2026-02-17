import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface PdmNavigationItem {
  label: string;
  href?: string;
  active?: boolean;
}

@Component({
  selector: 'pdm-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmNavigationMenuComponent {
  @Input() items: PdmNavigationItem[] = [];
  @Input() className = '';
}
