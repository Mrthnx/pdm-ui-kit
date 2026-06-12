import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type PdmFieldOrientation = 'vertical' | 'horizontal';
export type PdmFieldDescriptionPosition = 'before' | 'after';

@Component({
  selector: 'pdm-field',
  templateUrl: './field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmFieldComponent {
  @Input() id = '';
  @Input() label = '';
  @Input() description = '';
  @Input() error = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() invalid = false;
  @Input() orientation: PdmFieldOrientation = 'vertical';
  @Input() descriptionPosition: PdmFieldDescriptionPosition = 'after';
  @Input() className = '';
  @Input() labelClassName = '';
  @Input() controlClassName = '';

  get rootClass(): string {
    return this.orientation === 'horizontal'
      ? 'grid items-start gap-3 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-4'
      : 'grid w-full gap-3';
  }

  get isHorizontal(): boolean {
    return this.orientation === 'horizontal';
  }

  get showDescriptionBeforeControl(): boolean {
    return !this.isHorizontal && this.descriptionPosition === 'before' && !!this.description && !this.invalid;
  }

  get showDescriptionAfterControl(): boolean {
    return !this.isHorizontal && !this.showDescriptionBeforeControl && !!this.description && !this.invalid;
  }
}
