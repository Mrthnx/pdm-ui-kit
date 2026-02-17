import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export type PdmToggleSize = 'sm' | 'default' | 'lg';

@Component({
  selector: 'pdm-toggle',
  templateUrl: './toggle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmToggleComponent {
  @Input() pressed = false;
  @Input() disabled = false;
  @Input() size: PdmToggleSize = 'default';
  @Input() className = '';

  @Output() pressedChange = new EventEmitter<boolean>();

  toggle(): void {
    if (!this.disabled) {
      this.pressedChange.emit(!this.pressed);
    }
  }

  get sizeClass(): string {
    if (this.size === 'sm') return 'h-8 px-2.5 min-w-[32px]';
    if (this.size === 'lg') return 'h-10 px-4 min-w-[40px]';
    return 'h-9 px-3 min-w-[36px]';
  }
}
