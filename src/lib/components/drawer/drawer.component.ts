import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export type PdmDrawerVariant = 'drawer' | 'responsive-dialog';

@Component({
  selector: 'pdm-drawer',
  templateUrl: './drawer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmDrawerComponent {
  @Input() open = false;
  @Input() variant: PdmDrawerVariant = 'drawer';
  @Input() className = '';
  @Input() title = '';
  @Input() description = '';
  @Input() value: number | string = '';
  @Input() unit = '';
  @Input() decrementLabel = '-';
  @Input() incrementLabel = '+';
  @Input() primaryLabel = '';
  @Input() secondaryLabel = '';

  @Input() profileTitle = '';
  @Input() profileDescription = '';
  @Input() nameLabel = 'Name';
  @Input() nameValue = '';
  @Input() usernameLabel = 'Username';
  @Input() usernameValue = '';
  @Input() responsivePrimaryLabel = '';

  @Output() openChange = new EventEmitter<boolean>();
  @Output() primaryAction = new EventEmitter<void>();
  @Output() secondaryAction = new EventEmitter<void>();

  @Input() bars: number[] = [];

  close(): void {
    this.openChange.emit(false);
  }

  onPrimaryAction(): void {
    this.primaryAction.emit();
  }

  onSecondaryAction(): void {
    this.secondaryAction.emit();
  }
}
