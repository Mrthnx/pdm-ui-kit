import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pdm-combobox',
  templateUrl: './combobox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmComboboxComponent {
  @Input() open = false;
  @Input() placeholder = 'Select framework...';
  @Input() searchPlaceholder = 'Search framework';
  @Input() className = '';
  @Input() options: string[] = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];
  @Input() value = '';
  @Input() width = 200;

  @Output() openChange = new EventEmitter<boolean>();
  @Output() valueChange = new EventEmitter<string>();

  get selectedLabel(): string {
    return this.value || this.placeholder;
  }

  toggle(): void {
    this.openChange.emit(!this.open);
  }

  select(option: string): void {
    this.valueChange.emit(option);
    this.openChange.emit(false);
  }
}
