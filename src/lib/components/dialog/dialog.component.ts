import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

export type PdmDialogVariant = 'default' | 'custom-close';
export type PdmDialogSize = 'desktop' | 'mobile' | 'mobile-fullscreen';
export type PdmDialogFooterAlign = 'right' | 'full-width' | 'left';

@Component({
  selector: 'pdm-dialog',
  templateUrl: './dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmDialogComponent {
  @Input() open = false;
  @Input() variant: PdmDialogVariant = 'default';
  @Input() size: PdmDialogSize = 'desktop';
  @Input() title = 'Edit profile';
  @Input() description = 'Make changes to your profile here. Click save when you\'re done.';
  @Input() closeOnBackdrop = true;
  @Input() closeOnEsc = true;
  @Input() showCloseButton = true;
  @Input() showHeader = true;
  @Input() showFooter = true;
  @Input() primaryActionText = 'Save changes';
  @Input() secondaryActionText = 'Cancel';
  @Input() alignFooter: PdmDialogFooterAlign = 'right';
  @Input() headerClassName = '';
  @Input() bodyClassName = '';
  @Input() footerClassName = '';
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

  get panelClassName(): string {
    const base = [
      'relative z-10 w-full border border-border bg-background text-foreground shadow-lg',
      this.size === 'desktop' ? 'max-w-[640px] max-h-[calc(100vh-2rem)] rounded-[10px] overflow-hidden' : '',
      this.size === 'mobile' ? 'max-w-[320px] min-h-[240px] rounded-[10px] overflow-hidden' : '',
      this.size === 'mobile-fullscreen'
        ? 'max-w-[320px] h-[min(100dvh,640px)] rounded-none sm:rounded-[10px] overflow-hidden'
        : '',
      this.className
    ];

    return base.filter(Boolean).join(' ');
  }

  get bodyWrapperClassName(): string {
    const base = [
      'min-h-0 flex-1',
      this.size === 'mobile-fullscreen' ? 'overflow-y-auto px-4 py-6' : 'px-6 py-6',
      this.bodyClassName
    ];

    return base.filter(Boolean).join(' ');
  }

  get headerWrapperClassName(): string {
    return ['flex items-start justify-between gap-3 p-4', this.headerClassName].filter(Boolean).join(' ');
  }

  get footerWrapperClassName(): string {
    const effectiveAlign =
      this.alignFooter === 'right' && this.variant === 'custom-close' ? 'left' : this.alignFooter;

    const base = [
      'p-4',
      effectiveAlign === 'full-width'
        ? 'flex flex-col gap-2'
        : effectiveAlign === 'left'
          ? 'flex items-center gap-2 justify-start'
          : 'flex items-center gap-2 justify-end',
      this.footerClassName
    ];

    return base.filter(Boolean).join(' ');
  }
}
