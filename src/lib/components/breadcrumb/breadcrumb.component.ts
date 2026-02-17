import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type PdmBreadcrumbMode =
  | 'custom-separator'
  | 'dropdown'
  | 'collapsed'
  | 'link-component'
  | 'responsive';

@Component({
  selector: 'pdm-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmBreadcrumbComponent {
  @Input() mode: PdmBreadcrumbMode = 'link-component';
  @Input() items: string[] = ['Home', 'Components', 'Breadcrumb'];
  @Input() className = '';

  get renderedItems(): string[] {
    if ((this.mode === 'collapsed' || this.mode === 'responsive') && this.items.length > 3) {
      return [this.items[0], '...', this.items[this.items.length - 2], this.items[this.items.length - 1]];
    }
    return this.items;
  }
}
