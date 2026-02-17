import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pdm-collapsible',
  templateUrl: './collapsible.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmCollapsibleComponent {
  @Input() title = '@peduarte starred 3 repositories';
  @Input() open = false;
  @Input() disabled = false;
  @Input() items: string[] = ['@radix-ui/primitives', '@radix-ui/colors', '@stitches/react'];
  @Input() className = '';

  @Output() openChange = new EventEmitter<boolean>();

  get visibleItems(): string[] {
    if (!this.items.length) {
      return [];
    }
    return this.open ? this.items : this.items.slice(0, 1);
  }

  toggle(): void {
    if (!this.disabled) {
      this.openChange.emit(!this.open);
    }
  }
}
