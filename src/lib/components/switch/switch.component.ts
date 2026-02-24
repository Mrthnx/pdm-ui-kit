import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

export type PdmSwitchSize = 'default' | 'sm';

@Component({
  selector: 'pdm-switch',
  templateUrl: './switch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmSwitchComponent {
  constructor(private readonly cdr: ChangeDetectorRef) {}

  @Input() id = '';
  @Input() checked = false;
  @Input() disabled = false;
  @Input() label = '';
  @Input() className = '';
  @Input() size: PdmSwitchSize = 'default';

  @Output() checkedChange = new EventEmitter<boolean>();

  get rootClasses(): string[] {
    return [
      'peer relative inline-flex appearance-none shrink-0 items-center rounded-full border border-transparent outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
      this.size === 'sm' ? 'h-[14px] w-[24px]' : 'h-[18.4px] w-[32px]',
      this.checked ? 'bg-primary' : 'bg-input dark:bg-input/80'
    ];
  }

  get thumbClasses(): string[] {
    return [
      'pointer-events-none block rounded-full bg-background ring-0 transition-transform',
      this.size === 'sm' ? 'size-3' : 'size-4',
      this.checked ? 'translate-x-[calc(100%-2px)]' : 'translate-x-0'
    ];
  }

  onToggle(): void {
    if (this.disabled) return;
    const next = !this.checked;
    this.checked = next;
    this.checkedChange.emit(next);
    this.cdr.markForCheck();
  }
}
