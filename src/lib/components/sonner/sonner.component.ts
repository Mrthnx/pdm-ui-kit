import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export type PdmToastTone = 'default' | 'success' | 'error' | 'warning';

@Component({
  selector: 'pdm-sonner',
  templateUrl: './sonner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmSonnerComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() tone: PdmToastTone = 'default';
  @Input() className = '';

  @Output() dismissed = new EventEmitter<void>();

  get toneClass(): string {
    if (this.tone === 'success') return 'border-emerald-200 bg-emerald-50 text-emerald-900';
    if (this.tone === 'error') return 'border-red-200 bg-red-50 text-red-900';
    if (this.tone === 'warning') return 'border-amber-200 bg-amber-50 text-amber-900';

    return 'border-border bg-background text-foreground';
  }
}
