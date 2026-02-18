import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export type PdmEmptyVariant = 'default' | 'outline' | 'background';

@Component({
  selector: 'pdm-empty',
  templateUrl: './empty.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmEmptyComponent {
  @Input() variant: PdmEmptyVariant = 'default';
  @Input() title = 'No Projects Yet';
  @Input() description = "You haven't created any projects yet. Get started by creating your first project.";
  @Input() iconName = 'folder';
  @Input() primaryActionLabel = '';
  @Input() secondaryActionLabel = '';
  @Input() linkLabel = '';
  @Input() className = '';

  @Output() primaryAction = new EventEmitter<void>();
  @Output() secondaryAction = new EventEmitter<void>();
  @Output() linkAction = new EventEmitter<void>();

  get containerClass(): string {
    if (this.variant === 'outline') {
      return 'border border-dashed border-border rounded-[12px]';
    }

    if (this.variant === 'background') {
      return 'rounded-[12px] bg-muted';
    }

    return '';
  }
}
