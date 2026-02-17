import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'pdm-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmAlertDialogComponent {
  @Input() open = false;
  @Input() showTrigger = false;
  @Input() triggerText = 'Show dialog';
  @Input() title = 'Are you absolutely sure?';
  @Input() description = '';
  @Input() confirmText = 'Continue';
  @Input() cancelText = 'Cancel';
  @Input() className = '';

  @Output() openChange = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onTriggerClick(): void {
    this.open = true;
    this.openChange.emit(true);
  }

  onCancel(): void {
    this.cancel.emit();
    this.open = false;
    this.openChange.emit(false);
  }

  onConfirm(): void {
    this.confirm.emit();
    this.open = false;
    this.openChange.emit(false);
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.open) {
      this.onCancel();
    }
  }
}
