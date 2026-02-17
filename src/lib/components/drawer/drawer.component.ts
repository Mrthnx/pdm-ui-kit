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
  @Input() title = 'Move Goal';
  @Input() description = 'Set your daily activity goal.';
  @Input() value = 350;
  @Input() unit = 'CALORIES/DAY';

  @Input() profileTitle = 'Edit profile';
  @Input() profileDescription = 'Make changes to your profile here. Click save when you\'re done.';
  @Input() nameLabel = 'Name';
  @Input() nameValue = 'Pedro Duarte';
  @Input() usernameLabel = 'Username';
  @Input() usernameValue = '@peduarte';

  @Output() openChange = new EventEmitter<boolean>();
  @Output() primaryAction = new EventEmitter<void>();
  @Output() secondaryAction = new EventEmitter<void>();

  readonly bars = [72, 54, 58, 49, 60, 65, 44, 53, 61, 52, 63, 48, 66];

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
