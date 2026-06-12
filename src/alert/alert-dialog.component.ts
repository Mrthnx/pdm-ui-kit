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

  /** Close when the ESC key is pressed. Default: `true`. */
  @Input() closeOnEsc = true;

  @Output() openChange = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  /**
   * Returns `true` when at least one consumer listens to `openChange`.
   * - **Controlled** (has observers): parent manages `open` via two-way binding → only emit.
   * - **Uncontrolled** (no observers): we own the `open` state → mutate it locally.
   */
  private get isControlled(): boolean {
    return this.openChange.observed;
  }

  onTriggerClick(): void {
    if (!this.isControlled) {
      this.open = true;
    }
    this.openChange.emit(true);
  }

  onCancel(): void {
    this.cancel.emit();
    if (!this.isControlled) {
      this.open = false;
    }
    this.openChange.emit(false);
  }

  onConfirm(): void {
    this.confirm.emit();
    if (!this.isControlled) {
      this.open = false;
    }
    this.openChange.emit(false);
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.open && this.closeOnEsc) {
      this.onCancel();
    }
  }
}
