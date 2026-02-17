import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

export type PdmDialogVariant = 'default' | 'custom-close';

@Component({
  selector: 'pdm-dialog',
  templateUrl: './dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmDialogComponent {
  @Input() open = false;
  @Input() variant: PdmDialogVariant = 'default';
  @Input() title = 'Edit profile';
  @Input() description = 'Make changes to your profile here. Click save when you\'re done.';
  @Input() closeOnBackdrop = true;
  @Input() closeOnEsc = true;
  @Input() showCloseButton = true;
  @Input() primaryActionText = 'Save changes';
  @Input() secondaryActionText = 'Cancel';
  @Input() nameLabel = 'Name';
  @Input() nameValue = 'Pedro Duarte';
  @Input() usernameLabel = 'Username';
  @Input() usernameValue = '@peduarte';
  @Input() linkValue = 'https://ui.shadcn.com/docs/installation';
  @Input() className = '';

  @Output() openChange = new EventEmitter<boolean>();
  @Output() primaryAction = new EventEmitter<void>();
  @Output() secondaryAction = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.open && this.closeOnEsc) {
      this.close();
    }
  }

  close(): void {
    this.openChange.emit(false);
  }

  onPrimaryAction(): void {
    this.primaryAction.emit();
  }

  onSecondaryAction(): void {
    this.secondaryAction.emit();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop) {
      this.close();
    }
  }
}
